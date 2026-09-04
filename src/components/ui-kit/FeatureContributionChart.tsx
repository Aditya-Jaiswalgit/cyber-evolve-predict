import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FeatureContribution } from "@/services/types";

export function FeatureContributionChart({ data }: { data: FeatureContribution[] }) {
  const chartData = data.map((d) => ({ feature: d.feature, contribution: d.contribution }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 24, left: 60, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
        />
        <YAxis
          type="category"
          dataKey="feature"
          stroke="var(--muted-foreground)"
          fontSize={12}
          width={150}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
          formatter={(v: number) => [`${v > 0 ? "+" : ""}${v.toFixed(2)}`, "SHAP contribution"]}
        />
        <Bar dataKey="contribution" radius={[0, 3, 3, 0]} barSize={18}>
          {chartData.map((d, i) => (
            <Cell
              key={i}
              fill={d.contribution >= 0 ? "var(--destructive)" : "var(--success)"}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
