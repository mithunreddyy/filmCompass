"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Dices, Send, Sparkles, User, Wand2 } from "lucide-react";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";
import { PageHeader, PageShell } from "@/components/layout/page-shell";

interface Message {
  role: "user" | "assistant";
  content: string;
  movies?: Movie[];
  provider?: string | null;
}

type AssistantAction = "chat" | "random-gem" | "recommend";

const QUICK_ACTIONS: {
  label: string;
  action: AssistantAction;
  message?: string;
  icon: typeof Dices;
}[] = [
  {
    label: "Random Telugu gem",
    action: "random-gem",
    icon: Dices,
  },
  {
    label: "Recommend for tonight",
    action: "recommend",
    message: "something great to watch tonight",
    icon: Wand2,
  },
  {
    label: "Underrated Telugu thrillers",
    action: "chat",
    message: "Recommend underrated Telugu thriller films",
    icon: Sparkles,
  },
];

const SUGGESTIONS = [
  "Movies like Baahubali but smaller scale",
  "Telugu hidden gems from the 2010s",
  "Feel-good Telugu family films",
  "Dark psychological Telugu dramas",
];

export function AssistantContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm FilmCompass AI — powered by open-source models (Ollama/Groq) when configured. Ask for recommendations, hit **Random Telugu gem**, or tell me your mood.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isLoading]);

  const sendRequest = useCallback(
    async (payload: { message?: string; action?: AssistantAction }) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = (await res.json()) as {
          success: boolean;
          data?: { reply: string; movies: Movie[]; provider?: string | null };
          error?: string;
        };

        if (data.success && data.data) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.data!.reply,
              movies: data.data!.movies,
              provider: data.data!.provider,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.error ?? "Sorry, I couldn't process that request.",
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Something went wrong. Please try again." },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    await sendRequest({ message: trimmed, action: "chat" });
  }

  async function handleQuickAction(action: (typeof QUICK_ACTIONS)[number]) {
    if (isLoading) return;

    const userLabel =
      action.action === "random-gem"
        ? "Surprise me with a random Telugu hidden gem"
        : action.label;

    setMessages((prev) => [...prev, { role: "user", content: userLabel }]);
    await sendRequest({
      action: action.action,
      message: action.message,
    });
  }

  return (
    <PageShell className="flex min-h-[calc(100vh-7rem)] max-w-3xl flex-col !py-4">
      <PageHeader
        kicker="FilmCompass AI"
        title="Assistant"
        description="Open-source AI recommendations + live TMDb catalogue"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => handleQuickAction(action)}
            disabled={isLoading}
            className="fc-chip gap-1.5"
          >
            <action.icon size={13} className="shrink-0 text-brand-violet" />
            {action.label}
          </button>
        ))}
      </div>

      {messages.length <= 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="fc-chip gap-1.5 text-left text-xs"
            >
              <Sparkles size={11} className="shrink-0 text-brand-mint" />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div
        className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border/50 bg-surface/40 p-3 sm:p-4"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                msg.role === "user"
                  ? "bg-brand-violet/15 text-brand-violet"
                  : "bg-brand-mint/10 text-brand-mint"
              )}
              aria-hidden
            >
              {msg.role === "user" ? (
                <User size={16} strokeWidth={2} />
              ) : (
                <Bot size={16} strokeWidth={2} />
              )}
            </div>
            <div
              className={cn(
                "max-w-[82%] min-w-0",
                msg.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div className={msg.role === "user" ? "fc-chat-user" : "fc-chat-assistant"}>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content.replace(/\*\*/g, "")}
                </p>

                {msg.provider && msg.role === "assistant" && (
                  <p className="mt-2 text-[10px] capitalize text-muted-foreground">
                    via {msg.provider}
                  </p>
                )}

                {msg.movies && msg.movies.length > 0 && (
                  <div className="mt-3 grid gap-2">
                    {msg.movies.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface/80 p-2.5 transition-all hover:border-brand-violet/40 hover:shadow-sm"
                      >
                        {movie.posterUrl ? (
                          <Image
                            src={movie.posterUrl}
                            alt={movie.title}
                            width={36}
                            height={54}
                            className="rounded-md object-cover shadow-sm"
                          />
                        ) : (
                          <div className="h-[54px] w-9 rounded-md bg-muted/30" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground group-hover:text-brand-violet">
                            {movie.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {movie.year > 0 ? movie.year : "Unknown"} · ★{" "}
                            {movie.rating.toFixed(1)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint">
              <Bot size={16} />
            </div>
            <div className="fc-chat-assistant flex items-center gap-2">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-violet [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-violet [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-violet [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky z-10"
        style={{
          bottom:
            "calc(var(--dock-offset) + var(--dock-gap) + env(safe-area-inset-bottom, 0px) + 0.5rem)",
        }}
      >
        <div className="fc-glass flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about films, genres, or hidden gems…"
            className="min-h-10 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="fc-btn-primary !min-h-10 !min-w-10 !rounded-xl !p-0"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </PageShell>
  );
}
