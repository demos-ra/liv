// @liv-standard v1.5.2
// Built with LIV · livai.dev
// Vendored — portable substrate package. Canonical home: src/features/F-memory/config/substrate-config.ts (d6d13c8).
// Slice-internal substrate config: the raw Postgres row shape + DB constants.
// Zero domain logic.

import type {
  IdentityRef,
  ScopeRef,
  SubstrateSourceRef,
  PositionRef,
  RoleRef,
  Relation,
  ThreadKind,
  ContentClass,
} from '../types/substrate.types'

// ─── DB row shape (raw Postgres) ──────────────────────────────────────────────
// StateChangeRow: shape returned by the Postgres query. The repository maps it to
// StateChangeRecord. JSONB columns inflate to typed atoms at the read boundary.
export type StateChangeRow = {
  id:                  string
  position:            string                          // bigint serialized as string
  time_ms:             string                          // bigint serialized as string
  source_channel:      string
  source_content_class: string
  source_scope:        string
  user_id:             string
  identities:          string[] | null                 // JSONB array of IdentityRef strings; NULL on post-027 cognition rows
  relations:           unknown | null                   // JSONB array of Relation objects; NULL on post-027 cognition rows
}

// ─── Write-validation output (post-shape-check, pre-gate) ─────────────────────
// SubstrateWriteValidated: shape carried into the relational commit. Position is
// owned by the database (state_change_position_seq) and assigned at INSERT.
export type SubstrateWriteValidated = {
  userId:     string
  identities: IdentityRef[]
  relations:  Relation[]
  time:       number
  source:     SubstrateSourceRef
}

// ─── Gate output ──────────────────────────────────────────────────────────────
export type SubstrateGateAxiomId =
  | 'LMA1'
  | 'LMA3'
  | 'LMA10'
  | 'LMA11'
  | 'LMA9'

export type SubstrateGateResult = {
  axiom:  SubstrateGateAxiomId
  passed: boolean
  reason?: string
}

// ─── Thread-query validation output ───────────────────────────────────────────
export type ThreadQueryValidated = {
  threadKind:    ThreadKind
  anchor:        IdentityRef | PositionRef
  roleFilter?:   RoleRef
  scope?:        ScopeRef
  contentClass?: ContentClass
  asOfPosition?: PositionRef
  window?:       number
  limit?:        number
}

// ─── DB constants ─────────────────────────────────────────────────────────────
export const SUBSTRATE_TABLE_NAME = 'state_change' as const

export const SUBSTRATE_INDICES = {
  primary:        'state_change_pkey',
  identityLookup: 'state_change_identity_idx',
  identityRole:   'state_change_identity_role_idx',
  scopeLookup:    'state_change_scope_idx',
} as const

// ─── Identity-by-reference normalization ──────────────────────────────────────
// Validation belongs at the perimeter (the store does not enforce); helper
// provided here for write-site use if the perimeter does not pre-normalize.
export function normalizeIdentityRef(raw: string): IdentityRef {
  return raw.trim().toLowerCase().replace(/\s+/g, '-') as IdentityRef
}
