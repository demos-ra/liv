// @liv-standard v1.3
// [F-executor/domain/executor-logic.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-executor
// layer:      R1
// wires-in:
//   W-ATOM  TestSummary  ../types/executor-types
// wires-out:
//   W-FN  parseTestSummary   →  F-executor/R4 (executor-io.ts)
//   W-FN  classifyExitCode   →  available for future use (not yet wired)
//   W-FN  truncateOutput     →  F-executor/R4 (executor-io.ts)
// deps:
//   R0  ../types/executor-types
// validated:  2026-03-13
//
// Step 3 (A2): R1 — pure functions only. No I/O, no imports beyond R0.
// Axiom cite: A2 — directional deps, lower layers only.

import type { TestSummary } from '../types/executor-types'

// ── parseTestSummary ──────────────────────────────────────────────────────────
// Detects Jest / Node test runner / Mocha / Vitest summary lines in stdout.
// Returns null if no recognizable summary found — caller treats as unknown.
// Pure: no side effects, deterministic on input.

const JEST_RE    = /Tests:\s+(?:(\d+) failed,\s*)?(?:(\d+) skipped,\s*)?(\d+) passed,\s*(\d+) total/
const NODE_RE    = /# fail\s+(\d+)|# pass\s+(\d+)|# skip\s+(\d+)/g

export function parseTestSummary(stdout: string): TestSummary | null {
  // Jest format: "Tests: 2 failed, 1 skipped, 10 passed, 13 total"
  const jestMatch = JEST_RE.exec(stdout)
  if (jestMatch) {
    const failed  = parseInt(jestMatch[1] ?? '0', 10)
    const skipped = parseInt(jestMatch[2] ?? '0', 10)
    const passed  = parseInt(jestMatch[3] ?? '0', 10)
    const total   = parseInt(jestMatch[4] ?? '0', 10)
    return { total, passed, failed, skipped }
  }

  // Node built-in test runner (node:test) TAP format
  // Emits "# pass N", "# fail N", "# skip N" lines
  const nodeMatches = [...stdout.matchAll(NODE_RE)]
  if (nodeMatches.length > 0) {
    let passed = 0, failed = 0, skipped = 0
    for (const m of nodeMatches) {
      if (m[0].startsWith('# fail'))  failed  = parseInt(m[1], 10)
      if (m[0].startsWith('# pass'))  passed  = parseInt(m[2], 10)
      if (m[0].startsWith('# skip'))  skipped = parseInt(m[3], 10)
    }
    return { total: passed + failed + skipped, passed, failed, skipped }
  }

  // Mocha format: "N passing" / "N failing" / "N pending"
  const mochaPass = /(\d+) passing/.exec(stdout)
  const mochaFail = /(\d+) failing/.exec(stdout)
  const mochaPend = /(\d+) pending/.exec(stdout)
  if (mochaPass) {
    const passed  = parseInt(mochaPass[1], 10)
    const failed  = mochaFail ? parseInt(mochaFail[1], 10) : 0
    const skipped = mochaPend ? parseInt(mochaPend[1], 10) : 0
    return { total: passed + failed + skipped, passed, failed, skipped }
  }

  return null
}

// ── classifyExitCode ──────────────────────────────────────────────────────────
// Maps Docker exit codes to human-readable strings for StageLogEntry.message.

export function classifyExitCode(code: number, timedOut: boolean): string {
  if (timedOut)    return 'TIMEOUT — execution exceeded time limit'
  if (code === 0)  return 'PASS — all tests passed'
  if (code === 1)  return 'FAIL — test suite reported failures'
  if (code === 137) return 'OOM — container killed (out of memory)'
  if (code === 125) return 'DOCKER_ERROR — container failed to start'
  if (code === 126) return 'PERMISSION_ERROR — command not executable'
  if (code === 127) return 'NOT_FOUND — command not found in container'
  return `EXIT_${code} — process exited with code ${code}`
}

// ── truncateOutput ────────────────────────────────────────────────────────────
// Caps output length. Appends a truncation notice if cut.
// maxBytes is a byte ceiling applied to utf8 encoding length.

export function truncateOutput(output: string, maxBytes: number): string {
  if (Buffer.byteLength(output, 'utf8') <= maxBytes) return output
  // Slice by character approximation — safe overshoot, trim to byte boundary
  let truncated = output.slice(0, maxBytes)
  while (Buffer.byteLength(truncated, 'utf8') > maxBytes) {
    truncated = truncated.slice(0, -1)
  }
  return truncated + `\n\n[output truncated at ${maxBytes} bytes]`
}
