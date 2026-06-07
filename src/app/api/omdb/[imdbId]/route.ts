import { NextRequest } from "next/server";
import { getOMDbByImdbId } from "@/services/omdb";
import { apiError, apiSuccess } from "@/lib/api-route";
import { NotFoundError, ValidationError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ imdbId: string }> }
) {
  try {
    const { imdbId } = await params;

    if (!imdbId.startsWith("tt")) {
      throw new ValidationError("Invalid IMDb ID format");
    }

    const data = await getOMDbByImdbId(imdbId);

    if (!data) {
      throw new NotFoundError("Movie not found in OMDb");
    }

    return apiSuccess({ data });
  } catch (error) {
    return apiError(error, "OMDb API");
  }
}
