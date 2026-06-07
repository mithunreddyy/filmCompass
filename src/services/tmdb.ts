import { cache, CACHE_TTL } from "@/lib/cache";
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
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY environment variable is not set");
  }
  return key;
}

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const apiKey = getApiKey();
  const searchParams = new URLSearchParams();
  searchParams.set("api_key", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`;
  const cacheKey = `tmdb:${url}`;

  // Check cache first
  const cached = cache.get<T>(cacheKey);
  if (cached) return cached;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(
      `TMDb API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as T;

  // Cache the result
  const ttl = endpoint.includes("trending")
    ? CACHE_TTL.TRENDING
    : endpoint.includes("movie/")
      ? CACHE_TTL.MOVIE_DETAIL
      : CACHE_TTL.SEARCH;
  cache.set(cacheKey, data, ttl);

  return data;
}

// ============================================
// Data Transformers
// ============================================

export function transformMovie(movie: TMDbMovie): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
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
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
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
  ratingMin?: number;
  ratingMax?: number;
  language?: string;
  sortBy?: string;
  page?: number;
}) {
  const apiParams: Record<string, string | number | boolean | undefined> = {
    sort_by: params.sortBy ?? "popularity.desc",
    include_adult: false,
    page: params.page ?? 1,
    "vote_count.gte": 50,
  };

  if (params.genres?.length) {
    apiParams.with_genres = params.genres.join(",");
  }
  if (params.yearFrom) {
    apiParams["primary_release_date.gte"] = `${params.yearFrom}-01-01`;
  }
  if (params.yearTo) {
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
    { page }
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
    { page }
  );

  return {
    movies: data.results.map(transformMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getGenreList(): Promise<Genre[]> {
  const cached = cache.get<Genre[]>("tmdb:genres");
  if (cached) return cached;

  const data = await tmdbFetch<{ genres: TMDbGenre[] }>("/genre/movie/list");
  const genres: Genre[] = data.genres.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  cache.set("tmdb:genres", genres, CACHE_TTL.GENRES);
  return genres;
}

/**
 * Get "hidden gems" — high-rated movies with lower popularity
 */
export async function getHiddenGems(page: number = 1) {
  return discoverMovies({
    ratingMin: 7.5,
    sortBy: "vote_average.desc",
    page,
  });
}
