import { z } from "zod";
import { searchMovies, getMovieDetail } from "@/services/tmdb";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/redis-cache";
import { logger } from "@/lib/logger";
import { chatCompletion, getAIProviderLabel } from "@/services/ai/client";
import { enrichGemContext } from "@/services/gem-engine";
import {
  pickRandomTeluguHiddenGem,
  type ScoredTeluguGem,
} from "@/services/telugu-gems";
import type { Movie } from "@/types/movie";

const recommendationInputSchema = z.object({
  favoriteGenres: z.array(z.string()).optional(),
  likedMovieTitles: z.array(z.string()).optional(),
  mood: z.string().optional(),
  language: z.string().optional(),
});

export type RecommendationInput = z.infer<typeof recommendationInputSchema>;

export interface AIRecommendation {
  title: string;
  reason: string;
  movie: Movie | null;
}

const aiResponseSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
    })
  ),
});

export async function getAIRecommendations(
  input: RecommendationInput
): Promise<AIRecommendation[]> {
  const parsed = recommendationInputSchema.parse(input);
  const cacheKey = `ai-rec:${JSON.stringify(parsed)}`;
  const cached = await cacheGet<AIRecommendation[]>(cacheKey);
  if (cached) return cached;

  const prompt = buildRecommendationPrompt(parsed);
  const content = await chatCompletion({
    system:
      "You are a film curator expert specializing in Telugu and world cinema. Recommend real, existing movies. Respond ONLY with valid JSON: { recommendations: [{ title: string, reason: string }] }. Recommend 6 diverse films including hidden gems.",
    user: prompt,
    jsonMode: true,
    temperature: 0.7,
  });

  if (!content) {
    return getFallbackRecommendations(parsed);
  }

  try {
    const raw: unknown = JSON.parse(content);
    const aiResult = aiResponseSchema.safeParse(raw);
    if (!aiResult.success) return getFallbackRecommendations(parsed);

    const recommendations = await resolveRecommendations(aiResult.data.recommendations);
    await cacheSet(cacheKey, recommendations, CACHE_TTL.DISCOVER);
    return recommendations;
  } catch (error) {
    logger.error("AI recommendation parse failed", error);
    return getFallbackRecommendations(parsed);
  }
}

function buildRecommendationPrompt(input: RecommendationInput): string {
  const parts: string[] = ["Recommend movies based on:"];

  if (input.likedMovieTitles?.length) {
    parts.push(`Liked movies: ${input.likedMovieTitles.join(", ")}`);
  }
  if (input.favoriteGenres?.length) {
    parts.push(`Favorite genres: ${input.favoriteGenres.join(", ")}`);
  }
  if (input.mood) parts.push(`Mood/preference: ${input.mood}`);
  if (input.language) {
    parts.push(`Language preference: ${input.language}`);
  } else {
    parts.push("Prefer Telugu cinema when relevant, but include world cinema too.");
  }

  parts.push(
    "Include diverse picks: similar storytelling, themes, cinematography, and lesser-known hidden gems."
  );

  return parts.join("\n");
}

async function resolveRecommendations(
  items: Array<{ title: string; reason: string }>
): Promise<AIRecommendation[]> {
  return Promise.all(
    items.map(async (item) => {
      try {
        const search = await searchMovies(item.title, 1);
        const movie = search.movies[0] ?? null;
        return { title: item.title, reason: item.reason, movie };
      } catch {
        return { title: item.title, reason: item.reason, movie: null };
      }
    })
  );
}

async function getFallbackRecommendations(
  input: RecommendationInput
): Promise<AIRecommendation[]> {
  const query =
    input.likedMovieTitles?.[0] ??
    input.favoriteGenres?.[0] ??
    input.mood ??
    "Telugu critically acclaimed";

  const search = await searchMovies(query, 1);
  const recommendations: AIRecommendation[] = [];

  for (const movie of search.movies.slice(0, 6)) {
    let reason = "Recommended based on your preferences";

    if (input.likedMovieTitles?.length) {
      reason = `Because you liked ${input.likedMovieTitles[0]}`;
    } else if (input.favoriteGenres?.length) {
      reason = `Top pick in ${input.favoriteGenres[0]}`;
    } else if (input.mood) {
      reason = `Matches your mood: ${input.mood}`;
    }

    recommendations.push({ title: movie.title, reason, movie });
  }

  return recommendations;
}

function fallbackGemPitch(gem: ScoredTeluguGem, facts: string[]): string {
  const year = gem.year > 0 ? `${gem.year}` : "";
  const title = year ? `${gem.title} (${year})` : gem.title;
  const highlight =
    gem.highlights.length > 0 ? gem.highlights.slice(0, 2).join(" · ") : "Hidden gem";

  const lines = [
    `${title} — ${highlight}.`,
    facts.slice(0, 3).join(" "),
    `Scores high on favorite index (${gem.favoriteIndex.toFixed(1)}) and repeat value (${gem.repeatValue.toFixed(1)}) — a Telugu pick audiences keep coming back to.`,
  ];

  return lines.join(" ");
}

export async function generateGemPitch(gem: ScoredTeluguGem): Promise<string> {
  const cacheKey = `gem-pitch:v2:${gem.id}`;
  const cached = await cacheGet<string>(cacheKey);
  if (cached) return cached;

  const context = await enrichGemContext(gem);
  const { movie, genres, tagline, pitchFacts, omdb } = context;

  const content = await chatCompletion({
    system:
      "You are FilmCompass, a Telugu cinema curator. Write an accurate 2-3 sentence pitch using ONLY the provided facts — do not invent cast, plot twists, or awards. Focus on why audiences love it and its repeat-watch appeal. Respond ONLY with JSON: { pitch: string }",
    user: [
      `Film: "${movie.title}" (${movie.year})`,
      `Genres: ${genres.join(", ") || "Telugu cinema"}`,
      tagline ? `Tagline: ${tagline}` : "",
      `Overview: ${movie.overview?.slice(0, 300) ?? "N/A"}`,
      ...pitchFacts,
      omdb?.awards ? `Awards: ${omdb.awards}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    jsonMode: true,
    temperature: 0.65,
    timeoutMs: 10_000,
  });

  let pitch = fallbackGemPitch(movie, pitchFacts);

  if (content) {
    try {
      const parsed = z.object({ pitch: z.string() }).safeParse(JSON.parse(content));
      if (parsed.success && parsed.data.pitch.length > 20) {
        pitch = parsed.data.pitch;
      }
    } catch {
      // use fallback
    }
  }

  await cacheSet(cacheKey, pitch, CACHE_TTL.MOVIE_DETAIL);
  return pitch;
}

export async function getRandomHiddenGemResponse(excludeIds: number[] = []): Promise<{
  movie: ScoredTeluguGem;
  pitch: string;
  provider: string | null;
  highlights: string[];
}> {
  const movie = await pickRandomTeluguHiddenGem(excludeIds);
  if (!movie) {
    throw new Error("No hidden gems available in the catalogue right now");
  }

  const pitch = await generateGemPitch(movie);
  return {
    movie,
    pitch,
    provider: getAIProviderLabel(),
    highlights: movie.highlights,
  };
}

export async function getAssistantResponse(
  message: string,
  context?: { movieId?: number }
): Promise<{ reply: string; movies: Movie[]; provider?: string | null }> {
  const normalized = message.trim().toLowerCase();

  if (isRandomGemIntent(normalized)) {
    const result = await getRandomHiddenGemResponse();
    return {
      reply: result.pitch,
      movies: [result.movie],
      provider: result.provider,
    };
  }

  const cacheKey = `assistant:${message}:${context?.movieId ?? "none"}`;
  const cached = await cacheGet<{ reply: string; movies: Movie[] }>(cacheKey);
  if (cached) return { ...cached, provider: getAIProviderLabel() };

  let movieContext = "";
  if (context?.movieId) {
    try {
      const detail = await getMovieDetail(context.movieId);
      movieContext = `Current movie: "${detail.title}" (${detail.year}), genres: ${detail.genres.map((g) => g.name).join(", ")}, overview: ${detail.overview.slice(0, 200)}`;
    } catch {
      // ignore
    }
  }

  const content = await chatCompletion({
    system: `You are FilmCompass AI, a movie discovery assistant focused on Telugu cinema and world films. ${movieContext} Be concise and enthusiastic. At the end, list up to 5 movie titles as JSON in format MOVIES:["Title 1","Title 2"]`,
    user: message,
    temperature: 0.8,
  });

  if (!content) {
    return getAssistantFallback(message, cacheKey);
  }

  const moviesMatch = content.match(/MOVIES:\s*(\[[\s\S]*?\])/);
  let movieTitles: string[] = [];

  if (moviesMatch) {
    try {
      const parsed: unknown = JSON.parse(moviesMatch[1]);
      if (Array.isArray(parsed)) {
        movieTitles = parsed.filter((t): t is string => typeof t === "string");
      }
    } catch {
      // ignore
    }
  }

  const reply = content.replace(/MOVIES:\s*\[[\s\S]*?\]/, "").trim();
  const movies: Movie[] = [];

  for (const title of movieTitles.slice(0, 5)) {
    const search = await searchMovies(title, 1);
    if (search.movies[0]) movies.push(search.movies[0]);
  }

  if (movies.length === 0) {
    const search = await searchMovies(message, 1);
    movies.push(...search.movies.slice(0, 5));
  }

  const result = {
    reply: reply || `Here are films related to "${message}":`,
    movies,
  };
  await cacheSet(cacheKey, result, CACHE_TTL.SEARCH);
  return { ...result, provider: getAIProviderLabel() };
}

function isRandomGemIntent(message: string): boolean {
  const patterns = [
    /random\s+(telugu\s+)?(hidden\s+)?gem/,
    /surprise\s+me/,
    /pick\s+a\s+(hidden\s+)?gem/,
    /hidden\s+gem\s+(today|tonight|now)/,
    /one\s+random\s+(telugu\s+)?film/,
  ];
  return patterns.some((p) => p.test(message));
}

async function getAssistantFallback(
  message: string,
  cacheKey: string
): Promise<{ reply: string; movies: Movie[]; provider: null }> {
  const teluguGemTerms = /telugu|hidden gem|underrated|gem/;
  if (teluguGemTerms.test(message.toLowerCase())) {
    try {
      const gem = await getRandomHiddenGemResponse();
      return {
        reply: `Here's a Telugu hidden gem for you:\n\n${gem.pitch}`,
        movies: [gem.movie],
        provider: null,
      };
    } catch {
      // fall through
    }
  }

  const search = await searchMovies(message, 1);
  const result = {
    reply: `Here are some films matching "${message}":`,
    movies: search.movies.slice(0, 6),
  };
  await cacheSet(cacheKey, result, CACHE_TTL.SEARCH);
  return { ...result, provider: null };
}

export async function getAssistantRecommendations(
  mood?: string
): Promise<{ reply: string; movies: Movie[]; provider: string | null }> {
  const recommendations = await getAIRecommendations({
    mood: mood ?? "something great to watch tonight",
    language: "Telugu",
  });

  const withMovies = recommendations.filter((r) => r.movie);
  const movies = withMovies.map((r) => r.movie!);

  const lines = withMovies
    .slice(0, 5)
    .map((r) => `• **${r.movie!.title}** — ${r.reason}`);

  const reply =
    lines.length > 0
      ? `Tonight's picks for you:\n\n${lines.join("\n")}`
      : "I couldn't find strong matches right now — try asking for a genre or mood.";

  return { reply, movies, provider: getAIProviderLabel() };
}
