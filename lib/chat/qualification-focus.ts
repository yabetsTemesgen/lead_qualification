import type { ContactConsentStatus } from "@/lib/chat/contact-consent";
import { isQualificationComplete } from "@/lib/chat/conversation-ready";
import { normalizeLeadDraft } from "@/lib/chat/normalize";
import type { LeadDraft } from "@/lib/chat/types";
import {
  BUDGET_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/chat/types";

/** Tells the model exactly what to ask next — keeps chat on qualification fields. */
export function getQualificationFocus(
  draft: LeadDraft | undefined,
  contactConsent: ContactConsentStatus = "none",
): string {
  const n = normalizeLeadDraft(draft ?? {});

  if (contactConsent === "declined") {
    return [
      "The visitor is not ready for the contact form yet.",
      "Answer project or agency questions helpfully.",
      "Do NOT push the contact form unless they say they are ready (yes) to share contact details.",
      "Never ask for name, email, phone, or company in chat.",
    ].join(" ");
  }

  if (contactConsent === "granted") {
    return [
      "The visitor agreed to share contact details.",
      "The app shows the contact form — do not send another message about filling it in.",
      "Do not ask them to type contact fields in chat.",
    ].join(" ");
  }

  if (!n.service) {
    return [
      "The visitor has not confirmed a service yet.",
      "If they ask about services, summarize our offerings briefly, then ask which fits their need.",
      "Otherwise ask what they want to build (one short question).",
      "Do not ask about budget or timeline until service is clear.",
      "If they ask for code or off-topic help, decline and redirect to their project.",
    ].join(" ");
  }

  if (!n.budget) {
    return [
      `They chose ${n.service}.`,
      "Respond naturally: briefly reflect why that service fits or acknowledge their choice, then ask about budget.",
      `You MUST list every budget option in your message: ${BUDGET_OPTIONS.join(", ")}.`,
      "Sound like a consultant, not a script.",
    ].join(" ");
  }

  if (!n.timeline) {
    return [
      `Service: ${n.service}. Budget: ${n.budget}.`,
      "Acknowledge the budget naturally, then ask about timeline.",
      `You MUST list every timeline option in your message: ${TIMELINE_OPTIONS.join(", ")}.`,
      "Sound like a consultant, not a script.",
    ].join(" ");
  }

  if (isQualificationComplete(n) && contactConsent === "none") {
    return [
      `Service: ${n.service}. Budget: ${n.budget}. Timeline: ${n.timeline}.`,
      "Qualification is complete. In your own words, briefly recap what you understood, then ask if they want to share contact details now (yes or no).",
      "Do NOT mention a contact form. Do NOT ask more qualifying questions.",
    ].join(" ");
  }

  return [
    "Qualification is complete. Do NOT ask for name, email, or company in chat.",
    "Answer project questions only. If they say yes to sharing contact details, stay silent — the app opens the form.",
  ].join(" ");
}

export function getMissingQualificationLabels(
  draft: LeadDraft,
): string[] {
  const n = normalizeLeadDraft(draft);
  const missing: string[] = [];
  if (!n.service) missing.push("service type");
  if (!n.budget) missing.push("budget range");
  if (!n.timeline) missing.push("timeline");
  return missing;
}
