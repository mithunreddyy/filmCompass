"use client";

import { motion } from "framer-motion";
import type { Video } from "@/types/movie";

interface MovieTrailerModalProps {
  trailer: Video;
  onClose: () => void;
}

export function MovieTrailerModal({ trailer, onClose }: MovieTrailerModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Trailer: ${trailer.name}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
          title={trailer.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </motion.div>
    </div>
  );
}
