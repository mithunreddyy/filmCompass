import { z } from "zod";

export const searchParamsSchema = z.object({
  query: z.string().min(1).max(200),
  page: z.coerce.number().int().min(1).max(500).default(1),
  year: z.coerce.number().int().min(1900).max(2030).optional(),
});

export const movieIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const discoverParamsSchema = z.object({
  genres: z
    .string()
    .optional()
    .transform((v) =>
      v
        ? v
            .split(",")
            .map(Number)
            .filter((n) => !isNaN(n))
        : []
    ),
  yearFrom: z.coerce.number().int().min(1900).max(2030).optional(),
  yearTo: z.coerce.number().int().min(1900).max(2030).optional(),
  ratingMin: z.coerce.number().min(0).max(10).default(0),
  ratingMax: z.coerce.number().min(0).max(10).default(10),
  language: z
    .string()
    .optional()
    .transform((v) => (v === "all" || v === "" ? undefined : v ?? "te")),
  sortBy: z
    .enum([
      "popularity.desc",
      "popularity.asc",
      "vote_average.desc",
      "vote_average.asc",
      "primary_release_date.desc",
      "primary_release_date.asc",
      "revenue.desc",
      "original_title.asc",
    ])
    .default("popularity.desc"),
  page: z.coerce.number().int().min(1).max(500).default(1),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
export type DiscoverParams = z.infer<typeof discoverParamsSchema>;
