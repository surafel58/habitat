import { z } from "zod";

export const inquirySchema = z.object({
  propertyId: z.string().min(1),
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(5, "Tell us a little more").max(1000),
  // ISO date (yyyy-mm-dd) from <input type="date">; optional.
  visitDate: z.string().optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
