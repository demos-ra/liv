// @liv-standard v1.5.2
// @present-standard v2.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/dispatch-read.ts]
// Sprint 2 — Shot 2; present-rederive — Shot 3 (v2.0 domain re-wire)
//
// PR4 — focus/ordering/standpoint dispatch onto the LMA9 read primitives,
//        per Present Standard v2.0 §3.7.
//
// v2.0 re-derivation: dispatch is keyed on the three PresentIntent dimensions,
// not on a five-arm operation.kind. The `focus` dimension selects the read
// primitive; the `standpoint` dimension supplies the Reading-A ceiling.
//
//   focus 'identity'      → threadQuery({ threadKind: 'identity-recurrence' })
//   focus 'identity-role' → threadQuery({ threadKind: 'role-pattern' })
//   focus 'density'       → threadQuery({ threadKind: 'identity-recurrence' }) on
//                           the userId seed, then crystallize the densest identity
//
// Reading-A wiring (the standpoint dimension):
//   standpoint non-null → every thread read this dispatch issues passes
//     `asOfPosition: standpoint`, ceiling the read to the snapshot position —
//     the substrate as it actually stood at that chain position.
//   standpoint null → no asOfPosition is passed — the live present.
//   PrA6 substrate-read closure stays at the LMA9 thread primitives;
//   asOfPosition? is a parameter on them (LM v3.5), not a new primitive.
//
// ContentClass filter discipline (per LMA13 + §3.7 PR4):
//   All three focus arms are anchor-candidate reads → pass contentClass:
//   'wearer-life'. (The v1.0.1 full-state reads — move-neighborhood,
//   move-trajectory — are not v2.0 focus arms; they collapsed into the one
//   operation per the Phase-four grid. A wearer wanting a position-anchored or
//   trajectory view expresses it through standpoint + ordering, not a separate
//   operation; those views are out of the focus-keyed read path and ride the
//   identity/role primitives ceilinged by standpoint.)
//
// One ReadPrimitiveTrace is emitted per primitive invocation per §2.1.
//
// Imports: runtime functions from substrate-contract R3 (cross-slice via A5);
//          typed atoms from core/types/substrate.types (core import, established pattern).

import { threadQuery } from '@/features/F-memory/contract/substrate-contract'

import type {
  StateChangeRecord,
  IdentityRef,
  PositionRef,
  ContentClass,
  ThreadQueryInput,
} from '@/core/types/substrate.types'

import type {
  PresentIntent,
  AnchorTrace,
  ReadPrimitiveTrace,
} from '../config/present-types'

import type { PresentResult } from '../config/present-errors'

// ── Return shape ──────────────────────────────────────────────────────────────

export type DispatchReadResult = {
  records:            StateChangeRecord[]
  traces:             ReadPrimitiveTrace[]
  crystallizedAnchor: AnchorTrace
}

// ── Main dispatch ─────────────────────────────────────────────────────────────

export async function dispatchRead(
  intent: PresentIntent,
  anchor: AnchorTrace,
): Promise<PresentResult<DispatchReadResult>> {
  const traces: ReadPrimitiveTrace[] = []

  // Reading-A ceiling: non-null standpoint → asOfPosition on every thread read.
  const asOf: PositionRef | undefined =
    intent.standpoint !== null ? intent.standpoint : undefined

  switch (intent.focus.kind) {

    // ── focus 'identity' → identity-recurrence ────────────────────────────────
    case 'identity': {
      const identityAnchor = anchor.derivedAs.identity!
      const query: ThreadQueryInput = {
        threadKind:   'identity-recurrence',
        anchor:       identityAnchor,
        scope:        intent.scopeRef,
        contentClass: 'wearer-life' as ContentClass,
        limit:        intent.bound.maxNodes,
        ...(asOf !== undefined ? { asOfPosition: asOf } : {}),
      }
      const result = await threadQuery(query, intent.userId)
      if (!result.ok) {
        return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: result.error.message, underlying: result.error } }
      }
      traces.push({
        primitive:          'identity-recurrence',
        parameters:         { userId: intent.userId, anchor: identityAnchor, scope: intent.scopeRef, limit: intent.bound.maxNodes, ...(asOf !== undefined ? { asOfPosition: asOf } : {}) },
        recordCount:        result.data.records.length,
        contentClassFilter: 'wearer-life' as ContentClass,
        ...(asOf !== undefined ? { asOfPosition: asOf } : {}),
      })
      return {
        ok: true,
        data: {
          records:            result.data.records,
          traces,
          crystallizedAnchor: anchor,   // wearer-supplied; no crystallization needed
        },
      }
    }

    // ── focus 'identity-role' → role-pattern ──────────────────────────────────
    case 'identity-role': {
      const identityAnchor = anchor.derivedAs.identity!
      const roleAnchor     = anchor.derivedAs.role!
      const query: ThreadQueryInput = {
        threadKind:   'role-pattern',
        anchor:       identityAnchor,
        roleFilter:   roleAnchor,
        scope:        intent.scopeRef,
        contentClass: 'wearer-life' as ContentClass,
        limit:        intent.bound.maxNodes,
        ...(asOf !== undefined ? { asOfPosition: asOf } : {}),
      }
      const result = await threadQuery(query, intent.userId)
      if (!result.ok) {
        return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: result.error.message, underlying: result.error } }
      }
      traces.push({
        primitive:          'role-pattern',
        parameters:         { userId: intent.userId, anchor: identityAnchor, roleFilter: roleAnchor, scope: intent.scopeRef, limit: intent.bound.maxNodes, ...(asOf !== undefined ? { asOfPosition: asOf } : {}) },
        recordCount:        result.data.records.length,
        contentClassFilter: 'wearer-life' as ContentClass,
        ...(asOf !== undefined ? { asOfPosition: asOf } : {}),
      })
      return {
        ok: true,
        data: {
          records:            result.data.records,
          traces,
          crystallizedAnchor: anchor,   // wearer-supplied; no crystallization needed
        },
      }
    }

    // ── focus 'density' → identity-recurrence on seed, then crystallize ───────
    case 'density': {
      const seedIdentity = anchor.derivedAs.identity!   // userId seed cast at PR3
      const rule         = anchor.rule ?? 'identity-density'
      const query: ThreadQueryInput = {
        threadKind:   'identity-recurrence',
        anchor:       seedIdentity,
        scope:        intent.scopeRef,
        contentClass: 'wearer-life' as ContentClass,
        limit:        intent.bound.maxNodes,
        ...(asOf !== undefined ? { asOfPosition: asOf } : {}),
      }
      const result = await threadQuery(query, intent.userId)
      if (!result.ok) {
        return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: result.error.message, underlying: result.error } }
      }

      // Crystallize the densest identity in the result. If empty, seed is retained.
      const crystallizedIdentity = crystallizeDensestIdentity(result.data.records, seedIdentity, rule)

      traces.push({
        primitive:          'identity-recurrence',
        parameters:         { userId: intent.userId, anchor: seedIdentity, scope: intent.scopeRef, limit: intent.bound.maxNodes, crystallizationRule: rule, ...(asOf !== undefined ? { asOfPosition: asOf } : {}) },
        recordCount:        result.data.records.length,
        contentClassFilter: 'wearer-life' as ContentClass,
        ...(asOf !== undefined ? { asOfPosition: asOf } : {}),
      })

      const crystallizedAnchor: AnchorTrace = {
        source:    'system-derived',
        derivedAs: { identity: crystallizedIdentity },
        rule,
      }

      return {
        ok: true,
        data: {
          records:            result.data.records,
          traces,
          crystallizedAnchor,
        },
      }
    }
  }
}

// ── Crystallization helper (density focus) ────────────────────────────────────
// Counts identity occurrences across all records; returns the most-frequent.
// Stable: on count tie, the identity that appeared first in record order wins.
// 'position-density' uses the same single read result per the Shape-A discipline
// carried from v1.0.1 — density here means recurrence across records, the
// available signal from one identity-recurrence read.

function crystallizeDensestIdentity(
  records: StateChangeRecord[],
  seed:    IdentityRef,
  _rule:   'identity-density' | 'position-density',
): IdentityRef {
  if (records.length === 0) return seed

  const counts = new Map<string, number>()
  for (const record of records) {
    for (const id of record.content.identities) {
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }

  let best: IdentityRef = seed
  let bestCount = counts.get(seed as string) ?? 0

  for (const [id, count] of counts) {
    if (count > bestCount) {
      best      = id as IdentityRef
      bestCount = count
    }
  }

  return best
}
