"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Calendar, ArrowRight } from "lucide-react";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { SectionHeader } from "@/components/shared/section-header";

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
    <PageShell className="space-y-6 sm:space-y-7">
      <PageHeader
        kicker="Browse"
        title="Global Explorer"
        description="Browse cinema by language, region, and decade — from Telugu thrillers to Korean hidden gems."
      />

      <section>
        <SectionHeader title="Browse by Region" />
        <div className="grid gap-4 md:grid-cols-3">
          {REGIONS.map((region, i) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="fc-card-interactive"
            >
              <div className="mb-3 flex items-center gap-2">
                <Globe size={16} className="text-brand-violet" />
                <h3 className="text-base font-semibold text-foreground">
                  {region.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">{region.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {region.languages.map((code) => {
                  const lang = languages.find((l) => l.code === code);
                  if (!lang) return null;
                  return (
                    <Link
                      key={code}
                      href={`/discover?language=${code}&sortBy=vote_average.desc`}
                      className="fc-chip hover:text-brand-violet"
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

      <section>
        <SectionHeader title="Browse by Language" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={`/discover?language=${lang.code}`}
              className="group fc-card-interactive flex items-center justify-between !p-3"
            >
              <span className="text-sm font-medium text-foreground group-hover:text-brand-violet">
                {lang.name}
              </span>
              <ArrowRight
                size={14}
                className="text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-brand-violet"
              />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Browse by Decade" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {DECADES.map((decade) => (
            <Link
              key={decade.label}
                href={`/discover?language=te&yearFrom=${decade.from}&yearTo=${decade.to}&sortBy=vote_average.desc`}
              className="group fc-card-interactive text-center !p-4"
            >
              <Calendar
                size={14}
                className="mx-auto mb-2 text-brand-violet/60 group-hover:text-brand-violet"
              />
              <span className="text-sm font-semibold text-foreground group-hover:text-brand-violet">
                {decade.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
