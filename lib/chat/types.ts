/** Must match service names on the landing page (lib/landing-content.ts). */
export const SERVICE_OPTIONS = [
  "AI Product Development",
  "Product Strategy Consulting",
  "UI/UX Design",
  "App & Software Development",
] as const;

export const BUDGET_OPTIONS = [
  "<$10K",
  "$10K-$25K",
  "$25K-$50K",
  "$50K+",
] as const;

export const TIMELINE_OPTIONS = [
  "ASAP",
  "1-2 months",
  "2-4 months",
  "4+ months",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
export type BudgetOption = (typeof BUDGET_OPTIONS)[number];
export type TimelineOption = (typeof TIMELINE_OPTIONS)[number];
export type LeadScore = "High" | "Medium" | "Low";

export type LeadFormData = {
  service: ServiceOption;
  budget: BudgetOption;
  timeline: TimelineOption;
  fullName: string;
  email: string;
  companyName: string;
  phone?: string;
};

export type LeadDraft = {
  fullName?: string | null;
  email?: string | null;
  companyName?: string | null;
  phone?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  projectSummary?: string | null;
};

export type ChatUiStep = "chatting" | "contact" | "submitting" | "success";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};
