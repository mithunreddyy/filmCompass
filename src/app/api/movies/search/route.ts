import { NextRequest } from "next/server";
import { searchMovies } from "@/services/tmdb";
import { searchParamsSchema } from "@/schemas/movie";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = searchParamsSchema.safeParse({
      query: searchParams.get("query") ?? "",
      page: searchParams.get("page") ?? "1",
      year: searchParams.get("year") ?? undefined,
    });

    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid search parameters" },
        { status: 400 }
      );
    }

    const { query, page, year } = parsed.data;
    const result = await searchMovies(query, page, year);

    return Response.json({
      success: true,
      data: result.movies,
      page: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
    });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Search failed",
      },
      { status: 500 }
    );
  }
}
