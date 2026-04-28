// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    cog-v1.2.1-operator-interface
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  AuditTrailEntry             ←  F-codec/R0 (codec-audit-types)
//   W-ATOM  AuditTrailFilter            ←  F-codec/R0 (codec-audit-types)
//   W-ATOM  CognitiveRuntimeState       ←  F-codec/R0 (codec-audit-types)
//   W-ATOM  AUDIT_TRAIL_BUFFER_SIZE     ←  F-codec/R0 (codec-audit-types)
//   W-ATOM  COGNITIVE_STANDARD_VERSION  ←  F-codec/R0 (codec-audit-types)
//   W-ATOM  COGNITIVE_LAST_CONFIRMED_AT ←  F-codec/R0 (codec-audit-types)
// wires-out:
//   W-FN    getCognitiveAuditTrail()    →  F-codec/R3 (codec-contract)
//   W-FN    getCognitiveRuntimeState()  →  F-codec/R3 (codec-contract)
//   W-FN    recordAuditTrailEntry()     →  F-codec internals (future producers)
// deps:
//   R0  ../config/codec-audit-types
// validated:  pending

// Cognitive Standard v1.2.1 §5.3 audit-trail + §6.5 OperatorInterface
// runtime implementation.
//
// First-pass per Shot 5 (Sprint 3): in-memory ring buffer; persistent
// backing-store design owned by F-codec ops layer at post-Sprint-3 cycle.

import type {
  AuditTrailEntry,
  AuditTrailFilter,
  CognitiveRuntimeState,
} from '../config/codec-audit-types'

import {
  AUDIT_TRAIL_BUFFER_SIZE,
  COGNITIVE_STANDARD_VERSION,
  COGNITIVE_LAST_CONFIRMED_AT,
} from '../config/codec-audit-types'

// ─── In-memory ring buffer ───────────────────────────────────────────────────
// Module-scoped, single-process. Resets at server restart; consumers should
// not rely on long-term retention in the first-pass implementation.

let _buffer: AuditTrailEntry[] = []

// ─── recordAuditTrailEntry ───────────────────────────────────────────────────
// Internal producer hook. Future F-codec call sites (encode-LLM-failure,
// decode-parse-failure, gate-execution-result) emit entries here. Not exported
// at R3 in Sprint 3 — public producer surface is post-Sprint-3 work.
//
// Thread-safety: Node single-threaded event loop suffices for ring-buffer
// mutation; no lock required.

export function recordAuditTrailEntry(entry: AuditTrailEntry): void {
  _buffer.push(entry)
  if (_buffer.length > AUDIT_TRAIL_BUFFER_SIZE) {
    // Drop oldest. Ring buffer; FIFO eviction.
    _buffer = _buffer.slice(_buffer.length - AUDIT_TRAIL_BUFFER_SIZE)
  }
}

// ─── getCognitiveAuditTrail ──────────────────────────────────────────────────
// §5.3 query interface: filter by frameworkRef / eventType / timeRange.
// All filters optional + AND-composed. Returns a copy of matched entries
// (callers cannot mutate the buffer). AuditTrailFilter atom owned at R0
// per B-A-01 close-turn relocation.

export async function getCognitiveAuditTrail(
  filter: AuditTrailFilter = {},
): Promise<AuditTrailEntry[]> {
  const fromMs = filter.timeRange ? Date.parse(filter.timeRange.from) : null
  const toMs   = filter.timeRange ? Date.parse(filter.timeRange.to)   : null

  return _buffer.filter((entry) => {
    if (filter.frameworkRef && entry.frameworkRef !== filter.frameworkRef) {
      return false
    }
    if (filter.eventType && entry.eventType !== filter.eventType) {
      return false
    }
    if (fromMs !== null && toMs !== null) {
      const tsMs = Date.parse(entry.timestamp)
      if (Number.isNaN(tsMs) || tsMs < fromMs || tsMs > toMs) {
        return false
      }
    }
    return true
  })
}

// ─── getCognitiveRuntimeState ────────────────────────────────────────────────
// §6.5 Discovery sub-interface (runtimeStateQuery). First-pass: hardcoded
// constants from R0 atoms. Future: read from registry HR5.

export function getCognitiveRuntimeState(): CognitiveRuntimeState {
  return {
    standardVersion: COGNITIVE_STANDARD_VERSION,
    lifecycleState:  'applied',
    lastConfirmedAt: COGNITIVE_LAST_CONFIRMED_AT,
  }
}

// ─── Test-only buffer access ─────────────────────────────────────────────────
// Test harness uses this to clear or seed buffer state. Not exported at R3.

export function _resetAuditTrailBufferForTest(): void {
  _buffer = []
}
