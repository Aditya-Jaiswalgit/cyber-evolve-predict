import type { AttackStage, AttackStageId, PredictionResult, StageStatus } from "./types";

const STAGE_META: { id: AttackStageId; name: string; description: string }[] = [
  {
    id: "reconnaissance",
    name: "Reconnaissance",
    description: "Port scanning and host discovery from an external source",
  },
  {
    id: "initial-access",
    name: "Initial Access",
    description: "Exploitation of an exposed service to gain a foothold",
  },
  {
    id: "lateral-movement",
    name: "Lateral Movement",
    description: "Internal east-west traffic toward additional hosts",
  },
  {
    id: "command-control",
    name: "Command & Control",
    description: "Beaconing to an external controller on a persistent channel",
  },
  {
    id: "exfiltration",
    name: "Exfiltration",
    description: "Sustained outbound transfer of internal data",
  },
];

const CURVES: Record<number, number[]> = {
  3: [0.2, 0.27, 0.35, 0.48],
  5: [0.2, 0.27, 0.35, 0.48, 0.63, 0.76],
  10: [0.2, 0.27, 0.35, 0.48, 0.63, 0.76, 0.82, 0.86, 0.89, 0.91, 0.93],
};

function riskFor(p: number): PredictionResult["risk"] {
  if (p >= 0.85) return "Critical";
  if (p >= 0.6) return "High";
  if (p >= 0.35) return "Moderate";
  return "Low";
}

function stagesFor(horizon: number): AttackStage[] {
  const currentIndex = 0;
  const predictedIndex = horizon >= 10 ? 2 : 1;
  const confidences: number[] = [0.94, 0.76, 0.41, 0.22, 0.11];

  return STAGE_META.map((stage, i) => {
    let status: StageStatus = "future";
    if (i < currentIndex) status = "completed";
    else if (i === currentIndex) status = "current";
    else if (i <= predictedIndex) status = "predicted";
    return { ...stage, confidence: confidences[i] ?? 0, status };
  });
}

export const predictionService = {
  getStageMeta: () => STAGE_META,
  getHorizons: () => [3, 5, 10] as const,
  /** Simulated K-step forward rollout. Swap for the PyTorch inference endpoint. */
  async runForwardSimulation(horizon: number): Promise<PredictionResult> {
    await new Promise((r) => setTimeout(r, 900));
    return predictionService.getPrediction(horizon);
  },
  getPrediction(horizon: number): PredictionResult {
    const curve: number[] = CURVES[horizon] ?? CURVES[5] ?? [];
    const timeline = curve.map((probability, i) => ({
      window: i === 0 ? "t (now)" : `t+${i}`,
      probability: Math.round(probability * 100),
    }));
    const peak = curve[curve.length - 1] ?? 0;
    const stages = stagesFor(horizon);

    return {
      horizon,
      simulated: true,
      timeline,
      currentStage: "reconnaissance",
      predictedStage: horizon >= 10 ? "lateral-movement" : "initial-access",
      risk: riskFor(peak),
      peakProbability: Math.round(peak * 100),
      stages,
    };
  },
  getAlert(result: PredictionResult) {
    const predicted = STAGE_META.find((s) => s.id === result.predictedStage)!;
    return `Elevated probability of progression toward ${predicted.name} within ${result.horizon} prediction windows (${result.peakProbability}%).`;
  },
};
