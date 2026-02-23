import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(12).max(200),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(320),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(12).max(200),
});