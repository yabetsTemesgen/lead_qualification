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

export function normalizeService(value?: string | null): ServiceOption | null {
  if (!value?.trim()) return null;
  const v = value.trim();

  const direct = pickClosest(v, SERVICE_OPTIONS);
  if (direct) return direct;

  const lower = v.toLowerCase();

  // Landing-page "App & Software Development" (check before /\bai\b/ — not substring "ai" in "app")
  if (
    /app\s*(?:&|and)\s*software|app\s+and\s+software|software development/.test(
      lower,
    )
  ) {
    return /mobile|ios|android|native app/.test(lower)
      ? "Mobile App"
      : "Web Development";
  }

  if (/mobile\s*app|native\s*app|ios|android|app store/.test(lower)) {
    return "Mobile App";
  }

  if (
    /\bai\b|\bml\b|ai\/ml|ai product|machine learning|\bllm\b|chatbot/.test(
      lower,
    )
  ) {
    return "AI/ML Solution";
  }

  if (/cloud|aws|azure|gcp|migration|devops/.test(lower)) {
    return "Cloud Migration";
  }
  if (/ui|ux|design|figma/.test(lower)) return "UI/UX Design";
  if (/web|website|saas|portal|dashboard|next\.?js|react/.test(lower)) {
    return "Web Development";
  }

  return null;
}

export function normalizeBudget(value?: string | null): BudgetOption | null {
  if (!value?.trim()) return null;
  const v = value.trim();
  const direct = pickClosest(v, BUDGET_OPTIONS);
  if (direct) return direct;

  const lower = v.toLowerCase().replace(/,/g, "");
  if (/under\s*10|<\s*\$?\s*10|<10/.test(lower)) return "<$10K";
  if (/50\s*k|50k|\$50|50,000|50-100|above\s*50/.test(lower)) return "$50K+";
  if (
    /25\s*k|25k|25-50|25\s*to\s*50|between\s*25|25\s*and\s*5o?k|25\s*-\s*50/i.test(
      lower,
    )
  ) {
    return "$25K-$50K";
  }
  if (/10\s*k|10k|10-25|15k|20k|10\s*to\s*25/.test(lower)) return "$10K-$25K";
  if (/^20\s*k?$|^\$?\s*20k$/i.test(lower.trim())) return "$10K-$25K";

  const nums = [...lower.matchAll(/(\d+)\s*k/gi)].map((m) => Number(m[1]));
  if (nums.length) {
    const max = Math.max(...nums);
    if (max < 10) return "<$10K";
    if (max < 25) return "$10K-$25K";
    if (max < 50) return "$25K-$50K";
    return "$50K+";
  }

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

/** Fill qualification fields from full chat history (model often confirms slots in replies). */
export function inferQualificationFromMessages(
  turns: { role: string; content: string }[],
  draft: LeadDraft,
): LeadDraft {
  let merged = draft;
  for (const turn of turns) {
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
