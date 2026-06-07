"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Film, Calendar, ArrowRight } from "lucide-react";

interface Language {
  code: string;
  name: string;
}

interface ExplorePageContentProps {
  languages: readonly Language[];
}

const REGIONS = [
  {
    name: "South Indian Cinema",
    languages: ["te", "ta", "ml", "kn"],
    description: "Telugu, Tamil, Malayalam & Kannada films",
  },
  {
    name: "East Asian Cinema",
    languages: ["ko", "ja", "zh"],
    description: "Korean, Japanese & Chinese masterpieces",
  },
  {
    name: "European Cinema",
    languages: ["fr", "de", "it", "es", "pt"],
    description: "French, German, Italian & more",
  },
];

const DECADES = [
  { label: "2020s", from: 2020, to: 2029 },
  { label: "2010s", from: 2010, to: 2019 },
  { label: "2000s", from: 2000, to: 2009 },
  { label: "1990s", from: 1990, to: 1999 },
  { label: "1980s", from: 1980, to: 1989 },
  { label: "Classic Era", from: 1950, to: 1979 },
];

export function ExplorePageContent({ languages }: ExplorePageContentProps) {
  return (
    <div className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Global Movie Explorer
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Browse cinema by language, region, and decade. Discover films from
            Telugu thrillers to Korean hidden gems.
          </p>
        </motion.div>

        {/* Regions */}
        <section className="mb-16">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Globe size={20} className="text-amber-500" />
            Browse by Region
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {REGIONS.map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border/30 bg-card/30 p-6 backdrop-blur-sm"
              >
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {region.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {region.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {region.languages.map((code) => {
                    const lang = languages.find((l) => l.code === code);
                    if (!lang) return null;
                    return (
                      <Link
                        key={code}
                        href={`/discover?language=${code}&sortBy=vote_average.desc`}
                        className="rounded-full border border-border/30 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-amber-500/30 hover:text-amber-500"
                      >
                        {lang.name}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* All Languages */}
        <section className="mb-16">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Film size={20} className="text-amber-500" />
            Browse by Language
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={`/discover?language=${lang.code}`}
                className="group flex items-center justify-between rounded-xl border border-border/30 bg-card/30 p-4 transition-all hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-amber-500">
                  {lang.name}
                </span>
                <ArrowRight
                  size={14}
                  className="text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-amber-500"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Decades */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-amber-500" />
            Browse by Decade
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {DECADES.map((decade) => (
              <Link
                key={decade.label}
                href={`/discover?yearFrom=${decade.from}&yearTo=${decade.to}&sortBy=vote_average.desc`}
                className="group rounded-xl border border-border/30 bg-card/30 p-5 text-center transition-all hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                <span className="font-heading text-lg font-semibold text-foreground group-hover:text-amber-500">
                  {decade.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
