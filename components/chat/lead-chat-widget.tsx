"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Loader2, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { SUBMITTED_STORAGE_KEY } from "@/lib/chat/flow";
import {
  CONTACT_CONSENT_CLARIFY_MESSAGE,
  CONTACT_CONSENT_DECLINED_MESSAGE,
  CONTACT_CONSENT_PROMPT,
  detectContactConsent,
  messageAsksContactConsent,
  messageDirectsToContactForm,
  type ContactConsentStatus,
} from "@/lib/chat/contact-consent";
import { isQualificationComplete } from "@/lib/chat/conversation-ready";
import { contactFormSchema } from "@/lib/chat/contact-form";
import { INITIAL_ASSISTANT_MESSAGE } from "@/lib/chat/system-prompt";
import {
  inferQualificationFromMessages,
  inferQualificationFromText,
  isLeadReadyForSubmit,
  normalizeLeadDraft,
  normalizeService,
} from "@/lib/chat/normalize";
import { resolveServiceFromChat } from "@/lib/chat/resolve-service-from-chat";
import type {
  ChatMessage,
  ChatTurn,
  ChatUiStep,
  LeadDraft,
} from "@/lib/chat/types";
import { site } from "@/lib/landing-content";

const OPEN_CHAT_EVENT = "open-lead-chat";

function createMessage(role: ChatMessage["role"], text: string): ChatMessage {
  return { id: crypto.randomUUID(), role, text };
}

export function LeadChatWidget() {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ChatUiStep>("chatting");
  const [contactConsent, setContactConsent] =
    useState<ContactConsentStatus>("none");
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", INITIAL_ASSISTANT_MESSAGE),
  ]);
  const [input, setInput] = useState("");
  const [leadDraft, setLeadDraft] = useState<LeadDraft>({});
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [contact, setContact] = useState({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
  });
  const [contactErrors, setContactErrors] = useState<
    Partial<Record<"fullName" | "email" | "companyName" | "phone", string>>
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const submissionIdRef = useRef(crypto.randomUUID());

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, isTyping, step, scrollToBottom]);

  useEffect(() => {
    try {
      setAlreadySubmitted(localStorage.getItem(SUBMITTED_STORAGE_KEY) === "true");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, openChat);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, openChat);
  }, []);

  const toTurns = (msgs: ChatMessage[]): ChatTurn[] =>
    msgs.map((m) => ({
      role: m.role,
      content: m.text,
    }));

  const resetChat = () => {
    localStorage.removeItem(SUBMITTED_STORAGE_KEY);
    setAlreadySubmitted(false);
    setStep("chatting");
    setContactConsent("none");
    setLeadDraft({});
    setError(null);
    setInput("");
    setContact({ fullName: "", email: "", companyName: "", phone: "" });
    setContactErrors({});
    submissionIdRef.current = crypto.randomUUID();
    setMessages([createMessage("assistant", INITIAL_ASSISTANT_MESSAGE)]);
  };

  const mergeLeadFromApi = (incoming?: LeadDraft) => {
    if (!incoming) return;
    setLeadDraft((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(incoming)) {
        if (value != null && String(value).trim()) {
          (next as Record<string, string>)[key] = String(value).trim();
        }
      }
      return next;
    });
  };

  const grantContactConsent = useCallback(() => {
    setContactConsent("granted");
    setStep("contact");
    setError(null);
  }, []);

  const promptContactConsent = useCallback((priorAssistantText?: string) => {
    setContactConsent("pending");
    setMessages((prev) => {
      const next = [...prev];
      if (priorAssistantText?.trim()) {
        const last = next[next.length - 1];
        if (last?.role !== "assistant" || last.text !== priorAssistantText) {
          next.push(createMessage("assistant", priorAssistantText));
        }
      }
      const last = next[next.length - 1];
      if (
        last?.role === "assistant" &&
        (last.text === CONTACT_CONSENT_PROMPT ||
          /reply yes or no/i.test(last.text))
      ) {
        return next;
      }
      next.push(createMessage("assistant", CONTACT_CONSENT_PROMPT));
      return next;
    });
  }, []);

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || isTyping || step !== "chatting" || alreadySubmitted) return;

    setError(null);
    if (!textOverride) setInput("");

    const userMessage = createMessage("user", text);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    const draftWithInference = inferQualificationFromMessages(
      toTurns(nextMessages),
      inferQualificationFromText(text, leadDraft),
    );

    const priorAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    const consentAsked =
      contactConsent === "pending" ||
      Boolean(priorAssistant && messageAsksContactConsent(priorAssistant.text));

    const consentDecision = detectContactConsent(text);

    if (
      consentDecision === "yes" &&
      (consentAsked || contactConsent === "declined")
    ) {
      setLeadDraft(draftWithInference);
      grantContactConsent();
      return;
    }

    if (consentAsked) {
      if (consentDecision === "no") {
        setContactConsent("declined");
        setLeadDraft(draftWithInference);
        setMessages((prev) => [
          ...prev,
          createMessage("assistant", CONTACT_CONSENT_DECLINED_MESSAGE),
        ]);
        return;
      }
      if (consentDecision === null && contactConsent === "pending") {
        setMessages((prev) => [
          ...prev,
          createMessage("assistant", CONTACT_CONSENT_CLARIFY_MESSAGE),
        ]);
        return;
      }
    }

    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: toTurns(nextMessages),
          leadDraft: draftWithInference,
          contactConsent,
        }),
      });

      const data = (await res.json()) as {
        message?: string;
        lead?: LeadDraft;
        qualificationComplete?: boolean;
        askContactConsent?: boolean;
        showContactForm?: boolean;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Could not get a reply. Please try again.");
        return;
      }

      let merged: LeadDraft = { ...draftWithInference };
      if (data.lead) {
        for (const [key, value] of Object.entries(data.lead)) {
          if (value != null && String(value).trim()) {
            (merged as Record<string, string>)[key] = String(value).trim();
          }
        }
        mergeLeadFromApi(data.lead);
      }
      merged = inferQualificationFromText(text, merged);
      const serviceFromUser = normalizeService(text);
      if (serviceFromUser) {
        merged = { ...merged, service: serviceFromUser };
      }
      setLeadDraft(merged);

      const shouldAskConsent =
        data.askContactConsent === true ||
        (contactConsent === "none" && isQualificationComplete(merged));

      const apiAsksConsent =
        Boolean(data.message && messageAsksContactConsent(data.message));
      const openFormFromApi =
        consentDecision === "yes" &&
        (data.showContactForm === true ||
          Boolean(data.message && messageDirectsToContactForm(data.message)));

      if (openFormFromApi) {
        grantContactConsent();
      } else if (data.message?.trim()) {
        if (shouldAskConsent && contactConsent === "none" && !apiAsksConsent) {
          promptContactConsent();
        } else {
          setMessages((prev) => [
            ...prev,
            createMessage("assistant", data.message!),
          ]);
          if (apiAsksConsent) {
            setContactConsent("pending");
          }
        }
      } else if (shouldAskConsent && contactConsent === "none") {
        promptContactConsent();
      } else if (data.showContactForm === true && contactConsent === "granted") {
        grantContactConsent();
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsTyping(false);
      if (step === "chatting") {
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadySubmitted) return;

    const formResult = contactFormSchema.safeParse(contact);
    if (!formResult.success) {
      const fieldErrors: Partial<
        Record<"fullName" | "email" | "companyName" | "phone", string>
      > = {};
      for (const issue of formResult.error.issues) {
        const field = issue.path[0];
        if (
          field === "fullName" ||
          field === "email" ||
          field === "companyName" ||
          field === "phone"
        ) {
          fieldErrors[field] = issue.message;
        }
      }
      setContactErrors(fieldErrors);
      return;
    }

    setContactErrors({});

    const serviceFromChat = resolveServiceFromChat(messages);

    const merged: LeadDraft = {
      ...leadDraft,
      service: serviceFromChat ?? leadDraft.service,
      fullName: formResult.data.fullName,
      email: formResult.data.email,
      companyName: formResult.data.companyName,
      phone: formResult.data.phone,
    };

    const normalized = normalizeLeadDraft(merged);
    if (!isLeadReadyForSubmit(normalized)) {
      setError(
        "Project details are incomplete. Use Back to chat and confirm service, budget, and timeline.",
      );
      setStep("chatting");
      return;
    }

    setError(null);
    setStep("submitting");

    const payload = {
      service: normalized.service!,
      budget: normalized.budget!,
      timeline: normalized.timeline!,
      fullName: normalized.fullName!,
      email: normalized.email!,
      companyName: normalized.companyName!,
      phone: normalized.phone,
      clientSubmissionId: submissionIdRef.current,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Submission failed. Please try again.");
        setStep("contact");
        return;
      }

      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          `Thank you, ${normalized.fullName}! We've received your inquiry and will follow up within one business day at ${normalized.email}.`,
        ),
      ]);
      setStep("success");

      try {
        localStorage.setItem(SUBMITTED_STORAGE_KEY, "true");
      } catch {
        /* ignore */
      }
      setAlreadySubmitted(true);
    } catch {
      setError("Network error. Please try again.");
      setStep("contact");
    }
  };

  const normalized = normalizeLeadDraft(leadDraft);
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const awaitingContactConsent =
    contactConsent === "pending" ||
    (contactConsent === "none" &&
      Boolean(
        lastAssistantMessage &&
          messageAsksContactConsent(lastAssistantMessage.text),
      ));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="lead-chat-panel"
        className="fixed right-5 bottom-5 z-50 inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-900/40 transition hover:bg-cyan-200"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Chat with us</span>
      </button>

      {open ? (
        <div
          id="lead-chat-panel"
          role="dialog"
          aria-label="Project assistant chat"
          className="fixed right-5 bottom-20 z-50 flex h-[min(560px,calc(100vh-6rem))] w-[min(100vw-2.5rem,400px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-2xl shadow-black/50"
        >
          <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {site.name} {site.tagline}
                </p>
                <p className="text-xs text-slate-400">Project assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-cyan-400/20 text-cyan-50"
                      : "bg-white/5 text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3.5 py-2.5 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Typing…
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 bg-slate-900/50 p-4">
            {alreadySubmitted && step !== "success" ? (
              <p className="mb-3 text-center text-sm text-slate-400">
                You already submitted an inquiry.{" "}
                <button
                  type="button"
                  className="text-cyan-300 underline"
                  onClick={resetChat}
                >
                  Start over
                </button>
              </p>
            ) : null}

            {step === "chatting" && !alreadySubmitted ? (
              <>
                {error ? (
                  <p className="mb-2 text-sm text-rose-300">{error}</p>
                ) : null}

                {awaitingContactConsent ? (
                  <div className="mb-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void sendMessage("yes")}
                      disabled={isTyping}
                      className="flex-1 rounded-xl border border-cyan-300/40 bg-cyan-400/15 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/25 disabled:opacity-50"
                    >
                      Yes, share details
                    </button>
                    <button
                      type="button"
                      onClick={() => void sendMessage("no")}
                      disabled={isTyping}
                      className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
                    >
                      Not yet
                    </button>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                    placeholder={
                      awaitingContactConsent
                        ? "Reply yes or no…"
                        : "Ask about our services or describe your project…"
                    }
                    className="min-h-[44px] flex-1 resize-none rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => void sendMessage()}
                    disabled={!input.trim() || isTyping}
                    className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>

              </>
            ) : null}

            {step === "contact" && !alreadySubmitted ? (
              <form onSubmit={handleSubmitLead} className="space-y-3" noValidate>
                {normalized.service ? (
                  <p className="rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400">
                    <span className="text-slate-300">Project:</span>{" "}
                    {normalized.service}
                    {normalized.budget ? ` · ${normalized.budget}` : ""}
                    {normalized.timeline ? ` · ${normalized.timeline}` : ""}
                  </p>
                ) : null}

                <p className="text-sm font-medium text-slate-200">
                  Contact details
                </p>
                <p className="text-xs text-slate-500">
                  Submitting sends your inquiry to our team (n8n workflow).
                </p>

                <div>
                  <label htmlFor={`${formId}-name`} className="sr-only">
                    Full name
                  </label>
                  <input
                    id={`${formId}-name`}
                    autoComplete="name"
                    placeholder="Full name *"
                    value={contact.fullName}
                    onChange={(e) => {
                      setContact((c) => ({ ...c, fullName: e.target.value }));
                      if (contactErrors.fullName) {
                        setContactErrors((err) => ({ ...err, fullName: undefined }));
                      }
                    }}
                    aria-invalid={Boolean(contactErrors.fullName)}
                    className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none aria-invalid:border-rose-400/60"
                  />
                  {contactErrors.fullName ? (
                    <p className="mt-1 text-xs text-rose-300">{contactErrors.fullName}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={`${formId}-email`} className="sr-only">
                    Email
                  </label>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    autoComplete="email"
                    placeholder="Email *"
                    value={contact.email}
                    onChange={(e) => {
                      setContact((c) => ({ ...c, email: e.target.value }));
                      if (contactErrors.email) {
                        setContactErrors((err) => ({ ...err, email: undefined }));
                      }
                    }}
                    aria-invalid={Boolean(contactErrors.email)}
                    className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none aria-invalid:border-rose-400/60"
                  />
                  {contactErrors.email ? (
                    <p className="mt-1 text-xs text-rose-300">{contactErrors.email}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={`${formId}-company`} className="sr-only">
                    Company name
                  </label>
                  <input
                    id={`${formId}-company`}
                    autoComplete="organization"
                    placeholder="Company name *"
                    value={contact.companyName}
                    onChange={(e) => {
                      setContact((c) => ({ ...c, companyName: e.target.value }));
                      if (contactErrors.companyName) {
                        setContactErrors((err) => ({
                          ...err,
                          companyName: undefined,
                        }));
                      }
                    }}
                    aria-invalid={Boolean(contactErrors.companyName)}
                    className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none aria-invalid:border-rose-400/60"
                  />
                  {contactErrors.companyName ? (
                    <p className="mt-1 text-xs text-rose-300">
                      {contactErrors.companyName}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={`${formId}-phone`} className="sr-only">
                    Phone
                  </label>
                  <input
                    id={`${formId}-phone`}
                    type="tel"
                    autoComplete="tel"
                    placeholder="Phone (optional)"
                    value={contact.phone}
                    onChange={(e) => {
                      setContact((c) => ({ ...c, phone: e.target.value }));
                      if (contactErrors.phone) {
                        setContactErrors((err) => ({ ...err, phone: undefined }));
                      }
                    }}
                    className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none"
                  />
                </div>

                {error ? <p className="text-sm text-rose-300">{error}</p> : null}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                >
                  Submit inquiry
                  <Send className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setContactConsent("declined");
                    setStep("chatting");
                  }}
                  className="w-full text-center text-xs text-slate-500 underline"
                >
                  Back to chat
                </button>
              </form>
            ) : null}

            {step === "submitting" ? (
              <p className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting your inquiry…
              </p>
            ) : null}

            {step === "success" ? (
              <button
                type="button"
                onClick={() => {
                  resetChat();
                  setOpen(false);
                }}
                className="w-full rounded-full border border-white/15 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5"
              >
                Close
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function openLeadChat() {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT));
}
