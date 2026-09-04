import { ArrowRight, Crosshair, DoorOpen, Move3d, Radio, Upload } from "lucide-react";
import type { AttackStage, AttackStageId } from "@/services/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

const ICONS: Record<AttackStageId, React.ElementType> = {
  reconnaissance: Crosshair,
  "initial-access": DoorOpen,
  "lateral-movement": Move3d,
  "command-control": Radio,
  exfiltration: Upload,
};

const STATUS_LABEL = {
  completed: "Observed",
  current: "Current",
  predicted: "Predicted",
  future: "Future",
} as const;

export function AttackStageTimeline({ stages }: { stages: AttackStage[] }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
      {stages.map((stage, i) => {
        const Icon = ICONS[stage.id];
        const isCurrent = stage.status === "current";
        const isPredicted = stage.status === "predicted";
        return (
          <div key={stage.id} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex-1 rounded-md border p-3 transition-colors",
                isCurrent && "border-destructive/60 bg-destructive/10",
                isPredicted && "border-warning/50 bg-warning/10",
                stage.status === "completed" && "border-border bg-muted/50",
                stage.status === "future" && "border-border bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <Icon
                  className={cn(
                    "size-4",
                    isCurrent ? "text-destructive" : isPredicted ? "text-warning" : "text-muted-foreground",
                  )}
                />
                <StatusBadge
                  tone={isCurrent ? "danger" : isPredicted ? "warning" : "neutral"}
                  className="text-[10px]"
                >
                  {STATUS_LABEL[stage.status]}
                </StatusBadge>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{stage.name}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                {stage.description}
              </p>
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isCurrent ? "bg-destructive" : isPredicted ? "bg-warning" : "bg-primary/50",
                    )}
                    style={{ width: `${Math.round(stage.confidence * 100)}%` }}
                  />
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  confidence {Math.round(stage.confidence * 100)}%
                </p>
              </div>
            </div>
            {i < stages.length - 1 ? (
              <ArrowRight className="hidden size-4 shrink-0 text-muted-foreground/60 lg:block" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
