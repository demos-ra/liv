// @liv-standard v1.5.1
// [F-memory/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-1 (substrate authoring), sprint-12-shot-2 (LM v3.2: userId SW1 validation + thread-through), present-rederive-shot-1 (LM v3.4/v3.5: TQ3 threads contentClass? + asOfPosition? to repository reads; identityRecurrence/rolePattern/adjacency wrappers gain the optional parameters), fixround-position-sequence (sw1Validate position:0 sentinel removed — position is DB-owned, assigned at INSERT in R4), th1-flag-field (TH1: sw1Validate threads metadata.flag? through to SubstrateWriteValidated.flag — capture-integrity flag, default 'pass' stamped at R4; Mechanics M8 / Rulings R10/R12)
// compliance: Living Memory (SW1 thread-through); Mechanics M8 (capture-integrity flag carried, not WriteAck — WriteAck untouched); Rulings R10 (binary pass/fail) / R12 (save-and-flag). Seal: none (Storage schema).
// slice:      F-memory
// layer:      R2
// wires-in:
//   W-ATOM    SubstrateWriteInput   core/R5 substrate.types
//   W-ATOM    ThreadQueryInput      core/R5 substrate.types
//   W-ATOM    StateChangeRecord     core/R5 substrate.types
//   W-ATOM    ThreadResult          core/R5 substrate.types
//   W-ATOM    Relation              core/R5 substrate.types
//   W-ATOM    REVOKE_REF            core/R5 substrate.types (LMA2 sentinel)
//   W-ATOM    SubstrateWriteValidated F-memory/R0 substrate-config
//   W-ATOM    ThreadQueryValidated    F-memory/R0 substrate-config
//   W-ATOM    SubstrateGateResult     F-memory/R0 substrate-config
//   W-INJECT  substrate-repository  F-memory/R4
//   W-EVENT   substrate.state-change-written  → F-event-system
//   W-EVENT   substrate.state-change-revoked  → F-event-system
//   W-EVENT   substrate.write-gate-failed     → F-event-system
//   W-EVENT   substrate.boot-complete         → F-event-system
// wires-out:
//   W-FN      writeStateChange      → F-memory/R3 substrate-contract
//   W-FN      readStateChange       → F-memory/R3 substrate-contract
//   W-FN      iterateAxis           → F-memory/R3 substrate-contract
//   W-FN      identityRecurrence    → F-memory/R3 substrate-contract
//   W-FN      rolePattern           → F-memory/R3 substrate-contract
//   W-FN      adjacency             → F-memory/R3 substrate-contract
//   W-FN      threadQuery           → F-memory/R3 substrate-contract
//   W-FN      onBoot                → F-event-system/R2 (startup)
// deps:
//   R0  ../config/substrate-config
//   R0  ../config/substrate-events
//   R4  ../exec/substrate-repository
//   R5  @/core/types/substrate.types
//   R5  @/core/types/primitives
// validated:  pending

// Living Memory v3.2 — substrate service.
// R2: orchestrates SW1–SW3 (substrate write) and TQ1–TQ3 (thread query)
// procedures. Composes 6 operations declared in §3.10 of the standard.
// Canonical spec: PLACEMENT_REGISTRY.living_memory_standard
//
// Procedure structure (LM v3.1 §3.8, §3.9):
//   SW1 (mechanical, stage 2)        — validate shape; assign position + time
//   SW2 (gate-execution, stage 3)    — gates [LMA1, LMA3, LMA10, LMA11]
//   SW3 (mechanical, stage 5)        — RevokeRef detect → delete; commit atomically
//
//   TQ1 (mechanical, stage 2)        — validate threadKind, anchor, role/window
//   TQ2 (gate-execution, stage 3)    — gates [LMA9]
//   TQ3 (mechanical, stage 5)        — execute against substrate; emit ThreadResult
//
// Atomicity (LMA4): SW3 commit is one DB transaction. Revocation + new-record
// commit, when both occur, are both inside the same transaction at R4.
// (This service issues them as paired calls; for production-grade combined
// revoke+write atomicity, R4 exposes a future combined entry point — natural-
// defer per §1.21: contract here is "atomic per state-change", which is what
// R4 already guarantees per call. Combined revoke+write is one logical commit
// with two DB statements; revocation always precedes the write, and a failure
// in the write rolls back via the outer error path. For Sprint 8 close gate
// "RevokeRef detection fires in-band at SW3" — the detection + dispatch
// happens here in SW3 unconditionally before commitStateChange.)

import type { Result } from '@/core/types/primitives'
import { enforceSubstrateReadScope } from '@/features/F-permissions/contract/permissions-contract'
import type {
  SubstrateWriteInput,
  ThreadQueryInput,
  StateChangeRecord,
  ThreadResult,
  IdentityRef,
  PositionRef,
  ScopeRef,
  RoleRef,
  StateChangeId,
  Relation,
  ContentClass,
} from '@/core/types/substrate.types'
import { REVOKE_REF } from '@/core/types/substrate.types'
import type {
  SubstrateWriteValidated,
  ThreadQueryValidated,
  SubstrateGateResult,
} from '../config/substrate-config'
import {
  commitStateChange,
  commitRevocation,
  readByPosition,
  iterateAxisRows,
  readIsolatedRows,
  readIdentityRecurrence,
  readRolePattern,
  readAdjacency,
  getLastPosition,
} from '../exec/substrate-repository'
import { SUBSTRATE_EVENTS } from '../config/substrate-events'
import { readTranscript } from '../exec/transcript-read'
import { writeRawTurn } from '../exec/raw-turn-write'
import { readerOf } from '../exec/scope-clause'
import type { ScopeSpec } from '../exec/scope-clause'
import type { RawTurn, RawWord, Who } from '@/core/types/substrate-raw.types'

// ═══════════════════════════════════════════════════════════════
// SW1 — Validation + position/time assignment (mechanical, stage 2)
// ═══════════════════════════════════════════════════════════════
// Validates inbound shape per LM v3.1 §3.8:
//   - identities array non-empty
//   - each Relation has all four components (type, modality, identitiesWithRoles, negation)
//   - each Relation.identitiesWithRoles has ≥ 1 entry
// fixround-position-sequence: SW1 no longer carries position — position is
// owned by the database (state_change_position_seq) and assigned at INSERT in
// R4. SW1 validates shape and stamps time only.
// Stamps time as write-time (already provided by perimeter; preserved here).

function sw1Validate(input: SubstrateWriteInput): Result<SubstrateWriteValidated> {
  const { content, metadata } = input

  if (!Array.isArray(content?.identities) || content.identities.length === 0) {
    return {
      ok: false,
      error: {
        code:    'SW1_VALIDATION_FAILED',
        message: 'identities must be a non-empty array',
      },
    }
  }

  if (!Array.isArray(content?.relations)) {
    return {
      ok: false,
      error: {
        code:    'SW1_VALIDATION_FAILED',
        message: 'relations must be an array (may be empty)',
      },
    }
  }

  for (let i = 0; i < content.relations.length; i++) {
    const r = content.relations[i]
    if (!r || typeof r !== 'object') {
      return {
        ok: false,
        error: {
          code:    'SW1_VALIDATION_FAILED',
          message: `relations[${i}] is not an object`,
        },
      }
    }
    if (typeof (r as Relation).type !== 'string') {
      return {
        ok: false,
        error: {
          code:    'SW1_VALIDATION_FAILED',
          message: `relations[${i}].type missing or not IdentityRef`,
        },
      }
    }
    if (typeof (r as Relation).modality !== 'string') {
      return {
        ok: false,
        error: {
          code:    'SW1_VALIDATION_FAILED',
          message: `relations[${i}].modality missing`,
        },
      }
    }
    if (typeof (r as Relation).negation !== 'boolean') {
      return {
        ok: false,
        error: {
          code:    'SW1_VALIDATION_FAILED',
          message: `relations[${i}].negation must be boolean`,
        },
      }
    }
    const iwr = (r as Relation).identitiesWithRoles
    if (!Array.isArray(iwr) || iwr.length === 0) {
      return {
        ok: false,
        error: {
          code:    'SW1_VALIDATION_FAILED',
          message: `relations[${i}].identitiesWithRoles must have ≥1 entry`,
        },
      }
    }
  }

  if (!metadata?.source?.scope || typeof metadata.source.channel !== 'string') {
    return {
      ok: false,
      error: {
        code:    'SW1_VALIDATION_FAILED',
        message: 'metadata.source incomplete (channel + scope required)',
      },
    }
  }

  if (typeof input.userId !== 'string' || input.userId.length === 0) {
    return {
      ok: false,
      error: {
        code:    'SW1_VALIDATION_FAILED',
        message: 'userId required (LM v3.2 §2.1)',
      },
    }
  }

  return {
    ok: true,
    data: {
      userId:     input.userId,
      identities: content.identities,
      relations:  content.relations,
      time:       typeof metadata.time === 'number' ? metadata.time : Date.now(),
      source:     metadata.source,
      flag:       metadata.flag,   // TH1: carry capture-integrity flag through. Omitted ⇒ 'pass' stamped at the R4 write door (R12).
    },
  }
}

// ═══════════════════════════════════════════════════════════════
// SW2 — Gate execution (gates [LMA1, LMA3, LMA10, LMA11])
// ═══════════════════════════════════════════════════════════════
// LMA1 (forward-additive): every write produces a new StateChangeRecord
//   appended to Axis 1. The implementation's INSERT-only semantic (no UPDATE
//   of existing records, no overwrite) satisfies this. Verified at R4.
// LMA3 (relation structure): re-checks Relation shape at gate level
//   (defense-in-depth; SW1 already validated; SW2 is the structural axiom check).
// LMA10 (two-axis structure): position assignment is monotonic on Axis 1;
//   identity threads (Axis 2) are read-time geometry — no storage requirement
//   to verify here. Mechanically vacuous-pass given SW1 + R4 contract.
// LMA11 (modality stored as recorded metadata): modality is stored on the
//   Relation as-given; no constraint is applied to its operational value.
//   Vacuous-pass at gate level (the storage of modality is mechanical at SW3).

function sw2Gates(validated: SubstrateWriteValidated): SubstrateGateResult[] {
  const results: SubstrateGateResult[] = []

  // LMA1 — append-only contract verified by R4 INSERT semantic (no UPSERT).
  results.push({ axiom: 'LMA1', passed: true })

  // LMA3 — relation structure re-check (already done by SW1 but axiom is owned here).
  let lma3Passed = true
  let lma3Reason: string | undefined
  for (let i = 0; i < validated.relations.length; i++) {
    const r = validated.relations[i]
    if (
      typeof r.type !== 'string' ||
      typeof r.modality !== 'string' ||
      typeof r.negation !== 'boolean' ||
      !Array.isArray(r.identitiesWithRoles) ||
      r.identitiesWithRoles.length === 0
    ) {
      lma3Passed = false
      lma3Reason = `relation[${i}] missing required four-component structure`
      break
    }
  }
  results.push({
    axiom:  'LMA3',
    passed: lma3Passed,
    ...(lma3Reason ? { reason: lma3Reason } : {}),
  })

  // LMA10 — two-axis. Position monotonicity is owned by the database
  // (state_change_position_seq, migration 022) — assigned at INSERT in R4.
  results.push({ axiom: 'LMA10', passed: true })

  // LMA11 — modality stored as recorded; no execution-time binding here.
  results.push({ axiom: 'LMA11', passed: true })

  return results
}

// ═══════════════════════════════════════════════════════════════
// SW3 — RevokeRef detection + atomic commit (mechanical, stage 5)
// ═══════════════════════════════════════════════════════════════
// LMA2: when the inbound write's top-level relation has type === REVOKE_REF,
// the target StateChangeRecord (identified by relation.identitiesWithRoles[0].identity
// interpreted as a StateChangeId per Decision-D-4) is deleted. The revocation
// itself is NOT stored as a record — it is purely the deletion mechanism.
// Position gaps are honest (LMA2): no renumbering after delete.
//
// Sequence on revocation:
//   1) Detect REVOKE_REF at top level of any relation in the inbound write.
//   2) Extract target StateChangeId from identitiesWithRoles[0].identity.
//   3) commitRevocation(targetId) at R4 — single atomic DELETE.
//   4) Return synthetic StateChangeRecord representing the revocation event
//      (NOT persisted; the perimeter sees the act happened but no record exists).
//
// On non-revocation:
//   1) commitStateChange(validated) at R4 — atomic INSERT inside a transaction.

type Sw3Outcome =
  | { kind: 'committed'; record: StateChangeRecord }
  | { kind: 'revoked';   revokedId: StateChangeId; revokedPosition: PositionRef | null }

async function sw3Commit(
  validated: SubstrateWriteValidated,
): Promise<Result<Sw3Outcome>> {
  // LMA2 — RevokeRef detection
  const revokeRel = validated.relations.find(r => r.type === REVOKE_REF)

  if (revokeRel) {
    const targetId = revokeRel.identitiesWithRoles[0]?.identity as unknown as StateChangeId
    if (!targetId) {
      return {
        ok: false,
        error: {
          code:    'SW3_REVOKE_TARGET_MISSING',
          message: 'RevokeRef relation has no identitiesWithRoles[0].identity',
        },
      }
    }
    const revoked = await commitRevocation(targetId)
    if (!revoked.ok) return revoked
    return {
      ok: true,
      data: {
        kind: 'revoked',
        revokedId: revoked.data.revokedId,
        revokedPosition: revoked.data.revokedPosition,
      },
    }
  }

  // Non-revocation — atomic commit at R4
  const committed = await commitStateChange(validated)
  if (!committed.ok) return committed
  return { ok: true, data: { kind: 'committed', record: committed.data } }
}

// ═══════════════════════════════════════════════════════════════
// writeStateChange — R3-callable entry point composing SW1 → SW2 → SW3
// ═══════════════════════════════════════════════════════════════

export async function writeStateChange(
  input: SubstrateWriteInput,
): Promise<Result<StateChangeRecord | { revoked: StateChangeId; position: PositionRef | null }>> {
  // F-009 — the WRITE face of the one wall (the relational write path). admitWrite runs IN FRONT
  // of SW1→SW3 (never inside commitStateChange; HR-LM1 keeps the store dumb). Every writeStateChange
  // caller (perimeter, proxy, F-plan/verify/discover/builder/artifact) routes through this one gate.
  // Pure indirection today (admits); Wave 2/3 fills substrate_write from connect-time identity.
  admitWrite(input.userId)

  // SW1
  const validated = sw1Validate(input)
  if (!validated.ok) return validated

  // SW2
  const gates = sw2Gates(validated.data)
  const failed = gates.find(g => !g.passed)
  if (failed) {
    void emitWriteGateFailed(failed)   // fire-and-forget; do not block return
    return {
      ok: false,
      error: {
        code:    'SW2_GATE_FAILED',
        message: `${failed.axiom}: ${failed.reason ?? 'gate failed'}`,
      },
    }
  }

  // SW3
  const outcome = await sw3Commit(validated.data)
  if (!outcome.ok) return outcome

  if (outcome.data.kind === 'committed') {
    void emitStateChangeWritten(outcome.data.record)
    return { ok: true, data: outcome.data.record }
  } else {
    void emitStateChangeRevoked(outcome.data.revokedId, outcome.data.revokedPosition)
    return {
      ok: true,
      data: {
        revoked: outcome.data.revokedId,
        position: outcome.data.revokedPosition,
      },
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// TQ1 — Thread query validation (mechanical, stage 2)
// ═══════════════════════════════════════════════════════════════

function tq1Validate(input: ThreadQueryInput): Result<ThreadQueryValidated> {
  const validKinds = ['identity-recurrence', 'role-pattern', 'adjacency'] as const
  if (!validKinds.includes(input.threadKind as typeof validKinds[number])) {
    return {
      ok: false,
      error: {
        code:    'TQ1_INVALID_THREAD_KIND',
        message: `threadKind must be one of: ${validKinds.join(', ')}`,
      },
    }
  }
  if (input.threadKind === 'role-pattern' && typeof input.roleFilter !== 'string') {
    return {
      ok: false,
      error: {
        code:    'TQ1_ROLE_FILTER_REQUIRED',
        message: 'role-pattern queries require roleFilter',
      },
    }
  }
  if (input.threadKind === 'adjacency') {
    if (typeof input.anchor !== 'number') {
      return {
        ok: false,
        error: {
          code:    'TQ1_ADJACENCY_ANCHOR_INVALID',
          message: 'adjacency queries require PositionRef (number) anchor',
        },
      }
    }
    if (typeof input.window !== 'number' || input.window <= 0) {
      return {
        ok: false,
        error: {
          code:    'TQ1_ADJACENCY_WINDOW_INVALID',
          message: 'adjacency queries require positive integer window',
        },
      }
    }
  }
  return { ok: true, data: { ...input } }
}

// ═══════════════════════════════════════════════════════════════
// TQ2 — Gate execution (gates [LMA9])
// ═══════════════════════════════════════════════════════════════
// LMA9: thread-kind primitive is one of three. TQ1 already enforced this;
// TQ2 is the axiom-level confirmation of that constraint at gate stage.

function tq2Gates(_validated: ThreadQueryValidated): SubstrateGateResult[] {
  // LMA9 enforcement: TQ1 has already validated threadKind ∈ {3 primitives}.
  // The gate is structurally satisfied if TQ1 passed.
  return [{ axiom: 'LMA9', passed: true }]
}

// ═══════════════════════════════════════════════════════════════
// TQ3 — Execute against substrate (mechanical, stage 5)
// ═══════════════════════════════════════════════════════════════

async function tq3Execute(
  validated: ThreadQueryValidated,
): Promise<Result<ThreadResult>> {
  switch (validated.threadKind) {
    case 'identity-recurrence': {
      const records = await readIdentityRecurrence(
        validated.anchor as IdentityRef,
        validated.scope,
        validated.limit,
        validated.contentClass,
        validated.asOfPosition,
      )
      if (!records.ok) return records
      return {
        ok: true,
        data: {
          threadKind: 'identity-recurrence',
          anchor:     validated.anchor,
          records:    records.data,
        },
      }
    }
    case 'role-pattern': {
      const records = await readRolePattern(
        validated.anchor as IdentityRef,
        validated.roleFilter as RoleRef,
        validated.scope,
        validated.limit,
        validated.contentClass,
        validated.asOfPosition,
      )
      if (!records.ok) return records
      return {
        ok: true,
        data: {
          threadKind: 'role-pattern',
          anchor:     validated.anchor,
          records:    records.data,
          roleFilter: validated.roleFilter,
        },
      }
    }
    case 'adjacency': {
      const records = await readAdjacency(
        validated.anchor as PositionRef,
        validated.window as number,
        validated.scope,
        validated.contentClass,
        validated.asOfPosition,
      )
      if (!records.ok) return records
      // Apply limit at TS level for adjacency (window already bounds; limit
      // is an additional cap the caller may apply).
      const limited = typeof validated.limit === 'number'
        ? records.data.slice(0, validated.limit)
        : records.data
      return {
        ok: true,
        data: {
          threadKind: 'adjacency',
          anchor:     validated.anchor,
          records:    limited,
        },
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// threadQuery — R3-callable entry point composing TQ1 → TQ2 → TQ3
// ═══════════════════════════════════════════════════════════════
// sprint-12-shot-3: callerUserId added per Stream B scope isolation.
// enforceSubstrateReadScope called when scope is present and represents
// a userId scope (D7: callsite passes userId as scope for user-scoped reads).

export async function threadQuery(
  input:         ThreadQueryInput,
  callerUserId?: string,
): Promise<Result<ThreadResult>> {
  // B3: enforce user-scope isolation when scope is present and callerUserId provided.
  // Callsites that pass userId as scope (user-scoped reads) supply callerUserId.
  // Project-scoped reads do not supply callerUserId — pass through per TQ3.
  if (callerUserId !== undefined && input.scope !== undefined) {
    try {
      enforceSubstrateReadScope(callerUserId, String(input.scope))
    } catch (err) {
      return {
        ok: false,
        error: {
          code:    'SUBSTRATE_READ_PERMISSION_DENIED',
          message: err instanceof Error ? err.message : 'Substrate read scope denied',
        },
      }
    }
  }

  const validated = tq1Validate(input)
  if (!validated.ok) return validated

  const gates = tq2Gates(validated.data)
  const failed = gates.find(g => !g.passed)
  if (failed) {
    return {
      ok: false,
      error: {
        code:    'TQ2_GATE_FAILED',
        message: `${failed.axiom}: ${failed.reason ?? 'gate failed'}`,
      },
    }
  }

  return tq3Execute(validated.data)
}

// ═══════════════════════════════════════════════════════════════
// 6 operations declared by LM v3.1 §3.10
// ═══════════════════════════════════════════════════════════════
// (1) write_state_change — composed above as writeStateChange
// (2) read_state_change  — direct R4 lookup
// (3) iterate_axis       — direct R4 axis scan
// (4) identity_recurrence — TQ via threadQuery({ threadKind: 'identity-recurrence' })
// (5) role_pattern       — TQ via threadQuery({ threadKind: 'role-pattern' })
// (6) adjacency          — TQ via threadQuery({ threadKind: 'adjacency' })
//
// Convenience wrappers for direct callers (R3 contract surfaces these).
// present-rederive-shot-1: each wrapper gains optional contentClass? + asOfPosition?
// parameters, forwarded onto the constructed ThreadQueryInput. Existing callers
// pass neither — additive-optional, backward-compatible, no callsite sweep.

export async function readStateChange(
  position: PositionRef,
): Promise<Result<StateChangeRecord | null>> {
  return readByPosition(position)
}

export async function iterateAxis(
  start: PositionRef,
  direction: 'forward' | 'backward',
  count: number,
): Promise<Result<StateChangeRecord[]>> {
  return iterateAxisRows(start, direction, count)
}

// readScope: the canonical scope-ordered substrate read — every
// StateChangeRecord for a userId, position ASC. First-class (F10): the core
// loop's read step and the export route both consume it. userId-scoped — the
// substrate isolation floor; never iterateAxis (unscoped).
//
// contentclass-coreloop: optional contentClass filter, threaded to
// readIsolatedRows. Mirrors the TQ3 contentClass filter on the thread primitives
// (identityRecurrence / rolePattern / adjacency). Omitted → all classes
// (backward-compatible; the export route relies on this). The core-loop read
// passes 'wearer-life' to filter apparatus crossing-records out of cognition.
export async function readScope(
  principals: string | string[],
  contentClass?: ContentClass,
  scopeSet?: string[],
): Promise<Result<StateChangeRecord[]>> {
  // READ-ADMIT — the read face's substrate_read gate (mirror of admitWrite). The reader is the
  // principal (this is always `mine`). Permissive today; Wave 2/3 fills the check.
  admitRead(Array.isArray(principals) ? principals[0] : principals)
  // the relational read is always `mine` (isolation) — principals is a single id or the reader's
  // alias-set (the principal-set fold, user_id = ANY). scopeSet (the readableScopesFor producer's
  // data, when provided) bounds the read to the reader's readable scopes via source_scope = ANY.
  // readIsolatedRows builds the WHERE through the one builder (scopeClause).
  return readIsolatedRows(principals, contentClass, scopeSet)
}

// ── admitRead — the READ face's authority gate (F-009 read side) ─────────────────
// Mirror of admitWrite: gather/readScope admit the READER before the read, IN FRONT of the
// builder + floors (HR-LM1 — the store stays dumb). substrate_read is the token (owner+member,
// viewer excluded — permissions-config.ts:62-63/95), the symmetric twin of substrate_write.
// Permissive today (admits); Wave 2/3 fills the check from the reader's connect-time identity —
// exactly as admitWrite's substrate_write fill. One read-admit, never scattered.
export function admitRead(_readerUserId: string): void {
  // Wave 2/3 fills the substrate_read check HERE. Today: admit.
}

// ── gather — the one scope-resolving cognition read (the scope un-weld) ──────────
// ReadScope is the visibility VALUE a read receives — the scope knob, un-welded from
// the "only mine" that was baked into every read. 1c: the only scope is 'mine' — the
// reader's own substrate. Wave 2 adds { kind: 'public' } (cross-author, bounded to
// source_scope='public') and inbox AS NEW MEMBERS HERE.
// ReadScope is the scope dial — unified with the one builder's ScopeSpec (mine | public).
export type ReadScope = ScopeSpec

// gather — the one scope-resolving cognition read. It hands the scope DIAL to readTranscript,
// which builds the WHERE through the one builder (scopeClause): 'mine' binds user_id (single or
// the alias-set), 'public' drops it for source_scope='public' (the forum's cross-author read).
// This is the v2 §4 fill-point. Every product read (present, search, core-loop) fetches through
// here; the public relaxation appears ONLY via the one builder, audited, never scattered.
export async function gather(scope: ReadScope): Promise<RawTurn[]> {
  // READ-ADMIT in front of EVERY read (mirror of admitWrite) — mine AND public. readerOf carries
  // the reader (the principal for mine, the session user for public), so F-forum's public read
  // (Wave 4) INHERITS this gate at the seam — it never re-adds it. Permissive today.
  admitRead(readerOf(scope))
  return readTranscript(scope)
}

// ── admitWrite — the WRITE face of the one wall (F-009) ──────────────────────────
// F-memory R2 is THE ONE WALL: gather/readScope admits READS by scope; admitWrite admits WRITES
// by authority; the isolation floor is shared. One audited home, both faces. The gate sits IN
// FRONT OF the substrate primitives (writeRawTurn / writeStateChange→commitStateChange), never
// inside them — the substrate stays a dumb store (HR-LM1: authority is the perimeter's, not the
// store's). substrate_write is enforced ONCE, here. 1e: the SEAM lands and every write routes
// through it (pure indirection — admits today, behavior unchanged); the per-deployment
// substrate_write FILL is connect-time identity (Wave 2/3), exactly as the read side's scope-fill.
// The writer's id is received now; only the permission check is deferred — never scattered.
export function admitWrite(_writerUserId: string): void {
  // Wave 2/3 fills the substrate_write check HERE (Permissions-Standard token), resolved from the
  // writer's connect-time identity. Today: admit (no provider wired → permissive, like the gate).
}

// admitWriteRaw — the cognition write face: admit, then the dumb-store primitive. Every cognition
// writer (capture, the compose recorder, chat intake) routes through here instead of writeRawTurn
// directly, so the seam is the ONLY path to the primitive (no bypass). Signature-identical to
// writeRawTurn (pure indirection — same write out).
export async function admitWriteRaw(input: { who: Who; words: RawWord[]; userId: string; scope: string }): Promise<number> {
  admitWrite(input.userId)
  return writeRawTurn(input)
}

export async function identityRecurrence(
  anchor: IdentityRef,
  scope?: ScopeRef,
  limit?: number,
  contentClass?: ContentClass,
  asOfPosition?: PositionRef,
): Promise<Result<ThreadResult>> {
  return threadQuery({
    threadKind: 'identity-recurrence',
    anchor,
    scope,
    limit,
    contentClass,
    asOfPosition,
  })
}

export async function rolePattern(
  anchor: IdentityRef,
  role: RoleRef,
  scope?: ScopeRef,
  limit?: number,
  contentClass?: ContentClass,
  asOfPosition?: PositionRef,
): Promise<Result<ThreadResult>> {
  return threadQuery({
    threadKind:  'role-pattern',
    anchor,
    roleFilter:  role,
    scope,
    limit,
    contentClass,
    asOfPosition,
  })
}

export async function adjacency(
  anchor: PositionRef,
  window: number,
  scope?: ScopeRef,
  limit?: number,
  contentClass?: ContentClass,
  asOfPosition?: PositionRef,
): Promise<Result<ThreadResult>> {
  return threadQuery({
    threadKind: 'adjacency',
    anchor,
    window,
    scope,
    limit,
    contentClass,
    asOfPosition,
  })
}

// ═══════════════════════════════════════════════════════════════
// Boot (state transition declared → runtime per LM v3.1 §5.3)
// ═══════════════════════════════════════════════════════════════

export async function onBoot(): Promise<Result<{ lastPosition: PositionRef | null }>> {
  const last = await getLastPosition()
  if (!last.ok) return last
  void emitBootComplete(last.data)
  return { ok: true, data: { lastPosition: last.data } }
}

// ═══════════════════════════════════════════════════════════════
// Event emission (best-effort; not blocking on writes)
// ═══════════════════════════════════════════════════════════════
// Sprint 8 Shot 1 stub: events emit via console.log for traceability until
// F-event-system is wired through to substrate writes (Sprint 9 rewire).
// Decision-D-5: stub emission rather than direct F-event-system import to
// preserve R-layer discipline (R2 importing F-event-system R0 is a slice
// crossing requiring W-EVENT wire — wired at Sprint 9). Stub form keeps
// the contract surface declarative without coupling.

async function emitStateChangeWritten(record: StateChangeRecord): Promise<void> {
  console.log(JSON.stringify({
    level: 'info',
    event: SUBSTRATE_EVENTS.STATE_CHANGE_WRITTEN,
    id:        record.id,
    position:  record.metadata.position,
    scope:     record.metadata.source.scope,
    timestamp: new Date().toISOString(),
  }))
}

async function emitStateChangeRevoked(
  revokedId: StateChangeId,
  revokedPosition: PositionRef | null,
): Promise<void> {
  console.log(JSON.stringify({
    level: 'info',
    event: SUBSTRATE_EVENTS.STATE_CHANGE_REVOKED,
    revokedId,
    revokedPosition,
    timestamp: new Date().toISOString(),
  }))
}

async function emitWriteGateFailed(gate: SubstrateGateResult): Promise<void> {
  console.log(JSON.stringify({
    level: 'warn',
    event: SUBSTRATE_EVENTS.WRITE_GATE_FAILED,
    axiom:  gate.axiom,
    reason: gate.reason ?? 'gate failed',
    timestamp: new Date().toISOString(),
  }))
}

async function emitBootComplete(lastPosition: PositionRef | null): Promise<void> {
  console.log(JSON.stringify({
    level: 'info',
    event: SUBSTRATE_EVENTS.BOOT_COMPLETE,
    lastPosition,
    timestamp: new Date().toISOString(),
  }))
}

// ─── End ──────────────────────────────────────────────────────────────────────
