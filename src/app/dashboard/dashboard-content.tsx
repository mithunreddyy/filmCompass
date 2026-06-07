"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Award, Bot, ArrowRight } from "lucide-react";
import { MovieSection } from "@/components/movies/movie-section";
import { RandomGemSpotlight } from "@/components/movies/random-gem-spotlight";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { buildDiscoverUrl } from "@/lib/discover-params";
import { TMDB_DEFAULT_ORIGINAL_LANG } from "@/lib/tmdb-config";
import type { Movie } from "@/types/movie";

interface DashboardContentProps {
  trending: Movie[];
  hiddenGems: Movie[];
  topRated: Movie[];
}

const QUICK_LINKS = [
  {
    href: "/gems",
    label: "Telugu Hidden Gems",
    icon: Sparkles,
    description: "Highly rated, low-profile Telugu films",
  },
  {
    href: buildDiscoverUrl({
      language: TMDB_DEFAULT_ORIGINAL_LANG,
      sortBy: "popularity.desc",
    }),
    label: "Telugu Trending",
    icon: TrendingUp,
    description: "Most popular Telugu films right now",
  },
  {
    href: buildDiscoverUrl({
      language: TMDB_DEFAULT_ORIGINAL_LANG,
      sortBy: "vote_average.desc",
      ratingMin: 7,
    }),
    label: "Underrated Engine",
    icon: Award,
    description: "Our custom underrated scoring",
  },
  {
    href: "/assistant",
    label: "AI Assistant",
    icon: Bot,
    description: "Ask for personalized picks",
  },
];

export function DashboardContent({
  trending,
  hiddenGems,
  topRated,
}: DashboardContentProps) {
  return (
    <PageShell className="space-y-6 sm:space-y-7">
      <PageHeader
        kicker="Overview"
        title="Your Dashboard"
        description="Telugu cinema first — discover hidden gems and find your next favorite film."
      />

      <RandomGemSpotlight compact />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link, i) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={link.href} className="group fc-card-interactive flex flex-col !p-4">
              <link.icon size={18} className="mb-2 text-brand-violet" />
              <span className="font-semibold text-foreground group-hover:text-brand-violet">
                {link.label}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                {link.description}
              </span>
              <ArrowRight
                size={14}
                className="mt-3 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-brand-violet"
              />
            </Link>
          </motion.div>
        ))}
      </section>

      <MovieSection
        movies={trending}
        title="Telugu Trending"
        subtitle="Most talked about Telugu films"
        href={buildDiscoverUrl({
          language: TMDB_DEFAULT_ORIGINAL_LANG,
          sortBy: "popularity.desc",
        })}
      />
      <MovieSection
        movies={hiddenGems}
        title="Telugu Hidden Gems"
        subtitle="Critically acclaimed but undiscovered"
        href="/gems"
        linkText="Explore"
      />
      <MovieSection
        movies={topRated}
        title="Top Rated Telugu"
        subtitle="Highest rated Telugu films"
        href={buildDiscoverUrl({
          language: TMDB_DEFAULT_ORIGINAL_LANG,
          sortBy: "vote_average.desc",
        })}
      />

      <div className="flex justify-center pt-2">
        <Link
          href={buildDiscoverUrl({ language: TMDB_DEFAULT_ORIGINAL_LANG })}
          className="fc-btn-ghost inline-flex gap-2 text-sm"
        >
          Browse full Telugu catalogue
          <ArrowRight size={14} />
        </Link>
      </div>
    </PageShell>
  );
}
