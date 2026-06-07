import { describe, expect, it } from "vitest";
import {
  calculateFavoriteIndex,
  calculateRepeatValue,
  pickWeightedGem,
  scoreMovieAsGem,
  scoreGemPool,
} from "@/services/gem-engine";
import type { Movie } from "@/types/movie";

function mockMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: "Test Film",
    originalTitle: "Test Film",
    overview: "Overview",
    posterUrl: null,
    backdropUrl: null,
    releaseDate: "2018-01-01",
    year: 2018,
    rating: 8,
    voteCount: 120,
    popularity: 28,
    genreIds: [35, 18],
    language: "te",
    ...overrides,
  };
}

describe("gem-engine", () => {
  it("favors audience-validated films over hype-only titles", () => {
    const cult = calculateFavoriteIndex(
      mockMovie({ voteCount: 200, popularity: 25, rating: 8.1 })
    );
    const hype = calculateFavoriteIndex(
      mockMovie({ voteCount: 30, popularity: 110, rating: 8.4 })
    );
    expect(cult).toBeGreaterThan(hype);
  });

  it("gives comedy/drama higher repeat value", () => {
    const comedy = calculateRepeatValue(mockMovie({ genreIds: [35] }));
    const horror = calculateRepeatValue(mockMovie({ genreIds: [27] }));
    expect(comedy).toBeGreaterThan(horror);
  });

  it("filters blockbusters and unreliable ratings", () => {
    const scored = scoreGemPool([
      mockMovie({ id: 1, popularity: 200 }),
      mockMovie({ id: 2, rating: 6 }),
      mockMovie({ id: 3, voteCount: 3, rating: 9 }),
      mockMovie({ id: 4, popularity: 40, rating: 8, voteCount: 90 }),
    ]);
    expect(scored).toHaveLength(1);
    expect(scored[0].id).toBe(4);
    expect(scored[0].gemScore).toBeGreaterThan(0);
  });

  it("weighted pick returns a candidate from the pool", () => {
    const pool = scoreGemPool([
      mockMovie({ id: 1, popularity: 20 }),
      mockMovie({ id: 2, popularity: 35, voteCount: 80 }),
      mockMovie({ id: 3, popularity: 15, voteCount: 150, rating: 8.3 }),
    ]);
    const pick = pickWeightedGem(pool, []);
    expect(pick).not.toBeNull();
    expect(pool.some((p) => p.id === pick!.id)).toBe(true);
  });

  it("adds social proof highlights when OMDb data is strong", () => {
    const gem = scoreMovieAsGem(mockMovie(), {
      imdbRating: 8.1,
      imdbVotes: 12000,
      rottenTomatoes: 88,
    });
    expect(gem.socialProof).toBeGreaterThan(1);
    expect(gem.highlights).toContain("Cross-platform buzz");
  });
});
