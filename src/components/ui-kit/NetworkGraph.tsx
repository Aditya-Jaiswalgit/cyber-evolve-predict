import type { GraphEdge, GraphNode } from "@/services/types";

export function NetworkGraph({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="grid-bg rounded-md border border-border bg-background/40">
      <svg viewBox="0 0 720 400" className="h-[400px] w-full">
        {edges.map((e, i) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeWidth={e.volume * 0.7}
              stroke={e.suspicious ? "var(--destructive)" : "var(--primary)"}
              strokeOpacity={e.suspicious ? 0.55 : 0.35}
              strokeLinecap="round"
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.kind === "external" ? 16 : 13}
              fill="var(--card)"
              stroke={
                n.risk > 0.7
                  ? "var(--destructive)"
                  : n.risk > 0.4
                    ? "var(--warning)"
                    : "var(--accent)"
              }
              strokeWidth={2.5}
            />
            <text
              x={n.x}
              y={n.y + 34}
              textAnchor="middle"
              className="fill-muted-foreground font-mono"
              fontSize={11}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-4 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-destructive" /> High-risk host
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-warning" /> Elevated
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-accent" /> Normal
        </span>
        <span className="ml-auto">Edge thickness = traffic volume · red edges = suspicious flows</span>
      </div>
    </div>
  );
}
