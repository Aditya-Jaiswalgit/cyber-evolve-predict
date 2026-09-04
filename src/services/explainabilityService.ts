import type { DrivingFlow, FeatureContribution } from "./types";

const CONTRIBUTIONS: FeatureContribution[] = [
  { feature: "SYN Flag Rate", value: "High (148/s)", contribution: 0.24, impact: "Increases Risk" },
  { feature: "Destination Port Activity", value: "High (214 ports)", contribution: 0.18, impact: "Increases Risk" },
  { feature: "Packet Rate", value: "Elevated (2.4k/s)", contribution: 0.14, impact: "Increases Risk" },
  { feature: "Flow Duration", value: "Medium (0.42s)", contribution: 0.07, impact: "Increases Risk" },
  { feature: "TTL Variance", value: "Medium (11.2)", contribution: 0.06, impact: "Increases Risk" },
  { feature: "Inbound/Outbound Ratio", value: "Low (0.18)", contribution: -0.04, impact: "Reduces Risk" },
  { feature: "Retransmission Ratio", value: "Low (0.09)", contribution: -0.03, impact: "Reduces Risk" },
];

const DRIVING_FLOWS: DrivingFlow[] = [
  { source: "203.0.113.42", destination: "10.0.14.7", port: 445, protocol: "TCP", riskContribution: 0.31 },
  { source: "203.0.113.42", destination: "10.0.14.7", port: 22, protocol: "TCP", riskContribution: 0.22 },
  { source: "10.0.14.9", destination: "198.51.100.77", port: 8443, protocol: "TCP", riskContribution: 0.19 },
  { source: "10.0.14.7", destination: "10.0.14.21", port: 3389, protocol: "TCP", riskContribution: 0.14 },
  { source: "10.0.14.21", destination: "10.0.14.9", port: 139, protocol: "TCP", riskContribution: 0.09 },
];

export const explainabilityService = {
  getContributions: () => CONTRIBUTIONS,
  getDrivingFlows: () => DRIVING_FLOWS,
  getBaseline: () => ({ baseValue: 0.12, predicted: 0.76, method: "SHAP-style attribution (demo values)" }),
  getNarrative: () =>
    "The forecast is dominated by a high SYN-flag rate spread across 214 distinct destination ports from a single external host, a signature the world model associates with reconnaissance preceding initial access. Short flow durations and elevated TTL variance reinforce the scanning pattern.",
};
