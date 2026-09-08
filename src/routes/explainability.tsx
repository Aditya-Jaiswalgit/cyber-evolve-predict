import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, ListTree } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FeatureContributionChart } from "@/components/ui-kit/FeatureContributionChart";
import { MetricCard } from "@/components/ui-kit/MetricCard";
import { SectionCard } from "@/components/ui-kit/SectionCard";
import { explainabilityService } from "@/services/explainabilityService";

export const Route = createFileRoute("/explainability")({
  head: () => ({
    meta: [
      { title: "Explainability — Predictive Cyber Defence" },
      {
        name: "description",
        content:
          "Why the model made its prediction: feature contributions, the flows driving risk, and a plain-language rationale.",
      },
      { property: "og:title", content: "Explainability — Predictive Cyber Defence" },
      {
        property: "og:description",
        content: "Feature attribution behind each attack-progression forecast.",
      },
    ],
  }),
  component: ExplainabilityPage,
});

function ExplainabilityPage() {
  const contributions = explainabilityService.getContributions();
  const flows = explainabilityService.getDrivingFlows();
  const baseline = explainabilityService.getBaseline();

  return (
    <AppShell
      title="Explainability"
      subtitle="Why the model made that prediction"
      icon={<Lightbulb className="size-5" />}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Base value" value={`${Math.round(baseline.baseValue * 100)}%`} hint="Average risk across the dataset" />
        <MetricCard label="Predicted risk" value={`${Math.round(baseline.predicted * 100)}%`} tone="danger" hint="For the current window" />
        <MetricCard label="Method" value="SHAP-style" hint={baseline.method} tone="primary" />
      </div>

      <SectionCard
        title="Feature contributions"
        description="How each feature pushed the forecast up or down"
      >
        <FeatureContributionChart data={contributions} />
      </SectionCard>

      <SectionCard title="Rationale" description="Plain-language summary of the attribution">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {explainabilityService.getNarrative()}
        </p>
      </SectionCard>

      <SectionCard
        title="Flows driving the prediction"
        description="Ranked by contribution to predicted risk"
        icon={<ListTree className="size-4" />}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-2 font-medium">Source</th>
                <th className="px-4 py-2 font-medium">Destination</th>
                <th className="px-4 py-2 font-medium">Protocol</th>
                <th className="px-4 py-2 text-right font-medium">Port</th>
                <th className="px-4 py-2 text-right font-medium">Risk contribution</th>
              </tr>
            </thead>
            <tbody>
              {flows.map((f, i) => (
                <tr key={`${f.source}-${f.destination}-${f.port}-${i}`} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-2 font-mono text-xs text-foreground">{f.source}</td>
                  <td className="px-4 py-2 font-mono text-xs text-foreground">{f.destination}</td>
                  <td className="px-4 py-2 text-muted-foreground">{f.protocol}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground">{f.port}</td>
                  <td className="px-4 py-2 text-right font-medium text-primary">
                    +{Math.round(f.riskContribution * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}
