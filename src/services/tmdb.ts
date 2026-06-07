import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/redis-cache";
import { getServerEnv } from "@/lib/env";
import { NotFoundError } from "@/lib/errors";
import {
  TMDB_LOCALE,
  TMDB_DEFAULT_ORIGINAL_LANG,
  TMDB_REGION,
  TMDB_VOTE_COUNT_DEFAULT,
  TMDB_VOTE_COUNT_REGIONAL,
} from "@/lib/tmdb-config";
import type {
  TMDbMovie,
  TMDbMovieDetail,
  TMDbPaginatedResponse,
  TMDbGenre,
  Movie,
  MovieDetail,
  CastMember,
  CrewMember,
  Video,
  Review,
  Genre,
} from "@/types/movie";

// ============================================
// TMDb Configuration
// ============================================

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const IMAGE_SIZES = {
  poster: {
    small: `${TMDB_IMAGE_BASE}/w185`,
    medium: `${TMDB_IMAGE_BASE}/w342`,
    large: `${TMDB_IMAGE_BASE}/w500`,
    original: `${TMDB_IMAGE_BASE}/original`,
  },
  backdrop: {
    small: `${TMDB_IMAGE_BASE}/w780`,
    large: `${TMDB_IMAGE_BASE}/w1280`,
    original: `${TMDB_IMAGE_BASE}/original`,
  },
  profile: {
    small: `${TMDB_IMAGE_BASE}/w185`,
    medium: `${TMDB_IMAGE_BASE}/h632`,
    original: `${TMDB_IMAGE_BASE}/original`,
  },
  logo: {
    small: `${TMDB_IMAGE_BASE}/w92`,
    medium: `${TMDB_IMAGE_BASE}/w154`,
    large: `${TMDB_IMAGE_BASE}/w300`,
  },
} as const;

// ============================================
// API Fetcher
// ============================================

function getApiKey(): string {
  return getServerEnv().TMDB_API_KEY;
}

function getAccessToken(): string | null {
  return getServerEnv().TMDB_ACCESS_TOKEN ?? null;
}

function buildAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  if (token) {
    return {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
  return { Accept: "application/json" };
}

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const token = getAccessToken();
  const searchParams = new URLSearchParams();

  if (!token) {
    searchParams.set("api_key", getApiKey());
  }

  if (!searchParams.has("language")) {
    searchParams.set("language", TMDB_LOCALE);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`;
  const cacheKey = `tmdb:${endpoint}:${searchParams.toString()}`;

  const cached = await cacheGet<T>(cacheKey);
  if (cached) return cached;

  const response = await fetch(url, {
    headers: buildAuthHeaders(),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError("Movie not found");
    }
    throw new Error(
      `TMDb API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as T;

  const ttl = endpoint.includes("trending")
    ? CACHE_TTL.TRENDING
    : endpoint.includes("movie/")
      ? CACHE_TTL.MOVIE_DETAIL
      : endpoint.includes("discover")
        ? CACHE_TTL.DISCOVER
        : CACHE_TTL.SEARCH;
  await cacheSet(cacheKey, data, ttl);

  return data;
}

// ============================================
// Data Transformers
// ============================================

function pickEnglishTitle(title: string, originalTitle: string): string {
  const localized = title?.trim();
  if (localized) return localized;
  return originalTitle?.trim() ?? "";
}

export function transformMovie(movie: TMDbMovie): Movie {
  return {
    id: movie.id,
    title: pickEnglishTitle(movie.title, movie.original_title),
    originalTitle: movie.original_title,
    overview: movie.overview?.trim() ?? "",
    posterUrl: movie.poster_path
      ? `${IMAGE_SIZES.poster.large}${movie.poster_path}`
      : null,
    backdropUrl: movie.backdrop_path
      ? `${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`
      : null,
    releaseDate: movie.release_date,
    year: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 0,
    rating: Math.round(movie.vote_average * 10) / 10,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    genreIds: movie.genre_ids,
    language: movie.original_language,
  };
}

export function transformMovieDetail(movie: TMDbMovieDetail): MovieDetail {
  const director =
    movie.credits?.crew.find((c) => c.job === "Director") ?? null;

  const trailer =
    movie.videos?.results.find(
      (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
    ) ??
    movie.videos?.results.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    ) ??
    null;

  // Get US certification
  const usRelease = movie.release_dates?.results.find(
    (r) => r.iso_3166_1 === "US"
  );
  const certification =
    usRelease?.release_dates.find((r) => r.certification)?.certification ??
    null;

  return {
    id: movie.id,
    title: pickEnglishTitle(movie.title, movie.original_title),
    originalTitle: movie.original_title,
    overview: movie.overview?.trim() ?? "",
    posterUrl: movie.poster_path
      ? `${IMAGE_SIZES.poster.large}${movie.poster_path}`
      : null,
    backdropUrl: movie.backdrop_path
      ? `${IMAGE_SIZES.backdrop.original}${movie.backdrop_path}`
      : null,
    releaseDate: movie.release_date,
    year: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 0,
    rating: Math.round(movie.vote_average * 10) / 10,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    genreIds: movie.genres.map((g) => g.id),
    language: movie.original_language,
    budget: movie.budget,
    revenue: movie.revenue,
    runtime: movie.runtime,
    status: movie.status,
    tagline: movie.tagline,
    homepage: movie.homepage,
    imdbId: movie.imdb_id,
    genres: movie.genres.map(
      (g: TMDbGenre): Genre => ({
        id: g.id,
        name: g.name,
        slug: g.name.toLowerCase().replace(/\s+/g, "-"),
      })
    ),
    cast: (movie.credits?.cast ?? []).slice(0, 20).map(
      (c): CastMember => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profileUrl: c.profile_path
          ? `${IMAGE_SIZES.profile.medium}${c.profile_path}`
          : null,
        order: c.order,
      })
    ),
    crew: (movie.credits?.crew ?? []).slice(0, 10).map(
      (c): CrewMember => ({
        id: c.id,
        name: c.name,
        job: c.job,
        department: c.department,
        profileUrl: c.profile_path
          ? `${IMAGE_SIZES.profile.medium}${c.profile_path}`
          : null,
      })
    ),
    director: director
      ? {
          id: director.id,
          name: director.name,
          job: director.job,
          department: director.department,
          profileUrl: director.profile_path
            ? `${IMAGE_SIZES.profile.medium}${director.profile_path}`
            : null,
        }
      : null,
    videos: (movie.videos?.results ?? []).map(
      (v): Video => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
        official: v.official,
      })
    ),
    trailer: trailer
      ? {
          id: trailer.id,
          key: trailer.key,
          name: trailer.name,
          site: trailer.site,
          type: trailer.type,
          official: trailer.official,
        }
      : null,
    similarMovies: (movie.similar?.results ?? []).slice(0, 12).map(transformMovie),
    recommendations: (movie.recommendations?.results ?? [])
      .slice(0, 12)
      .map(transformMovie),
    reviews: (movie.reviews?.results ?? []).slice(0, 10).map(
      (r): Review => ({
        id: r.id,
        author: r.author,
        authorAvatar: r.author_details.avatar_path
          ? r.author_details.avatar_path.startsWith("/https")
            ? r.author_details.avatar_path.slice(1)
            : `${IMAGE_SIZES.profile.small}${r.author_details.avatar_path}`
          : null,
        authorRating: r.author_details.rating,
        content: r.content,
        createdAt: r.created_at,
      })
    ),
    productionCompanies: movie.production_companies.map((c) => ({
      id: c.id,
      name: c.name,
      logoUrl: c.logo_path
        ? `${IMAGE_SIZES.logo.medium}${c.logo_path}`
        : null,
      country: c.origin_country,
    })),
    spokenLanguages: movie.spoken_languages.map((l) => ({
      code: l.iso_639_1,
      name: l.name,
      englishName: l.english_name,
    })),
    certification,
    keywords: movie.keywords?.keywords.map((k) => k.name) ?? [],
  };
}

// ============================================
// API Methods
// ============================================

export async function searchMovies(
  query: string,
  page: number = 1,
  year?: number
) {
  const data = await tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>(
    "/search/movie",
    { query, page, year, include_adult: false }
  );

  return {
    movies: data.results.map(transformMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const data = await tmdbFetch<TMDbMovieDetail>(`/movie/${id}`, {
    append_to_response:
      "credits,videos,similar,recommendations,reviews,images,keywords,release_dates",
  });

  return transformMovieDetail(data);
}

export async function getTrending(
  timeWindow: "day" | "week" = "week",
  page: number = 1
) {
  const data = await tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>(
    `/trending/movie/${timeWindow}`,
    { page }
  );

  return {
    movies: data.results.map(transformMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function discoverMovies(params: {
  genres?: number[];
  yearFrom?: number;
  yearTo?: number;
  releaseDateFrom?: string;
  releaseDateTo?: string;
  ratingMin?: number;
  ratingMax?: number;
  language?: string;
  sortBy?: string;
  page?: number;
}) {
  const hasLanguageFilter = Boolean(params.language);

  const apiParams: Record<string, string | number | boolean | undefined> = {
    sort_by: params.sortBy ?? "popularity.desc",
    include_adult: false,
    page: params.page ?? 1,
    "vote_count.gte": hasLanguageFilter
      ? TMDB_VOTE_COUNT_REGIONAL
      : TMDB_VOTE_COUNT_DEFAULT,
  };

  if (params.genres?.length) {
    apiParams.with_genres = params.genres.join(",");
  }
  if (params.releaseDateFrom) {
    apiParams["primary_release_date.gte"] = params.releaseDateFrom;
  } else if (params.yearFrom) {
    apiParams["primary_release_date.gte"] = `${params.yearFrom}-01-01`;
  }
  if (params.releaseDateTo) {
    apiParams["primary_release_date.lte"] = params.releaseDateTo;
  } else if (params.yearTo) {
    apiParams["primary_release_date.lte"] = `${params.yearTo}-12-31`;
  }
  if (params.ratingMin && params.ratingMin > 0) {
    apiParams["vote_average.gte"] = params.ratingMin;
  }
  if (params.ratingMax && params.ratingMax < 10) {
    apiParams["vote_average.lte"] = params.ratingMax;
  }
  if (params.language) {
    apiParams.with_original_language = params.language;
  }

  const data = await tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>(
    "/discover/movie",
    apiParams
  );

  return {
    movies: data.results.map(transformMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getTopRated(page: number = 1) {
  const data = await tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>(
    "/movie/top_rated",
    { page }
  );

  return {
    movies: data.results.map(transformMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getNowPlaying(page: number = 1) {
  const data = await tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>(
    "/movie/now_playing",
    { page, region: TMDB_REGION }
  );

  return {
    movies: data.results.map(transformMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getUpcoming(page: number = 1) {
  const data = await tmdbFetch<TMDbPaginatedResponse<TMDbMovie>>(
    "/movie/upcoming",
    { page, region: TMDB_REGION }
  );

  return {
    movies: data.results.map(transformMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getGenreList(): Promise<Genre[]> {
  const cacheKey = "tmdb:genres";
  const cached = await cacheGet<Genre[]>(cacheKey);
  if (cached) return cached;

  const data = await tmdbFetch<{ genres: TMDbGenre[] }>("/genre/movie/list");
  const genres: Genre[] = data.genres.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  await cacheSet(cacheKey, genres, CACHE_TTL.GENRES);
  return genres;
}

/**
 * Get "hidden gems" — high-rated movies with lower popularity
 */
export async function getHiddenGems(page: number = 1) {
  const { getTeluguHiddenGemsPaginated } = await import("@/services/telugu-gems");
  return getTeluguHiddenGemsPaginated(page);
}

// ============================================
// Telugu-first helpers
// ============================================

export async function getTeluguTrending(page: number = 1) {
  return discoverMovies({
    language: TMDB_DEFAULT_ORIGINAL_LANG,
    sortBy: "popularity.desc",
    page,
  });
}

export async function getTeluguTopRated(page: number = 1) {
  return discoverMovies({
    language: TMDB_DEFAULT_ORIGINAL_LANG,
    sortBy: "vote_average.desc",
    page,
  });
}

export async function getTeluguHiddenGems(page: number = 1) {
  return getHiddenGems(page);
}

function filterTeluguMovies(movies: Movie[]): Movie[] {
  return movies.filter((m) => m.language === TMDB_DEFAULT_ORIGINAL_LANG);
}

const TELUGU_NOW_PLAYING_CACHE_KEY = "tmdb:telugu-now-playing:merged";

/** India theatrical now-playing (region IN), Telugu only */
async function fetchTeluguNowPlayingMerged(): Promise<Movie[]> {
  const cached = await cacheGet<Movie[]>(TELUGU_NOW_PLAYING_CACHE_KEY);
  if (cached) return cached;

  const pages = await Promise.all(
    [1, 2, 3, 4, 5].map((p) =>
      getNowPlaying(p).catch(() => ({ movies: [] as Movie[] }))
    )
  );

  const telugu = filterTeluguMovies(pages.flatMap((r) => r.movies));
  const seen = new Set<number>();
  const unique: Movie[] = [];

  for (const movie of telugu) {
    if (!seen.has(movie.id)) {
      seen.add(movie.id);
      unique.push(movie);
    }
  }

  unique.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));

  await cacheSet(TELUGU_NOW_PLAYING_CACHE_KEY, unique, CACHE_TTL.TRENDING);
  return unique;
}

/** Telugu films currently in Indian theaters — TMDb /movie/now_playing?region=IN */
export async function getTeluguNowPlaying(page: number = 1) {
  const all = await fetchTeluguNowPlayingMerged();
  const perPage = 20;
  const start = (page - 1) * perPage;

  return {
    movies: all.slice(start, start + perPage),
    page,
    totalPages: Math.max(1, Math.ceil(all.length / perPage)),
    totalResults: all.length,
  };
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function filterFutureTelugu(movies: Movie[], fromDate: string): Movie[] {
  return movies.filter(
    (m) =>
      m.language === TMDB_DEFAULT_ORIGINAL_LANG &&
      m.releaseDate &&
      m.releaseDate >= fromDate
  );
}

function mergeMoviesByReleaseDate(...lists: Movie[][]): Movie[] {
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
  return merged.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
}

const TELUGU_UPCOMING_CACHE_KEY = "tmdb:telugu-upcoming:merged";

async function fetchTeluguUpcomingMerged(): Promise<Movie[]> {
  const cached = await cacheGet<Movie[]>(TELUGU_UPCOMING_CACHE_KEY);
  if (cached) return cached;

  const today = toISODate(new Date());
  const end = new Date();
  end.setMonth(end.getMonth() + 18);
  const endISO = toISODate(end);

  const [theatricalPages, discoverPages] = await Promise.all([
    Promise.all(
      [1, 2, 3].map((p) =>
        getUpcoming(p).catch(() => ({ movies: [] as Movie[] }))
      )
    ),
    Promise.all(
      [1, 2].map((p) =>
        discoverMovies({
          language: TMDB_DEFAULT_ORIGINAL_LANG,
          sortBy: "primary_release_date.asc",
          releaseDateFrom: today,
          releaseDateTo: endISO,
          page: p,
        }).catch(() => ({ movies: [] as Movie[] }))
      )
    ),
  ]);

  const theatrical = mergeMoviesByReleaseDate(
    ...theatricalPages.map((r) => filterFutureTelugu(r.movies, today))
  );
  const discovered = mergeMoviesByReleaseDate(
    ...discoverPages.map((r) => filterFutureTelugu(r.movies, today))
  );
  const all = mergeMoviesByReleaseDate(theatrical, discovered);

  await cacheSet(TELUGU_UPCOMING_CACHE_KEY, all, CACHE_TTL.TRENDING);
  return all;
}

/** Upcoming Telugu films from today onward — India theatrical + discover */
export async function getTeluguUpcoming(page: number = 1) {
  const all = await fetchTeluguUpcomingMerged();
  const perPage = 20;
  const start = (page - 1) * perPage;

  return {
    movies: all.slice(start, start + perPage),
    page,
    totalPages: Math.max(1, Math.ceil(all.length / perPage)),
    totalResults: all.length,
  };
}

/** Merge movies from two pages, deduplicating by id */
export async function fetchTwoPages(
  fetcher: (page: number) => Promise<{ movies: Movie[] }>
): Promise<Movie[]> {
  const [p1, p2] = await Promise.all([fetcher(1), fetcher(2)]);
  const seen = new Set<number>();
  const merged: Movie[] = [];
  for (const movie of [...p1.movies, ...p2.movies]) {
    if (!seen.has(movie.id)) {
      seen.add(movie.id);
      merged.push(movie);
    }
  }
  return merged;
}
