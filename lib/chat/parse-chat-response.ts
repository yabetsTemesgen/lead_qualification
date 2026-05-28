import { z } from "zod";
import { LEAD_BLOCK_END, LEAD_BLOCK_START } from "@/lib/chat/system-prompt";
import { stripModelArtifacts } from "@/lib/chat/strip-model-output";
import type { LeadDraft } from "@/lib/chat/types";

const leadSchema = z.object({
  fullName: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  service: z.string().nullable().optional(),
  budget: z.string().nullable().optional(),
  timeline: z.string().nullable().optional(),
  projectSummary: z.string().nullable().optional(),
  readyForForm: z.boolean().optional(),
});

const legacyJsonSchema = z.object({
  message: z.string().min(1),
  lead: leadSchema.optional(),
  canSubmit: z.boolean().optional(),
});

export type ParsedChatResponse = {
  message: string;
  lead?: Partial<LeadDraft> & { readyForForm?: boolean };
  readyForForm?: boolean;
};

function parseLeadJson(jsonText: string): Partial<LeadDraft> & { readyForForm?: boolean } | null {
  try {
    const parsed = JSON.parse(jsonText.trim()) as unknown;
    const result = leadSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function parseLeadBlock(cleaned: string): ParsedChatResponse | null {
  const start = cleaned.indexOf(LEAD_BLOCK_START);
  const end = cleaned.indexOf(LEAD_BLOCK_END);
  if (start === -1 || end === -1 || end <= start) return null;

  const message = cleaned.slice(0, start).trim();
  const jsonPart = cleaned.slice(start + LEAD_BLOCK_START.length, end).trim();
  const lead = parseLeadJson(jsonPart);

  if (!message) return null;

  return {
    message,
    lead: lead ?? undefined,
    readyForForm: lead?.readyForForm,
  };
}

function parseLegacyJsonEnvelope(cleaned: string): ParsedChatResponse | null {
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) return null;

  try {
    const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as unknown;
    const result = legacyJsonSchema.safeParse(parsed);
    if (!result.success) return null;
    return {
      message: result.data.message.trim(),
      lead: result.data.lead,
      readyForForm: false,
    };
  } catch {
    return null;
  }
}

/** Parse model output into visible message + optional lead metadata. */
export function parseChatResponse(raw: string): ParsedChatResponse | null {
  const cleaned = stripModelArtifacts(raw);
  if (!cleaned) return null;

  return (
    parseLeadBlock(cleaned) ??
    parseLegacyJsonEnvelope(cleaned) ??
    (cleaned.length >= 3 ? { message: cleaned } : null)
  );
}
