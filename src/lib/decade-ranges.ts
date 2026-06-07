export interface DecadeRange {
  from: number;
  to: number;
}

/** Inclusive decade slices, e.g. 1950–1959 … 2020–2026 */
export function buildDecadeRanges(
  startYear: number,
  endYear: number
): DecadeRange[] {
  const ranges: DecadeRange[] = [];
  let year = startYear;

  while (year <= endYear) {
    const to = Math.min(year + 9, endYear);
    ranges.push({ from: year, to });
    year += 10;
  }

  return ranges;
}
