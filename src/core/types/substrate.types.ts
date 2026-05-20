// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: sprint-8-shot-1 (substrate authoring), sprint-12-shot-2 (LM v3.2: userId fields), sprint-b2-shot-5 (SourceChannel: 'system-l0' added), side-quest-shot-1 (substrate v1.8.3: A-24 ContentClass added, SubstrateSourceRef.contentClass field added), side-quest-shot-2 (LM v3.4: ThreadQueryInput.contentClass? optional filter added for LMA13)
// slice: core
// layer: R5
// wires-in:
//   W-ATOM Result   ← core/R5 primitives
//   W-ATOM AppError ← core/R5 primitives
// wires-out:
//   W-ATOM IdentityRef          → all substrate consumers (perimeter, F-memory, F-chat, F-router)
//   W-ATOM ScopeRef             → all substrate consumers
//   W-ATOM SubstrateSourceRef   → all substrate consumers (Decision-D-2: prefixed to avoid collision with research-standard SourceRef)
//   W-ATOM PositionRef          → all substrate consumers
//   W-ATOM RoleRef              → all substrate consumers
//   W-ATOM Relation             → all substrate consumers
//   W-ATOM RelationModality     → all substrate consumers
//   W-ATOM IdentityWithRole     → all substrate consumers
//   W-ATOM SubstrateWriteInput  → perimeter/intake (write surface)
//   W-ATOM ThreadQueryInput     → F-chat, F-plan, F-verify, F-discover, F-router (read surface)
//   W-ATOM StateChangeRecord    → all substrate consumers
//   W-ATOM ThreadResult         → thread query consumers
//   W-ATOM StateChangeId        → substrate-internal + thread query consumers
//   W-ATOM ThreadKind           → thread query consumers
//   W-ATOM SourceChannel        → perimeter (channel enum)
//   W-ATOM ContentClass         → all substrate consumers (substrate v1.8.3 A-24; carried on SubstrateSourceRef.contentClass)
//   W-FUNC deriveContentClassFromChannel → Path A Boundary stampers + variable-channel Path B callers (default-derivation rule per substrate §4.2 A-24)
//   W-CONST REVOKE_REF          → SW3 RevokeRef detection (LMA2)
// deps:
//   R5 ./primitives
// validated: pending

// ═══════════════════════════════════════════════════════════════
// SUBSTRATE v1 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Living Memory v3.2 substrate atoms. Pure event-store: two axes,
// state-change records, identity threads, scope as attribute.
// Canonical spec: PLACEMENT_REGISTRY.living_memory_standard
// A1: declared once, at R5 core. Slices import — never redeclare.
//
// Sprint 8 Shot 1: authored alongside (not replacing) legacy
// living-memory.types.ts — coexistence preserved until Shot 3
// dissolve. New substrate consumers import from this file;
// legacy F-memory v1.1/v2.1 consumers continue importing
// living-memory.types.ts unchanged.
//
// Decision-D-1: new file rather than mutating living-memory.types.ts.
//   Rationale: legacy file is dissolve-bucket per salvage map;
//   coexistence in Shot 1 requires non-colliding declarations.
// Decision-D-2: SourceRef → SubstrateSourceRef.
//   Rationale: spec literal SourceRef collides with existing
//   research-standard.types.ts SourceRef (CitationId-bearing).
//   Substrate-prefix matches existing codebase pattern (LMHandoff*,
//   LMGate*). Type-name structural concern, not §1.16 lexical-field.

import type { Result, AppError } from './primitives'

// ─── Identity (LMA5: identity-by-reference; clusters are read-time geometry) ──
// IdentityRef: a reference string naming an identity. Normalized form:
//   lowercase hyphenated. Verbs, nouns, concepts — all are IdentityRefs.

export type IdentityRef = string & { readonly _brand: 'IdentityRef' }

// ─── Scope (LMA6: scope as attribute; open vocabulary) ────────────────────────
// ScopeRef: open-vocabulary scope identifier. Examples: 'global', userId,
//   teamId, projectId. New scope kinds are new ScopeRef values — no
//   infrastructure change.

export type ScopeRef = string & { readonly _brand: 'ScopeRef' }

// ─── Position (LMA10: Axis 1 monotonic integer) ───────────────────────────────
// PositionRef: monotonic integer coordinate on Axis 1. Auto-assigned at SW3.
//   Enables adjacency queries (LMA9) and ordered iteration.

export type PositionRef = number & { readonly _brand: 'PositionRef' }

// ─── Role (open vocabulary; identity-with-role pairing) ───────────────────────
// RoleRef: open-vocabulary string naming the role an identity plays in a
//   Relation. Common roles ('agent', 'patient', 'instrument') crystallize
//   as anchors through accumulation — not declared.

export type RoleRef = string & { readonly _brand: 'RoleRef' }

// ─── State change identifier ──────────────────────────────────────────────────
// StateChangeId: unique identifier for a committed StateChangeRecord.
//   Decision-D-3: uuid-prefixed string ('sc_' + uuid). Rationale: matches
//   existing codebase generateId() pattern; uuid avoids collision; prefix
//   aids log-grep. Position is the Axis 1 coordinate; StateChangeId is the
//   addressable handle (different concerns).

export type StateChangeId = string & { readonly _brand: 'StateChangeId' }

// ─── Source channel (extensible enum) ─────────────────────────────────────────
// SourceChannel: origin classification. Enum extensible per LMA6 open-vocabulary
//   discipline at SourceRef.scope; channel set declared but extensible
//   per metaframework Mode/enum-extension pattern.

export type SourceChannel =
  | 'wearer'
  | 'ai'
  | 'cron'
  | 'integration-event'
  | 'internal-derivation'
  | 'system-l0'           // Manual Part II L180 — distinct channel origin for System-L0 initiated writes

// ─── Content class (substrate v1.8.3 A-24: closed two-value classification) ────
// ContentClass: classifies the content of a recorded state-change as either
//   record-of-wearer-life (content participating in the cognition LIV extends —
//   Manual L28 root claim) or record-of-system-operation (apparatus's faithful
//   record of its own activity). Closed at declaration time per substrate v1.8.3
//   A-24 closure rule; extensible only via explicit substrate amendment.
//
// Default-derivation rule (channel → ContentClass) per substrate v1.8.3 §4.2:
//   wearer / ai / integration-event → 'wearer-life'
//   cron / system-l0                → 'system-introspection'
//   internal-derivation             → declared per emitting Standard (Phase D).
//
// Carried at SubstrateSourceRef.contentClass — required field (no nullable);
//   stamped at Boundary on Path A crossings, declared at emission site on Path B.

export type ContentClass =
  | 'wearer-life'
  | 'system-introspection'

// ─── deriveContentClassFromChannel (substrate v1.8.3 §4.2 A-24 default-rule) ──
// Mechanical projection of channel → ContentClass per the default-derivation
// rule declared at substrate §4.2 A-24. Five channels deterministic; one
// channel polymorphic.
//
// IMPORTANT: 'internal-derivation' is polymorphic at substrate tier — the
// classification is declared per emitting Standard at Phase D. Callers that
// know they emit via 'internal-derivation' must specify the ContentClass
// directly at the construction site (e.g., F-artifact emissions declare per
// target class; Present Standard emissions declare 'system-introspection').
//
// This helper is for Path A (Boundary stamping at proxy/perimeter) and any
// Path B caller whose channel is variable and known to be in the deterministic
// five-channel set. For static 'internal-derivation' callers, do NOT use this
// helper — declare the ContentClass literal at the call site per the emitting
// Standard's discipline.
//
// During the Phase A backfill window (pre-Phase-D), legacy 'internal-derivation'
// emissions that have not yet been classified by their emitting Standard
// receive the provisional 'system-introspection' stamp per substrate §4.2
// A-24 boot-time backfill rule.

export function deriveContentClassFromChannel(channel: SourceChannel): ContentClass {
  switch (channel) {
    case 'wearer':
    case 'ai':
    case 'integration-event':
      return 'wearer-life'
    case 'cron':
    case 'system-l0':
      return 'system-introspection'
    case 'internal-derivation':
      // Polymorphic at substrate tier; callers should normally declare directly.
      // Boot-time backfill provisional stamp per substrate §4.2 A-24 backfill rule.
      return 'system-introspection'
  }
}

// ─── SubstrateSourceRef (LM v3.1 §2.1 SourceRef; renamed for codebase) ────────
// Origin channel + scope attribute on every state-change.
// v1.8.3: `contentClass` field added (substrate A-24); sibling on origin-axis
//   shape per locus derivation (see substrate v1.8.3 §4.2 A-24 declaration).

export type SubstrateSourceRef = {
  channel:      SourceChannel
  contentClass: ContentClass
  scope:        ScopeRef
}

// ─── Relation modality (LMA3 + LMA11: stored, re-derived at execution) ────────
// RelationModality: declarative | interrogative | imperative | exclamative.
//   Stored as recorded metadata (LMA11). Operational significance re-derived
//   from context at read time.

export type RelationModality =
  | 'declarative'
  | 'interrogative'
  | 'imperative'
  | 'exclamative'

// ─── Identity-with-role pair (LMA3: ≥1 entry per relation) ────────────────────
// IdentityWithRole: an identity playing a named role inside a Relation.

export type IdentityWithRole = {
  identity: IdentityRef
  role:     RoleRef
}

// ─── Relation (LMA3: four peer components; nests unboundedly) ─────────────────
// Every Relation has exactly four peer components:
//   type      — IdentityRef (verbs are identities; open vocabulary)
//   modality  — RelationModality (stored; re-derived per LMA11)
//   identitiesWithRoles — ≥1 entry; open-vocabulary roles
//   negation  — boolean
// Relations nest unboundedly (a relation can appear inside another via
//   IdentityRef referencing the relation type — geometry emerges at read).

export type Relation = {
  type:                IdentityRef
  modality:            RelationModality
  identitiesWithRoles: IdentityWithRole[]   // ≥1 enforced at SW1 validation
  negation:            boolean
}

// ─── Thread kinds (LMA9: three and only three thread primitives) ──────────────
// ThreadKind: identity-recurrence | role-pattern | adjacency. All other
//   queries compose from these three plus raw axis scan (iterate_axis).

export type ThreadKind =
  | 'identity-recurrence'
  | 'role-pattern'
  | 'adjacency'

// ─── Substrate write input (R3 surface) ───────────────────────────────────────
// SubstrateWriteInput: input W-ATOM submitted by perimeter/intake (HR-LM1).
//   SW1 validates shape; SW2 runs LMA1/LMA3/LMA10/LMA11 gates;
//   SW3 detects RevokeRef and commits atomically (LMA4).

export type SubstrateWriteInput = {
  userId:  string               // v3.2: authentication identity of writer
  content: {
    identities: IdentityRef[]   // ≥1 enforced at SW1
    relations:  Relation[]      // may be empty (silent positions valid)
  }
  metadata: {
    time:   number              // write-time ms epoch (timestamp)
    source: SubstrateSourceRef
    // PositionRef NOT in input — auto-assigned at SW1 (monotonic)
  }
}

// ─── Thread query input (R3 surface) ──────────────────────────────────────────
// ThreadQueryInput: input W-ATOM for thread reads. TQ1 validates;
//   TQ2 runs LMA9 gate; TQ3 executes against substrate.
//
// v3.4 (Side-Quest Shot 2): contentClass? optional filter parameter added.
// LM v3.4 LMA13 declares ContentClass discipline; the filter is the read-side
// mechanism for selecting on the row-stamped ContentClass column. Default
// (omitted) returns all classes — backward-compatible with v3.3.1 callers.

export type ThreadQueryInput = {
  threadKind:    ThreadKind
  anchor:        IdentityRef | PositionRef   // identity- or position-anchored per kind
  roleFilter?:   RoleRef                     // required for 'role-pattern'
  scope?:        ScopeRef                    // optional read-time scope filter
  contentClass?: ContentClass                // v3.4: optional read-time ContentClass filter (LM v3.4 LMA13)
  window?:       number                      // required for 'adjacency'; positive integer
  limit?:        number                      // max positions to return
}

// ─── State change record (output of SW3 commit) ───────────────────────────────
// StateChangeRecord: persisted W-ATOM. Identity-by-reference (LMA5);
//   the record is the only durable form of the identities/relations.

export type StateChangeRecord = {
  id:       StateChangeId
  userId:   string              // v3.2: carried from SubstrateWriteInput (LMA12)
  content: {
    identities: IdentityRef[]
    relations:  Relation[]
  }
  metadata: {
    time:     number              // ms epoch as recorded at SW1
    source:   SubstrateSourceRef
    position: PositionRef         // assigned at SW1, persisted at SW3
  }
}

// ─── Thread result (output of TQ3 execute) ────────────────────────────────────
// ThreadResult: ordered records by position. roleFilter echoed for
//   'role-pattern' queries; absent for other kinds.

export type ThreadResult = {
  threadKind:  ThreadKind
  anchor:      IdentityRef | PositionRef
  records:     StateChangeRecord[]   // ordered by position ascending
  roleFilter?: RoleRef
}

// ─── RevokeRef (LMA2: in-band revocation; system-reserved) ────────────────────
// REVOKE_REF: the single system-reserved IdentityRef. When a SubstrateWriteInput
//   arrives whose top-level relation has type=REVOKE_REF, SW3 deletes the
//   target StateChangeRecord (identified by the relation's identitiesWithRoles)
//   as a side effect of the same atomic commit. Position gaps are honest;
//   no revocation record is stored.
//
// Literal value: `'revoke-Ref'` per LM v3.1 §3.6 verbatim. The general
// IdentityRef norm "lowercase hyphenated" (§3.12) does not bind here —
// §3.6 explicitly declares the literal with capital-R, and the system-reserved
// sentinel is exempt from the general lexical norm by virtue of explicit
// declaration. SW3 recognizes by exact equality.

export const REVOKE_REF: IdentityRef = 'revoke-Ref' as IdentityRef

// ─── Result aliases (Result<T, AppError> pattern per A6) ──────────────────────
// Substrate consumers receive Result-wrapped values for fallible operations.

export type SubstrateError = AppError
export type WriteResult       = Result<StateChangeRecord, SubstrateError>
export type ReadResult        = Result<StateChangeRecord | null, SubstrateError>
export type IterateResult     = Result<StateChangeRecord[], SubstrateError>
export type ThreadQueryResult = Result<ThreadResult, SubstrateError>

// ─── End ──────────────────────────────────────────────────────────────────────
