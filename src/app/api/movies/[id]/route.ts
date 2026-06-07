import { NextRequest } from "next/server";
import { getMovieDetail } from "@/services/tmdb";
import { movieIdSchema } from "@/schemas/movie";
import { apiError, apiSuccess } from "@/lib/api-route";
import { NotFoundError, ValidationError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = movieIdSchema.safeParse({ id });

    if (!parsed.success) {
      throw new ValidationError("Invalid movie ID");
    }

    const movie = await getMovieDetail(parsed.data.id);
    return apiSuccess({ data: movie });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return apiError(error, "Movie detail API");
    }
    return apiError(error, "Movie detail API");
  }
}
