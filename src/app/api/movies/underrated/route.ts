import { NextRequest } from "next/server";
import {
  getUnderratedMovies,
  getHiddenGemsByCategory,
} from "@/services/underrated";
import { underratedParamsSchema } from "@/schemas/recommendations";
import { apiError, apiSuccess } from "@/lib/api-route";
import { ValidationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = underratedParamsSchema.safeParse({
      page: searchParams.get("page") ?? "1",
      language: searchParams.get("language") ?? undefined,
      category: searchParams.get("category") ?? undefined,
    });

    if (!parsed.success) {
      throw new ValidationError("Invalid parameters");
    }

    const { page, language, category } = parsed.data;

    const result = category
      ? await getHiddenGemsByCategory(category, page)
      : await getUnderratedMovies(page, language);

    return apiSuccess({
      data: result.movies,
      page: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
    });
  } catch (error) {
    return apiError(error, "Underrated API");
  }
}
