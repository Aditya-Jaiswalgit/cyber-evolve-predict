import { cn } from "@/lib/utils";

export function PredictionCard({
  label,
  value,
  detail,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: React.ReactNode;
  tone?: "default" | "current" | "predicted" | "risk";
}) {
  const styles = {
    default: "border-border",
    current: "border-destructive/50 bg-destructive/5",
    predicted: "border-warning/50 bg-warning/5",
    risk: "border-primary/50 bg-primary/5",
  }[tone];

  const valueTone = {
    default: "text-foreground",
    current: "text-destructive",
    predicted: "text-warning",
    risk: "text-primary",
  }[tone];

  return (
    <div className={cn("panel p-4", styles)}>
      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {icon}
        {label}
      </div>
      <p className={cn("mt-3 font-display text-xl font-semibold", valueTone)}>{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}
