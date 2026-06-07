import { NextRequest } from "next/server";
import { getAIRecommendations } from "@/services/recommendations";
import { recommendationInputSchema } from "@/schemas/recommendations";
import { toErrorResponse } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = recommendationInputSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid recommendation input" },
        { status: 400 }
      );
    }

    const recommendations = await getAIRecommendations(parsed.data);

    return Response.json({ success: true, data: recommendations });
  } catch (error) {
    return Response.json(toErrorResponse(error), { status: 500 });
  }
}
