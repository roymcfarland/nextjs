"use server";

import { prisma } from "../../../db/prisma";
import { forgotPasswordSchema } from "../../../validation/auth";
import { issueResetToken } from "../../../auth/reset";
import { sendPasswordResetEmail } from "../../../services/email.service";
import { rateLimitOrThrow } from "../../../lib/rateLimit";
import { redirect } from "next/navigation";

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  await rateLimitOrThrow(`forgot:${email}`);

  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) redirect("/forgot-password?sent=1");

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, email: true, active: true },
  });

  if (user?.active) {
    const { rawToken } = await issueResetToken(user.id);
    const base = process.env.APP_URL || "http://localhost:3000";
    const link = `${base}/reset-password?token=${encodeURIComponent(rawToken)}`;
    await sendPasswordResetEmail(user.email, link);
  }

  redirect("/forgot-password?sent=1");
}