import type { ContactConsentStatus } from "@/lib/chat/contact-consent";
import { normalizeLeadDraft } from "@/lib/chat/normalize";
import type { LeadDraft } from "@/lib/chat/types";
import { BUDGET_OPTIONS, TIMELINE_OPTIONS } from "@/lib/chat/types";

/** User is describing a product engagement, not asking for deliverable code. */
const PROJECT_INTENT =
  /\b(build|develop|launch|ship|need|want|looking\s+for|hire|partner)\b.{0,40}\b(app|application|product|platform|mvp|website|tool|software|system|full[\s-]?stack|saas)\b|\b(full[\s-]?stack|web\s*app|mobile\s*app|saas|mvp)\b/i;

const CODE_REQUEST =
  /\b(write|show|give|generate|provide|create|implement|debug|fix)\b.{0,50}\b(code|script|snippet|function|program|algorithm|calculator\s+code)\b|\b(code|script|snippet)\s+for\b|\bhow\s+do\s+i\s+(code|program|implement)\b|\b```/i;

const CODE_LANGUAGE_REQUEST =
  /\b(in|using)\s+(javascript|typescript|python|java|html|css|react|node\.?js|sql)\b/i;

const GENERAL_OFF_TOPIC =
  /\b(weather|recipe|joke|poem|essay|homework|translate\s+this|solve\s+this\s+math)\b|\bwho\s+(is|was)\s+the\s+(president|king|queen)\b/i;

export function isOffTopicUserMessage(text: string): boolean {
  const t = text.trim();
  if (t.length < 4) return false;

  if (PROJECT_INTENT.test(t) && !CODE_REQUEST.test(t)) {
    return false;
  }

  if (CODE_REQUEST.test(t)) return true;

  if (CODE_LANGUAGE_REQUEST.test(t) && /\b(write|show|give|create|implement|code)\b/i.test(t)) {
    return true;
  }

  if (GENERAL_OFF_TOPIC.test(t)) return true;

  return false;
}

export function assistantReplyContainsCode(text: string): boolean {
  return /```[\s\S]*?```/.test(text) || /\bfunction\s+\w+\s*\([^)]*\)\s*\{/.test(text);
}

export function getOffTopicReply(
  draft: LeadDraft | undefined,
  contactConsent: ContactConsentStatus = "none",
): string {
  const decline =
    "I'm here to help with your project and how Wipuu Labs can support you — I can't write code or handle general requests in this chat.";

  if (contactConsent === "granted") {
    return `${decline} Please use the contact form when you're ready.`;
  }

  const n = normalizeLeadDraft(draft ?? {});

  if (!n.service) {
    return `${decline} What are you looking to build, or which of our services fits best?`;
  }

  if (!n.budget) {
    return `${decline} For ${n.service}, what budget range fits? (${BUDGET_OPTIONS.join(", ")})`;
  }

  if (!n.timeline) {
    return `${decline} What timeline are you aiming for? (${TIMELINE_OPTIONS.join(", ")})`;
  }

  return `${decline} If you'd like, we can connect you with the team to discuss ${n.service} — are you open to sharing contact details?`;
}
