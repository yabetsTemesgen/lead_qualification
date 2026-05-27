import type { ChatStep } from "@/lib/chat/types";

export const CHAT_COPY = {
  greeting:
    "Hi! I'm the Wipuu Labs project assistant. I'll ask a few quick questions so our team can follow up with the right plan.",
  service: "What type of service are you looking for?",
  budget: "What's your estimated budget for this project?",
  timeline: "When do you need this project completed?",
  contact: "Almost done — share your contact details and we'll reach out within one business day.",
  success: (score: string) =>
    `Thank you! Your inquiry has been received. We've scored this lead as **${score}** priority and will follow up soon.`,
} as const;

export function getStepPrompt(step: ChatStep): string | null {
  switch (step) {
    case "service":
      return CHAT_COPY.service;
    case "budget":
      return CHAT_COPY.budget;
    case "timeline":
      return CHAT_COPY.timeline;
    case "contact":
      return CHAT_COPY.contact;
    default:
      return null;
  }
}

export const SUBMITTED_STORAGE_KEY = "wipuu_labs_lead_submitted";
