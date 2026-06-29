import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
