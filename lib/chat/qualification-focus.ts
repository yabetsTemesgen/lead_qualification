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
      "Tell them to fill in the contact form below (name, email, company).",
      "Do not ask them to type contact fields in chat.",
    ].join(" ");
  }

  if (!n.service) {
    return [
      "The visitor has not confirmed a service yet.",
      "If they ask about services, summarize our offerings briefly, then ask which fits their need.",
      "Otherwise ask what they want to build (one short question).",
      "Do not ask about budget or timeline until service is clear.",
    ].join(" ");
  }

  if (!n.budget) {
    return [
      `Service confirmed: ${n.service}.`,
      "Your ONLY job this turn: ask which budget range fits.",
      `Present these exact options in your message: ${BUDGET_OPTIONS.join(", ")}.`,
      "Do NOT ask about platforms (iOS/Android), audience, features, or product depth.",
    ].join(" ");
  }

  if (!n.timeline) {
    return [
      `Service: ${n.service}. Budget: ${n.budget}.`,
      "Your ONLY job this turn: ask when they need the project completed.",
      `Present these exact options: ${TIMELINE_OPTIONS.join(", ")}.`,
      "Do NOT ask further product-discovery questions.",
    ].join(" ");
  }

  if (!n.projectSummary) {
    return [
      `Service: ${n.service}. Budget: ${n.budget}. Timeline: ${n.timeline}.`,
      "Ask ONE short question about other requirements (platforms, must-haves, or integrations) — one sentence only.",
      "Do NOT ask for name, email, phone, or company in chat.",
      "Do NOT mention the contact form yet.",
    ].join(" ");
  }

  if (isQualificationComplete(n) && contactConsent === "none") {
    return [
      "Qualification is complete.",
      "Briefly confirm service, budget, timeline, and requirements.",
      "Ask if they are ready to share contact details now — they should reply yes or no.",
      "Do NOT mention the contact form until they say yes.",
    ].join(" ");
  }

  return [
    "Qualification is complete. Do NOT ask for name, email, or company in chat.",
    "If they have questions, answer them. If they say yes to contact details, tell them to use the form below.",
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
