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
  variant?: "default" | "hero" | "compact";
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
  const listboxId = "search-suggestions";
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

  const isCompact = variant === "compact";

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={cn(
          "flex items-center gap-2 rounded fc-input transition-shadow",
          isCompact ? "rounded-full px-3 py-1.5" : variant === "hero" ? "px-4 py-3" : "px-3 py-2",
          isOpen && "ring-1 ring-brand-violet/40"
        )}
      >
        <Search
          className={cn("shrink-0 text-muted-foreground", isCompact ? "h-3.5 w-3.5" : "h-4 w-4")}
        />
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
          placeholder="Search films..."
          className={cn(
            "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none",
            isCompact ? "text-sm" : "text-sm sm:text-base"
          )}
          aria-label="Search films"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-autocomplete="list"
          role="combobox"
          autoComplete="off"
        />
        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery("");
              inputRef.current?.focus();
            }}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-border/80 bg-surface/95 shadow-xl backdrop-blur-xl"
          >
            {localQuery.length < 2 && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="mb-1 flex items-center justify-between px-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Recent
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-[11px] text-brand-violet"
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
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-surface-raised"
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            )}

            {isLoading && localQuery.length >= 2 && (
              <div className="p-4 text-center">
                <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-brand-violet" />
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div
                id={listboxId}
                role="listbox"
                aria-label="Search suggestions"
                className="max-h-72 overflow-y-auto p-1"
              >
                {results.slice(0, 8).map((movie, i) => (
                  <button
                    key={movie.id}
                    role="option"
                    aria-selected={selectedIndex === i}
                    onClick={() => {
                      addRecentSearch(movie.title);
                      setIsOpen(false);
                      router.push(`/movie/${movie.id}`);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left",
                      selectedIndex === i ? "bg-surface-raised" : "hover:bg-surface-raised"
                    )}
                  >
                    {movie.posterUrl ? (
                      <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        width={32}
                        height={48}
                        className="rounded-sm object-cover"
                      />
                    ) : (
                      <div className="h-12 w-8 rounded-sm bg-muted" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{movie.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {movie.year > 0 ? movie.year : "—"}
                        {movie.rating > 0 && ` · ${movie.rating.toFixed(1)}`}
                      </p>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => handleSubmit(localQuery)}
                  className="mt-1 flex w-full items-center justify-center gap-1 py-2 text-xs font-semibold text-brand-violet hover:bg-surface-raised"
                >
                  All results for &quot;{localQuery}&quot;
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            {!isLoading && localQuery.length >= 2 && results.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">No films found</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
