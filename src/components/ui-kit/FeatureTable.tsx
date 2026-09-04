import type { FeatureDefinition } from "@/services/types";

export function FeatureTable({
  title,
  icon,
  features,
}: {
  title: string;
  icon?: React.ReactNode;
  features: FeatureDefinition[];
}) {
  return (
    <div className="panel">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="ml-auto text-xs text-muted-foreground">{features.length} features</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-2 font-medium">Feature</th>
            <th className="px-4 py-2 font-medium">Encoding / Unit</th>
            <th className="px-4 py-2 font-medium">Sample</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f) => (
            <tr key={f.name} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-2 text-foreground">{f.name}</td>
              <td className="px-4 py-2 text-muted-foreground">{f.unit}</td>
              <td className="px-4 py-2 font-mono text-[12.5px] text-accent">{f.sample}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
