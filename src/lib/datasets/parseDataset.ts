import type {
  FlowRecord,
  GraphEdge,
  GraphNode,
  NetworkStateVector,
  TrafficSummary,
} from "@/services/types";

export type DatasetFormat = "cic-ids" | "ctu-13" | "unknown";

export interface ParsedFlow extends FlowRecord {
  epoch: number | null;
  srcPort: number;
  synCount: number;
}

export interface ParsedDataset {
  fileName: string;
  fileType: string;
  format: DatasetFormat;
  hasAddresses: boolean;
  rowsRead: number;
  rowsParsed: number;
  rowsSkipped: number;
  truncated: boolean;
  labelCounts: { label: string; count: number }[];
  columns: string[];
  flows: ParsedFlow[];
  summary: TrafficSummary;
  throughput: { window: string; packets: number; flaggedFlows: number }[];
  stateVector: NetworkStateVector;
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
}

export const MAX_ROWS = 120_000;

/* ------------------------------- CSV parsing ------------------------------ */

function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else quoted = false;
      } else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((v) => v.trim());
}

const norm = (s: string) => s.toLowerCase().replace(/[\s_./-]/g, "");

/* ------------------------------ field helpers ----------------------------- */

const ALIASES = {
  timestamp: ["timestamp", "starttime", "flowstarttime", "date", "stime"],
  srcIp: ["srcip", "sourceip", "srcaddr", "sourceaddress", "src"],
  dstIp: ["dstip", "destinationip", "dstaddr", "destinationaddress", "dst"],
  srcPort: ["srcport", "sourceport", "sport"],
  dstPort: ["dstport", "destinationport", "dport", "port"],
  protocol: ["protocol", "proto"],
  duration: ["flowduration", "duration", "dur"],
  fwdPkts: ["totfwdpkts", "totalfwdpackets", "totalfwdpacket", "srcpkts", "spkts"],
  bwdPkts: ["totbwdpkts", "totalbackwardpackets", "dstpkts", "dpkts"],
  totPkts: ["totpkts", "totalpackets", "packets"],
  fwdBytes: ["totlenfwdpkts", "totallengthoffwdpackets", "srcbytes", "sbytes"],
  bwdBytes: ["totlenbwdpkts", "totallengthofbwdpackets", "dstbytes", "dbytes"],
  totBytes: ["totbytes", "totallength", "bytes"],
  syn: ["synflagcnt", "synflagcount", "fwdpshflags"],
  ack: ["ackflagcnt", "ackflagcount"],
  psh: ["pshflagcnt", "pshflagcount"],
  fin: ["finflagcnt", "finflagcount"],
  rst: ["rstflagcnt", "rstflagcount"],
  state: ["state", "dir"],
  label: ["label", "attack", "attackcategory", "class"],
  iatMean: ["flowiatmean", "fwdiatmean"],
  initWin: ["initfwdwinbyts", "initwinbytesforward"],
  ttl: ["ttl", "sttl", "dttl"],
} as const;

type FieldKey = keyof typeof ALIASES;

function buildIndex(header: string[]): Partial<Record<FieldKey, number>> {
  const normed = header.map(norm);
  const idx: Partial<Record<FieldKey, number>> = {};
  for (const key of Object.keys(ALIASES) as FieldKey[]) {
    for (const alias of ALIASES[key]) {
      const at = normed.indexOf(alias);
      if (at !== -1) {
        idx[key] = at;
        break;
      }
    }
  }
  return idx;
}

const num = (v: string | undefined): number => {
  if (!v) return 0;
  const n = Number(v.replace(/[^0-9.eE+-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const PROTO_NUM: Record<string, string> = { "6": "TCP", "17": "UDP", "1": "ICMP", "0": "HOPOPT" };

function protocolOf(raw: string | undefined): string {
  if (!raw) return "Other";
  const v = raw.trim();
  if (/^\d+$/.test(v)) return PROTO_NUM[v] ?? `IP/${v}`;
  return v.toUpperCase();
}

function labelOf(raw: string | undefined): FlowRecord["label"] {
  const v = (raw ?? "").toLowerCase();
  if (!v) return "Benign";
  if (v.includes("benign") || v.includes("normal")) return "Benign";
  if (v.includes("background")) return "Suspicious";
  if (v.includes("attempt") || v.includes("probe") || v.includes("scan")) return "Suspicious";
  return "Malicious";
}

function parseTime(raw: string | undefined): number | null {
  if (!raw) return null;
  const v = raw.trim();
  if (/^\d{4}[/-]/.test(v)) {
    const t = Date.parse(v.replace(/\//g, "-").replace(" ", "T") + "Z");
    return Number.isFinite(t) ? t : null;
  }
  // CIC style: dd/MM/yyyy HH:mm:ss (optional AM/PM)
  const m = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (m) {
    let hour = Number(m[4]);
    const mer = m[7]?.toUpperCase();
    if (mer === "PM" && hour < 12) hour += 12;
    if (mer === "AM" && hour === 12) hour = 0;
    const year = Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]);
    return Date.UTC(year, Number(m[2]) - 1, Number(m[1]), hour, Number(m[5]), Number(m[6] ?? 0));
  }
  const epoch = Number(v);
  if (Number.isFinite(epoch) && epoch > 1_000_000_000) return epoch < 1e12 ? epoch * 1000 : epoch;
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : null;
}

const clock = (epoch: number | null, fallback: string) => {
  if (epoch === null) return fallback;
  const d = new Date(epoch);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}.${p(d.getUTCMilliseconds(), 3)}`;
};

const isPrivate = (ip: string) =>
  /^10\./.test(ip) ||
  /^192\.168\./.test(ip) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
  /^127\./.test(ip) ||
  /^169\.254\./.test(ip) ||
  /^fe80:/i.test(ip);

function humanBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 || i === 0 ? 0 : 2)} ${units[i]}`;
}

function detectFormat(header: string[]): DatasetFormat {
  const n = header.map(norm);
  if (n.includes("srcaddr") && n.includes("totpkts")) return "ctu-13";
  if (n.some((h) => h === "flowduration") || n.includes("totfwdpkts") || n.includes("totalfwdpackets"))
    return "cic-ids";
  if (n.includes("dstport") && n.includes("label")) return "cic-ids";
  return "unknown";
}

/* ------------------------------- main parser ------------------------------ */

export function parseDatasetText(fileName: string, text: string): ParsedDataset {
  const lines = text.split(/\r?\n/);
  let headerAt = 0;
  while (headerAt < lines.length && lines[headerAt]!.trim() === "") headerAt++;
  const header = splitLine(lines[headerAt] ?? "");
  const format = detectFormat(header);
  if (format === "unknown") {
    throw new Error(
      "Unrecognised columns. Expected a CIC-IDS-2018 flow CSV or a CTU-13 .binetflow / .csv export.",
    );
  }
  const idx = buildIndex(header);
  const flows: ParsedFlow[] = [];
  const labelCounts = new Map<string, number>();
  let rowsRead = 0;
  let rowsSkipped = 0;
  let truncated = false;

  for (let i = headerAt + 1; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw || raw.trim() === "") continue;
    rowsRead++;
    if (flows.length >= MAX_ROWS) {
      truncated = true;
      break;
    }
    const cells = splitLine(raw);
    if (cells.length < 4 || norm(cells[0] ?? "") === norm(header[0] ?? "")) {
      rowsSkipped++;
      continue;
    }
    const at = (k: FieldKey) => (idx[k] === undefined ? undefined : cells[idx[k]!]);

    const pkts =
      num(at("totPkts")) || num(at("fwdPkts")) + num(at("bwdPkts")) || 0;
    const bytes = num(at("totBytes")) || num(at("fwdBytes")) + num(at("bwdBytes")) || 0;
    let duration = num(at("duration"));
    if (format === "cic-ids") duration = duration / 1_000_000; // microseconds
    const epoch = parseTime(at("timestamp"));
    const rawLabel = (at("label") ?? "").trim() || "Unlabelled";
    labelCounts.set(rawLabel, (labelCounts.get(rawLabel) ?? 0) + 1);

    if (pkts === 0 && bytes === 0) {
      rowsSkipped++;
      continue;
    }

    const synCount = num(at("syn"));
    const flagParts: string[] = [];
    if (format === "ctu-13") {
      const st = (at("state") ?? "").trim();
      if (st) flagParts.push(st);
    } else {
      if (synCount > 0) flagParts.push("SYN");
      if (num(at("ack")) > 0) flagParts.push("ACK");
      if (num(at("psh")) > 0) flagParts.push("PSH");
      if (num(at("fin")) > 0) flagParts.push("FIN");
      if (num(at("rst")) > 0) flagParts.push("RST");
    }

    flows.push({
      timestamp: clock(epoch, at("timestamp") ?? "—"),
      epoch,
      source: (at("srcIp") ?? "—").trim() || "—",
      destination: (at("dstIp") ?? "—").trim() || "—",
      protocol: protocolOf(at("protocol")),
      port: Math.round(num(at("dstPort"))),
      srcPort: Math.round(num(at("srcPort"))),
      packets: Math.round(pkts),
      bytes: Math.round(bytes),
      duration: Number.isFinite(duration) ? duration : 0,
      flags: flagParts.join(",") || "—",
      label: labelOf(rawLabel),
      synCount,
    });
  }

  if (flows.length === 0) throw new Error("No usable flow rows found in this file.");

  const hasAddresses = flows.some((f) => f.source !== "—" && f.destination !== "—");
  const summary = buildSummary(fileName, format, flows);

  return {
    fileName,
    fileType:
      format === "ctu-13"
        ? "CTU-13 Argus bidirectional NetFlow export"
        : "CIC-IDS-2018 labelled flow CSV",
    format,
    hasAddresses,
    rowsRead,
    rowsParsed: flows.length,
    rowsSkipped,
    truncated,
    labelCounts: [...labelCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    columns: header,
    flows,
    summary,
    throughput: buildThroughput(flows),
    stateVector: buildStateVector(flows),
    graph: buildGraph(flows),
  };
}

/* ------------------------------- derivations ------------------------------ */

function timeRangeOf(flows: ParsedFlow[]) {
  const stamps = flows.map((f) => f.epoch).filter((e): e is number => e !== null);
  if (stamps.length === 0) return { min: null, max: null };
  return { min: Math.min(...stamps), max: Math.max(...stamps) };
}

function buildSummary(fileName: string, format: DatasetFormat, flows: ParsedFlow[]): TrafficSummary {
  const packets = flows.reduce((s, f) => s + f.packets, 0);
  const bytes = flows.reduce((s, f) => s + f.bytes, 0);
  const { min, max } = timeRangeOf(flows);
  const range =
    min !== null && max !== null
      ? `${clock(min, "—").slice(0, 8)} → ${clock(max, "—").slice(0, 8)} UTC (${Math.max(1, Math.round((max - min) / 60000))} min)`
      : "no parsable timestamps";

  const byProto = new Map<string, number>();
  for (const f of flows) byProto.set(f.protocol, (byProto.get(f.protocol) ?? 0) + 1);
  const ranked = [...byProto.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, 3);
  const restCount = ranked.slice(3).reduce((s, [, c]) => s + c, 0);
  const protocols = top.map(([name, count]) => ({
    name,
    share: Math.round((count / flows.length) * 100),
  }));
  if (restCount > 0)
    protocols.push({ name: "Other", share: Math.round((restCount / flows.length) * 100) });

  return {
    fileName,
    fileType: format === "ctu-13" ? "CTU-13 (.binetflow)" : "CIC-IDS-2018 (.csv)",
    flows: flows.length,
    timeRange: range,
    packets,
    bytes: humanBytes(bytes),
    protocols,
  };
}

function buildThroughput(flows: ParsedFlow[]) {
  const { min } = timeRangeOf(flows);
  const buckets = new Map<number, { packets: number; flaggedFlows: number }>();
  const ordered = flows;
  ordered.forEach((f, i) => {
    const key =
      min !== null && f.epoch !== null
        ? Math.floor((f.epoch - min) / 60_000)
        : Math.floor(i / Math.max(1, Math.ceil(flows.length / 12)));
    const b = buckets.get(key) ?? { packets: 0, flaggedFlows: 0 };
    b.packets += f.packets;
    if (f.label !== "Benign") b.flaggedFlows++;
    buckets.set(key, b);
  });
  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(0, 24)
    .map(([k, v]) => ({ window: `W${k + 1}`, ...v }));
}

const cap = (v: number, max: number) => Math.max(0, Math.min(1, v / max));

export function buildStateVector(flows: ParsedFlow[]): NetworkStateVector {
  const { min, max } = timeRangeOf(flows);
  let window = flows;
  let label = `all ${flows.length.toLocaleString()} flows`;
  if (min !== null && max !== null && max > min) {
    const start = Math.max(min, max - 60_000);
    const inWindow = flows.filter((f) => f.epoch !== null && f.epoch >= start);
    if (inWindow.length > 5) {
      window = inWindow;
      label = `${clock(start, "—").slice(0, 8)} → ${clock(max, "—").slice(0, 8)} UTC · last 60s`;
    }
  }

  const seconds = 60;
  const packets = window.reduce((s, f) => s + f.packets, 0);
  const bytes = window.reduce((s, f) => s + f.bytes, 0);
  const synFlows = window.filter((f) => f.synCount > 0 || f.flags.includes("S")).length;
  const meanDuration = window.reduce((s, f) => s + f.duration, 0) / window.length;
  const ports = new Set(window.map((f) => f.port));
  const outbound = window.filter((f) => f.destination !== "—" && !isPrivate(f.destination)).length;
  const inbound = window.filter((f) => f.source !== "—" && !isPrivate(f.source)).length;
  const ioRatio = outbound === 0 ? 0 : inbound / outbound;
  const external = window.filter(
    (f) =>
      (f.source !== "—" && !isPrivate(f.source)) ||
      (f.destination !== "—" && !isPrivate(f.destination)),
  ).length;

  const dstCounts = new Map<string, number>();
  for (const f of window) dstCounts.set(f.destination, (dstCounts.get(f.destination) ?? 0) + 1);
  let entropy = 0;
  for (const c of dstCounts.values()) {
    const p = c / window.length;
    entropy -= p * Math.log2(p);
  }
  const flagged = window.filter((f) => f.label !== "Benign").length / window.length;

  return {
    window: label,
    values: [
      { key: "syn_rate", label: "SYN flow rate", value: +(synFlows / seconds).toFixed(2), normalized: cap(synFlows / seconds, 200) },
      { key: "packet_rate", label: "Packet rate", value: Math.round(packets / seconds), normalized: cap(packets / seconds, 4000) },
      { key: "bytes", label: "Bytes / window", value: bytes, normalized: cap(bytes, 5_000_000) },
      { key: "duration", label: "Mean flow duration", value: +meanDuration.toFixed(2), normalized: cap(meanDuration, 10) },
      { key: "flow_rate", label: "Flows / second", value: +(window.length / seconds).toFixed(2), normalized: cap(window.length / seconds, 300) },
      { key: "port_activity", label: "Distinct dst ports", value: ports.size, normalized: cap(ports.size, 400) },
      { key: "flagged", label: "Flagged flow share", value: +flagged.toFixed(3), normalized: cap(flagged, 1) },
      { key: "io_ratio", label: "Inbound/outbound ratio", value: +ioRatio.toFixed(2), normalized: cap(ioRatio, 5) },
      { key: "entropy", label: "Dst address entropy", value: +entropy.toFixed(2), normalized: cap(entropy, 10) },
      { key: "ext_flows", label: "External flow share", value: +(external / window.length).toFixed(3), normalized: cap(external / window.length, 1) },
    ],
  };
}

export function buildGraph(flows: ParsedFlow[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const withAddr = flows.filter((f) => f.source !== "—" && f.destination !== "—");
  if (withAddr.length === 0) return { nodes: [], edges: [] };

  const hostFlows = new Map<string, { total: number; bad: number }>();
  const bump = (ip: string, bad: boolean) => {
    const h = hostFlows.get(ip) ?? { total: 0, bad: 0 };
    h.total++;
    if (bad) h.bad++;
    hostFlows.set(ip, h);
  };
  const pairs = new Map<string, { from: string; to: string; count: number; bad: number }>();
  for (const f of withAddr) {
    const bad = f.label !== "Benign";
    bump(f.source, bad);
    bump(f.destination, bad);
    const key = `${f.source}>${f.destination}`;
    const p = pairs.get(key) ?? { from: f.source, to: f.destination, count: 0, bad: 0 };
    p.count++;
    if (bad) p.bad++;
    pairs.set(key, p);
  }

  const top = [...hostFlows.entries()]
    .sort((a, b) => b[1].bad - a[1].bad || b[1].total - a[1].total)
    .slice(0, 8);
  const ids = new Set(top.map(([ip]) => ip));

  const cx = 360;
  const cy = 200;
  const nodes: GraphNode[] = top.map(([ip, stat], i) => {
    const angle = (i / top.length) * Math.PI * 2 - Math.PI / 2;
    return {
      id: ip,
      label: ip.length > 21 ? `${ip.slice(0, 19)}…` : ip,
      kind: isPrivate(ip) ? "internal" : "external",
      x: Math.round(cx + Math.cos(angle) * 250),
      y: Math.round(cy + Math.sin(angle) * 130),
      risk: +(stat.bad / stat.total).toFixed(2),
    };
  });

  const maxCount = Math.max(...[...pairs.values()].map((p) => p.count), 1);
  const edges: GraphEdge[] = [...pairs.values()]
    .filter((p) => ids.has(p.from) && ids.has(p.to) && p.from !== p.to)
    .sort((a, b) => b.bad - a.bad || b.count - a.count)
    .slice(0, 14)
    .map((p) => ({
      from: p.from,
      to: p.to,
      volume: Math.max(1, Math.round((p.count / maxCount) * 8)),
      suspicious: p.bad / p.count > 0.3,
    }));

  return { nodes, edges };
}

/* ----------------------------- feature samples ---------------------------- */

export interface FeatureSample {
  name: string;
  unit: string;
  sample: string;
  available: boolean;
}

export function buildFeatureSamples(dataset: ParsedDataset): {
  flow: FeatureSample[];
  packet: FeatureSample[];
} {
  const f = dataset.flows[0]!;
  const cols = dataset.columns.map(norm);
  const has = (key: FieldKey) => ALIASES[key].some((a) => cols.includes(a));
  const s = (v: string | number, ok = true): FeatureSample["sample"] => (ok ? String(v) : "not in export");

  const flow: FeatureSample[] = [
    { name: "Source IP", unit: "categorical / hashed", sample: s(f.source, dataset.hasAddresses), available: dataset.hasAddresses },
    { name: "Destination IP", unit: "categorical / hashed", sample: s(f.destination, dataset.hasAddresses), available: dataset.hasAddresses },
    { name: "Source Port", unit: "0–65535", sample: s(f.srcPort, has("srcPort")), available: has("srcPort") },
    { name: "Destination Port", unit: "0–65535", sample: s(f.port, has("dstPort")), available: has("dstPort") },
    { name: "Protocol", unit: "one-hot", sample: f.protocol, available: true },
    { name: "TCP Flags / State", unit: "bitmask", sample: f.flags, available: f.flags !== "—" },
    { name: "Packets", unit: "count", sample: String(f.packets), available: true },
    { name: "Bytes", unit: "bytes", sample: String(f.bytes), available: true },
    { name: "Flow Duration", unit: "seconds", sample: f.duration.toFixed(4), available: true },
    {
      name: "Inter-arrival Time",
      unit: "µs (mean)",
      sample: s("from Flow IAT Mean", has("iatMean")),
      available: has("iatMean"),
    },
    {
      name: "Inbound/Outbound Ratio",
      unit: "ratio",
      sample: dataset.hasAddresses
        ? String(dataset.stateVector.values.find((v) => v.key === "io_ratio")?.value ?? 0)
        : "not in export",
      available: dataset.hasAddresses,
    },
  ];

  const packet: FeatureSample[] = [
    { name: "TTL", unit: "hops", sample: s("present", has("ttl")), available: has("ttl") },
    { name: "TCP Init Window Size", unit: "bytes", sample: s("present", has("initWin")), available: has("initWin") },
    {
      name: "Mean Payload Size",
      unit: "bytes / packet",
      sample: (f.packets ? f.bytes / f.packets : 0).toFixed(1),
      available: true,
    },
    { name: "Fragmentation", unit: "flag / count", sample: "not in export", available: false },
    { name: "Retransmissions", unit: "count", sample: "not in export", available: false },
    {
      name: "Port Scan Pattern",
      unit: "score 0–1",
      sample: String(
        dataset.stateVector.values.find((v) => v.key === "port_activity")?.normalized ?? 0,
      ),
      available: true,
    },
  ];

  return { flow, packet };
}
