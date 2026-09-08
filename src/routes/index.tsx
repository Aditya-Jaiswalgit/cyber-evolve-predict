import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, Brain, LayoutDashboard, Network, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AttackStageTimeline } from "@/components/ui-kit/AttackStageTimeline";
import { MetricCard } from "@/components/ui-kit/MetricCard";
import { PipelineStep } from "@/components/ui-kit/PipelineStep";
import { ProbabilityChart } from "@/components/ui-kit/ProbabilityChart";
import { SectionCard } from "@/components/ui-kit/SectionCard";
import { featureService } from "@/services/featureService";
import { predictionService } from "@/services/predictionService";
import { trafficService } from "@/services/trafficService";
import { worldModelService } from "@/services/worldModelService";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Predictive Cyber Defence Console" },
      {
        name: "description",
        content:
          "Forecast attack progression from network traffic with an AI world model: traffic analysis, state modelling, prediction and explainability.",
      },
      { property: "og:title", content: "Overview — Predictive Cyber Defence Console" },
      {
        property: "og:description",
        content: "An AI world model that forecasts how network attacks progress before compromise completes.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const summary = trafficService.getSummary();
  const pipeline = featureService.getPreprocessingPipeline();
  const prediction = predictionService.getPrediction(5);
  const training = worldModelService.getTrainingInfo();
  const active = worldModelService.getActiveModel();

  return (
    <AppShell
      title="Overview"
      subtitle="From raw traffic to a forecast of future attack progression"
      icon={<LayoutDashboard className="size-5" />}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Flows analysed"
          value={summary.flows.toLocaleString()}
          hint={summary.timeRange}
          icon={<Activity className="size-4" />}
        />
        <MetricCard
          label="Active world model"
          value={active.name}
          hint={active.params}
          tone="primary"
          icon={<Brain className="size-4" />}
        />
        <MetricCard
          label="Peak attack probability"
          value={`${prediction.peakProbability}%`}
          hint={`Within ${prediction.horizon} prediction windows`}
          tone="danger"
          icon={<TrendingUp className="size-4" />}
        />
        <MetricCard
          label="Forecast risk level"
          value={prediction.risk}
          hint="Derived from the K-step rollout"
          tone="warning"
          icon={<AlertTriangle className="size-4" />}
        />
      </div>

      <div className="panel border-warning/40 bg-warning/5 p-4 text-sm text-foreground">
        <p className="font-medium">Early warning</p>
        <p className="mt-1 text-muted-foreground">{predictionService.getAlert(prediction)}</p>
      </div>

      <SectionCard
        title="How the system works"
        description="Traffic is parsed into features, features become network states, and the world model rolls those states forward in time."
        icon={<Network className="size-4" />}
      >
        <div className="grid gap-3 lg:grid-cols-6">
          {pipeline.map((step, i) => (
            <PipelineStep
              key={step.name}
              index={i + 1}
              title={step.name}
              detail={step.detail}
              orientation="horizontal"
              active={i === pipeline.length - 1}
              last={i === pipeline.length - 1}
            />
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Forecast attack probability"
          description="Probability of attack progression across future prediction windows"
          icon={<TrendingUp className="size-4" />}
        >
          <ProbabilityChart data={prediction.timeline} height={240} />
        </SectionCard>

        <SectionCard
          title="Model & training setup"
          description={active.summary}
          icon={<Brain className="size-4" />}
        >
          <dl className="space-y-3 text-sm">
            {[
              ["Dataset", training.dataset],
              ["Objective", training.objective],
              ["Windowing", training.windowing],
              ["Status", training.status],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-wrap justify-between gap-2 border-b border-border pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            to="/world-model"
            className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
          >
            Explore the world model →
          </Link>
        </SectionCard>
      </div>

      <SectionCard
        title="Attack stage progression"
        description="Where the network is now, and where the model expects it to go next"
      >
        <AttackStageTimeline stages={prediction.stages} />
      </SectionCard>
    </AppShell>
  );
}
