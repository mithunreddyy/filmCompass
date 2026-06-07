import { NextRequest } from "next/server";
import {
  getAssistantResponse,
  getAssistantRecommendations,
  getRandomHiddenGemResponse,
} from "@/services/recommendations";
import { assistantInputSchema } from "@/schemas/recommendations";
import { apiError, apiSuccess } from "@/lib/api-route";
import { enforceRateLimit } from "@/lib/rate-limit";
import { ValidationError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    enforceRateLimit(request, "assistant", {
      limit: 20,
      windowSeconds: 60 * 15,
    });

    const body: unknown = await request.json();
    const parsed = assistantInputSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Invalid assistant input");
    }

    const { message, movieId, action } = parsed.data;

    if (action === "random-gem") {
      const result = await getRandomHiddenGemResponse();
      return apiSuccess({
        data: {
          reply: result.pitch,
          movies: [result.movie],
          provider: result.provider,
        },
      });
    }

    if (action === "recommend") {
      const result = await getAssistantRecommendations(message ?? undefined);
      return apiSuccess({ data: result });
    }

    if (!message?.trim()) {
      throw new ValidationError("Message is required for chat");
    }

    const result = await getAssistantResponse(message.trim(), { movieId });

    return apiSuccess({ data: result });
  } catch (error) {
    return apiError(error, "Assistant API");
  }
}
