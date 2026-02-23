import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
});

export async function rateLimitOrThrow(key: string) {
  try {
    await limiter.consume(key);
  } catch {
    const err = new Error("Too many requests. Try again shortly.");
    // @ts-expect-error attach status
    err.status = 429;
    throw err;
  }
}