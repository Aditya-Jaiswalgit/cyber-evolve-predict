export type AttackStageId =
  | "reconnaissance"
  | "initial-access"
  | "lateral-movement"
  | "command-control"
  | "exfiltration";

export type StageStatus = "completed" | "current" | "predicted" | "future";

export interface AttackStage {
  id: AttackStageId;
  name: string;
  description: string;
  confidence: number;
  status: StageStatus;
}

export interface TrafficSummary {
  fileName: string;
  fileType: string;
  flows: number;
  timeRange: string;
  packets: number;
  bytes: string;
  protocols: { name: string; share: number }[];
}

export interface FlowRecord {
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  port: number;
  packets: number;
  bytes: number;
  duration: number;
  flags: string;
  label: "Benign" | "Suspicious" | "Malicious";
}

export interface FeatureDefinition {
  name: string;
  unit: string;
  sample: string;
}

export interface NetworkStateVector {
  window: string;
  values: { key: string; label: string; value: number; normalized: number }[];
}

export interface GraphNode {
  id: string;
  label: string;
  kind: "internal" | "external" | "service";
  x: number;
  y: number;
  risk: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  volume: number;
  suspicious: boolean;
}

export interface ModelCandidate {
  id: string;
  name: string;
  role: "active" | "candidate";
  summary: string;
  params: string;
  seqLength: string;
}

export interface StateTransition {
  label: string;
  synRate: number;
  packetRate: number;
  entropy: number;
  probability: number;
}

export interface PredictionResult {
  horizon: number;
  simulated: boolean;
  timeline: { window: string; probability: number }[];
  currentStage: AttackStageId;
  predictedStage: AttackStageId;
  risk: "Low" | "Moderate" | "High" | "Critical";
  peakProbability: number;
  stages: AttackStage[];
}

export interface FeatureContribution {
  feature: string;
  value: string;
  contribution: number;
  impact: "Increases Risk" | "Reduces Risk";
}

export interface DrivingFlow {
  source: string;
  destination: string;
  port: number;
  protocol: string;
  riskContribution: number;
}

export interface BenchmarkRow {
  metric: string;
  baseline: number;
  worldModel: number;
  lowerIsBetter?: boolean;
}

export interface DatasetInfo {
  name: string;
  purpose: string;
  trafficType: string;
  flows: string;
}
