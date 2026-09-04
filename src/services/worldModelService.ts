import type { ModelCandidate, StateTransition } from "./types";

const MODELS: ModelCandidate[] = [
  {
    id: "lstm",
    name: "LSTM",
    role: "active",
    summary:
      "Recurrent temporal model over normalized network-state vectors. Learns P(Sₜ₊₁ | Sₜ) from sequences of 60s windows.",
    params: "2 layers · 128 hidden · 412K params",
    seqLength: "16 windows",
  },
  {
    id: "transformer",
    name: "Temporal Transformer",
    role: "candidate",
    summary:
      "Self-attention over the window sequence, capturing long-range dependencies between reconnaissance and later stages.",
    params: "4 blocks · 8 heads · 1.9M params",
    seqLength: "64 windows",
  },
  {
    id: "gnn",
    name: "Graph Neural Network",
    role: "candidate",
    summary:
      "Message passing over the host/port communication graph, so state evolution is modelled per node rather than globally.",
    params: "3 GraphSAGE layers · 780K params",
    seqLength: "16 graph snapshots",
  },
];

const TRANSITIONS: StateTransition[] = [
  { label: "Sₜ", synRate: 0.91, packetRate: 0.64, entropy: 0.66, probability: 1 },
  { label: "Sₜ₊₁", synRate: 0.84, packetRate: 0.71, entropy: 0.72, probability: 0.88 },
  { label: "Sₜ₊₂", synRate: 0.72, packetRate: 0.79, entropy: 0.78, probability: 0.79 },
  { label: "Sₜ₊₃", synRate: 0.61, packetRate: 0.86, entropy: 0.83, probability: 0.71 },
  { label: "Sₜ₊K", synRate: 0.48, packetRate: 0.93, entropy: 0.89, probability: 0.62 },
];

export const worldModelService = {
  getModels: () => MODELS,
  getActiveModel: () => MODELS.find((m) => m.role === "active")!,
  getTransitions: () => TRANSITIONS,
  getTrainingInfo: () => ({
    dataset: "CIC-IDS-2018 (subset) + CTU-13",
    objective: "Next-state regression + attack-stage classification head",
    windowing: "60s windows, 30s stride, 16-window context",
    status: "Demo weights — no live inference backend attached",
  }),
};
