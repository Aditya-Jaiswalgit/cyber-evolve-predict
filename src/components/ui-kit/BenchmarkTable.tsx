import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { BenchmarkRow } from "@/services/types";

export function BenchmarkTable({ rows }: { rows: BenchmarkRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-2 font-medium">Metric</th>
            <th className="px-4 py-2 text-right font-medium">Logistic Regression</th>
            <th className="px-4 py-2 text-right font-medium">AI World Model</th>
            <th className="px-4 py-2 text-right font-medium">Delta</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const delta = r.worldModel - r.baseline;
            const better = r.lowerIsBetter ? delta < 0 : delta > 0;
            const Icon = delta > 0 ? ArrowUpRight : ArrowDownRight;
            return (
              <tr key={r.metric} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 text-foreground">
                  {r.metric}
                  {r.lowerIsBetter ? (
                    <span className="ml-2 text-[11px] text-muted-foreground">(lower is better)</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                  {r.baseline.toFixed(3)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {r.worldModel.toFixed(3)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono ${better ? "text-success" : "text-destructive"}`}
                >
                  <span className="inline-flex items-center gap-1">
                    <Icon className="size-3.5" />
                    {delta > 0 ? "+" : ""}
                    {delta.toFixed(3)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
