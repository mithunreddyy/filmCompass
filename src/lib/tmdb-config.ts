function trimOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === "" ? undefined : trimmed;
}

/** TMDb metadata locale — titles, overviews, and genre names in English */
export const TMDB_LOCALE =
  trimOptional(process.env.TMDB_DEFAULT_LANGUAGE) ?? "en-US";

/** Default original language filter for discover/browse */
export const TMDB_DEFAULT_ORIGINAL_LANG = "te";

/** Region for theatrical now-playing / upcoming */
export const TMDB_REGION =
  trimOptional(process.env.TMDB_DEFAULT_REGION) ?? "IN";

export const TMDB_VOTE_COUNT_DEFAULT = 50;
export const TMDB_VOTE_COUNT_REGIONAL = 5;
