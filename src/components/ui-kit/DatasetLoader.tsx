import { FileUp, Loader2, RotateCcw, TriangleAlert } from "lucide-react";
import { useRef } from "react";
import { datasetStore, MAX_ROWS, useDatasetState } from "@/lib/datasets/datasetStore";
import { StatusBadge } from "./StatusBadge";

export function DatasetLoader() {
  const { status, dataset, error } = useDatasetState();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold text-foreground">Dataset loader</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Load a real capture file: CIC-IDS-2018 labelled flow CSV, or a CTU-13 Argus{" "}
            <span className="font-mono">.binetflow</span> export. Parsing runs locally in your
            browser — first {MAX_ROWS.toLocaleString()} flow rows are used.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dataset ? (
            <StatusBadge tone="success">Real data</StatusBadge>
          ) : (
            <StatusBadge tone="demo">Demo data</StatusBadge>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
          >
            {status === "loading" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <FileUp className="size-3.5" />
            )}
            {status === "loading" ? "Parsing…" : "Load dataset file"}
          </button>
          {dataset ? (
            <button
              type="button"
              onClick={() => datasetStore.clear()}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="size-3.5" /> Back to demo
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.binetflow,.txt,.tsv,text/csv,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void datasetStore.loadFile(file);
          e.target.value = "";
        }}
      />

      {error ? (
        <p className="mt-3 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}

      {dataset ? (
        <div className="mt-4 space-y-3">
          <dl className="grid gap-3 text-xs sm:grid-cols-2 xl:grid-cols-4">
            {[
              { k: "File", v: dataset.fileName },
              { k: "Detected format", v: dataset.fileType },
              {
                k: "Rows parsed",
                v: `${dataset.rowsParsed.toLocaleString()} of ${dataset.rowsRead.toLocaleString()}${dataset.truncated ? " (truncated)" : ""}`,
              },
              {
                k: "Rows skipped",
                v: `${dataset.rowsSkipped.toLocaleString()} (empty / repeated headers)`,
              },
            ].map((row) => (
              <div key={row.k} className="rounded-md border border-border p-3">
                <dt className="tracking-wide text-muted-foreground uppercase">{row.k}</dt>
                <dd className="mt-1 font-mono text-[12.5px] break-words text-foreground">{row.v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-2">
            {dataset.labelCounts.map((l) => (
              <span
                key={l.label}
                className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {l.label}: {l.count.toLocaleString()}
              </span>
            ))}
          </div>
          {!dataset.hasAddresses ? (
            <p className="text-xs text-warning">
              This export has no source/destination address columns, so host-graph and
              inbound/outbound features are unavailable for it.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
