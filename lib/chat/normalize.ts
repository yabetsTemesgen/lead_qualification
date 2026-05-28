import type {
  BudgetOption,
  ServiceOption,
  TimelineOption,
} from "@/lib/chat/types";
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/chat/types";
import type { LeadDraft } from "@/lib/chat/types";

function pickClosest<T extends string>(
  value: string,
  options: readonly T[],
): T | null {
  const lower = value.toLowerCase();
  const exact = options.find((o) => o.toLowerCase() === lower);
  if (exact) return exact;

  for (const option of options) {
    if (lower.includes(option.toLowerCase())) return option;
  }

  return null;
}

const LEGACY_SERVICE_ALIASES: Record<string, ServiceOption> = {
  "Web Development": "App & Software Development",
  "Mobile App": "App & Software Development",
  "AI/ML Solution": "AI Product Development",
  "Cloud Migration": "App & Software Development",
};

export function normalizeService(value?: string | null): ServiceOption | null {
  if (!value?.trim()) return null;
  const v = value.trim();

  const direct = pickClosest(v, SERVICE_OPTIONS);
  if (direct) return direct;

  if (LEGACY_SERVICE_ALIASES[v]) return LEGACY_SERVICE_ALIASES[v];

  const lower = v.toLowerCase();

  // App & Software Development (before /\bai\b/ — "app" in "application" is ok, not "ai" in "app")
  if (
    /app\s*(?:&|and)\s*software|app\s+and\s+software|software development/.test(
      lower,
    ) ||
    /mobile\s*app|native\s*app|ios|android|app store/.test(lower) ||
    /\bweb\s*app\b|website|saas|portal|dashboard|next\.?js|react\b/.test(lower)
  ) {
    return "App & Software Development";
  }

  if (
    /\bai\b|\bml\b|ai\/ml|ai product|machine learning|\bllm\b|chatbot|artificial intelligence/.test(
      lower,
    )
  ) {
    return "AI Product Development";
  }

  if (
    /product strategy|strategy consulting|roadmap|prioriti[sz]e|discovery workshop|validate ideas/.test(
      lower,
    )
  ) {
    return "Product Strategy Consulting";
  }

  if (
    /\bui\b|\bux\b|ui\/ux|user interface|user experience|\bfigma\b/i.test(lower)
  ) {
    return "UI/UX Design";
  }

  if (/cloud|aws|azure|gcp|migration|devops/.test(lower)) {
    return "App & Software Development";
  }

  return null;
}

function budgetFromRange(lowK: number, highK: number): BudgetOption {
  const hi = Math.max(lowK, highK);
  const lo = Math.min(lowK, highK);
  if (hi <= 10) return "<$10K";
  if (hi <= 25 && lo < 25) return "$10K-$25K";
  if (hi <= 50 && lo < 50) return "$25K-$50K";
  return "$50K+";
}

export function normalizeBudget(value?: string | null): BudgetOption | null {
  if (!value?.trim()) return null;
  const v = value.trim();
  const direct = pickClosest(v, BUDGET_OPTIONS);
  if (direct) return direct;

  const lower = v.toLowerCase().replace(/,/g, "");

  // Two-number ranges first — "10k-25k" contains "25k" and must not match $25K-$50K
  const rangeMatch = lower.match(
    /(\d+)\s*k?\s*(?:-|–|—|\bto\b|\band\b)\s*(\d+)\s*k?/i,
  );
  if (rangeMatch) {
    return budgetFromRange(Number(rangeMatch[1]), Number(rangeMatch[2]));
  }

  if (/under\s*10|<\s*\$?\s*10|<\s*10\s*k\b/.test(lower)) return "<$10K";
  if (/50\s*k|50k|\$50|50,000|50-100|above\s*50|\b50\s*\+/.test(lower)) {
    return "$50K+";
  }
  if (/25\s*-\s*50|25\s*to\s*50|between\s*25\s*and\s*50/.test(lower)) {
    return "$25K-$50K";
  }
  if (
    /10\s*-\s*25|10\s*to\s*25|between\s*10\s*and\s*25|10k\s*-\s*25k/.test(
      lower,
    )
  ) {
    return "$10K-$25K";
  }

  const nums = [...lower.matchAll(/(\d+)\s*k/gi)].map((m) => Number(m[1]));
  if (nums.length === 1) {
    const n = nums[0];
    if (n < 10) return "<$10K";
    if (n <= 25) return "$10K-$25K";
    if (n <= 50) return "$25K-$50K";
    return "$50K+";
  }
  if (nums.length >= 2) {
    return budgetFromRange(Math.min(...nums), Math.max(...nums));
  }

  if (/^20\s*k?$|^\$?\s*20k$|2ok/i.test(lower.trim())) return "$10K-$25K";
  if (/^15\s*k?$|15k/i.test(lower)) return "$10K-$25K";

  return null;
}

export function normalizeTimeline(value?: string | null): TimelineOption | null {
  if (!value?.trim()) return null;
  const v = value.trim();
  const direct = pickClosest(v, TIMELINE_OPTIONS);
  if (direct) return direct;

  const lower = v.toLowerCase();
  if (/asap|urgent|immediately|right away|this week/.test(lower)) return "ASAP";
  if (
    /1-2|one to two|1 month|30 days|next month|within\s*2\s*month|in\s*2\s*month|with\s*in\s*2\s*month|\b2\s*months?\b/.test(
      lower,
    )
  ) {
    return "1-2 months";
  }
  if (/2-4|two to four|quarter|3 month/.test(lower)) return "2-4 months";
  if (/4\+|four plus|6 month|half year|no rush|flexible/.test(lower))
    return "4+ months";

  return null;
}

export function normalizeLeadDraft(draft: LeadDraft) {
  return {
    fullName: draft.fullName?.trim() || undefined,
    email: draft.email?.trim().toLowerCase() || undefined,
    companyName: draft.companyName?.trim() || undefined,
    phone: draft.phone?.trim() || undefined,
    service:
      normalizeService(draft.service) ??
      normalizeService(draft.projectSummary),
    budget: normalizeBudget(draft.budget),
    timeline: normalizeTimeline(draft.timeline),
    projectSummary: draft.projectSummary?.trim() || undefined,
  };
}

/** Fill gaps in lead draft from the latest user message (when model LEAD block lags). */
export function inferQualificationFromText(
  text: string,
  draft: LeadDraft,
): LeadDraft {
  const service = draft.service ?? normalizeService(text) ?? undefined;
  const budget = draft.budget ?? normalizeBudget(text) ?? undefined;
  const timeline = draft.timeline ?? normalizeTimeline(text) ?? undefined;

  let projectSummary = draft.projectSummary;
  const hasCore = Boolean(service && budget && timeline);
  const trimmed = text.trim();
  if (!projectSummary && hasCore && trimmed.length > 12) {
    const budgetOnly =
      Boolean(normalizeBudget(trimmed)) && trimmed.length < 28;
    const timelineOnly =
      Boolean(normalizeTimeline(trimmed)) && trimmed.length < 35;
    if (!budgetOnly && !timelineOnly) {
      projectSummary = trimmed;
    }
  }

  return {
    ...draft,
    service,
    budget,
    timeline,
    projectSummary,
  };
}

/** Fill qualification fields from user messages only (not assistant copy). */
export function inferQualificationFromMessages(
  turns: { role: string; content: string }[],
  draft: LeadDraft,
): LeadDraft {
  let merged = draft;
  for (const turn of turns) {
    if (turn.role !== "user") continue;
    merged = inferQualificationFromText(turn.content, merged);
  }
  return merged;
}

export function isLeadReadyForSubmit(
  normalized: ReturnType<typeof normalizeLeadDraft>,
): boolean {
  return Boolean(
    normalized.fullName &&
      normalized.email &&
      normalized.companyName &&
      normalized.service &&
      normalized.budget &&
      normalized.timeline,
  );
}
