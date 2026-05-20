// @liv-standard v1.5.1
// [F-memory/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-1 (substrate authoring)
// slice:      F-memory
// layer:      R0
// wires-in:
//   W-ATOM IdentityRef           core/R5 substrate.types
//   W-ATOM ScopeRef              core/R5 substrate.types
//   W-ATOM SubstrateSourceRef    core/R5 substrate.types
//   W-ATOM PositionRef           core/R5 substrate.types
//   W-ATOM RoleRef               core/R5 substrate.types
//   W-ATOM Relation              core/R5 substrate.types
//   W-ATOM ThreadKind            core/R5 substrate.types
// wires-out:
//   W-ATOM  StateChangeRow             →  F-memory/R4 (substrate-repository raw row shape)
//   W-ATOM  SubstrateWriteValidated    →  F-memory/R2 (post-SW1 shape)
//   W-ATOM  SubstrateGateResult        →  F-memory/R2 (post-SW2 shape)
//   W-ATOM  ThreadQueryValidated       →  F-memory/R2 (post-TQ1 shape)
//   W-CONST SUBSTRATE_TABLE_NAME       →  F-memory/R4
//   W-CONST SUBSTRATE_INDICES          →  F-memory/R4
// deps:
//   R5 @/core/types/substrate.types
// validated: pending

// Living Memory v3.1 — F-memory slice-internal substrate config.
// R0: type declarations + constants. Zero domain logic.
// Canonical spec: PLACEMENT_REGISTRY.living_memory_standard
//
// Sprint 8 Shot 1: authored alongside legacy memory-types.ts. Files
// distinguished by name prefix: substrate-* (new) vs memory-* (legacy
// dissolve-bucket per Shot 3 salvage map).

import type {
  IdentityRef,
  ScopeRef,
  SubstrateSourceRef,
  PositionRef,
  RoleRef,
  Relation,
  ThreadKind,
} from '@/core/types/substrate.types'

// ─── DB row shape (raw Postgres) ──────────────────────────────────────────────
// StateChangeRow: shape returned by the Postgres query. R4 maps to
// StateChangeRecord. JSONB columns inflate to typed atoms at the R4 boundary.

export type StateChangeRow = {
  id:                  string
  position:            number
  time_ms:             string                          // bigint serialized as string
  source_channel:      string
  source_content_class: string                         // v1.8.3 A-24: ContentClass column on state_change
  source_scope:        string
  user_id:             string                          // v3.2: authentication identity of writer
  identities:          string[]                        // JSONB array of IdentityRef strings
  relations:           unknown                          // JSONB array of Relation objects (validated at R4 → typed)
}

// ─── SW1 validation output (post-shape-check, pre-gate) ───────────────────────
// SubstrateWriteValidated: SW1 has assigned position + time, validated shape.
// Carries the inbound write through the procedure.

export type SubstrateWriteValidated = {
  userId:     string
  identities: IdentityRef[]
  relations:  Relation[]
  time:       number
  source:     SubstrateSourceRef
  position:   PositionRef
}

// ─── SW2 gate output ──────────────────────────────────────────────────────────
// SubstrateGateResult: per-axiom pass/fail trace from SW2 gate-execution.

export type SubstrateGateAxiomId =
  | 'LMA1'      // forward-additive
  | 'LMA3'      // relation structure
  | 'LMA10'     // two-axis coherence
  | 'LMA11'     // modality stored as recorded
  | 'LMA9'      // thread-kind primitive (TQ2 gate)

export type SubstrateGateResult = {
  axiom:  SubstrateGateAxiomId
  passed: boolean
  reason?: string
}

// ─── TQ1 validation output ────────────────────────────────────────────────────

export type ThreadQueryValidated = {
  threadKind:  ThreadKind
  anchor:      IdentityRef | PositionRef
  roleFilter?: RoleRef
  scope?:      ScopeRef
  window?:     number
  limit?:      number
}

// ─── DB constants ─────────────────────────────────────────────────────────────

export const SUBSTRATE_TABLE_NAME = 'state_change' as const

export const SUBSTRATE_INDICES = {
  primary:        'state_change_pkey',                 // (position)
  identityLookup: 'state_change_identity_idx',         // (identity_ref) via gin on identities
  identityRole:   'state_change_identity_role_idx',    // composite (identity_ref, role)
  scopeLookup:    'state_change_scope_idx',            // (source_scope, position)
} as const

// ─── Identity-by-reference normalization ──────────────────────────────────────
// IdentityRef normalized form: lowercase, hyphenated. Per LMA5 + §3.12 vocabulary
// of LM v3.1 standard. Validation belongs at the perimeter (LM does not enforce);
// helper provided here for SW1 use if perimeter does not pre-normalize.

export function normalizeIdentityRef(raw: string): IdentityRef {
  return raw.trim().toLowerCase().replace(/\s+/g, '-') as IdentityRef
}

// ─── End ──────────────────────────────────────────────────────────────────────
