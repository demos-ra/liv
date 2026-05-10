// @liv-standard v1.3 amended sprint-13-shot-2
// [F-executor/contract/executor-contract.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    sprint-13-shot-2 (manifest: F-planner consumer refs updated to F-builder — dissolution)
// slice:      F-executor
// layer:      R3
// wires-in:
//   W-ATOM  ExecutionJob     ../types/executor-types
//   W-ATOM  ExecutionResult  ../types/executor-types
//   W-ATOM  ExecutorResult   ../types/executor-types
//   W-FN    ioRunExecution   ../app/executor-io
// wires-out:
//   W-FN  runExecution  →  F-builder/R3 (builder-contract, via IExecutor W-INJECT bridge)
// deps:
//   R0  ../types/executor-types
//   R4  ../app/executor-io      (A2-w-inject-bridge — see below)
// validated:  2026-03-13
//
// Step 3 (A5):
//   This is the ONLY file in F-executor that any other slice may import.
//   F-builder reaches F-executor exclusively through runExecution() here.
//   No other slice imports F-executor internals (types/, domain/, app/).
//   The W-INJECT bridge in F-builder/contract/builder-contract.ts wraps
//   runExecution() into an IExecutor interface shape — F-executor never
//   depends on F-builder.
//
// A2-w-inject-bridge amendment (mirrors F-builder builder-contract.ts):
//   R3 contract files may import R4 solely to expose the I/O function at
//   the contract surface. No R4 type crosses the boundary. Pattern is
//   identical to the established codebase convention.
//
// Axiom cite:
//   A5 — event/contract bus only for cross-slice runtime communication.
//        runExecution() is the declared contract surface of F-executor.
//   A2 — R4 import is the A2-w-inject-bridge structural exception,
//        documented and auditable per codebase convention.

import { ioRunExecution }  from '../app/executor-io'
import type {
  ExecutionJob,
  ExecutionResult,
  ExecutorResult,
} from '../types/executor-types'

// ── runExecution — sole public surface of F-executor ─────────────────────────
// Accepts a typed ExecutionJob, returns ExecutorResult<ExecutionResult>.
// Callers never import executor-io, executor-logic, or executor-types directly.

export async function runExecution(
  job: ExecutionJob,
): Promise<ExecutorResult<ExecutionResult>> {
  return ioRunExecution(job)
}

// Re-export R0 atoms so callers import from one place — no internal path leakage.
export type { ExecutionJob, ExecutionResult, ExecutorResult } from '../types/executor-types'
