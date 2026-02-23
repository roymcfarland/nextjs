import { hash, verify } from "@node-rs/argon2";

const ARGON_OPTS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length < 12) throw new Error("Password must be at least 12 characters.");
  return hash(plain, ARGON_OPTS);
}

export async function verifyPassword(hashStr: string, plain: string): Promise<boolean> {
  return verify(hashStr, plain);
}