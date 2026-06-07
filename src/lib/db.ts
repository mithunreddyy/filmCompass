import { logger } from "@/lib/logger";

type PrismaClient = import("@prisma/client").PrismaClient;

let prisma: PrismaClient | null = null;

export function getDb(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;

  if (!prisma) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaClient } = require("@prisma/client") as {
        PrismaClient: new () => PrismaClient;
      };
      prisma = new PrismaClient();
    } catch (error) {
      logger.warn("Prisma client not available", {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  return prisma;
}
