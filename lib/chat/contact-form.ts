import { z } from "zod";

export const CONTACT_FORM_TRANSITION_MESSAGE =
  "Great — we have your project details. Please fill in the contact form below (name, email, and company). Once you submit, our team will follow up within one business day.";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name (at least 2 characters)"),
  email: z.email("Enter a valid email address"),
  companyName: z.string().trim().min(1, "Company name is required"),
  phone: z.string().trim().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function messageAsksForContactInChat(text: string): boolean {
  const lower = text.toLowerCase();
  const asksContact =
    /\b(your name|full name|email address|company name|what's your email|share your name)\b/i.test(
      lower,
    );
  const hasQuestion = text.includes("?");
  return asksContact && hasQuestion;
}
