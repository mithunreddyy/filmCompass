import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn("fc-page", className)}>{children}</div>;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  kicker?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, kicker, action }: PageHeaderProps) {
  return (
    <header className="mb-5 border-b border-border/50 pb-4 sm:mb-6 sm:pb-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {kicker && <p className="fc-kicker mb-1.5">{kicker}</p>}
          <h1 className="fc-page-title font-bold text-foreground">{title}</h1>
          {description && (
            <p className="fc-meta mt-2 max-w-2xl leading-relaxed">{description}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
