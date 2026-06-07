import { discoverParamsSchema } from "@/schemas/movie";
import { TMDB_DEFAULT_ORIGINAL_LANG } from "@/lib/tmdb-config";

export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest" },
  { value: "primary_release_date.asc", label: "Oldest" },
  { value: "revenue.desc", label: "Highest Revenue" },
  { value: "original_title.asc", label: "A-Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export interface DiscoverPageState {
  genres: number[];
  apiLanguage: string | undefined;
  activeLanguage: string | null;
  sortBy: SortOption;
  ratingMin: number;
  yearFrom?: number;
  yearTo?: number;
  page: number;
}

function readString(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  return typeof value === "string" ? value : undefined;
}

export function parseDiscoverPageParams(
  params: Record<string, string | string[] | undefined>
): DiscoverPageState | null {
  const parsed = discoverParamsSchema.safeParse({
    genres: readString(params, "genres"),
    yearFrom: readString(params, "yearFrom"),
    yearTo: readString(params, "yearTo"),
    ratingMin: readString(params, "ratingMin") ?? "0",
    ratingMax: readString(params, "ratingMax") ?? "10",
    language: readString(params, "language"),
    sortBy: readString(params, "sortBy") ?? "popularity.desc",
    page: readString(params, "page") ?? "1",
  });

  if (!parsed.success) return null;

  const languageParam = readString(params, "language");
  const activeLanguage =
    languageParam === "all"
      ? null
      : languageParam ?? TMDB_DEFAULT_ORIGINAL_LANG;

  return {
    genres: parsed.data.genres,
    apiLanguage: parsed.data.language,
    activeLanguage,
    sortBy: parsed.data.sortBy as SortOption,
    ratingMin: parsed.data.ratingMin,
    yearFrom: parsed.data.yearFrom,
    yearTo: parsed.data.yearTo,
    page: parsed.data.page,
  };
}

export interface DiscoverUrlOptions {
  genres?: number[];
  language?: string | null;
  sortBy?: string;
  ratingMin?: number;
  yearFrom?: number;
  yearTo?: number;
  page?: number;
}

export function buildDiscoverUrl(options: DiscoverUrlOptions = {}): string {
  const params = new URLSearchParams();

  if (options.genres?.length) {
    params.set("genres", options.genres.join(","));
  }

  if (options.language === null) {
    params.set("language", "all");
  } else if (options.language) {
    params.set("language", options.language);
  }

  if (options.yearFrom) params.set("yearFrom", String(options.yearFrom));
  if (options.yearTo) params.set("yearTo", String(options.yearTo));

  const sortBy = options.sortBy ?? "popularity.desc";
  if (sortBy !== "popularity.desc") params.set("sortBy", sortBy);

  if (options.ratingMin && options.ratingMin > 0) {
    params.set("ratingMin", String(options.ratingMin));
  }

  const page = options.page ?? 1;
  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return `/discover${qs ? `?${qs}` : ""}`;
}

export function buildDiscoverApiParams(state: {
  genres: number[];
  activeLanguage: string | null;
  sortBy: string;
  ratingMin: number;
  yearFrom?: number;
  yearTo?: number;
  page: number;
}): URLSearchParams {
  const params = new URLSearchParams();

  if (state.genres.length) params.set("genres", state.genres.join(","));
  params.set("language", state.activeLanguage ?? "all");
  if (state.yearFrom) params.set("yearFrom", String(state.yearFrom));
  if (state.yearTo) params.set("yearTo", String(state.yearTo));
  if (state.sortBy !== "popularity.desc") params.set("sortBy", state.sortBy);
  if (state.ratingMin > 0) params.set("ratingMin", String(state.ratingMin));
  params.set("page", String(state.page));

  return params;
}
