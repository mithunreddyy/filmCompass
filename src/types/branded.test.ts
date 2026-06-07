import { describe, it, expect } from "vitest";
import { toMovieId } from "@/types/branded";

describe("branded types", () => {
  it("creates valid movie IDs", () => {
    expect(toMovieId(550)).toBe(550);
  });

  it("rejects invalid movie IDs", () => {
    expect(() => toMovieId(-1)).toThrow("Invalid movie id");
    expect(() => toMovieId(1.5)).toThrow("Invalid movie id");
  });
});
