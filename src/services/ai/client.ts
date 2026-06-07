import { getServerEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import OpenAI from "openai";

export type AIProvider = "ollama" | "groq" | "openai";

export interface AIClientConfig {
  client: OpenAI;
  provider: AIProvider;
  model: string;
}

function trimOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === "" ? undefined : trimmed;
}

function resolveProviderPreference(): "ollama" | "groq" | "openai" | "auto" {
  const raw = trimOptional(process.env.AI_PROVIDER)?.toLowerCase();
  if (raw === "ollama" || raw === "groq" || raw === "openai") return raw;
  return "auto";
}

export function resolveAIClient(): AIClientConfig | null {
  const env = getServerEnv();
  const preference = resolveProviderPreference();

  const tryOllama = (): AIClientConfig | null => {
    const baseURL =
      trimOptional(process.env.OLLAMA_BASE_URL) ?? "http://127.0.0.1:11434/v1";
    const model = trimOptional(process.env.OLLAMA_MODEL) ?? "llama3.2";
    const enabled =
      preference === "ollama" ||
      trimOptional(process.env.OLLAMA_ENABLED) === "true" ||
      (preference === "auto" &&
        Boolean(trimOptional(process.env.OLLAMA_BASE_URL)));

    if (!enabled) return null;

    return {
      client: new OpenAI({ baseURL, apiKey: "ollama" }),
      provider: "ollama",
      model,
    };
  };

  const tryGroq = (): AIClientConfig | null => {
    const apiKey = trimOptional(process.env.GROQ_API_KEY);
    if (!apiKey) return null;
    if (preference !== "auto" && preference !== "groq") return null;

    return {
      client: new OpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey,
      }),
      provider: "groq",
      model: trimOptional(process.env.GROQ_MODEL) ?? "llama-3.3-70b-versatile",
    };
  };

  const tryOpenAI = (): AIClientConfig | null => {
    if (!env.OPENAI_API_KEY) return null;
    if (preference !== "auto" && preference !== "openai") return null;

    return {
      client: new OpenAI({ apiKey: env.OPENAI_API_KEY }),
      provider: "openai",
      model: trimOptional(process.env.OPENAI_MODEL) ?? "gpt-4o-mini",
    };
  };

  const order: Array<() => AIClientConfig | null> =
    preference === "ollama"
      ? [tryOllama, tryGroq, tryOpenAI]
      : preference === "groq"
        ? [tryGroq, tryOllama, tryOpenAI]
        : preference === "openai"
          ? [tryOpenAI, tryGroq, tryOllama]
          : trimOptional(process.env.OLLAMA_ENABLED) === "true"
            ? [tryOllama, tryGroq, tryOpenAI]
            : [tryGroq, tryOllama, tryOpenAI];

  for (const attempt of order) {
    const config = attempt();
    if (config) return config;
  }

  return null;
}

export function getAIProviderLabel(): string | null {
  return resolveAIClient()?.provider ?? null;
}

/** Quick ping — Ollama must be running locally when AI routes are called */
export async function isOllamaReachable(): Promise<boolean> {
  const base =
    trimOptional(process.env.OLLAMA_BASE_URL)?.replace(/\/v1\/?$/, "") ??
    "http://127.0.0.1:11434";

  try {
    const res = await fetch(`${base}/api/tags`, {
      signal: AbortSignal.timeout(1500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function chatCompletion(params: {
  system: string;
  user: string;
  temperature?: number;
  jsonMode?: boolean;
  timeoutMs?: number;
}): Promise<string | null> {
  const config = resolveAIClient();
  if (!config) return null;

  const timeoutMs = params.timeoutMs ?? 12_000;

  try {
    const completion = await config.client.chat.completions.create(
      {
        model: config.model,
        messages: [
          { role: "system", content: params.system },
          { role: "user", content: params.user },
        ],
        temperature: params.temperature ?? 0.7,
        ...(params.jsonMode
          ? { response_format: { type: "json_object" as const } }
          : {}),
      },
      { signal: AbortSignal.timeout(timeoutMs) },
    );

    return completion.choices[0]?.message?.content?.trim() ?? null;
  } catch (error) {
    logger.error(`AI chat failed (${config.provider})`, error);
    return null;
  }
}
