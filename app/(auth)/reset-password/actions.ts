"use server";

import { consumeResetToken } from "../../../auth/reset";
import { resetPasswordSchema } from "../../../validation/auth";
import { hashPassword } from "../../../auth/passwords";
import { prisma } from "../../../db/prisma";
import { rateLimitOrThrow } from "../../../lib/rateLimit";
import { redirect } from "next/navigation";

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  await rateLimitOrThrow(`reset:${token.slice(0, 12)}`);

  const parsed = resetPasswordSchema.safeParse({
    token,
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { ok: false, message: "Invalid request." };

  const user = await consumeResetToken(parsed.data.token);
  if (!user) return { ok: false, message: "Reset link is invalid or expired." };

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  redirect("/login?reset=1");
}