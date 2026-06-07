import { NextRequest } from "next/server";
import {
  getUnderratedMovies,
  getHiddenGemsByCategory,
} from "@/services/underrated";
import { underratedParamsSchema } from "@/schemas/recommendations";
import { toErrorResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = underratedParamsSchema.safeParse({
      page: searchParams.get("page") ?? "1",
      language: searchParams.get("language") ?? undefined,
      category: searchParams.get("category") ?? undefined,
    });

    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const { page, language, category } = parsed.data;

    const result = category
      ? await getHiddenGemsByCategory(category, page)
      : await getUnderratedMovies(page, language);

    return Response.json({
      success: true,
      data: result.movies,
      page: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
    });
  } catch (error) {
    return Response.json(toErrorResponse(error), { status: 500 });
  }
}
