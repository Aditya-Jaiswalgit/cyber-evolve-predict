import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { BenchmarkTable } from "@/components/ui-kit/BenchmarkTable";
import { SectionCard } from "@/components/ui-kit/SectionCard";
import { StatusBadge } from "@/components/ui-kit/StatusBadge";
import { benchmarkService } from "@/services/benchmarkService";

export const Route = createFileRoute("/benchmarking")({
  head: () => ({
    meta: [
      { title: "Benchmarking — Predictive Cyber Defence" },
      {
        name: "description",
        content:
          "Evaluation of the AI world model against a logistic-regression baseline on the same dataset and metrics.",
      },
      { property: "og:title", content: "Benchmarking — Predictive Cyber Defence" },
      {
        property: "og:description",
        content: "Accuracy, precision, recall, F1 and false-positive rate versus a baseline detector.",
      },
    ],
  }),
  component: BenchmarkingPage,
});

function BenchmarkingPage() {
  const rows = benchmarkService.getRows();
  const chartData = benchmarkService.getChartData();
  const setup = benchmarkService.getSetup();

  return (
    <AppShell
      title="Benchmarking"
      subtitle="How performance is evaluated"
      icon={<BarChart3 className="size-5" />}
    >
      <div className="panel border-accent/40 bg-accent/5 p-4 text-sm">
        <StatusBadge tone="demo">{setup.disclaimer}</StatusBadge>
        <p className="mt-2 text-muted-foreground">{setup.note}</p>
      </div>

      <SectionCard title="Evaluation setup" description="Identical data and metrics for both models">
        <dl className="space-y-3 text-sm">
          {[
            ["Dataset", setup.dataset],
            ["Split", setup.split],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-wrap justify-between gap-2 border-b border-border pb-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <SectionCard title="Baseline vs AI world model" description="Values shown as percentages" bodyClassName="p-0">
        <BenchmarkTable rows={rows} />
      </SectionCard>

      <SectionCard title="Metric comparison" description="Lower is better for false positive rate">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="metric" stroke="currentColor" className="text-muted-foreground" fontSize={12} />
            <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={12} unit="%" />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Logistic Regression" fill="hsl(var(--muted-foreground))" radius={[3, 3, 0, 0]} />
            <Bar dataKey="AI World Model" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </AppShell>
  );
}
