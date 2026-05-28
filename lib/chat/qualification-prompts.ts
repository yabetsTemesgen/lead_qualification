import type { ContactConsentStatus } from "@/lib/chat/contact-consent";
import { normalizeLeadDraft } from "@/lib/chat/normalize";
import type { LeadDraft } from "@/lib/chat/types";
import { BUDGET_OPTIONS, TIMELINE_OPTIONS } from "@/lib/chat/types";

function countListedOptions(
  message: string,
  options: readonly string[],
): number {
  const lower = message.toLowerCase();
  return options.filter((o) => lower.includes(o.toLowerCase())).length;
}

/** If the model asked for budget/timeline but omitted choices, append them naturally. */
export function polishQualificationReply(
  message: string,
  draft: LeadDraft,
  contactConsent: ContactConsentStatus,
): string {
  if (contactConsent !== "none") return message;

  const n = normalizeLeadDraft(draft);
  const trimmed = message.trim();

  if (n.service && !n.budget) {
    if (countListedOptions(trimmed, BUDGET_OPTIONS) < 3) {
      return `${trimmed}\n\nFor budget, we usually work within these ranges: ${BUDGET_OPTIONS.join(", ")}. What feels right for your project?`;
    }
  }

  if (n.service && n.budget && !n.timeline) {
    if (countListedOptions(trimmed, TIMELINE_OPTIONS) < 3) {
      return `${trimmed}\n\nTypical timelines we plan around are: ${TIMELINE_OPTIONS.join(", ")}. What are you aiming for?`;
    }
  }

  return trimmed;
}
