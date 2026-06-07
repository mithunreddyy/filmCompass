"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useMovieSearch } from "@/hooks/use-movie-search";
import { useSearchStore } from "@/store/search-store";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  variant?: "default" | "hero";
}

export function SearchBar({ variant = "default" }: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [localQuery, setLocalQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { recentSearches, addRecentSearch, clearRecentSearches } =
    useSearchStore();
  const { data, isLoading } = useMovieSearch(localQuery);

  const results = data?.data ?? [];
  const showDropdown =
    isOpen && (localQuery.length >= 2 || recentSearches.length > 0);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !isOpen) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleSubmit(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/movie/${results[selectedIndex].id}`);
        setIsOpen(false);
      } else {
        handleSubmit(localQuery);
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", variant === "hero" ? "max-w-lg" : "max-w-xl")}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl transition-all duration-300 liquid-glass-subtle",
          variant === "hero" ? "px-5 py-3.5" : "rounded-full px-4 py-2.5",
          isOpen && "ring-1 ring-ring/30"
        )}
      >
        <Search size={variant === "hero" ? 18 : 16} className="text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search films, actors, directors..."
          className={cn(
            "flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none",
            variant === "hero" ? "text-base" : "text-sm"
          )}
          aria-label="Search movies"
          autoComplete="off"
        />
        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery("");
              inputRef.current?.focus();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center rounded-md border border-border/40 bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          /
        </kbd>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl liquid-glass shadow-2xl"
          >
            {localQuery.length < 2 && recentSearches.length > 0 && (
              <div className="p-3">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock size={12} />
                    Recent
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.slice(0, 5).map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setLocalQuery(search);
                      handleSubmit(search);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    <Clock size={12} className="text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            )}

            {isLoading && localQuery.length >= 2 && (
              <div className="p-6 text-center">
                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/70" />
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto p-2">
                {results.slice(0, 8).map((movie, i) => (
                  <button
                    key={movie.id}
                    onClick={() => {
                      addRecentSearch(movie.title);
                      setIsOpen(false);
                      router.push(`/movie/${movie.id}`);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors",
                      selectedIndex === i
                        ? "bg-foreground/8 text-foreground"
                        : "hover:bg-foreground/5"
                    )}
                  >
                    {movie.posterUrl ? (
                      <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        width={36}
                        height={54}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-[54px] w-[36px] rounded-md bg-muted/30" />
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {movie.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {movie.year > 0 ? movie.year : "Unknown"} ·{" "}
                        {movie.rating > 0
                          ? `★ ${movie.rating.toFixed(1)}`
                          : "Unrated"}
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                  </button>
                ))}

                <button
                  onClick={() => handleSubmit(localQuery)}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  View all results for &quot;{localQuery}&quot;
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {!isLoading && localQuery.length >= 2 && results.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No movies found for &quot;{localQuery}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
