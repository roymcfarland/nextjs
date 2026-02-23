import crypto from "crypto";
import { prisma } from "../db/prisma";

const TOKEN_BYTES = 32;
const TOKEN_TTL_MINUTES = 30;

function sha256Base64Url(input: string) {
  return crypto.createHash("sha256").update(input).digest("base64url");
}

function generateRawToken(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString("base64url");
}

export async function issueResetToken(userId: string) {
  const rawToken = generateRawToken();
  const tokenHash = sha256Base64Url(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return { rawToken, expiresAt };
}

export async function consumeResetToken(rawToken: string) {
  const tokenHash = sha256Base64Url(rawToken);

  const token = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, email: true, active: true } } },
  });

  if (!token) return null;
  if (token.usedAt) return null;
  if (token.expiresAt.getTime() < Date.now()) return null;
  if (!token.user.active) return null;

  await prisma.passwordResetToken.update({
    where: { id: token.id },
    data: { usedAt: new Date() },
  });

  return token.user;
}