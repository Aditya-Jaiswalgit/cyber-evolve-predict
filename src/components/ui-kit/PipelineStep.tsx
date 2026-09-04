import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PipelineStep({
  index,
  title,
  detail,
  icon,
  active,
  orientation = "vertical",
  last,
}: {
  index?: number;
  title: string;
  detail?: string;
  icon?: React.ReactNode;
  active?: boolean;
  orientation?: "vertical" | "horizontal";
  last?: boolean;
}) {
  const Arrow = orientation === "vertical" ? ArrowDown : ArrowRight;

  return (
    <div
      className={cn(
        "flex items-center",
        orientation === "vertical" ? "w-full flex-col" : "flex-row",
      )}
    >
      <div
        className={cn(
          "flex w-full min-w-0 items-center gap-3 rounded-md border px-4 py-3 transition-colors",
          active
            ? "border-primary/50 bg-primary/10"
            : "border-border bg-card hover:border-primary/30",
        )}
      >
        {icon ? (
          <span className={cn("shrink-0", active ? "text-primary" : "text-muted-foreground")}>
            {icon}
          </span>
        ) : index !== undefined ? (
          <span className="flex size-6 shrink-0 items-center justify-center rounded border border-border font-mono text-[11px] text-muted-foreground">
            {index}
          </span>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          {detail ? <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p> : null}
        </div>
      </div>
      {!last ? (
        <Arrow
          className={cn(
            "size-4 shrink-0 text-muted-foreground/70",
            orientation === "vertical" ? "my-1.5" : "mx-2",
          )}
        />
      ) : null}
    </div>
  );
}
