// @liv-standard v1.3
// [F-executor/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-executor.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   (none — F-executor has zero cross-slice imports)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    runExecution()         →  F-planner/R3 (planner-inject)
//   W-ATOM  ExecutionJob           →  re-exported via F-executor/R3 (executor-contract)
//   W-ATOM  ExecutionResult        →  re-exported via F-executor/R3 (executor-contract)
//   W-ATOM  ExecutorResult         →  re-exported via F-executor/R3 (executor-contract)

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none)
