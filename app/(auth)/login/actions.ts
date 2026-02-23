"use server";

import { prisma } from "../../../db/prisma";
import { loginSchema } from "../../../validation/auth";
import { verifyPassword } from "../../../auth/passwords";
import { setSessionUser } from "../../../auth/session";
import { rateLimitOrThrow } from "../../../lib/rateLimit";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  await rateLimitOrThrow(`login:${email}`);

  const parsed = loginSchema.safeParse({
    email,
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { ok: false, message: "Invalid credentials." };

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, role: true, accountId: true, active: true, passwordHash: true },
  });
  if (!user?.active) return { ok: false, message: "Invalid credentials." };

  const ok = await verifyPassword(user.passwordHash, parsed.data.password);
  if (!ok) return { ok: false, message: "Invalid credentials." };

  await setSessionUser({ userId: user.id, role: user.role, accountId: user.accountId ?? null });

  if (user.role === "STAFF") redirect("/dashboard/orders");
  redirect("/menu");
}