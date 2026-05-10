// @liv-standard v1.3 amended sprint-13-shot-2
// [F-executor/types/executor-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-executor
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  ExecutionFile    →  F-executor/R4, F-executor/R3, F-builder/R2
//   W-ATOM  ExecutionJob     →  F-executor/R1, F-executor/R4, F-executor/R3, F-builder/R2
//   W-ATOM  TestSummary      →  F-executor/R1, F-executor/R3, F-builder/R2
//   W-ATOM  ExecutionResult  →  F-executor/R1, F-executor/R4, F-executor/R3, F-builder/R2
//   W-ATOM  ExecutorResult   →  F-executor/R3, F-builder/R2
//   W-ATOM  EXECUTOR_CONST   →  F-executor/R4
// deps:       none
// validated:  2026-03-13
//
// Step 3 (A6):
//   All F-executor atoms declared here at R0. ExecutionFile uses plain typed
//   fields — no cross-slice type import needed (A3). ExecutionResult is the
//   typed output boundary consumed by F-builder via IExecutor interface.
//   Axiom cite: A6 — declare at R0 of owner.

// ── Input atoms ───────────────────────────────────────────────────────────────
// Plain typed pair — no OutputFile import required. A3: atoms only cross slice lines.
export type ExecutionFile = {
  path:    string   // relative, e.g. "src/features/F-foo/types/foo-types.ts"
  content: string   // utf8 source text
}

export type ExecutionJob = {
  jobId:     string           // PlannerJobId passed as plain string (A3)
  projectId: string
  files:     ExecutionFile[]
  timeoutMs: number           // hard ceiling — caller sets, R4 enforces
}

// ── Output atoms ──────────────────────────────────────────────────────────────

export type TestSummary = {
  total:   number
  passed:  number
  failed:  number
  skipped: number
}

export type ExecutionResult = {
  jobId:       string
  exitCode:    number
  passed:      boolean              // exitCode === 0
  stdout:      string               // truncated to EXECUTOR_CONST.MAX_OUTPUT_BYTES
  stderr:      string               // truncated to EXECUTOR_CONST.MAX_OUTPUT_BYTES
  testSummary: TestSummary | null   // null if no test runner output detected
  durationMs:  number
  timedOut:    boolean
}

// ── Scoped result alias — shape matches core Result<T> ────────────────────────
export type ExecutorResult<T> =
  | { ok: true;  data: T }
  | { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } }

// ── Constants ─────────────────────────────────────────────────────────────────
export const EXECUTOR_CONST = {
  DEFAULT_TIMEOUT_MS: 120_000,           // 120 s — matches handoff spec
  MAX_OUTPUT_BYTES:   256_000,           // 256 KB per stream — prevents log floods
  DOCKER_IMAGE:       'node:20-alpine',  // pinned — no floating tags
  WORK_DIR:           '/app',            // inside container
  RUN_CMD:            'sh -c "npm install --prefer-offline --no-audit && npm test"',
  CONTAINER_PREFIX:   'liv-exec-',       // prefix for container names
} as const
