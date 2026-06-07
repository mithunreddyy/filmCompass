import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "View all",
}: SectionHeaderProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <span className="fc-section-accent" aria-hidden />
        <h2 className="fc-section-title shrink-0 font-bold text-foreground">
          {title}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-border via-border/50 to-transparent" />
        {href && (
          <Link
            href={href}
            className="group flex shrink-0 items-center gap-0.5 text-xs font-semibold text-brand-violet"
          >
            {linkText}
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 pl-2.5 text-[11px] text-muted-foreground sm:text-xs">
          {subtitle}
        </p>
      )}
    </div>
  );
}
