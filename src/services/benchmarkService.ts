import type { BenchmarkRow } from "./types";

const ROWS: BenchmarkRow[] = [
  { metric: "Precision", baseline: 0.79, worldModel: 0.91 },
  { metric: "Recall", baseline: 0.71, worldModel: 0.88 },
  { metric: "F1 Score", baseline: 0.748, worldModel: 0.895 },
  { metric: "False Positive Rate", baseline: 0.14, worldModel: 0.06, lowerIsBetter: true },
];

export const benchmarkService = {
  getRows: () => ROWS,
  getChartData: () =>
    ROWS.map((r) => ({
      metric: r.metric,
      "Logistic Regression": Math.round(r.baseline * 1000) / 10,
      "AI World Model": Math.round(r.worldModel * 1000) / 10,
      lowerIsBetter: Boolean(r.lowerIsBetter),
    })),
  getSetup: () => ({
    dataset: "CIC-IDS-2018 (held-out day) + CTU-13 scenario 9",
    split: "70 / 15 / 15 train-validation-test, time-ordered",
    note: "The baseline and proposed model are evaluated using the same dataset and evaluation metrics.",
    disclaimer: "Illustrative Demo Results — not actual experimental measurements.",
  }),
};
