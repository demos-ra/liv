// [F-execution-panel/app/execution-panel-workflow.ts]
// R2 — Execution panel orchestration.
// Execution panel is a read-only display slice: results are written to the
// execution_panel namespace by F-la-config/app/la-runner after each LA run.
// This slice reads via useExecutionPanel hook — it owns no writes.
// Reserved for future: triggering manual re-runs, dismissing results.

export {}
