import { NextRequest } from "next/server";
import { getAssistantResponse } from "@/services/recommendations";
import { assistantInputSchema } from "@/schemas/recommendations";
import { toErrorResponse } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = assistantInputSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid assistant input" },
        { status: 400 }
      );
    }

    const { message, movieId } = parsed.data;
    const result = await getAssistantResponse(message, { movieId });

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json(toErrorResponse(error), { status: 500 });
  }
}
