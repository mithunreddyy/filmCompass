export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid request") {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class ExternalApiError extends AppError {
  constructor(service: string, message: string) {
    super(`${service}: ${message}`, 502, "EXTERNAL_API_ERROR");
    this.name = "ExternalApiError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export function toErrorResponse(error: unknown): {
  success: false;
  error: string;
  code?: string;
} {
  if (error instanceof AppError) {
    return { success: false, error: error.message, code: error.code };
  }
  return { success: false, error: getErrorMessage(error) };
}
