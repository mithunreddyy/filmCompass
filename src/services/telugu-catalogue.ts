import type { Movie } from "@/types/movie";
import { discoverMovies } from "@/services/tmdb";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/redis-cache";
import { buildDecadeRanges } from "@/lib/decade-ranges";
import { TMDB_DEFAULT_ORIGINAL_LANG } from "@/lib/tmdb-config";
import { logger } from "@/lib/logger";

export const TELUGU_CATALOGUE_START = 1950;
export const TELUGU_CATALOGUE_END = 2026;

const CACHE_KEY = `tmdb:telugu-catalogue:${TELUGU_CATALOGUE_START}-${TELUGU_CATALOGUE_END}`;
const PAGE_BATCH = 10;
const DECADE_BATCH = 3;
const TMDB_MAX_PAGE = 500;

const DISCOVER_SORTS = [
  "popularity.desc",
  "vote_average.desc",
  "primary_release_date.desc",
  "primary_release_date.asc",
] as const;

function mergeById(...lists: Movie[][]): Movie[] {
  const seen = new Set<number>();
  const merged: Movie[] = [];
  for (const list of lists) {
    for (const movie of list) {
      if (!seen.has(movie.id)) {
        seen.add(movie.id);
        merged.push(movie);
      }
    }
  }
  return merged;
}

async function fetchDiscoverPage(
  yearFrom: number,
  yearTo: number,
  sortBy: string,
  page: number
): Promise<{ movies: Movie[]; totalPages: number }> {
  try {
    const result = await discoverMovies({
      language: TMDB_DEFAULT_ORIGINAL_LANG,
      yearFrom,
      yearTo,
      sortBy,
      ratingMin: 0,
      page,
    });
    return { movies: result.movies, totalPages: result.totalPages };
  } catch {
    return { movies: [], totalPages: 0 };
  }
}

/** Fetch every TMDb discover page for one decade + sort (capped at 500 pages) */
async function fetchAllPagesForQuery(
  yearFrom: number,
  yearTo: number,
  sortBy: string
): Promise<Movie[]> {
  const first = await fetchDiscoverPage(yearFrom, yearTo, sortBy, 1);
  const merged = [...first.movies];
  const maxPage = Math.min(first.totalPages, TMDB_MAX_PAGE);

  for (let page = 2; page <= maxPage; page += PAGE_BATCH) {
    const end = Math.min(page + PAGE_BATCH - 1, maxPage);
    const pages = await Promise.all(
      Array.from({ length: end - page + 1 }, (_, i) =>
        fetchDiscoverPage(yearFrom, yearTo, sortBy, page + i)
      )
    );
    merged.push(...pages.flatMap((p) => p.movies));
  }

  return merged;
}

async function fetchDecadeCatalogue(
  yearFrom: number,
  yearTo: number
): Promise<Movie[]> {
  const bySort = await Promise.all(
    DISCOVER_SORTS.map((sortBy) => fetchAllPagesForQuery(yearFrom, yearTo, sortBy))
  );
  return mergeById(...bySort);
}

async function mapInBatches<T, R>(
  items: T[],
  batchSize: number,
  mapper: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const slice = items.slice(i, i + batchSize);
    const batch = await Promise.all(slice.map(mapper));
    results.push(...batch);
  }
  return results;
}

/**
 * Full Telugu film catalogue from TMDb (1950 → 2026).
 * Crawls each decade with multiple sort orders and all discover pages.
 * Cached 6 hours — first build may take 30–90s.
 */
export async function fetchTeluguCatalogue1950Present(): Promise<Movie[]> {
  const cached = await cacheGet<Movie[]>(CACHE_KEY);
  if (cached && cached.length > 0) return cached;

  const decades = buildDecadeRanges(TELUGU_CATALOGUE_START, TELUGU_CATALOGUE_END);
  const started = Date.now();

  const decadeLists = await mapInBatches(decades, DECADE_BATCH, ({ from, to }) =>
    fetchDecadeCatalogue(from, to)
  );

  const catalogue = mergeById(...decadeLists).filter(
    (m) =>
      m.language === TMDB_DEFAULT_ORIGINAL_LANG &&
      m.year >= TELUGU_CATALOGUE_START &&
      m.year <= TELUGU_CATALOGUE_END
  );

  logger.info("Telugu catalogue built", {
    films: catalogue.length,
    decades: decades.length,
    ms: Date.now() - started,
  });

  await cacheSet(CACHE_KEY, catalogue, CACHE_TTL.CATALOGUE);
  return catalogue;
}

export async function getTeluguCatalogueStats() {
  const catalogue = await fetchTeluguCatalogue1950Present();
  const byDecade: Record<string, number> = {};

  for (const movie of catalogue) {
    const decade = Math.floor(movie.year / 10) * 10;
    const label = `${decade}s`;
    byDecade[label] = (byDecade[label] ?? 0) + 1;
  }

  return {
    total: catalogue.length,
    startYear: TELUGU_CATALOGUE_START,
    endYear: TELUGU_CATALOGUE_END,
    byDecade,
  };
}
