import { normalizeLeadDraft } from "@/lib/chat/normalize";
import type { LeadDraft } from "@/lib/chat/types";

/** Service, budget, and timeline captured (requirements may still be open). */
export function isProjectDiscoveryComplete(draft: LeadDraft): boolean {
  const n = normalizeLeadDraft(draft);
  return Boolean(n.service && n.budget && n.timeline);
}

/** All qualification fields captured — ready to ask for contact consent. */
export function isQualificationComplete(draft: LeadDraft): boolean {
  const n = normalizeLeadDraft(draft);
  return Boolean(
    n.service && n.budget && n.timeline && n.projectSummary?.trim(),
  );
}
