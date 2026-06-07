import OpenAI from "openai";
import { z } from "zod";
import { searchMovies, getMovieDetail } from "@/services/tmdb";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/redis-cache";
import { getServerEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
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

function getOpenAIClient(): OpenAI | null {
  try {
    const env = getServerEnv();
    if (!env.OPENAI_API_KEY) return null;
    return new OpenAI({ apiKey: env.OPENAI_API_KEY });
  } catch {
    return null;
  }
}

export async function getAIRecommendations(
  input: RecommendationInput
): Promise<AIRecommendation[]> {
  const parsed = recommendationInputSchema.parse(input);
  const cacheKey = `ai-rec:${JSON.stringify(parsed)}`;
  const cached = await cacheGet<AIRecommendation[]>(cacheKey);
  if (cached) return cached;

  const client = getOpenAIClient();

  if (!client) {
    return getFallbackRecommendations(parsed);
  }

  const prompt = buildRecommendationPrompt(parsed);

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a film curator expert. Recommend real, existing movies. Respond ONLY with valid JSON matching the schema: { recommendations: [{ title: string, reason: string }] }. Recommend 6 movies.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return getFallbackRecommendations(parsed);

    const raw: unknown = JSON.parse(content);
    const aiResult = aiResponseSchema.safeParse(raw);
    if (!aiResult.success) return getFallbackRecommendations(parsed);

    const recommendations = await resolveRecommendations(aiResult.data.recommendations);
    await cacheSet(cacheKey, recommendations, CACHE_TTL.DISCOVER);
    return recommendations;
  } catch (error) {
    logger.error("OpenAI recommendation failed", error);
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
  if (input.language) parts.push(`Language preference: ${input.language}`);

  parts.push(
    "Include diverse recommendations: similar storytelling, themes, cinematography, and hidden gems."
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
    "critically acclaimed";

  const search = await searchMovies(query, 1);
  const recommendations: AIRecommendation[] = [];

  for (const movie of search.movies.slice(0, 6)) {
    let reason = "Recommended based on your preferences";

    if (input.likedMovieTitles?.length) {
      reason = `Because you liked ${input.likedMovieTitles[0]}`;
    } else if (input.favoriteGenres?.length) {
      reason = `Top pick in ${input.favoriteGenres[0]}`;
    }

    recommendations.push({ title: movie.title, reason, movie });
  }

  return recommendations;
}

export async function getAssistantResponse(
  message: string,
  context?: { movieId?: number }
): Promise<{ reply: string; movies: Movie[] }> {
  const cacheKey = `assistant:${message}:${context?.movieId ?? "none"}`;
  const cached = await cacheGet<{ reply: string; movies: Movie[] }>(cacheKey);
  if (cached) return cached;

  let movieContext = "";
  if (context?.movieId) {
    try {
      const detail = await getMovieDetail(context.movieId);
      movieContext = `Current movie context: "${detail.title}" (${detail.year}), genres: ${detail.genres.map((g) => g.name).join(", ")}, overview: ${detail.overview.slice(0, 200)}`;
    } catch {
      // ignore
    }
  }

  const client = getOpenAIClient();

  if (!client) {
    const search = await searchMovies(message, 1);
    const result = {
      reply: `Here are some movies matching "${message}":`,
      movies: search.movies.slice(0, 6),
    };
    await cacheSet(cacheKey, result, CACHE_TTL.SEARCH);
    return result;
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are FilmCompass AI, a movie discovery assistant. Help users find films. ${movieContext} Be concise and enthusiastic. At the end, list up to 5 movie titles as JSON array in format MOVIES:["Title 1","Title 2"]`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    const moviesMatch = content.match(/MOVIES:\s*(\[[\s\S]*?\])/);
    let movieTitles: string[] = [];

    if (moviesMatch) {
      try {
        const parsed: unknown = JSON.parse(moviesMatch[1]);
        if (Array.isArray(parsed)) {
          movieTitles = parsed.filter((t): t is string => typeof t === "string");
        }
      } catch {
        // ignore parse errors
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

    const result = { reply, movies };
    await cacheSet(cacheKey, result, CACHE_TTL.SEARCH);
    return result;
  } catch (error) {
    logger.error("Assistant response failed", error);
    const search = await searchMovies(message, 1);
    return {
      reply: `I found these movies related to your query:`,
      movies: search.movies.slice(0, 5),
    };
  }
}
