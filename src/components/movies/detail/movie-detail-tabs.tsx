"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type MovieDetailTab = "overview" | "cast" | "reviews" | "similar";

interface TabItem {
  id: MovieDetailTab;
  label: string;
  count?: number;
}

interface MovieDetailTabsProps {
  tabs: TabItem[];
  activeTab: MovieDetailTab;
  onChange: (tab: MovieDetailTab) => void;
}

export function MovieDetailTabs({
  tabs,
  activeTab,
  onChange,
}: MovieDetailTabsProps) {
  return (
    <div className="mt-6 border-b border-border/30 sm:mt-8">
      <div
        role="tablist"
        aria-label="Movie details"
        className="flex gap-1 overflow-x-auto no-scrollbar"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "text-brand-violet"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({tab.count})
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-violet"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
