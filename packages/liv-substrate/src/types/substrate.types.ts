// @liv-standard v1.5.2
// Built with LIV · livai.dev
// Vendored — portable substrate package. Canonical home: src/core/types/substrate.types.ts (d6d13c8).
// The relational record atoms read back by readScope. Faithful copy; only the
// header differs. Marks and present-state are NOT here — they recompose in the
// engine, never travel in the store (Law 2).
// th1-flag-field (TH1): StateFlag + metadata.flag mirrored from canonical to keep
//   the faithful-copy invariant (capture-integrity flag — Mechanics M8 / R10 / R12).

import type { Result, AppError } from './primitives'

// ─── Identity (LMA5: identity-by-reference; clusters are read-time geometry) ──
export type IdentityRef = string & { readonly _brand: 'IdentityRef' }

// ─── Scope (LMA6: scope as attribute; open vocabulary) ────────────────────────
export type ScopeRef = string & { readonly _brand: 'ScopeRef' }

// ─── Position (LMA10: Axis 1 monotonic integer) ───────────────────────────────
export type PositionRef = number & { readonly _brand: 'PositionRef' }

// ─── Role (open vocabulary; identity-with-role pairing) ───────────────────────
export type RoleRef = string & { readonly _brand: 'RoleRef' }

// ─── State change identifier ──────────────────────────────────────────────────
export type StateChangeId = string & { readonly _brand: 'StateChangeId' }

// ─── Source channel (extensible enum) ─────────────────────────────────────────
export type SourceChannel =
  | 'wearer'
  | 'ai'
  | 'cron'
  | 'integration-event'
  | 'internal-derivation'
  | 'system-l0'
  | 'external-agent'

// ─── Content class (closed two-value classification) ──────────────────────────
// record-of-wearer-life vs record-of-system-operation. Carried on
// SubstrateSourceRef.contentClass — required field.
export type ContentClass =
  | 'wearer-life'
  | 'system-introspection'

// Mechanical projection channel → ContentClass (default-derivation rule).
// 'internal-derivation' is polymorphic; static callers declare the literal directly.
export function deriveContentClassFromChannel(channel: SourceChannel): ContentClass {
  switch (channel) {
    case 'wearer':
    case 'ai':
    case 'integration-event':
    case 'external-agent':
      return 'wearer-life'
    case 'cron':
    case 'system-l0':
      return 'system-introspection'
    case 'internal-derivation':
      return 'system-introspection'
  }
}

// ─── StateFlag (TH1: capture-integrity flag — binary pass/fail) ───────────────
// 'pass' = clean first-hand capture; 'fail' = reconstructed / could-not-cleanly
// capture (R12 save-and-flag). Capture integrity only — distinct from WriteAck
// (transport honesty). Carried on StateChangeRecord.metadata.flag.
export type StateFlag =
  | 'pass'
  | 'fail'

// ─── SubstrateSourceRef ────────────────────────────────────────────────────────
// Origin channel + content class + scope attribute on every state-change.
export type SubstrateSourceRef = {
  channel:      SourceChannel
  contentClass: ContentClass
  scope:        ScopeRef
}

// ─── Relation modality (LMA3 + LMA11: stored, re-derived at execution) ────────
export type RelationModality =
  | 'declarative'
  | 'interrogative'
  | 'imperative'
  | 'exclamative'

// ─── Identity-with-role pair (LMA3: ≥1 entry per relation) ────────────────────
export type IdentityWithRole = {
  identity: IdentityRef
  role:     RoleRef
}

// ─── Relation (LMA3: four peer components; nests unboundedly) ─────────────────
export type Relation = {
  type:                IdentityRef
  modality:            RelationModality
  identitiesWithRoles: IdentityWithRole[]   // ≥1 enforced at write validation
  negation:            boolean
}

// ─── Thread kinds (LMA9: three and only three thread primitives) ──────────────
export type ThreadKind =
  | 'identity-recurrence'
  | 'role-pattern'
  | 'adjacency'

// ─── Substrate write input (relational write surface) ──────────────────────────
export type SubstrateWriteInput = {
  userId:  string
  content: {
    identities: IdentityRef[]
    relations:  Relation[]
  }
  metadata: {
    time:   number
    source: SubstrateSourceRef
    flag?:  StateFlag           // TH1: omitted ⇒ clean first-hand ⇒ 'pass'
  }
}

// ─── Thread query input ────────────────────────────────────────────────────────
export type ThreadQueryInput = {
  threadKind:    ThreadKind
  anchor:        IdentityRef | PositionRef
  roleFilter?:   RoleRef
  scope?:        ScopeRef
  contentClass?: ContentClass
  asOfPosition?: PositionRef
  window?:       number
  limit?:        number
}

// ─── State change record (durable form of identities/relations) ───────────────
export type StateChangeRecord = {
  id:       StateChangeId
  userId:   string
  content: {
    identities: IdentityRef[]
    relations:  Relation[]
  }
  metadata: {
    time:     number
    source:   SubstrateSourceRef
    position: PositionRef
    flag?:    StateFlag         // TH1: capture-integrity flag (R10/R12). Optional in the vendored copy — the package store (substrate-repository.ts here) is out of TH1 scope (tsconfig excludes packages/); wiring it is a separate integration. Canonical (src/) makes this required.
  }
}

// ─── Thread result (output of TQ3 execute) ────────────────────────────────────
export type ThreadResult = {
  threadKind:  ThreadKind
  anchor:      IdentityRef | PositionRef
  records:     StateChangeRecord[]
  roleFilter?: RoleRef
}

// ─── RevokeRef (LMA2: in-band revocation; system-reserved) ────────────────────
// Literal value `'revoke-Ref'` verbatim; recognized by exact equality.
export const REVOKE_REF: IdentityRef = 'revoke-Ref' as IdentityRef

// ─── Result aliases (Result<T, AppError> pattern) ─────────────────────────────
export type SubstrateError = AppError
export type WriteResult       = Result<StateChangeRecord, SubstrateError>
export type ReadResult        = Result<StateChangeRecord | null, SubstrateError>
export type IterateResult     = Result<StateChangeRecord[], SubstrateError>
export type ThreadQueryResult = Result<ThreadResult, SubstrateError>
