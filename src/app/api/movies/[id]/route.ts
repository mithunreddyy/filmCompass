import { NextRequest } from "next/server";
import { getMovieDetail } from "@/services/tmdb";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = Number(id);

    if (isNaN(movieId) || movieId <= 0) {
      return Response.json(
        { success: false, error: "Invalid movie ID" },
        { status: 400 }
      );
    }

    const movie = await getMovieDetail(movieId);

    return Response.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Movie detail error:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch movie",
      },
      { status: 500 }
    );
  }
}
