"use client";

import { RatingPill } from "@/components/movies/rating-pill";
import { cn } from "@/lib/utils";
import type { Movie } from "@/types/movie";
import { motion } from "framer-motion";
import { AlertCircle, Dices, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface RandomGemData {
  movie: Movie & {
    underratedScore?: number;
    gemScore?: number;
    favoriteIndex?: number;
    repeatValue?: number;
  };
  pitch: string;
  provider: string | null;
  highlights?: string[];
}

interface RandomGemSpotlightProps {
  className?: string;
  compact?: boolean;
}

export function RandomGemSpotlight({
  className,
  compact,
}: RandomGemSpotlightProps) {
  const [loading, setLoading] = useState(false);
  const [gem, setGem] = useState<RandomGemData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<number[]>([]);

  async function fetchRandomGem() {
    setLoading(true);
    setError(null);
    try {
      const params = seenIds.length
        ? `?exclude=${seenIds.slice(-12).join(",")}`
        : "";
      const res = await fetch(`/api/gems/random${params}`);
      const data = (await res.json()) as {
        success: boolean;
        data?: RandomGemData;
        error?: string;
      };

      if (!res.ok || !data.success || !data.data) {
        setError(data.error ?? `Could not fetch a gem (${res.status})`);
        return;
      }

      setGem(data.data);
      setSeenIds((prev) => [...prev, data.data!.movie.id]);
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={cn("mb-5 sm:mb-6", className)}>
      <div className="fc-glass overflow-hidden p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="fc-kicker mb-1.5">Smart picks</p>
            <h2 className="text-base font-semibold text-foreground sm:text-lg">
              Surprise me with a Telugu hidden gem
            </h2>
            <p className="fc-meta mt-1.5 max-w-xl">
              Picks from our full Telugu catalogue (1950–2026) — ranked by
              audience favorites, repeat-watch value, and cult signals — then
              pitched with local AI when available.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchRandomGem}
            disabled={loading}
            className="fc-btn-primary shrink-0 gap-2 self-start"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Dices size={16} />
            )}
            {gem ? "Another gem" : "Random gem"}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {gem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-border/60 bg-surface/60 p-3 sm:p-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/movie/${gem.movie.id}`}
                className={cn(
                  "group shrink-0",
                  compact
                    ? "mx-auto w-[100px] sm:mx-0"
                    : "mx-auto w-[110px] sm:mx-0",
                )}
              >
                <div className="fc-poster">
                  {gem.movie.posterUrl ? (
                    <Image
                      src={gem.movie.posterUrl}
                      alt={gem.movie.title}
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
                      {gem.movie.title}
                    </div>
                  )}
                  {gem.movie.rating > 0 && (
                    <div className="absolute bottom-1.5 left-1.5">
                      <RatingPill rating={gem.movie.rating} />
                    </div>
                  )}
                </div>
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/movie/${gem.movie.id}`}
                    className="text-lg font-semibold text-foreground transition-colors hover:text-brand-violet"
                  >
                    {gem.movie.title}
                  </Link>
                  {gem.movie.year > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {gem.movie.year}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(gem.highlights ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="fc-chip fc-chip-active gap-1 py-0.5 text-[10px]"
                    >
                      <Sparkles size={9} />
                      {tag}
                    </span>
                  ))}
                  {typeof gem.movie.gemScore === "number" && (
                    <span className="fc-chip py-0.5 text-[10px]">
                      Gem score {gem.movie.gemScore.toFixed(1)}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {gem.pitch.replace(/\*\*/g, "")}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/movie/${gem.movie.id}`}
                    className="fc-btn-primary text-sm"
                  >
                    View film
                  </Link>
                  {gem.provider && (
                    <span className="fc-chip pointer-events-none text-[10px] capitalize">
                      via {gem.provider}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
