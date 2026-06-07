import { NextRequest } from "next/server";
import { getRandomHiddenGemResponse } from "@/services/recommendations";
import { getTeluguCatalogueStats } from "@/services/telugu-catalogue";
import { apiError, apiSuccess } from "@/lib/api-route";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    enforceRateLimit(request, "gems-random", {
      limit: 120,
      windowSeconds: 60 * 15,
    });

    const excludeParam = request.nextUrl.searchParams.get("exclude");
    const excludeIds =
      excludeParam
        ?.split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => Number.isFinite(id) && id > 0) ?? [];

    const [result, stats] = await Promise.all([
      getRandomHiddenGemResponse(excludeIds),
      getTeluguCatalogueStats().catch(() => null),
    ]);

    return apiSuccess({
      data: {
        ...result,
        catalogue: stats
          ? { total: stats.total, byDecade: stats.byDecade }
          : undefined,
      },
    });
  } catch (error) {
    return apiError(error, "Random gem API");
  }
}
