import { prisma } from "../db/prisma";
import { getSessionUser } from "./session";

export class AuthError extends Error {
  status = 401;
}

export class ForbiddenError extends Error {
  status = 403;
}

export async function requireUser() {
  const s = await getSessionUser();
  if (!s) throw new AuthError("Not authenticated.");

  const dbUser = await prisma.user.findUnique({
    where: { id: s.userId },
    select: { id: true, role: true, accountId: true, active: true },
  });

  if (!dbUser?.active) throw new AuthError("User inactive.");
  return dbUser;
}

export async function requireStaff() {
  const u = await requireUser();
  if (u.role !== "STAFF") throw new ForbiddenError("Staff only.");
  return u;
}

export async function requireBuyer() {
  const u = await requireUser();
  if (u.role !== "BUYER") throw new ForbiddenError("Buyer only.");
  if (!u.accountId) throw new ForbiddenError("Buyer missing account.");

  const acct = await prisma.account.findUnique({
    where: { id: u.accountId },
    select: { status: true },
  });

  if (!acct || acct.status !== "ACTIVE") throw new ForbiddenError("Account not active.");
  return u;
}