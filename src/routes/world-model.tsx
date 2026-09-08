import { createFileRoute } from "@tanstack/react-router";
import { Brain, GitBranch } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui-kit/SectionCard";
import { StatusBadge } from "@/components/ui-kit/StatusBadge";
import { worldModelService } from "@/services/worldModelService";

export const Route = createFileRoute("/world-model")({
  head: () => ({
    meta: [
      { title: "World Model — Predictive Cyber Defence" },
      {
        name: "description",
        content:
          "How the temporal world model learns state transitions P(S t+1 | S t) over network state sequences, and how it is trained.",
      },
      { property: "og:title", content: "World Model — Predictive Cyber Defence" },
      {
        property: "og:description",
        content: "Temporal dynamics of network state learned by an LSTM world model.",
      },
    ],
  }),
  component: WorldModelPage,
});

function WorldModelPage() {
  const models = worldModelService.getModels();
  const transitions = worldModelService.getTransitions();
  const training = worldModelService.getTrainingInfo();

  return (
    <AppShell
      title="World Model"
      subtitle="How the model learns temporal dynamics of network state"
      icon={<Brain className="size-5" />}
    >
      <SectionCard
        title="Learning objective"
        description="The model is trained to predict the next network state from a sequence of past states"
      >
        <div className="rounded-md border border-border bg-muted/40 p-4 text-center">
          <p className="font-display text-lg text-foreground">
            P(S<sub>t+1</sub> | S<sub>t</sub>, S<sub>t−1</sub>, …, S<sub>t−n</sub>)
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Rolling the prediction forward K times yields the future attack trajectory.
          </p>
        </div>
        <dl className="mt-4 space-y-3 text-sm">
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
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {models.map((m) => (
          <div key={m.id} className="panel p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-sm font-semibold text-foreground">{m.name}</h3>
              <StatusBadge tone={m.role === "active" ? "success" : "neutral"}>
                {m.role === "active" ? "Active" : "Candidate"}
              </StatusBadge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{m.summary}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>{m.params}</span>
              <span>Sequence: {m.seqLength}</span>
            </div>
          </div>
        ))}
      </div>

      <SectionCard
        title="State transitions"
        description="Each step forward carries the predicted state and its probability"
        icon={<GitBranch className="size-4" />}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-2 font-medium">State</th>
                <th className="px-4 py-2 text-right font-medium">SYN rate</th>
                <th className="px-4 py-2 text-right font-medium">Packet rate</th>
                <th className="px-4 py-2 text-right font-medium">Entropy</th>
                <th className="px-4 py-2 text-right font-medium">Probability</th>
              </tr>
            </thead>
            <tbody>
              {transitions.map((t) => (
                <tr key={t.label} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-2 font-medium text-foreground">{t.label}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground">{t.synRate.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground">{t.packetRate.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground">{t.entropy.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-medium text-primary">
                    {Math.round(t.probability * 100)}%
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
