import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows requests within the limit", () => {
    const key = `test-${Date.now()}`;
    const result = checkRateLimit(key, { limit: 3, windowSeconds: 60 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests over the limit", () => {
    const key = `block-${Date.now()}`;
    const options = { limit: 2, windowSeconds: 60 };
    checkRateLimit(key, options);
    checkRateLimit(key, options);
    const blocked = checkRateLimit(key, options);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
