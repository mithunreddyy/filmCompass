import { NextRequest } from "next/server";
import { getTrending } from "@/services/tmdb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const timeWindow =
      searchParams.get("timeWindow") === "day" ? "day" : "week";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

    const result = await getTrending(timeWindow, page);

    return Response.json({
      success: true,
      data: result.movies,
      page: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
    });
  } catch (error) {
    console.error("Trending error:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch trending",
      },
      { status: 500 }
    );
  }
}
