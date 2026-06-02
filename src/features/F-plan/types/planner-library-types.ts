// @liv-standard v1.3
// [F-plan/types/planner-library-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4d-phase1, foundation-group4 (slice: F-planner → F-plan; compliance stamp corrected)
// slice:      F-plan
// layer:      R0
// wires-in:
//   W-ATOM  FlowId  @/core/constants/liv-standard.types
// wires-out:
//   W-ATOM  FlowLibraryEntry      →  F-plan/R1, F-plan/R2, F-plan/R4
//   W-ATOM  LibraryMatchType      →  F-plan/R1, F-plan/R2, F-plan/R4
//   W-ATOM  LibraryLookupResult   →  F-plan/R2, F-plan/R4
// deps:
//   R0  @/core/constants/liv-standard.types  (FlowId — A1, canonical)
// validated:  pending
//
// step4d-phase1 (A1, A3, A6):
//   New file. Kept separate from planner-types.ts per A1: flow library is a
//   distinct domain concern from the pipeline job domain. Separate R0 file
//   maintains deletability (A7) — library feature can be removed without
//   touching core pipeline types.
//   Axiom cite: A6 — declared at R0 of owning slice. A1 — single owner.
//   A3 — typed atoms at boundary.

import type { FlowId } from '@/core/constants/liv-standard.types'

// ── AK-ENT — Flow library entry ───────────────────────────────────────────────
// One entry per structural fingerprint (flowId + standardVersion +
// atomShapeHash + wireSignatureHash). Per-bundle granularity.
// outputFiles: proven IN-BUILD output for this bundle. { path, content } only —
// encoding not stored (all library files are utf8 source).
export type FlowLibraryEntry = {
  id:                 string
  flowId:             FlowId
  standardVersion:    string
  atomShapeHash:      string
  wireSignatureHash:  string
  bundleName:         string
  slotValues:         Record<string, string>
  outputFiles:        { path: string; content: string }[]
  sourceBuildId:      string
  reuseFailureCount:  number
  createdAt:          number   // epoch ms
}

// ── AK-ENUM — Match type ──────────────────────────────────────────────────────
export type LibraryMatchType = 'exact' | 'partial' | 'none'

// ── AK-RES — Lookup result ────────────────────────────────────────────────────
export type LibraryLookupResult = {
  matchType: LibraryMatchType
  entry:     FlowLibraryEntry | null
}

// ── AK-PAY — Insert payload (omits DB-generated fields) ───────────────────────
export type LibraryInsertPayload = {
  flowId:            FlowId
  standardVersion:   string
  atomShapeHash:     string
  wireSignatureHash: string
  bundleName:        string
  slotValues:        Record<string, string>
  outputFiles:       { path: string; content: string }[]
  sourceBuildId:     string
}
