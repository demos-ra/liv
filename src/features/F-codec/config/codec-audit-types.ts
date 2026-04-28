// @liv-standard v1.5.1
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    cog-v1.2.1-operator-interface
// slice:      F-codec
// layer:      R0
// wires-in:
//   (no W-ATOM imports — pure declaration of audit-trail vocabulary)
// wires-out:
//   W-ATOM  AuditTrailEntry            →  F-codec/R2 (codec-audit), R3 (codec-contract)
//   W-ATOM  AuditTrailEventType        →  F-codec/R2, R3
//   W-ATOM  AuditTrailFilter           →  F-codec/R2 (codec-audit), R3 (codec-contract)
//   W-ATOM  CognitiveLifecycleState    →  F-codec/R2, R3
//   W-ATOM  CognitiveRuntimeState      →  F-codec/R2, R3
//   W-ATOM  AUDIT_TRAIL_BUFFER_SIZE    →  F-codec/R2 (codec-audit)
//   W-ATOM  COGNITIVE_STANDARD_VERSION →  F-codec/R2 (codec-audit)
// deps:
//   (none — R0 leaf vocabulary)
// validated:  pending

// Audit-trail + runtime-state types per Cognitive Standard v1.2.1 §5.3 +
// §6.5 OperatorInterface (Review + Discovery sub-interfaces).
//
// CA4 (purity): all types/consts here are leaf declarations; no I/O.
// Sprint 3 Shot 5 — first-pass declaration; F-codec ops layer owns
// persistence design at post-Sprint-3 cycle.

// ─── Audit-trail event types ─────────────────────────────────────────────────
// Per §5.3: 'gate-execution' | 'state-transition' | 'amendment-event'.

export type AuditTrailEventType =
  | 'gate-execution'
  | 'state-transition'
  | 'amendment-event'

// ─── Audit-trail entry ───────────────────────────────────────────────────────
// Per §5.3 declared shape: every gate-execution result + every state-transition
// event logs as one entry. Consumed by F-codec/R3 getCognitiveAuditTrail().

export type AuditTrailEntry = {
  eventId:           string                  // UUID
  frameworkRef:      string                  // e.g. 'cognitive-standard-v1-2'
  eventType:         AuditTrailEventType
  timestamp:         string                  // ISO8601
  sourceFrameworkRef: string                 // emitter's framework reference
  payload:           Record<string, unknown> // event-specific shape
}

// ─── Audit-trail filter ──────────────────────────────────────────────────────
// Per §5.3 query interface: optional + AND-composed filter shape consumed by
// getCognitiveAuditTrail({frameworkRef?, eventType?, timeRange?}).

export type AuditTrailFilter = {
  frameworkRef?: string
  eventType?:    AuditTrailEventType
  timeRange?:    { from: string; to: string }   // ISO8601 inclusive bounds
}

// ─── Cognitive runtime state ─────────────────────────────────────────────────
// Per §6.5 Discovery sub-interface (runtimeStateQuery). LifecycleState aligned
// with Cognitive §5.x lifecycle slot vocabulary.

export type CognitiveLifecycleState =
  | 'declared'
  | 'applied'
  | 'deprecated'
  | 'terminated'

export type CognitiveRuntimeState = {
  standardVersion:   string                  // e.g. 'v1.2.1'
  lifecycleState:    CognitiveLifecycleState
  lastConfirmedAt:   string                  // ISO8601
}

// ─── Configuration ──────────────────────────────────────────────────────────

// Ring-buffer cap for in-memory audit trail. First-pass per Shot 5 D-row;
// persistent backing-store design lands post-Sprint-3.
export const AUDIT_TRAIL_BUFFER_SIZE = 1000

// Frozen at Sprint 3 close per Cognitive v1.2.1 §11 closure declaration +
// §5.6 frozen-input invariant. Bumps require new amendment cycle.
export const COGNITIVE_STANDARD_VERSION = 'v1.2.1' as const

// Deploy-time confirmation timestamp. First-pass: ISO8601 hardcoded constant
// per Shot 5 D-row. Future: read from registry HR5 write per §6.5
// confirmation.confirmationRecordPath.
export const COGNITIVE_LAST_CONFIRMED_AT = '2026-04-28T00:00:00.000Z' as const
