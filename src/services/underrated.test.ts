import { describe, it, expect } from "vitest";
import { calculateUnderratedScore } from "@/services/underrated";

describe("calculateUnderratedScore", () => {
  it("scores high-rated low-popularity films higher", () => {
    const underrated = calculateUnderratedScore({
      rating: 8.5,
      voteCount: 500,
      popularity: 5,
      imdbRating: 8.2,
      metascore: 85,
      rottenTomatoes: 90,
      hasAwards: true,
    });

    const popular = calculateUnderratedScore({
      rating: 8.5,
      voteCount: 500,
      popularity: 500,
      imdbRating: 8.2,
      metascore: 85,
      rottenTomatoes: 90,
      hasAwards: true,
    });

    expect(underrated).toBeGreaterThan(popular);
  });

  it("returns a positive score for well-rated films", () => {
    const score = calculateUnderratedScore({
      rating: 7.5,
      voteCount: 100,
      popularity: 20,
    });

    expect(score).toBeGreaterThan(0);
  });
});
