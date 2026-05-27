"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";
import { CHAT_COPY, getStepPrompt, SUBMITTED_STORAGE_KEY } from "@/lib/chat/flow";
import type {
  BudgetOption,
  ChatMessage,
  ChatStep,
  LeadFormData,
  LeadScore,
  ServiceOption,
  TimelineOption,
} from "@/lib/chat/types";
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/chat/types";
import { site } from "@/lib/landing-content";

const OPEN_CHAT_EVENT = "open-lead-chat";

function createMessage(role: ChatMessage["role"], text: string): ChatMessage {
  return { id: crypto.randomUUID(), role, text };
}

function scoreBadgeClass(score: LeadScore) {
  if (score === "High") return "bg-emerald-400/15 text-emerald-200 ring-emerald-400/30";
  if (score === "Medium") return "bg-amber-400/15 text-amber-200 ring-amber-400/30";
  return "bg-slate-400/15 text-slate-300 ring-white/20";
}

export function LeadChatWidget() {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>("service");
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("bot", CHAT_COPY.greeting),
    createMessage("bot", CHAT_COPY.service),
  ]);
  const [lead, setLead] = useState<Partial<LeadFormData>>({});
  const [score, setScore] = useState<LeadScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [contact, setContact] = useState({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const submissionIdRef = useRef(crypto.randomUUID());

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, step, scrollToBottom]);

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

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, createMessage("bot", text)]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, createMessage("user", text)]);
  };

  const goToStep = (next: ChatStep) => {
    setStep(next);
    const prompt = getStepPrompt(next);
    if (prompt) addBotMessage(prompt);
  };

  const selectService = (value: ServiceOption) => {
    setLead((prev) => ({ ...prev, service: value }));
    addUserMessage(value);
    goToStep("budget");
  };

  const selectBudget = (value: BudgetOption) => {
    setLead((prev) => ({ ...prev, budget: value }));
    addUserMessage(value);
    goToStep("timeline");
  };

  const selectTimeline = (value: TimelineOption) => {
    setLead((prev) => ({ ...prev, timeline: value }));
    addUserMessage(value);
    goToStep("contact");
  };

  const resetChat = () => {
    setStep("service");
    setLead({});
    setScore(null);
    setError(null);
    setContact({ fullName: "", email: "", companyName: "", phone: "" });
    submissionIdRef.current = crypto.randomUUID();
    setMessages([
      createMessage("bot", CHAT_COPY.greeting),
      createMessage("bot", CHAT_COPY.service),
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadySubmitted) return;

    setError(null);
    setStep("submitting");

    const payload = {
      service: lead.service,
      budget: lead.budget,
      timeline: lead.timeline,
      fullName: contact.fullName.trim(),
      email: contact.email.trim(),
      companyName: contact.companyName.trim(),
      phone: contact.phone.trim() || undefined,
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
        score?: LeadScore;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Submission failed. Please try again.");
        setStep("contact");
        return;
      }

      const finalScore = data.score ?? "Medium";
      setScore(finalScore);
      addUserMessage(
        `${contact.fullName} · ${contact.email} · ${contact.companyName}`,
      );
      addBotMessage(
        `Thank you! Your inquiry has been received. Lead priority: ${finalScore}. We'll follow up within one business day.`,
      );
      setStep("success");

      try {
        localStorage.setItem(SUBMITTED_STORAGE_KEY, "true");
      } catch {
        /* ignore */
      }
      setAlreadySubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("contact");
    }
  };

  const optionButtonClass =
    "rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-left text-sm text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/10";

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
          aria-label="Lead qualification chat"
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
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-cyan-400/20 text-cyan-50"
                      : "bg-white/5 text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {step === "success" && score ? (
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${scoreBadgeClass(score)}`}
              >
                {score} priority lead
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 bg-slate-900/50 p-4">
            {alreadySubmitted && step !== "success" ? (
              <p className="text-center text-sm text-slate-400">
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

            {step === "service" && !alreadySubmitted ? (
              <div className="grid grid-cols-1 gap-2">
                {SERVICE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={optionButtonClass}
                    onClick={() => selectService(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}

            {step === "budget" && !alreadySubmitted ? (
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={optionButtonClass}
                    onClick={() => selectBudget(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}

            {step === "timeline" && !alreadySubmitted ? (
              <div className="grid grid-cols-2 gap-2">
                {TIMELINE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={optionButtonClass}
                    onClick={() => selectTimeline(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}

            {step === "contact" && !alreadySubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor={`${formId}-name`} className="sr-only">
                    Full name
                  </label>
                  <input
                    id={`${formId}-name`}
                    required
                    minLength={2}
                    placeholder="Full name *"
                    value={contact.fullName}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, fullName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-email`} className="sr-only">
                    Email
                  </label>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    required
                    placeholder="Email *"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, email: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-company`} className="sr-only">
                    Company name
                  </label>
                  <input
                    id={`${formId}-company`}
                    required
                    placeholder="Company name *"
                    value={contact.companyName}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, companyName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-phone`} className="sr-only">
                    Phone
                  </label>
                  <input
                    id={`${formId}-phone`}
                    type="tel"
                    placeholder="Phone (optional)"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, phone: e.target.value }))
                    }
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
              </form>
            ) : null}

            {step === "submitting" ? (
              <p className="text-center text-sm text-slate-400">Submitting…</p>
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
