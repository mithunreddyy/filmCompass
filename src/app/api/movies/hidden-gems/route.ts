import { NextRequest } from "next/server";
import { getHiddenGems } from "@/services/tmdb";
import { toErrorResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const page = Math.max(
      1,
      Number(request.nextUrl.searchParams.get("page") ?? "1")
    );
    const result = await getHiddenGems(page);

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
