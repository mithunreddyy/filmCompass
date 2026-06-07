import { NextRequest } from "next/server";
import { searchMovies } from "@/services/tmdb";
import { searchParamsSchema } from "@/schemas/movie";
import { apiError, apiSuccess } from "@/lib/api-route";
import { ValidationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = searchParamsSchema.safeParse({
      query: searchParams.get("query") ?? "",
      page: searchParams.get("page") ?? "1",
      year: searchParams.get("year") ?? undefined,
    });

    if (!parsed.success) {
      throw new ValidationError("Invalid search parameters");
    }

    const { query, page, year } = parsed.data;
    const result = await searchMovies(query, page, year);

    return apiSuccess({
      data: result.movies,
      page: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
    });
  } catch (error) {
    return apiError(error, "Search API");
  }
}
