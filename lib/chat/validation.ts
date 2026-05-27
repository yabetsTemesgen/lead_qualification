import { z } from "zod";
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/chat/types";

export const leadSubmissionSchema = z.object({
  service: z.enum(SERVICE_OPTIONS),
  budget: z.enum(BUDGET_OPTIONS),
  timeline: z.enum(TIMELINE_OPTIONS),
  fullName: z.string().trim().min(2, "Name is required"),
  email: z.email("Enter a valid email"),
  companyName: z.string().trim().min(1, "Company name is required"),
  phone: z.string().trim().optional(),
  clientSubmissionId: z.string().uuid().optional(),
});

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;
