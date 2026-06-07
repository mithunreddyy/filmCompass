import type { Movie } from "@/types/movie";
import { getGenreById } from "@/types/movie";
import { calculateUnderratedScore } from "@/services/underrated";
import { getMovieDetail } from "@/services/tmdb";
import { getOMDbByImdbId, searchOMDb } from "@/services/omdb";
import type { OMDbEnrichment } from "@/services/omdb";
import { TMDB_DEFAULT_ORIGINAL_LANG } from "@/lib/tmdb-config";

/** Genres that tend to have higher repeat / rewatch value */
const REPEAT_GENRE_WEIGHTS: Record<number, number> = {
  35: 0.95, // Comedy
  18: 0.9, // Drama
  10749: 0.85, // Romance
  53: 0.8, // Thriller
  14: 0.78, // Fantasy
  9648: 0.75, // Mystery
  878: 0.7, // Sci-Fi
  28: 0.62, // Action
  27: 0.55, // Horror
};

export interface GemSignals {
  favoriteIndex: number;
  repeatValue: number;
  cultScore: number;
  socialProof: number;
  accuracy: number;
  gemScore: number;
  underratedScore: number;
  highlights: string[];
}

export interface ScoredGem extends Movie, GemSignals {}

export interface EnrichedGemContext {
  movie: ScoredGem;
  genres: string[];
  tagline: string | null;
  reviewCount: number;
  omdb: OMDbEnrichment | null;
  pitchFacts: string[];
}

function minVotesForYear(year: number): number {
  if (year >= 2022) return 25;
  if (year >= 2015) return 18;
  if (year >= 2005) return 12;
  return 8;
}

/** Full catalogue gate — any Telugu film 1950–present on TMDb */
export function passesCatalogueGate(movie: Movie): boolean {
  if (movie.language !== TMDB_DEFAULT_ORIGINAL_LANG) return false;
  const year =
    movie.year > 0
      ? movie.year
      : movie.releaseDate
        ? new Date(movie.releaseDate).getFullYear()
        : 0;
  return year >= 1950 && year <= 2027;
}

/** Block obvious mega-hits; allow moderate buzz cult favorites */
export function passesHiddenGemGate(movie: Movie): boolean {
  if (movie.language !== TMDB_DEFAULT_ORIGINAL_LANG) return false;
  if (movie.rating < 6.8) return false;

  const minVotes = minVotesForYear(movie.year);
  if (movie.voteCount < minVotes) return false;

  // Mega-blockbusters are not "hidden" — but allow highly-rated cult hits up to ~130 pop
  if (movie.popularity > 130) return false;

  // Very low engagement = unreliable rating
  if (movie.rating >= 8 && movie.voteCount < 15) return false;

  return true;
}

function repeatGenreBoost(genreIds: number[]): number {
  if (genreIds.length === 0) return 0.65;
  const weights = genreIds
    .slice(0, 3)
    .map((id) => REPEAT_GENRE_WEIGHTS[id] ?? 0.68);
  return weights.reduce((a, b) => a + b, 0) / weights.length;
}

/**
 * People's favorite proxy: high rating × log(votes) with mainstream penalty.
 * TMDb votes ≈ aggregated audience consensus (similar to IMDb/social proof).
 */
export function calculateFavoriteIndex(movie: Movie): number {
  const voteSignal = Math.log10(Math.max(movie.voteCount, 1));
  const ratingSignal = movie.rating / 10;
  const mainstreamPenalty = Math.log10(Math.max(movie.popularity, 1)) * 0.35;
  const raw = ratingSignal * voteSignal * 10 - mainstreamPenalty;
  return Math.round(Math.max(0, raw) * 100) / 100;
}

/**
 * Repeat-value: genre rewatch appeal + stable high rating from engaged audience.
 */
export function calculateRepeatValue(movie: Movie): number {
  const genreBoost = repeatGenreBoost(movie.genreIds);
  const engagement = Math.min(movie.voteCount / 500, 1.5);
  const ratingStability = movie.rating >= 7.5 ? 1.1 : movie.rating >= 7 ? 1 : 0.85;
  const raw = genreBoost * ratingStability * (0.7 + engagement * 0.3) * 10;
  return Math.round(raw * 100) / 100;
}

/** Sweet-spot cult visibility: loved by fans, not trending everywhere */
export function calculateCultScore(movie: Movie): number {
  const pop = movie.popularity;
  let visibilityBonus = 0;

  if (pop >= 4 && pop <= 35) visibilityBonus = 3;
  else if (pop > 35 && pop <= 70) visibilityBonus = 2;
  else if (pop > 70 && pop <= 110) visibilityBonus = 0.5;
  else visibilityBonus = 1;

  const ratingBonus = movie.rating >= 8 ? 2.5 : movie.rating >= 7.5 ? 1.5 : 0.5;
  const voteSweetSpot =
    movie.voteCount >= 40 && movie.voteCount <= 8000 ? 1.5 : 0.8;

  return Math.round((visibilityBonus + ratingBonus + voteSweetSpot) * 100) / 100;
}

/** Rating confidence from vote volume relative to release era */
export function calculateAccuracy(movie: Movie): number {
  const minVotes = minVotesForYear(movie.year);
  const voteRatio = Math.min(movie.voteCount / (minVotes * 3), 1);
  const ratingCap = movie.voteCount < minVotes * 2 ? 0.7 : 1;
  return Math.round(voteRatio * ratingCap * 100) / 100;
}

export function scoreMovieAsGem(movie: Movie, social?: Partial<OMDbEnrichment>): ScoredGem {
  const underratedScore = calculateUnderratedScore({
    rating: movie.rating,
    voteCount: movie.voteCount,
    popularity: movie.popularity,
    imdbRating: social?.imdbRating,
    metascore: social?.metascore,
    rottenTomatoes: social?.rottenTomatoes,
    hasAwards: Boolean(social?.awards),
  });

  const favoriteIndex = calculateFavoriteIndex(movie);
  const repeatValue = calculateRepeatValue(movie);
  const cultScore = calculateCultScore(movie);
  const accuracy = calculateAccuracy(movie);

  let socialProof = 0;
  if (social?.imdbVotes && social.imdbVotes > 100) {
    socialProof += Math.min(Math.log10(social.imdbVotes), 4) * 0.8;
  }
  if (social?.imdbRating && social.imdbRating >= 7) {
    socialProof += (social.imdbRating - 6) * 0.5;
  }
  if (social?.rottenTomatoes && social.rottenTomatoes >= 70) {
    socialProof += 1;
  }
  socialProof = Math.round(socialProof * 100) / 100;

  const gemScore = Math.round(
    (favoriteIndex * 0.32 +
      repeatValue * 0.28 +
      cultScore * 0.18 +
      underratedScore * 0.14 +
      socialProof * 0.08) *
      accuracy *
      100
  ) / 100;

  const highlights: string[] = [];
  if (favoriteIndex >= 5) highlights.push("Audience favorite");
  if (repeatValue >= 7) highlights.push("High repeat value");
  if (cultScore >= 5) highlights.push("Cult following");
  if (socialProof >= 2) highlights.push("Cross-platform buzz");
  if (underratedScore >= 12) highlights.push("Underrated pick");

  return {
    ...movie,
    favoriteIndex,
    repeatValue,
    cultScore,
    socialProof,
    accuracy,
    gemScore,
    underratedScore,
    highlights,
  };
}

export function scoreGemPool(movies: Movie[]): ScoredGem[] {
  return movies
    .filter(passesHiddenGemGate)
    .map((m) => scoreMovieAsGem(m))
    .sort((a, b) => b.gemScore - a.gemScore);
}

/** Score every Telugu title in the 1950–present catalogue */
export function scoreCataloguePool(movies: Movie[]): ScoredGem[] {
  return movies
    .filter(passesCatalogueGate)
    .map((m) => scoreMovieAsGem(m))
    .sort((a, b) => b.gemScore - a.gemScore);
}

/** Weighted random — higher gemScore = more likely, but not deterministic */
export function pickWeightedGem(
  pool: ScoredGem[],
  excludeIds: number[] = [],
  options?: { wideSample?: boolean }
): ScoredGem | null {
  const candidates = pool.filter((m) => !excludeIds.includes(m.id));
  if (candidates.length === 0) return pool[0] ?? null;

  const ratio = options?.wideSample
    ? candidates.length > 400
      ? 0.92
      : 0.8
    : 0.7;
  const cutoff = Math.max(20, Math.ceil(candidates.length * ratio));
  const tier = candidates.slice(0, cutoff);

  const weights = tier.map((m) => Math.pow(m.gemScore + 0.5, 1.4));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;

  for (let i = 0; i < tier.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return tier[i];
  }

  return tier[tier.length - 1] ?? candidates[0];
}

export async function enrichGemContext(gem: ScoredGem): Promise<EnrichedGemContext> {
  let detail;
  try {
    detail = await getMovieDetail(gem.id);
  } catch {
    detail = null;
  }

  let omdb: OMDbEnrichment | null = null;
  if (detail?.imdbId) {
    omdb = await getOMDbByImdbId(detail.imdbId).catch(() => null);
  }
  if (!omdb && gem.title) {
    omdb = await searchOMDb(gem.title, gem.year > 0 ? gem.year : undefined).catch(
      () => null
    );
  }

  const genres =
    detail?.genres.map((g) => g.name) ??
    gem.genreIds
      .map((id) => getGenreById(id)?.name)
      .filter((n): n is string => Boolean(n));

  const pitchFacts: string[] = [
    `TMDb ★ ${gem.rating.toFixed(1)} from ${gem.voteCount.toLocaleString()} votes`,
    `Favorite index ${gem.favoriteIndex.toFixed(1)} · Repeat value ${gem.repeatValue.toFixed(1)}`,
  ];

  if (omdb?.imdbRating) {
    pitchFacts.push(`IMDb ★ ${omdb.imdbRating} (${omdb.imdbVotes?.toLocaleString() ?? "?"} votes)`);
  }
  if (omdb?.rottenTomatoes) {
    pitchFacts.push(`Rotten Tomatoes ${omdb.rottenTomatoes}%`);
  }
  if (detail?.reviews.length) {
    pitchFacts.push(`${detail.reviews.length} critic/user reviews on TMDb`);
  }
  if (gem.highlights.length) {
    pitchFacts.push(`Signals: ${gem.highlights.join(", ")}`);
  }

  return {
    movie: gem,
    genres,
    tagline: detail?.tagline ?? null,
    reviewCount: detail?.reviews.length ?? 0,
    omdb,
    pitchFacts,
  };
}
