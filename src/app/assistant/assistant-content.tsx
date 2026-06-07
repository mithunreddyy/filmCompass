"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, Loader2 } from "lucide-react";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  movies?: Movie[];
}

const SUGGESTIONS = [
  "Recommend mind-bending thrillers",
  "Movies like Interstellar",
  "Underrated Telugu films",
  "Dark psychological dramas after 2015",
  "Movies similar to Memories of Murder",
];

export function AssistantContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your FilmCompass AI assistant. Ask me for movie recommendations, hidden gems, or films similar to your favorites.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = (await res.json()) as {
        success: boolean;
        data?: { reply: string; movies: Movie[] };
        error?: string;
      };

      if (data.success && data.data) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.data!.reply,
            movies: data.data!.movies,
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
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pt-28 pb-16 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-3xl px-4 md:px-6 flex flex-col h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-amber-500/10 mb-4">
            <Bot size={24} className="text-amber-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            AI Movie Assistant
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask for recommendations powered by real movie data
          </p>
        </motion.div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="flex items-center gap-1.5 rounded-full border border-border/30 bg-card/30 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-amber-500/30 hover:text-amber-500"
              >
                <Sparkles size={10} />
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-amber-500 text-black font-medium"
                    : "border border-border/30 bg-card/50 text-foreground"
                )}
              >
                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>

                {msg.movies && msg.movies.length > 0 && (
                  <div className="mt-3 grid gap-2">
                    {msg.movies.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="flex items-center gap-3 rounded-xl bg-background/50 p-2 transition-colors hover:bg-background/80"
                      >
                        {movie.posterUrl ? (
                          <Image
                            src={movie.posterUrl}
                            alt={movie.title}
                            width={32}
                            height={48}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="h-12 w-8 rounded bg-muted/30" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate text-xs">
                            {movie.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {movie.year > 0 ? movie.year : "Unknown"} · ★{" "}
                            {movie.rating.toFixed(1)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-border/30 bg-card/50 px-4 py-3">
                <Loader2 size={16} className="animate-spin text-amber-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="sticky bottom-4">
          <div className="flex items-center gap-2 rounded-2xl border border-border/50 bg-card/80 px-4 py-3 backdrop-blur-xl shadow-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about movies..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-black transition-all hover:bg-amber-400 disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
