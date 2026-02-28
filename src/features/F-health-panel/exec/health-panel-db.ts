// [F-health-panel/exec/health-panel-db.ts]
// R4 — Health panel I/O.
// Violations are persisted by F-la-config/exec/la-results-db (owner of that I/O channel).
// This slice has no owned DB tables — it reads via namespace registry.
// Reserved for future: violation history, resolution tracking.

export {}
