import { createFileRoute } from "@tanstack/react-router";
import { Layers, Network, Package, Workflow } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DatasetLoader } from "@/components/ui-kit/DatasetLoader";
import { FeatureTable } from "@/components/ui-kit/FeatureTable";
import { NetworkGraph } from "@/components/ui-kit/NetworkGraph";
import { PipelineStep } from "@/components/ui-kit/PipelineStep";
import { SectionCard } from "@/components/ui-kit/SectionCard";
import { StatusBadge } from "@/components/ui-kit/StatusBadge";
import { buildFeatureSamples } from "@/lib/datasets/parseDataset";
import { useDatasetState } from "@/lib/datasets/datasetStore";
import { featureService } from "@/services/featureService";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Feature Extraction — Predictive Cyber Defence" },
      {
        name: "description",
        content:
          "Flow-level and packet-level features, preprocessing steps, the network state vector and the host communication graph.",
      },
      { property: "og:title", content: "Feature Extraction — Predictive Cyber Defence" },
      {
        property: "og:description",
        content: "How raw packets become a normalized network state vector.",
      },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  const { dataset } = useDatasetState();
  const pipeline = featureService.getPreprocessingPipeline();
  const state = dataset?.stateVector ?? featureService.getStateVector();
  const samples = dataset ? buildFeatureSamples(dataset) : null;
  const graph = dataset ? dataset.graph : featureService.getGraph();
  const { nodes, edges } = graph;

  return (
    <AppShell
      title="Feature Extraction"
      subtitle="Which features are extracted, and how network state is represented"
      icon={<Layers className="size-5" />}
      actions={
        <StatusBadge tone={dataset ? "success" : "demo"}>
          {dataset ? "Computed from loaded capture" : "Demo data"}
        </StatusBadge>
      }
    >
      <DatasetLoader />

      <div className="grid gap-4 xl:grid-cols-2">
        <FeatureTable
          title="Flow-level features"
          icon={<Workflow className="size-4" />}
          features={samples?.flow ?? featureService.getFlowFeatures()}
        />
        <FeatureTable
          title="Packet-level features"
          icon={<Package className="size-4" />}
          features={samples?.packet ?? featureService.getPacketFeatures()}
        />
      </div>

      <SectionCard title="Preprocessing pipeline" description="Applied in order before windowing">
        <div className="grid gap-3 lg:grid-cols-6">
          {pipeline.map((step, i) => (
            <PipelineStep
              key={step.name}
              index={i + 1}
              title={step.name}
              detail={step.detail}
              orientation="horizontal"
              last={i === pipeline.length - 1}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Network state vector"
        description={`One state per time window · ${state.window}`}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {state.values.map((v) => (
            <div key={v.key} className="rounded-md border border-border p-3">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{v.label}</span>
                <span className="font-display font-semibold text-foreground">
                  {v.value.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.round(v.normalized * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                normalized {v.normalized.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Host communication graph"
        description="Suspicious edges highlight the observed east-west and outbound paths"
        icon={<Network className="size-4" />}
      >
        <NetworkGraph nodes={nodes} edges={edges} />
      </SectionCard>
    </AppShell>
  );
}
