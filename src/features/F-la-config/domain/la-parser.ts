// [F-la-config/R1/C2] LA validator output parser
// R1: pure functions, no I/O, depends R0 only.
//
// Parses the stdout/stderr text output of LA v2.0 Python validators
// into typed TypeScript objects consumed by R2 (la-runner.ts).
//
// These are pure functions. No subprocess calls, no imports, no side effects.

import type { HealthViolation } from '@/features/F-health-panel/config/health-panel-config'
import type { ExecutionCheckResult } from '@/features/F-execution-panel/config/execution-panel-config'
import { randomUUID } from 'crypto'

// ─── R-layer violation line parser ───────────────────────────────────────────
// Parses lines like:
//   src/domain/auth-login.py:42
//     R1 Domain cannot depend on R3 Contract
//     > from contract import something

export interface ParsedLayerViolation {
  file: string
  line: number
  sourceLayer: string
  targetLayer: string
  importLine: string
  featureTag: string | null
  rLayer: number | null
}

export function parseLayerViolations(output: string): ParsedLayerViolation[] {
  const violations: ParsedLayerViolation[] = []
  const lines = output.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const fileLine = lines[i].trim()
    // Match: "src/domain/auth-login.py:42"
    const fileMatch = fileLine.match(/^([\w/.-]+\.(?:py|ts|js)):(\d+)$/)
    if (!fileMatch) continue

    const file = fileMatch[1]
    const lineNum = parseInt(fileMatch[2], 10)
    const layerLine = lines[i + 1]?.trim() ?? ''
    const importLine = lines[i + 2]?.trim()?.replace(/^>\s*/, '') ?? ''

    // Match: "R1 Domain cannot depend on R3 Contract"
    const layerMatch = layerLine.match(/^(R\d \w+) cannot depend on (R\d \w+)/)
    if (!layerMatch) continue

    violations.push({
      file,
      line: lineNum,
      sourceLayer: layerMatch[1],
      targetLayer: layerMatch[2],
      importLine,
      featureTag: extractFTagFromPath(file),
      rLayer: extractRLayerFromPath(file),
    })
  }

  return violations
}

// ─── F-tag completeness parser ────────────────────────────────────────────────
// Parses JSON output from validate-f-tags.py

export interface ParsedFTagResult {
  fTag: string
  rLayer: number
  file: string | null
  passed: boolean
  violations: string[]
}

export function parseFTagResults(output: string): ParsedFTagResult[] {
  // validate-f-tags.py outputs JSON when called with a commit message arg.
  // When scanned over history it outputs text. Handle both.
  try {
    const json = JSON.parse(output.trim())
    // Single result format: { valid, f_tag, layers_present, layers_missing }
    if (json.f_tag) {
      return [{
        fTag: json.f_tag,
        rLayer: 1,
        file: null,
        passed: json.complete ?? true,
        violations: (json.layers_missing ?? []).map((l: string) => `Missing layer ${l}`),
      }]
    }
    return []
  } catch {
    // Text scan format — parse summary lines
    const results: ParsedFTagResult[] = []
    const lines = output.split('\n')
    for (const line of lines) {
      // Match: "  F-auth        ⚠ missing R4"
      const warnMatch = line.match(/F-([a-z][a-z0-9-]*)\s+.*missing\s+(R\d)/)
      if (warnMatch) {
        results.push({
          fTag: `F-${warnMatch[1]}`,
          rLayer: parseInt(warnMatch[2].replace('R', ''), 10),
          file: null,
          passed: false,
          violations: [`Missing layer ${warnMatch[2]}`],
        })
      }
    }
    return results
  }
}

// ─── O-rule violations parser ─────────────────────────────────────────────────
// Parses lines like:
//   O1: API endpoint missing authentication decorator
//   O6: Hardcoded secret detected

export interface ParsedOpsViolation {
  rule: string
  message: string
  file: string
  featureTag: string | null
  rLayer: number | null
}

export function parseOpsViolations(output: string): ParsedOpsViolation[] {
  const violations: ParsedOpsViolation[] = []
  const lines = output.split('\n')
  let currentFile = ''

  for (const line of lines) {
    const trimmed = line.trim()

    // Detect file context lines like "Checking: src/domain/auth-login.py"
    const fileCtx = trimmed.match(/^(?:Checking|File):\s+([\w/.-]+\.(py|ts|js))/)
    if (fileCtx) {
      currentFile = fileCtx[1]
      continue
    }

    // Detect violation lines like "  - O1: ..." or "O1: ..."
    const violationMatch = trimmed.match(/^-?\s*(O\d):\s+(.+)$/)
    if (violationMatch) {
      violations.push({
        rule: violationMatch[1],
        message: violationMatch[2],
        file: currentFile,
        featureTag: currentFile ? extractFTagFromPath(currentFile) : null,
        rLayer: currentFile ? extractRLayerFromPath(currentFile) : null,
      })
    }
  }

  return violations
}

// ─── Execution validator parser ───────────────────────────────────────────────
// Parses JSON output from validate-execution.py

export interface ParsedExecutionResult {
  file: string
  valid: boolean
  violations: string[]
  featureTag: string | null
  rLayer: number | null
}

export function parseExecutionResults(output: string): ParsedExecutionResult[] {
  try {
    const json = JSON.parse(output.trim())
    // Single file result: { valid, filepath, io_ownership, state_machines, flow_paths }
    if ('filepath' in json) {
      const violations: string[] = []
      if (!json.io_ownership?.valid) {
        violations.push('I/O ownership: too many I/O channels in single file')
      }
      if (!json.state_machines?.valid) {
        violations.push('State machine: transitions incomplete or undefined')
      }
      if (!json.flow_paths?.valid) {
        violations.push('Flow path: deep relative imports indicate circular risk')
      }
      return [{
        file: json.filepath,
        valid: json.valid,
        violations,
        featureTag: extractFTagFromPath(json.filepath),
        rLayer: extractRLayerFromPath(json.filepath),
      }]
    }
    return []
  } catch {
    return []
  }
}

// ─── Path utilities ───────────────────────────────────────────────────────────

function extractFTagFromPath(filePath: string): string | null {
  // Matches F-slicename in path components, e.g. domain/auth-login.py → null (no F-tag in path)
  // LIV paths don't embed F-tag in path — extracted from file name convention
  const parts = filePath.split('/')
  const domainPart = parts.find((p) =>
    ['config', 'domain', 'app', 'contract', 'exec'].includes(p)
  )
  if (!domainPart) return null

  const filename = parts[parts.length - 1]
  // auth-login.py → F-auth  (module prefix = feature tag)
  const moduleMatch = filename.match(/^([a-z][a-z0-9]*)-/)
  if (moduleMatch) return `F-${moduleMatch[1]}`
  return null
}

function extractRLayerFromPath(filePath: string): number | null {
  if (filePath.includes('/config/'))   return 0
  if (filePath.includes('/domain/'))   return 1
  if (filePath.includes('/app/'))      return 2
  if (filePath.includes('/contract/')) return 3
  if (filePath.includes('/exec/'))     return 4
  return null
}

// ─── Health violation builder ─────────────────────────────────────────────────

export function buildHealthViolation(
  data: Omit<HealthViolation, 'violationId' | 'resolved'>
): HealthViolation {
  return {
    violationId: randomUUID(),
    resolved: false,
    ...data,
  }
}

// ─── Execution check result builder ──────────────────────────────────────────

export function buildExecutionCheckResult(
  data: Omit<ExecutionCheckResult, 'checkId'>
): ExecutionCheckResult {
  return {
    checkId: randomUUID(),
    ...data,
  }
}
