import { NextRequest } from "next/server";
import { discoverMovies } from "@/services/tmdb";
import { discoverParamsSchema } from "@/schemas/movie";
import { apiError, apiSuccess } from "@/lib/api-route";
import { ValidationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = discoverParamsSchema.safeParse({
      genres: searchParams.get("genres") ?? undefined,
      yearFrom: searchParams.get("yearFrom") ?? undefined,
      yearTo: searchParams.get("yearTo") ?? undefined,
      ratingMin: searchParams.get("ratingMin") ?? "0",
      ratingMax: searchParams.get("ratingMax") ?? "10",
      language: searchParams.get("language") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? "popularity.desc",
      page: searchParams.get("page") ?? "1",
    });

    if (!parsed.success) {
      throw new ValidationError("Invalid parameters");
    }

    const result = await discoverMovies(parsed.data);

    return apiSuccess({
      data: result.movies,
      page: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
    });
  } catch (error) {
    return apiError(error, "Discover API");
  }
}
