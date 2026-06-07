import type { Movie } from "@/types/movie";
import { discoverMovies } from "@/services/tmdb";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/redis-cache";

export interface UnderratedMovie extends Movie {
  underratedScore: number;
  category: UnderratedCategory;
}

export type UnderratedCategory =
  | "hidden-gem"
  | "forgotten-masterpiece"
  | "cult-classic"
  | "critically-acclaimed";

/**
 * Underrated Score = High Ratings + Award Recognition - Popularity Weight
 * Higher score = more underrated (great quality, low visibility)
 */
export function calculateUnderratedScore(params: {
  rating: number;
  voteCount: number;
  popularity: number;
  imdbRating?: number | null;
  metascore?: number | null;
  rottenTomatoes?: number | null;
  hasAwards?: boolean;
}): number {
  const {
    rating,
    voteCount,
    popularity,
    imdbRating,
    metascore,
    rottenTomatoes,
    hasAwards,
  } = params;

  const criticScore =
    ((imdbRating ?? rating) * 0.4 +
      ((metascore ?? 0) / 10) * 0.3 +
      ((rottenTomatoes ?? 0) / 10) * 0.3) *
    10;

  const qualityScore = Math.min(criticScore, 10) * 2;

  const awardBonus = hasAwards ? 3 : 0;

  const popularityPenalty = Math.log10(Math.max(popularity, 1)) * 1.5;

  const voteConfidence = Math.min(Math.log10(Math.max(voteCount, 1)), 3);

  const score =
    qualityScore + awardBonus + voteConfidence - popularityPenalty;

  return Math.round(score * 100) / 100;
}

function categorizeUnderrated(
  score: number,
  rating: number,
  popularity: number
): UnderratedCategory {
  if (rating >= 8 && popularity < 20) return "forgotten-masterpiece";
  if (rating >= 7.5 && popularity < 50) return "critically-acclaimed";
  if (rating >= 7 && popularity < 100) return "cult-classic";
  return "hidden-gem";
}

export async function getUnderratedMovies(
  page: number = 1,
  language?: string
): Promise<{
  movies: UnderratedMovie[];
  page: number;
  totalPages: number;
  totalResults: number;
}> {
  const cacheKey = `underrated:${page}:${language ?? "all"}`;
  const cached = await cacheGet<{
    movies: UnderratedMovie[];
    page: number;
    totalPages: number;
    totalResults: number;
  }>(cacheKey);
  if (cached) return cached;

  const discovered = await discoverMovies({
    ratingMin: 7,
    sortBy: "vote_average.desc",
    language,
    page,
  });

  const scored: UnderratedMovie[] = discovered.movies.map((movie) => {
    const underratedScore = calculateUnderratedScore({
      rating: movie.rating,
      voteCount: movie.voteCount,
      popularity: movie.popularity,
    });

    return {
      ...movie,
      underratedScore,
      category: categorizeUnderrated(
        underratedScore,
        movie.rating,
        movie.popularity
      ),
    };
  });

  scored.sort((a, b) => b.underratedScore - a.underratedScore);

  const result = {
    movies: scored,
    page: discovered.page,
    totalPages: discovered.totalPages,
    totalResults: discovered.totalResults,
  };

  await cacheSet(cacheKey, result, CACHE_TTL.DISCOVER);
  return result;
}

export async function getHiddenGemsByCategory(
  category: UnderratedCategory,
  page: number = 1
) {
  const all = await getUnderratedMovies(page);
  return {
    ...all,
    movies: all.movies.filter((m) => m.category === category),
  };
}
