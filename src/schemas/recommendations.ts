import { z } from "zod";

export const recommendationInputSchema = z.object({
  favoriteGenres: z.array(z.string()).optional(),
  likedMovieTitles: z.array(z.string()).optional(),
  mood: z.string().optional(),
  language: z.string().optional(),
});

export const assistantInputSchema = z.object({
  message: z.string().min(1).max(1000),
  movieId: z.number().int().positive().optional(),
});

export const underratedParamsSchema = z.object({
  page: z.coerce.number().int().min(1).max(500).default(1),
  language: z.string().min(2).max(5).optional(),
  category: z
    .enum([
      "hidden-gem",
      "forgotten-masterpiece",
      "cult-classic",
      "critically-acclaimed",
    ])
    .optional(),
});
