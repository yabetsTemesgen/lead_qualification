export const SERVICE_OPTIONS = [
  "Web Development",
  "Mobile App",
  "AI/ML Solution",
  "Cloud Migration",
  "UI/UX Design",
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

export type ChatStep = "service" | "budget" | "timeline" | "contact" | "submitting" | "success";

export type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};
