import { createFileRoute } from "@tanstack/react-router";
import { Activity, Database, FileText } from "lucide-react";
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
import { DatasetCard } from "@/components/ui-kit/DatasetCard";
import { DatasetLoader } from "@/components/ui-kit/DatasetLoader";
import { MetricCard } from "@/components/ui-kit/MetricCard";
import { SectionCard } from "@/components/ui-kit/SectionCard";
import { StatusBadge } from "@/components/ui-kit/StatusBadge";
import { TrafficTable } from "@/components/ui-kit/TrafficTable";
import { useDatasetState } from "@/lib/datasets/datasetStore";
import { trafficService } from "@/services/trafficService";

export const Route = createFileRoute("/traffic")({
  head: () => ({
    meta: [
      { title: "Traffic Analysis — Predictive Cyber Defence" },
      {
        name: "description",
        content: "Inspect captured network traffic: flow records, protocol mix, throughput and the datasets used.",
      },
      { property: "og:title", content: "Traffic Analysis — Predictive Cyber Defence" },
      {
        property: "og:description",
        content: "Flow-level view of captured traffic feeding the world model.",
      },
    ],
  }),
  component: TrafficPage,
});

function TrafficPage() {
  const { dataset } = useDatasetState();
  const summary = dataset?.summary ?? trafficService.getSummary();
  const allFlows = dataset?.flows ?? trafficService.getFlows();
  const flows = allFlows.slice(0, 60);
  const throughput = dataset?.throughput ?? trafficService.getThroughput();
  const datasets = trafficService.getDatasets();

  return (
    <AppShell
      title="Traffic Analysis"
      subtitle="What network data is captured and how it is read"
      icon={<Activity className="size-5" />}
      actions={
        <StatusBadge tone={dataset ? "success" : "demo"}>
          {dataset ? "Real capture loaded" : "Demo data"}
        </StatusBadge>
      }
    >
      <DatasetLoader />

      <SectionCard
        title="Capture source"
        description="Traffic is read from packet captures or flow exports"
        icon={<FileText className="size-4" />}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="File" value={summary.fileName} hint={summary.fileType} />
          <MetricCard label="Flows" value={summary.flows.toLocaleString()} hint={summary.timeRange} />
          <MetricCard label="Packets" value={summary.packets.toLocaleString()} tone="primary" />
          <MetricCard label="Volume" value={summary.bytes} />
        </div>
        <div className="mt-4 space-y-2">
          {summary.protocols.map((p) => (
            <div key={p.name} className="flex items-center gap-3 text-sm">
              <span className="w-16 text-muted-foreground">{p.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${p.share}%` }} />
              </div>
              <span className="w-10 text-right text-muted-foreground">{p.share}%</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Throughput and flagged flows per window"
        description="60-second windows across the capture"
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={throughput}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="window" stroke="currentColor" className="text-muted-foreground" fontSize={12} />
            <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="packets" name="Packets" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
            <Bar dataKey="flaggedFlows" name="Flagged flows" fill="hsl(var(--warning))" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Parsed flow records" description="Layer 2–4 headers reassembled by 5-tuple" bodyClassName="p-0">
        <TrafficTable flows={flows} />
      </SectionCard>

      <SectionCard title="Datasets" description="Public benchmark captures used for training and evaluation" icon={<Database className="size-4" />}>
        <div className="grid gap-4 md:grid-cols-2">
          {datasets.map((d) => (
            <DatasetCard key={d.name} dataset={d} />
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
