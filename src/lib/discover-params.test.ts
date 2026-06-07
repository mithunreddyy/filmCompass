import { describe, expect, it } from "vitest";
import { buildDiscoverUrl, parseDiscoverPageParams } from "./discover-params";

describe("parseDiscoverPageParams", () => {
  it("defaults to Telugu when language is omitted", () => {
    const state = parseDiscoverPageParams({});
    expect(state?.activeLanguage).toBe("te");
    expect(state?.apiLanguage).toBe("te");
    expect(state?.sortBy).toBe("popularity.desc");
  });

  it("parses all-languages escape hatch", () => {
    const state = parseDiscoverPageParams({ language: "all" });
    expect(state?.activeLanguage).toBeNull();
    expect(state?.apiLanguage).toBeUndefined();
  });

  it("parses genres and rating filters", () => {
    const state = parseDiscoverPageParams({
      genres: "28,12",
      ratingMin: "7.5",
      sortBy: "vote_average.desc",
      page: "2",
    });
    expect(state?.genres).toEqual([28, 12]);
    expect(state?.ratingMin).toBe(7.5);
    expect(state?.page).toBe(2);
  });
});

describe("buildDiscoverUrl", () => {
  it("builds Telugu gems URL", () => {
    expect(
      buildDiscoverUrl({
        language: "te",
        sortBy: "vote_average.desc",
        ratingMin: 7.5,
      })
    ).toBe("/discover?language=te&sortBy=vote_average.desc&ratingMin=7.5");
  });

  it("omits default sort and page", () => {
    expect(buildDiscoverUrl({ language: "te" })).toBe("/discover?language=te");
  });
});
