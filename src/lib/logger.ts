type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

function formatMessage(
  level: LogLevel,
  message: string,
  context?: LogContext
): string {
  const timestamp = new Date().toISOString();
  const ctx = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctx}`;
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatMessage("debug", message, context));
    }
  },

  info(message: string, context?: LogContext) {
    console.info(formatMessage("info", message, context));
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatMessage("warn", message, context));
  },

  error(message: string, error?: unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      ...(error instanceof Error
        ? { errorMessage: error.message, stack: error.stack }
        : { error }),
    };
    console.error(formatMessage("error", message, errorContext));
  },
};
