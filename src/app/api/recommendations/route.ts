import { NextRequest } from "next/server";
import { getAIRecommendations } from "@/services/recommendations";
import { recommendationInputSchema } from "@/schemas/recommendations";
import { apiError, apiSuccess } from "@/lib/api-route";
import { enforceRateLimit } from "@/lib/rate-limit";
import { ValidationError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    enforceRateLimit(request, "recommendations", {
      limit: 15,
      windowSeconds: 60 * 15,
    });

    const body: unknown = await request.json();
    const parsed = recommendationInputSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid recommendation input");
    }

    const recommendations = await getAIRecommendations(parsed.data);
    return apiSuccess({ data: recommendations });
  } catch (error) {
    return apiError(error, "Recommendations API");
  }
}
