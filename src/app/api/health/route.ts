import { getServerEnv } from "@/lib/env";
import { getAIProviderLabel, isOllamaReachable, resolveAIClient } from "@/services/ai/client";

export async function GET() {
  const env = getServerEnv();
  const aiConfig = resolveAIClient();
  const ollamaEnabled =
    process.env.AI_PROVIDER === "ollama" ||
    process.env.OLLAMA_ENABLED === "true";

  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      tmdb: Boolean(env.TMDB_API_KEY),
      openai: Boolean(env.OPENAI_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY?.trim()),
      ollama: ollamaEnabled ? await isOllamaReachable() : null,
      omdb: Boolean(env.OMDB_API_KEY),
      redis: Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
    },
    ai: {
      provider: getAIProviderLabel(),
      configured: Boolean(aiConfig),
      note: ollamaEnabled
        ? "Ollama runs on demand — start the Ollama app or `ollama serve` before using AI features"
        : undefined,
    },
  });
}
