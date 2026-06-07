import { NextRequest } from "next/server";
import { getOMDbByImdbId } from "@/services/omdb";
import { toErrorResponse } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ imdbId: string }> }
) {
  try {
    const { imdbId } = await params;

    if (!imdbId.startsWith("tt")) {
      return Response.json(
        { success: false, error: "Invalid IMDb ID format" },
        { status: 400 }
      );
    }

    const data = await getOMDbByImdbId(imdbId);

    if (!data) {
      return Response.json(
        { success: false, error: "Movie not found in OMDb" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(toErrorResponse(error), { status: 500 });
  }
}
