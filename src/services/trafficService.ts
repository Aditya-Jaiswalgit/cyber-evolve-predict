import type { DatasetInfo, FlowRecord, TrafficSummary } from "./types";

const DEMO_SUMMARY: TrafficSummary = {
  fileName: "cicids2018_thursday_subset.pcap",
  fileType: "PCAP (libpcap, Ethernet)",
  flows: 18432,
  timeRange: "09:12:04 → 09:42:04 UTC (30 min)",
  packets: 1284561,
  bytes: "1.42 GB",
  protocols: [
    { name: "TCP", share: 71 },
    { name: "UDP", share: 19 },
    { name: "ICMP", share: 6 },
    { name: "Other", share: 4 },
  ],
};

const DEMO_FLOWS: FlowRecord[] = [
  {
    timestamp: "09:12:04.118",
    source: "203.0.113.42",
    destination: "10.0.14.7",
    protocol: "TCP",
    port: 22,
    packets: 6,
    bytes: 412,
    duration: 0.08,
    flags: "SYN",
    label: "Suspicious",
  },
  {
    timestamp: "09:12:04.219",
    source: "203.0.113.42",
    destination: "10.0.14.7",
    protocol: "TCP",
    port: 80,
    packets: 4,
    bytes: 264,
    duration: 0.05,
    flags: "SYN",
    label: "Suspicious",
  },
  {
    timestamp: "09:12:05.442",
    source: "203.0.113.42",
    destination: "10.0.14.7",
    protocol: "TCP",
    port: 445,
    packets: 5,
    bytes: 330,
    duration: 0.06,
    flags: "SYN",
    label: "Malicious",
  },
  {
    timestamp: "09:13:11.005",
    source: "10.0.14.7",
    destination: "10.0.14.21",
    protocol: "TCP",
    port: 3389,
    packets: 148,
    bytes: 92310,
    duration: 12.4,
    flags: "SYN,ACK,PSH",
    label: "Suspicious",
  },
  {
    timestamp: "09:13:48.671",
    source: "10.0.14.21",
    destination: "10.0.14.9",
    protocol: "TCP",
    port: 139,
    packets: 74,
    bytes: 41208,
    duration: 8.1,
    flags: "ACK,PSH",
    label: "Suspicious",
  },
  {
    timestamp: "09:14:02.310",
    source: "10.0.14.9",
    destination: "198.51.100.77",
    protocol: "TCP",
    port: 8443,
    packets: 310,
    bytes: 184922,
    duration: 41.2,
    flags: "ACK,PSH",
    label: "Malicious",
  },
  {
    timestamp: "09:14:19.882",
    source: "10.0.14.5",
    destination: "10.0.14.2",
    protocol: "UDP",
    port: 53,
    packets: 12,
    bytes: 1840,
    duration: 0.4,
    flags: "—",
    label: "Benign",
  },
  {
    timestamp: "09:15:07.441",
    source: "10.0.14.12",
    destination: "10.0.14.2",
    protocol: "TCP",
    port: 443,
    packets: 96,
    bytes: 74210,
    duration: 6.3,
    flags: "ACK,PSH,FIN",
    label: "Benign",
  },
  {
    timestamp: "09:16:33.019",
    source: "203.0.113.42",
    destination: "10.0.14.7",
    protocol: "TCP",
    port: 3306,
    packets: 5,
    bytes: 318,
    duration: 0.05,
    flags: "SYN",
    label: "Suspicious",
  },
  {
    timestamp: "09:17:52.774",
    source: "10.0.14.9",
    destination: "198.51.100.77",
    protocol: "TCP",
    port: 443,
    packets: 512,
    bytes: 402118,
    duration: 88.6,
    flags: "ACK,PSH",
    label: "Malicious",
  },
];

const DATASETS: DatasetInfo[] = [
  {
    name: "CIC-IDS-2018",
    purpose: "Network intrusion traffic with labelled multi-stage attack scenarios",
    trafficType: "Benign enterprise traffic, brute force, infiltration, DoS, web attacks",
    flows: "~16M labelled flows",
  },
  {
    name: "CTU-13",
    purpose: "Botnet behaviour analysis against a background of normal traffic",
    trafficType: "Botnet command & control, normal and background traffic",
    flows: "13 capture scenarios",
  },
];

export const trafficService = {
  getSummary(): TrafficSummary {
    return DEMO_SUMMARY;
  },
  getFlows(): FlowRecord[] {
    return DEMO_FLOWS;
  },
  getDatasets(): DatasetInfo[] {
    return DATASETS;
  },
  getThroughput() {
    return Array.from({ length: 12 }, (_, i) => ({
      window: `W${i + 1}`,
      packets: 82000 + Math.round(Math.sin(i / 1.7) * 18000) + i * 2400,
      flaggedFlows: 40 + Math.round(i * i * 0.9),
    }));
  },
  /** Simulated pipeline run. Replace with a call to the Python backend. */
  async runAnalysis(source: string): Promise<{ source: string; simulated: boolean; startedAt: string }> {
    await new Promise((r) => setTimeout(r, 1200));
    return { source, simulated: true, startedAt: new Date().toISOString() };
  },
};
