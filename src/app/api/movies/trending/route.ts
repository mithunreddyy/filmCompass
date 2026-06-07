import { NextRequest } from "next/server";
import { getTrending, getTeluguTrending } from "@/services/tmdb";
import { apiError, apiSuccess } from "@/lib/api-route";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const timeWindow =
      searchParams.get("timeWindow") === "day" ? "day" : "week";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const scope = searchParams.get("scope") === "global" ? "global" : "telugu";

    const result =
      scope === "global"
        ? await getTrending(timeWindow, page)
        : await getTeluguTrending(page);

    return apiSuccess({
      data: result.movies,
      page: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
      scope,
    });
  } catch (error) {
    return apiError(error, "Trending API");
  }
}
