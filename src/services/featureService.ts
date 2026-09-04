import type {
  FeatureDefinition,
  GraphEdge,
  GraphNode,
  NetworkStateVector,
} from "./types";

const FLOW_FEATURES: FeatureDefinition[] = [
  { name: "Source IP", unit: "categorical / hashed", sample: "203.0.113.42" },
  { name: "Destination IP", unit: "categorical / hashed", sample: "10.0.14.7" },
  { name: "Source Port", unit: "0–65535", sample: "51422" },
  { name: "Destination Port", unit: "0–65535", sample: "445" },
  { name: "Protocol", unit: "one-hot", sample: "TCP" },
  { name: "TCP Flags", unit: "bitmask", sample: "SYN" },
  { name: "Packets", unit: "count", sample: "5" },
  { name: "Bytes", unit: "bytes", sample: "330" },
  { name: "Flow Duration", unit: "seconds", sample: "0.06" },
  { name: "Inter-arrival Time", unit: "ms (mean/std)", sample: "12.4 / 3.1" },
  { name: "Inbound/Outbound Ratio", unit: "ratio", sample: "0.18" },
];

const PACKET_FEATURES: FeatureDefinition[] = [
  { name: "TTL", unit: "hops", sample: "54 (var 11.2)" },
  { name: "TCP Window Size", unit: "bytes", sample: "8192" },
  { name: "Payload Size", unit: "bytes (mean)", sample: "62" },
  { name: "Fragmentation", unit: "flag / count", sample: "0" },
  { name: "Retransmissions", unit: "count", sample: "7" },
  { name: "Port Scan Pattern", unit: "score 0–1", sample: "0.87" },
];

const PIPELINE = [
  { name: "Raw Traffic", detail: "PCAP / NetFlow records read packet by packet" },
  { name: "Parsing", detail: "Layer 2–4 header decoding, flow reassembly by 5-tuple" },
  { name: "Feature Extraction", detail: "Flow-level and packet-level statistics computed" },
  { name: "Normalization", detail: "Z-score for continuous, one-hot for categorical" },
  { name: "Timestamp Alignment", detail: "Clock skew correction, monotonic ordering" },
  { name: "Time Windows", detail: "Fixed 60s sliding windows, 30s stride" },
];

const STATE_VECTOR: NetworkStateVector = {
  window: "W-08 · 09:19:04 → 09:20:04 UTC",
  values: [
    { key: "syn_rate", label: "SYN rate", value: 148.2, normalized: 0.91 },
    { key: "packet_rate", label: "Packet rate", value: 2410, normalized: 0.64 },
    { key: "bytes", label: "Bytes / window", value: 1_842_000, normalized: 0.57 },
    { key: "duration", label: "Mean flow duration", value: 0.42, normalized: 0.21 },
    { key: "ttl_var", label: "TTL variance", value: 11.2, normalized: 0.73 },
    { key: "port_activity", label: "Distinct dst ports", value: 214, normalized: 0.88 },
    { key: "retrans", label: "Retransmission ratio", value: 0.09, normalized: 0.34 },
    { key: "io_ratio", label: "Inbound/outbound ratio", value: 0.18, normalized: 0.28 },
    { key: "entropy", label: "Dst IP entropy", value: 3.71, normalized: 0.66 },
    { key: "ext_flows", label: "External flow share", value: 0.31, normalized: 0.44 },
  ],
};

const NODES: GraphNode[] = [
  { id: "ext1", label: "203.0.113.42", kind: "external", x: 90, y: 170, risk: 0.92 },
  { id: "ext2", label: "198.51.100.77", kind: "external", x: 640, y: 260, risk: 0.81 },
  { id: "h7", label: "10.0.14.7", kind: "internal", x: 280, y: 90, risk: 0.74 },
  { id: "h21", label: "10.0.14.21", kind: "internal", x: 420, y: 160, risk: 0.58 },
  { id: "h9", label: "10.0.14.9", kind: "internal", x: 470, y: 300, risk: 0.66 },
  { id: "h12", label: "10.0.14.12", kind: "internal", x: 250, y: 300, risk: 0.14 },
  { id: "gw", label: "10.0.14.2:53", kind: "service", x: 130, y: 320, risk: 0.08 },
];

const EDGES: GraphEdge[] = [
  { from: "ext1", to: "h7", volume: 9, suspicious: true },
  { from: "h7", to: "h21", volume: 6, suspicious: true },
  { from: "h21", to: "h9", volume: 4, suspicious: true },
  { from: "h9", to: "ext2", volume: 10, suspicious: true },
  { from: "h12", to: "gw", volume: 2, suspicious: false },
  { from: "h7", to: "gw", volume: 3, suspicious: false },
  { from: "h12", to: "h21", volume: 2, suspicious: false },
];

export const featureService = {
  getFlowFeatures: () => FLOW_FEATURES,
  getPacketFeatures: () => PACKET_FEATURES,
  getPreprocessingPipeline: () => PIPELINE,
  getStateVector: () => STATE_VECTOR,
  getGraph: () => ({ nodes: NODES, edges: EDGES }),
};
