import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "fc-glass flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[280px]",
        className
      )}
    >
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-violet/20 to-brand-mint/10 ring-1 ring-brand-violet/25">
        <div className="absolute inset-0 rounded-2xl fc-shimmer opacity-40" aria-hidden />
        <Icon className="relative h-8 w-8 text-brand-violet" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actions && actions.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={
                action.variant === "ghost" ? "fc-btn-ghost text-sm" : "fc-btn-primary text-sm"
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
