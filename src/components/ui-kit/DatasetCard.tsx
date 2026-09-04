import { Database } from "lucide-react";
import type { DatasetInfo } from "@/services/types";

export function DatasetCard({ dataset }: { dataset: DatasetInfo }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2">
        <Database className="size-4 text-accent" />
        <h3 className="font-display text-sm font-semibold text-foreground">{dataset.name}</h3>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">{dataset.flows}</span>
      </div>
      <dl className="mt-3 space-y-2 text-xs">
        <div>
          <dt className="tracking-wide text-muted-foreground uppercase">Purpose</dt>
          <dd className="mt-0.5 text-foreground">{dataset.purpose}</dd>
        </div>
        <div>
          <dt className="tracking-wide text-muted-foreground uppercase">Traffic Type</dt>
          <dd className="mt-0.5 text-foreground">{dataset.trafficType}</dd>
        </div>
      </dl>
    </div>
  );
}
