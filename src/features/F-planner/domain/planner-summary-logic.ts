// @liv-standard v1.3
// [F-planner/domain/planner-summary-logic.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5e-fix
// slice:      F-planner
// layer:      R1
// wires-in:
//   W-ATOM  SemVer        ../types/planner-version-types
//   W-ATOM  VersionBump   ../types/planner-version-types
//   W-ATOM  PipelineStage ../types/planner-types
// wires-out:
//   W-FN  buildCompletionSummary  →  F-planner/R3 (planner-ui.tsx)
//   W-FN  buildFailureSummary     →  F-planner/R3 (planner-ui.tsx)
//   W-FN  buildActivityLine       →  F-planner/R3 (planner-ui.tsx)
//   W-FN  parseSemVer             →  F-planner/R1 (self, called by bumpVersion)
//   W-FN  bumpVersion             →  F-planner/R2 (planner-workflow.ts)
//   W-FN  formatVersion           →  F-planner/R3 (planner-ui.tsx)
// deps:
//   R0  ../types/planner-version-types
//   R0  ../types/planner-types
// validated:  pending
//
// step5e (A1, A2, A6):
//   New file. Pure R1 functions — no I/O, no imports beyond R0.
//   All functions are deterministic and have no side effects.
//   Axiom cite: A1 — F-planner owns version summary logic. A2 — R1 imports R0 only.
//   A6 — types used here declared at R0.

import type { SemVer, VersionBump } from '../types/planner-version-types'
import type { PipelineStage }       from '../types/planner-types'

// ── buildCompletionSummary ─────────────────────────────────────────────────────
// Single human-readable line summarising a completed build.
// Format: "{description}. {N} files. Built in {T}."
// Description first — the user's own words anchor the result.

export function buildCompletionSummary(
  description: string,
  fileCount:   number,
  durationMs:  number,
): string {
  const secs = Math.round(durationMs / 1000)
  const time = secs >= 60
    ? `${Math.floor(secs / 60)}m ${secs % 60}s`
    : `${secs}s`
  return `${description}. ${fileCount} file${fileCount !== 1 ? 's' : ''}. Built in ${time}.`
}

// ── buildFailureSummary ────────────────────────────────────────────────────────
// Returns the user-visible failure message.
// Escalated (LIV error): two-line message, no actions.
// Terminal non-escalated failure: suggest rewording.

export function buildFailureSummary(isEscalated: boolean): string {
  if (isEscalated) {
    return 'Something went wrong on our end. We\'re looking into it.'
  }
  return 'This build couldn\'t be completed. Try describing it differently.'
}

// ── buildActivityLine ──────────────────────────────────────────────────────────
// Maps pipeline stage to a user-visible one-liner.
// Only three phases visible: building, compiling, checking.
// No retry/re-entry/error visibility.

export function buildActivityLine(
  currentStage: PipelineStage | null,
  _stageStatus: string | null,
): string {
  if (!currentStage) return 'Building...'

  switch (currentStage) {
    case 'IN_BUILD':
    case 'IN_RESOLVE':
    case 'IN_AUDIT':
    case 'IN_MAIN':
      return 'Building...'
    case 'IN_COMPILE':
      return 'Compiling...'
    case 'IN_QA':
      return 'Running final checks...'
    default:
      return 'Building...'
  }
}

// ── parseSemVer ───────────────────────────────────────────────────────────────
// Parses "1.2.3" → { major: 1, minor: 2, patch: 3 }.
// Returns { major: 1, minor: 0, patch: 0 } on invalid input.

export function parseSemVer(version: string): SemVer {
  const parts = version.split('.')
  if (parts.length !== 3) return { major: 1, minor: 0, patch: 0 }
  const [major, minor, patch] = parts.map(Number)
  if (isNaN(major) || isNaN(minor) || isNaN(patch)) return { major: 1, minor: 0, patch: 0 }
  return { major, minor, patch }
}

// ── bumpVersion ───────────────────────────────────────────────────────────────
// Applies a semver bump.
// minor resets patch. major resets minor and patch.

export function bumpVersion(current: string, bump: VersionBump): string {
  const { major, minor, patch } = parseSemVer(current)
  switch (bump) {
    case 'major': return `${major + 1}.0.0`
    case 'minor': return `${major}.${minor + 1}.0`
    case 'patch': return `${major}.${minor}.${patch + 1}`
  }
}

// ── formatVersion ─────────────────────────────────────────────────────────────
// Prefixes a semver string for display: "1.0.0" → "v1.0.0".

export function formatVersion(version: string): string {
  return `v${version}`
}
