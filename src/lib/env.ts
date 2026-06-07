import { z } from "zod";

function trimOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === "" ? undefined : trimmed;
}

const serverEnvSchema = z.object({
  TMDB_API_KEY: z.string().min(1, "TMDB_API_KEY is required"),
  TMDB_ACCESS_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OMDB_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  TMDB_DEFAULT_LANGUAGE: z.string().optional(),
  TMDB_DEFAULT_REGION: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

let _serverEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getServerEnv() {
  if (!_serverEnv) {
    _serverEnv = serverEnvSchema.parse({
      TMDB_API_KEY: trimOptional(process.env.TMDB_API_KEY),
      TMDB_ACCESS_TOKEN: trimOptional(process.env.TMDB_ACCESS_TOKEN),
      OPENAI_API_KEY: trimOptional(process.env.OPENAI_API_KEY),
      OMDB_API_KEY: trimOptional(process.env.OMDB_API_KEY),
      DATABASE_URL: trimOptional(process.env.DATABASE_URL),
      UPSTASH_REDIS_REST_URL: trimOptional(process.env.UPSTASH_REDIS_REST_URL),
      UPSTASH_REDIS_REST_TOKEN: trimOptional(process.env.UPSTASH_REDIS_REST_TOKEN),
      AUTH_SECRET: trimOptional(process.env.AUTH_SECRET),
      TMDB_DEFAULT_LANGUAGE: trimOptional(process.env.TMDB_DEFAULT_LANGUAGE),
      TMDB_DEFAULT_REGION: trimOptional(process.env.TMDB_DEFAULT_REGION),
    });
  }
  return _serverEnv;
}

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: trimOptional(process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: trimOptional(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  NEXT_PUBLIC_APP_URL: trimOptional(process.env.NEXT_PUBLIC_APP_URL) ?? "http://localhost:3000",
});
