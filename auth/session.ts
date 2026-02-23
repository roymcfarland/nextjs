import { cookies } from "next/headers";
import { getIronSession, IronSession } from "iron-session";
import type { UserRole } from "@prisma/client";

export type SessionUser = {
  userId: string;
  role: UserRole;
  accountId: string | null;
};

type SessionData = {
  user?: SessionUser;
};

const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: process.env.SESSION_COOKIE_NAME || "app_sess",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
};

function assertEnv() {
  if (!process.env.SESSION_PASSWORD || process.env.SESSION_PASSWORD.length < 32) {
    throw new Error("SESSION_PASSWORD must be set and be at least 32 characters.");
  }
}

export async function getSession(): Promise<IronSession<SessionData>> {
  assertEnv();
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session.user ?? null;
}

export async function setSessionUser(user: SessionUser): Promise<void> {
  const session = await getSession();
  session.user = user;
  await session.save();
}

export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}