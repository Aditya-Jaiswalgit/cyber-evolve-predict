import { StatusBadge } from "@/components/ui-kit/StatusBadge";

export function Header({
  title,
  subtitle,
  icon,
  actions,
  badge = "Demo Data",
}: {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: string | null;
}) {
  return (
    <header className="border-b border-border bg-surface/60">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="mt-0.5 flex size-10 items-center justify-center rounded-md border border-border bg-primary/10 text-primary">
              {icon}
            </div>
          ) : null}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-semibold text-foreground">{title}</h1>
              {badge ? <StatusBadge tone="demo">{badge}</StatusBadge> : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
