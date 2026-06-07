import { NextRequest } from "next/server";
import { getHiddenGems } from "@/services/tmdb";
import { apiError, apiSuccess } from "@/lib/api-route";

export async function GET(request: NextRequest) {
  try {
    const page = Math.max(
      1,
      Number(request.nextUrl.searchParams.get("page") ?? "1")
    );
    const result = await getHiddenGems(page);

    return apiSuccess({
      data: result.movies,
      page: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
    });
  } catch (error) {
    return apiError(error, "Hidden gems API");
  }
}
