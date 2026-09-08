import { useSyncExternalStore } from "react";
import { MAX_ROWS, parseDatasetText, type ParsedDataset } from "./parseDataset";

export interface DatasetState {
  status: "idle" | "loading" | "ready" | "error";
  dataset: ParsedDataset | null;
  error: string | null;
  loadedAt: string | null;
}

let state: DatasetState = { status: "idle", dataset: null, error: null, loadedAt: null };
const listeners = new Set<() => void>();

function set(next: Partial<DatasetState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useDatasetState(): DatasetState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

export const datasetStore = {
  get: () => state,
  clear: () => set({ status: "idle", dataset: null, error: null, loadedAt: null }),
  async loadFile(file: File) {
    set({ status: "loading", error: null });
    try {
      const text = await file.text();
      const dataset = parseDatasetText(file.name, text);
      set({ status: "ready", dataset, error: null, loadedAt: new Date().toISOString() });
      return dataset;
    } catch (err) {
      set({
        status: "error",
        dataset: null,
        error: err instanceof Error ? err.message : "Could not read this file.",
      });
      return null;
    }
  },
};

export { MAX_ROWS };
export type { ParsedDataset };
