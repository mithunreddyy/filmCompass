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
    <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
        >
          {linkText}
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
        </Link>
      )}
    </div>
  );
}
