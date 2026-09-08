import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Crosshair, Play, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AttackStageTimeline } from "@/components/ui-kit/AttackStageTimeline";
import { PredictionCard } from "@/components/ui-kit/PredictionCard";
import { ProbabilityChart } from "@/components/ui-kit/ProbabilityChart";
import { SectionCard } from "@/components/ui-kit/SectionCard";
import { predictionService } from "@/services/predictionService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prediction")({
  head: () => ({
    meta: [
      { title: "Prediction — Predictive Cyber Defence" },
      {
        name: "description",
        content:
          "Run a K-step forward simulation to forecast attack probability and the next likely attack stage before compromise completes.",
      },
      { property: "og:title", content: "Prediction — Predictive Cyber Defence" },
      {
        property: "og:description",
        content: "Forecast future attack progression with a K-step rollout of the world model.",
      },
    ],
  }),
  component: PredictionPage,
});

function PredictionPage() {
  const horizons = predictionService.getHorizons();
  const [horizon, setHorizon] = useState<number>(5);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(() => predictionService.getPrediction(5));

  const stageName = (id: string) =>
    predictionService.getStageMeta().find((s) => s.id === id)?.name ?? id;

  async function run(next: number) {
    setHorizon(next);
    setRunning(true);
    const r = await predictionService.runForwardSimulation(next);
    setResult(r);
    setRunning(false);
  }

  return (
    <AppShell
      title="Prediction"
      subtitle="How the system forecasts future attack progression"
      icon={<TrendingUp className="size-5" />}
      actions={
        <div className="flex items-center gap-2">
          {horizons.map((h) => (
            <button
              key={h}
              onClick={() => run(h)}
              disabled={running}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
                horizon === h
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              K = {h}
            </button>
          ))}
          <button
            onClick={() => run(horizon)}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Play className="size-3.5" />
            {running ? "Simulating…" : "Run simulation"}
          </button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PredictionCard
          label="Current stage"
          value={stageName(result.currentStage)}
          detail="Detected in the latest window"
          tone="current"
          icon={<Crosshair className="size-4" />}
        />
        <PredictionCard
          label="Predicted next stage"
          value={stageName(result.predictedStage)}
          detail={`Within ${result.horizon} windows`}
          tone="predicted"
          icon={<TrendingUp className="size-4" />}
        />
        <PredictionCard
          label="Peak probability"
          value={`${result.peakProbability}%`}
          detail="Highest point of the rollout"
          tone="risk"
        />
        <PredictionCard
          label="Risk level"
          value={result.risk}
          detail="Derived from peak probability"
          tone="risk"
          icon={<AlertTriangle className="size-4" />}
        />
      </div>

      <div className="panel border-warning/40 bg-warning/5 p-4 text-sm">
        <p className="font-medium text-foreground">Early warning</p>
        <p className="mt-1 text-muted-foreground">{predictionService.getAlert(result)}</p>
      </div>

      <SectionCard
        title="Attack probability over future windows"
        description="Each step is one forward pass of the world model, fed by its own prediction"
      >
        <ProbabilityChart data={result.timeline} />
      </SectionCard>

      <SectionCard
        title="Predicted attack progression"
        description="Stage confidences produced alongside the state rollout"
      >
        <AttackStageTimeline stages={result.stages} />
      </SectionCard>
    </AppShell>
  );
}
