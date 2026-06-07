import { z } from "zod";
import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/redis-cache";
import { getServerEnv } from "@/lib/env";
import { ExternalApiError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const OMDB_BASE_URL = "https://www.omdbapi.com/";

const omdbRatingSchema = z.object({
  Source: z.string(),
  Value: z.string(),
});

const omdbMovieSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  Rated: z.string().optional(),
  Released: z.string().optional(),
  Runtime: z.string().optional(),
  Genre: z.string().optional(),
  Director: z.string().optional(),
  Writer: z.string().optional(),
  Actors: z.string().optional(),
  Plot: z.string().optional(),
  Language: z.string().optional(),
  Country: z.string().optional(),
  Awards: z.string().optional(),
  Poster: z.string().optional(),
  Ratings: z.array(omdbRatingSchema).optional(),
  Metascore: z.string().optional(),
  imdbRating: z.string().optional(),
  imdbVotes: z.string().optional(),
  imdbID: z.string(),
  Type: z.string(),
  BoxOffice: z.string().optional(),
  Production: z.string().optional(),
  Website: z.string().optional(),
  Response: z.literal("True"),
});

const omdbErrorSchema = z.object({
  Response: z.literal("False"),
  Error: z.string(),
});

export type OMDbMovie = z.infer<typeof omdbMovieSchema>;

export interface OMDbEnrichment {
  imdbId: string;
  imdbRating: number | null;
  imdbVotes: number | null;
  metascore: number | null;
  rottenTomatoes: number | null;
  awards: string | null;
  boxOffice: string | null;
  director: string | null;
  actors: string[];
  plot: string | null;
}

function getApiKey(): string | null {
  return getServerEnv().OMDB_API_KEY ?? null;
}

function parseRating(value: string | undefined): number | null {
  if (!value || value === "N/A") return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

function parseVotes(value: string | undefined): number | null {
  if (!value || value === "N/A") return null;
  const num = parseInt(value.replace(/,/g, ""), 10);
  return isNaN(num) ? null : num;
}

function extractRottenTomatoes(
  ratings: Array<{ Source: string; Value: string }> | undefined
): number | null {
  const rt = ratings?.find((r) => r.Source === "Rotten Tomatoes");
  if (!rt) return null;
  const match = rt.Value.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : null;
}

export function transformOMDbEnrichment(data: OMDbMovie): OMDbEnrichment {
  return {
    imdbId: data.imdbID,
    imdbRating: parseRating(data.imdbRating),
    imdbVotes: parseVotes(data.imdbVotes),
    metascore: parseRating(data.Metascore),
    rottenTomatoes: extractRottenTomatoes(data.Ratings),
    awards: data.Awards && data.Awards !== "N/A" ? data.Awards : null,
    boxOffice: data.BoxOffice && data.BoxOffice !== "N/A" ? data.BoxOffice : null,
    director: data.Director && data.Director !== "N/A" ? data.Director : null,
    actors: data.Actors
      ? data.Actors.split(",").map((a) => a.trim()).filter(Boolean)
      : [],
    plot: data.Plot && data.Plot !== "N/A" ? data.Plot : null,
  };
}

export async function getOMDbByImdbId(imdbId: string): Promise<OMDbEnrichment | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    logger.debug("OMDB_API_KEY not set, skipping OMDb enrichment");
    return null;
  }

  const cacheKey = `omdb:${imdbId}`;
  const cached = await cacheGet<OMDbEnrichment>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    apikey: apiKey,
    i: imdbId,
    plot: "short",
  });

  const response = await fetch(`${OMDB_BASE_URL}?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new ExternalApiError("OMDb", `${response.status} ${response.statusText}`);
  }

  const raw: unknown = await response.json();

  const errorResult = omdbErrorSchema.safeParse(raw);
  if (errorResult.success) {
    logger.debug("OMDb lookup failed", { imdbId, error: errorResult.data.Error });
    return null;
  }

  const parsed = omdbMovieSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ExternalApiError("OMDb", "Invalid response format");
  }

  const enrichment = transformOMDbEnrichment(parsed.data);
  await cacheSet(cacheKey, enrichment, CACHE_TTL.MOVIE_DETAIL);
  return enrichment;
}

export async function searchOMDb(
  title: string,
  year?: number
): Promise<OMDbEnrichment | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const cacheKey = `omdb:search:${title}:${year ?? "any"}`;
  const cached = await cacheGet<OMDbEnrichment>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    apikey: apiKey,
    t: title,
    type: "movie",
  });
  if (year) params.set("y", String(year));

  const response = await fetch(`${OMDB_BASE_URL}?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new ExternalApiError("OMDb", `${response.status} ${response.statusText}`);
  }

  const raw: unknown = await response.json();
  const parsed = omdbMovieSchema.safeParse(raw);
  if (!parsed.success) return null;

  const enrichment = transformOMDbEnrichment(parsed.data);
  await cacheSet(cacheKey, enrichment, CACHE_TTL.SEARCH);
  return enrichment;
}
