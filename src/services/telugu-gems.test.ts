import { describe, expect, it } from "vitest";
import { scoreGemPool, scoreCataloguePool } from "@/services/gem-engine";
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
    voteCount: 100,
    popularity: 25,
    genreIds: [18],
    language: "te",
    ...overrides,
  };
}

describe("scoreCataloguePool", () => {
  it("includes all Telugu films from 1950–present in the catalogue", () => {
    const scored = scoreCataloguePool([
      mockMovie({ id: 1, popularity: 200, rating: 8.5, year: 1965 }),
      mockMovie({ id: 2, popularity: 30, rating: 6.5, year: 2010 }),
      mockMovie({ id: 3, popularity: 40, rating: 8.2, language: "hi", year: 2015 }),
      mockMovie({ id: 4, popularity: 35, rating: 8.1, voteCount: 80, year: 2018 }),
    ]);

    expect(scored).toHaveLength(3);
    expect(scored.map((m) => m.id).sort()).toEqual([1, 2, 4]);
  });
});

describe("scoreGemPool (hidden gems)", () => {
  it("filters mainstream blockbusters and low-rated films", () => {
    const scored = scoreGemPool([
      mockMovie({ id: 1, popularity: 200, rating: 8.5 }),
      mockMovie({ id: 2, popularity: 30, rating: 6.5 }),
      mockMovie({ id: 3, popularity: 40, rating: 8.2, language: "hi" }),
      mockMovie({ id: 4, popularity: 35, rating: 8.1, voteCount: 80, year: 2018 }),
    ]);

    expect(scored).toHaveLength(1);
    expect(scored[0].id).toBe(4);
    expect(scored[0].gemScore).toBeGreaterThan(0);
  });

  it("ranks lower popularity films higher when quality is similar", () => {
    const scored = scoreGemPool([
      mockMovie({ id: 1, popularity: 70, rating: 8.0, voteCount: 200 }),
      mockMovie({ id: 2, popularity: 15, rating: 8.0, voteCount: 200 }),
    ]);

    expect(scored[0].id).toBe(2);
    expect(scored[0].gemScore).toBeGreaterThan(scored[1].gemScore);
  });
});
