"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/section-header";
import { GENRES, LANGUAGES } from "@/types/movie";

export function HomeCatalogueMeta() {
  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
      >
        <SectionHeader title="Genres" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {GENRES.slice(0, 15).map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.slug}`}
              className="fc-chip justify-center py-2.5 font-semibold text-foreground sm:text-sm"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
      >
        <SectionHeader title="By Language" />
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.code}
              href={`/discover?language=${lang.code}`}
              className="fc-chip"
            >
              {lang.name}
            </Link>
          ))}
        </div>
      </motion.section>
    </>
  );
}
