import { AppError, toErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";

export function apiSuccess<T extends Record<string, unknown>>(payload: T) {
  return Response.json({ success: true, ...payload });
}

export function apiError(error: unknown, context: string): Response {
  const status = error instanceof AppError ? error.status : 500;
  logger.error(context, error);
  return Response.json(toErrorResponse(error), { status });
}
