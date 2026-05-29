import { NextResponse } from "next/server";
import { z } from "zod";
import type { ContactConsentStatus } from "@/lib/chat/contact-consent";
import { isQualificationComplete } from "@/lib/chat/conversation-ready";
import {
  inferQualificationFromText,
  isLeadReadyForSubmit,
  normalizeLeadDraft,
} from "@/lib/chat/normalize";
import { parseChatResponse } from "@/lib/chat/parse-chat-response";
import { getQualificationFocus } from "@/lib/chat/qualification-focus";
import { polishQualificationReply } from "@/lib/chat/qualification-prompts";
import {
  assistantReplyContainsCode,
  getOffTopicReply,
  isOffTopicUserMessage,
} from "@/lib/chat/scope-guard";
import { buildChatSystemPrompt } from "@/lib/chat/system-prompt";
import { stripModelArtifacts } from "@/lib/chat/strip-model-output";
import type { LeadDraft } from "@/lib/chat/types";

const leadDraftSchema = z.object({
  fullName: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  service: z.string().nullable().optional(),
  budget: z.string().nullable().optional(),
  timeline: z.string().nullable().optional(),
  projectSummary: z.string().nullable().optional(),
});

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
  leadDraft: leadDraftSchema.optional(),
  contactConsent: z
    .enum(["none", "pending", "granted", "declined"])
    .optional(),
});

type OpenAIMessage = { role: "system" | "user" | "assistant"; content: string };

async function callChatModel(messages: OpenAIMessage[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY_NOT_SET");
  }

  const baseUrl = (
    process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"
  ).replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const body = {
    model,
    temperature: 0.85,
    max_tokens: 900,
    messages,
  };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    console.error("Chat model error:", response.status, text);
    throw new Error("CHAT_MODEL_ERROR");
  }

  const data = JSON.parse(text) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("CHAT_MODEL_EMPTY");
  return content;
}

function mergeLeadDraft(
  previous: LeadDraft | undefined,
  extracted: LeadDraft | undefined,
): LeadDraft {
  const pick = (next?: string | null, prev?: string | null) => {
    const value = next?.trim();
    return value ? value : prev ?? undefined;
  };

  return {
    fullName: pick(extracted?.fullName, previous?.fullName),
    email: pick(extracted?.email, previous?.email),
    companyName: pick(extracted?.companyName, previous?.companyName),
    phone: pick(extracted?.phone, previous?.phone),
    service: pick(extracted?.service, previous?.service),
    budget: pick(extracted?.budget, previous?.budget),
    timeline: pick(extracted?.timeline, previous?.timeline),
    projectSummary: pick(extracted?.projectSummary, previous?.projectSummary),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat request" },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          message:
            "Chat is not configured yet. Add OPENAI_API_KEY to .env.local and restart the dev server.",
          lead: {},
          readyForForm: false,
        });
      }
      return NextResponse.json(
        { error: "Chat is temporarily unavailable." },
        { status: 503 },
      );
    }

    const contactConsent: ContactConsentStatus =
      parsed.data.contactConsent ?? "none";

    let draft = mergeLeadDraft(parsed.data.leadDraft, undefined);
    const lastUser = [...parsed.data.messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUser) {
      draft = inferQualificationFromText(lastUser.content, draft);
    }

    const focus = getQualificationFocus(draft, contactConsent);
    const systemPrompt = buildChatSystemPrompt(focus);

    if (lastUser && isOffTopicUserMessage(lastUser.content)) {
      const reply = polishQualificationReply(
        getOffTopicReply(draft, contactConsent),
        draft,
        contactConsent,
      );
      const normalized = normalizeLeadDraft(draft);
      const qualificationComplete = isQualificationComplete(draft);

      return NextResponse.json({
        message: reply,
        lead: draft,
        qualificationComplete,
        askContactConsent:
          qualificationComplete && contactConsent === "none",
        showContactForm: false,
        canSubmit: isLeadReadyForSubmit(normalized),
      });
    }

    const modelMessages: OpenAIMessage[] = [
      { role: "system", content: systemPrompt },
      ...parsed.data.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const raw = await callChatModel(modelMessages);
    const structured = parseChatResponse(raw);

    const fallbackText = stripModelArtifacts(raw);
    let message =
      structured?.message?.trim() ||
      (fallbackText.length > 3 ? fallbackText : null);

    if (message && assistantReplyContainsCode(message)) {
      message = getOffTopicReply(draft, contactConsent);
    }

    if (!message) {
      return NextResponse.json(
        { error: "Could not generate a reply. Please try again." },
        { status: 502 },
      );
    }

    const extractedLead = structured?.lead
      ? {
          ...structured.lead,
          readyForForm: undefined,
        }
      : undefined;

    draft = mergeLeadDraft(draft, extractedLead);
    if (lastUser) {
      draft = inferQualificationFromText(lastUser.content, draft);
    }

    const normalized = normalizeLeadDraft(draft);

    const qualificationComplete = isQualificationComplete(draft);
    const userAcceptedContact =
      lastUser &&
      /^(yes|yeah|yep|sure|ok|okay)\b/i.test(lastUser.content.trim());

    const showContactForm =
      qualificationComplete &&
      (contactConsent === "granted" ||
        (contactConsent === "pending" && userAcceptedContact));

    const canSubmit = isLeadReadyForSubmit(normalized);

    const reply = polishQualificationReply(message, draft, contactConsent);

    return NextResponse.json({
      message: reply,
      lead: draft,
      qualificationComplete,
      askContactConsent:
        qualificationComplete &&
        contactConsent === "none",
      showContactForm,
      canSubmit,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "OPENAI_API_KEY_NOT_SET") {
      return NextResponse.json(
        { error: "Chat is not configured." },
        { status: 503 },
      );
    }
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Could not generate a reply. Please try again." },
      { status: 502 },
    );
  }
}
