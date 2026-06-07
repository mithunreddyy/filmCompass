import { z } from "zod";

const serverEnvSchema = z.object({
  TMDB_API_KEY: z.string().min(1, "TMDB_API_KEY is required"),
  TMDB_ACCESS_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OMDB_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

// Lazy validation — only validates when accessed
let _serverEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getServerEnv() {
  if (!_serverEnv) {
    _serverEnv = serverEnvSchema.parse({
      TMDB_API_KEY: process.env.TMDB_API_KEY,
      TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OMDB_API_KEY: process.env.OMDB_API_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      AUTH_SECRET: process.env.AUTH_SECRET,
    });
  }
  return _serverEnv;
}

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
