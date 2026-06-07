import { NextRequest } from "next/server";
import { discoverMovies } from "@/services/tmdb";
import { discoverParamsSchema } from "@/schemas/movie";

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
      return Response.json(
        { success: false, error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const result = await discoverMovies(parsed.data);

    return Response.json({
      success: true,
      data: result.movies,
      page: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
    });
  } catch (error) {
    console.error("Discover error:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to discover movies",
      },
      { status: 500 }
    );
  }
}
