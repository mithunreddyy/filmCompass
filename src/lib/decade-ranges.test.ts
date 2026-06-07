import { describe, expect, it } from "vitest";
import { buildDecadeRanges } from "@/lib/decade-ranges";

describe("buildDecadeRanges", () => {
  it("covers 1950 through 2026 in decade slices", () => {
    const ranges = buildDecadeRanges(1950, 2026);
    expect(ranges[0]).toEqual({ from: 1950, to: 1959 });
    expect(ranges[ranges.length - 1]).toEqual({ from: 2020, to: 2026 });
    expect(ranges).toHaveLength(8);
  });
});
