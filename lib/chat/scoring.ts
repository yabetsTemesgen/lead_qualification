import type { BudgetOption, LeadScore, TimelineOption } from "@/lib/chat/types";

const BUDGET_WEIGHT: Record<BudgetOption, number> = {
  "<$10K": 1,
  "$10K-$25K": 2,
  "$25K-$50K": 3,
  "$50K+": 4,
};

const TIMELINE_WEIGHT: Record<TimelineOption, number> = {
  ASAP: 4,
  "1-2 months": 3,
  "2-4 months": 2,
  "4+ months": 1,
};

export function calculateLeadScore(
  budget: BudgetOption,
  timeline: TimelineOption,
): LeadScore {
  const budgetScore = BUDGET_WEIGHT[budget];
  const timelineScore = TIMELINE_WEIGHT[timeline];
  const total = budgetScore + timelineScore;

  if (budgetScore >= 4 && timelineScore >= 3) return "High";
  if (total >= 6) return "High";
  if (total <= 3) return "Low";
  return "Medium";
}
