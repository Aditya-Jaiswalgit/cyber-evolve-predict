import type { FlowRecord } from "@/services/types";
import { StatusBadge } from "./StatusBadge";

const TONE = {
  Benign: "success",
  Suspicious: "warning",
  Malicious: "danger",
} as const;

export function TrafficTable({ flows }: { flows: FlowRecord[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
            <th className="px-3 py-2 font-medium">Timestamp</th>
            <th className="px-3 py-2 font-medium">Source</th>
            <th className="px-3 py-2 font-medium">Destination</th>
            <th className="px-3 py-2 font-medium">Protocol</th>
            <th className="px-3 py-2 font-medium">Port</th>
            <th className="px-3 py-2 text-right font-medium">Packets</th>
            <th className="px-3 py-2 text-right font-medium">Bytes</th>
            <th className="px-3 py-2 text-right font-medium">Duration</th>
            <th className="px-3 py-2 font-medium">TCP Flags</th>
            <th className="px-3 py-2 font-medium">Label</th>
          </tr>
        </thead>
        <tbody className="font-mono text-[12.5px]">
          {flows.map((f, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
              <td className="px-3 py-2 text-muted-foreground">{f.timestamp}</td>
              <td className="px-3 py-2">{f.source}</td>
              <td className="px-3 py-2">{f.destination}</td>
              <td className="px-3 py-2">{f.protocol}</td>
              <td className="px-3 py-2">{f.port}</td>
              <td className="px-3 py-2 text-right">{f.packets}</td>
              <td className="px-3 py-2 text-right">{f.bytes.toLocaleString()}</td>
              <td className="px-3 py-2 text-right">{f.duration.toFixed(2)}s</td>
              <td className="px-3 py-2 text-muted-foreground">{f.flags}</td>
              <td className="px-3 py-2">
                <StatusBadge tone={TONE[f.label]}>{f.label}</StatusBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
