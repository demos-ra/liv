// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/dispatch-read.ts]
// Sprint 2 — Shot 2
//
// PR4 — Operation → LMA9 primitive dispatch per Present Standard v1.0.1 §3.7.
//
// ContentClass filter discipline (per LMA13 + spec §3.7 PR4):
//   Anchor-candidate reads (search-by-identity, search-by-role, default-entry)
//     → pass contentClass: 'wearer-life'
//   Full state reads (move-neighborhood, move-trajectory)
//     → omit contentClass filter
//
// 4 LMA9 read primitives used (non-negotiable per spec §1):
//   threadQuery({ threadKind: 'identity-recurrence' })  — search-by-identity, default-entry
//   threadQuery({ threadKind: 'role-pattern' })         — search-by-role
//   threadQuery({ threadKind: 'adjacency' })            — move-neighborhood
//   iterateAxis(start, direction, count)                — move-trajectory
//
// Shape A (default-entry crystallization):
//   Single read on userId seed via identity-recurrence.
//   If the result contains at least one identity, the most-recurrent identity
//   (first record's leading identity) becomes the crystallized anchor.
//   Otherwise the seed is retained as crystallized anchor.
//   Rationale: Shape A satisfies PrA7 (no cached state) and performs one LMA9
//   invocation instead of two. Standard does not require Shape B. Preferred.
//
// One ReadPrimitiveTrace is emitted per primitive invocation per §2.1.
//
// Imports: runtime functions from substrate-contract R3 (cross-slice via A5);
//          typed atoms from core/types/substrate.types (core import, established pattern).

import { threadQuery, iterateAxis } from '@/features/F-memory/contract/substrate-contract'

import type {
  StateChangeRecord,
  IdentityRef,
  PositionRef,
  ContentClass,
} from '@/core/types/substrate.types'

import type {
  PresentReadIntent,
  AnchorTrace,
  ReadPrimitiveTrace,
  OperationParameter,
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
  intent: PresentReadIntent,
  anchor: AnchorTrace,
): Promise<PresentResult<DispatchReadResult>> {
  const traces: ReadPrimitiveTrace[] = []

  switch (intent.operation.kind) {

    // ── search-by-identity ────────────────────────────────────────────────────
    case 'search-by-identity': {
      const identityAnchor = anchor.derivedAs.identity!
      const result = await threadQuery(
        {
          threadKind:   'identity-recurrence',
          anchor:       identityAnchor,
          scope:        intent.scopeRef,
          contentClass: 'wearer-life' as ContentClass,
          limit:        intent.bound.maxNodes,
        },
        intent.userId,
      )
      if (!result.ok) {
        return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: result.error.message, underlying: result.error } }
      }
      traces.push({
        primitive:           'identity-recurrence',
        parameters:          { userId: intent.userId, anchor: identityAnchor, scope: intent.scopeRef, limit: intent.bound.maxNodes },
        recordCount:         result.data.records.length,
        contentClassFilter:  'wearer-life' as ContentClass,
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

    // ── search-by-role ────────────────────────────────────────────────────────
    case 'search-by-role': {
      const identityAnchor = anchor.derivedAs.identity!
      const roleAnchor     = anchor.derivedAs.role!
      const result = await threadQuery(
        {
          threadKind:   'role-pattern',
          anchor:       identityAnchor,
          roleFilter:   roleAnchor,
          scope:        intent.scopeRef,
          contentClass: 'wearer-life' as ContentClass,
          limit:        intent.bound.maxNodes,
        },
        intent.userId,
      )
      if (!result.ok) {
        return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: result.error.message, underlying: result.error } }
      }
      traces.push({
        primitive:           'role-pattern',
        parameters:          { userId: intent.userId, anchor: identityAnchor, roleFilter: roleAnchor, scope: intent.scopeRef, limit: intent.bound.maxNodes },
        recordCount:         result.data.records.length,
        contentClassFilter:  'wearer-life' as ContentClass,
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

    // ── move-neighborhood ─────────────────────────────────────────────────────
    case 'move-neighborhood': {
      const positionAnchor = anchor.derivedAs.position!
      const param = intent.parameter as Extract<OperationParameter, { kind: 'move-neighborhood' }>
      const result = await threadQuery(
        {
          threadKind: 'adjacency',
          anchor:     positionAnchor as unknown as IdentityRef,   // adjacency anchor is PositionRef; ThreadQueryInput union permits both
          scope:      intent.scopeRef,
          window:     param.window,
          limit:      intent.bound.maxNodes,
          // contentClass omitted — full state traversal per PR4 discipline
        },
        intent.userId,
      )
      if (!result.ok) {
        return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: result.error.message, underlying: result.error } }
      }
      // Post-filter by relationFilter if present
      let records = result.data.records
      if (param.relationFilter) {
        records = records.filter(r => r.content.relations.some(rel => rel.identitiesWithRoles.some(iwr => iwr.identity === param.relationFilter)))
      }
      traces.push({
        primitive:    'adjacency',
        parameters:   { userId: intent.userId, anchor: positionAnchor, scope: intent.scopeRef, window: param.window, limit: intent.bound.maxNodes },
        recordCount:  records.length,
        // contentClassFilter omitted — no filter applied
      })
      return {
        ok: true,
        data: {
          records,
          traces,
          crystallizedAnchor: anchor,
        },
      }
    }

    // ── move-trajectory ───────────────────────────────────────────────────────
    case 'move-trajectory': {
      const positionAnchor = anchor.derivedAs.position!
      const param = intent.parameter as Extract<OperationParameter, { kind: 'move-trajectory' }>
      const result = await iterateAxis(positionAnchor, param.direction, param.count)
      if (!result.ok) {
        return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: result.error.message, underlying: result.error } }
      }
      // Post-filter by relationFilter if present
      let records = result.data
      if (param.relationFilter) {
        records = records.filter(r => r.content.relations.some(rel => rel.identitiesWithRoles.some(iwr => iwr.identity === param.relationFilter)))
      }
      traces.push({
        primitive:   'iterate-axis',
        parameters:  { userId: intent.userId, start: positionAnchor, direction: param.direction, count: param.count },
        recordCount: records.length,
        // contentClassFilter omitted — full state traversal
      })
      return {
        ok: true,
        data: {
          records,
          traces,
          crystallizedAnchor: anchor,
        },
      }
    }

    // ── default-entry (Shape A) ───────────────────────────────────────────────
    case 'default-entry': {
      const seedIdentity   = anchor.derivedAs.identity!   // userId cast at PR3
      const rule           = anchor.rule ?? 'identity-density'
      const result = await threadQuery(
        {
          threadKind:   'identity-recurrence',
          anchor:       seedIdentity,
          scope:        intent.scopeRef,
          contentClass: 'wearer-life' as ContentClass,
          limit:        intent.bound.maxNodes,
        },
        intent.userId,
      )
      if (!result.ok) {
        return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: result.error.message, underlying: result.error } }
      }

      // Crystallize anchor: find most-recurrent identity in result.
      // Shape A: the same records serve both crystallization and view composition.
      // Most-recurrent = identity appearing in the most records (first leading identity wins on tie).
      // If result is empty, seed is retained.
      const crystallizedIdentity = crystallizeDensestIdentity(result.data.records, seedIdentity, rule)

      traces.push({
        primitive:           'identity-recurrence',
        parameters:          { userId: intent.userId, anchor: seedIdentity, scope: intent.scopeRef, limit: intent.bound.maxNodes, crystallizationRule: rule },
        recordCount:         result.data.records.length,
        contentClassFilter:  'wearer-life' as ContentClass,
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

// ── Crystallization helper (default-entry Shape A) ────────────────────────────
// Counts identity occurrences across all records; returns the most-frequent.
// Stable: on count tie, the identity that appeared first in record order wins.
// 'position-density' rule uses the same read result (single read per Shape A);
// density here means recurrence across records, which is the available signal
// from a single identity-recurrence read.

function crystallizeDensestIdentity(
  records:      StateChangeRecord[],
  seed:         IdentityRef,
  _rule:        'identity-density' | 'position-density',
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
