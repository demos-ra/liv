// @liv-standard v1.5.2
// @present-standard v2.0
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/present-service.ts]
// Sprint 2 — Shot 5; present-rederive — Shot 3 (v2.0 domain re-wire)
//
// R2 — Orchestration layer. Composes PR1→PR8 in sequence per Present Standard v2.0 §3.7.
//
// PR1  validateIntent    — J-intent-binding (the three dimensions of PresentIntent)
// PR2  authorizeIntent   — PS handshake mechanics (userId + scopeRef presence)
// PR3  deriveAnchor      — AnchorTrace dispatch on focus + standpoint
// PR4  dispatchRead      — focus/ordering/standpoint dispatch onto LMA9 primitives
//                          + ContentClass filter + Reading-A asOfPosition ceiling
// PR5  composeView       — Option C weighting, LMA5 cluster, LMA3 relations
// PR6  emitView          — PresentViewEmission via writeStateChange (atomic, LMA4)
// PR7  runGates          — PrG1–PrG8 runtime audit harness
// PR8  deliverView       — ViewBound enforcement + consumer return
//
// v2.0 re-derivation:
//   - The wearer-callable input is PresentIntent (one operation, three dimensions).
//   - composeView receives the `ordering` dimension directly; perspective IS the
//     ordering selector (no operation/parameter pair).
//   - PresentView.provenance.operationApplied is REMOVED (the verb layer collapsed
//     to one member; the field recorded a dimension with nothing behind it).
//
// emittedAt: stamped here (service layer) at the point between PR4 and PR5.

import { validateIntent }  from '../domain/validate-intent'
import { authorizeIntent } from '../domain/authorize-intent'
import { deriveAnchor }    from '../domain/derive-anchor'
import { dispatchRead }    from '../domain/dispatch-read'
import { composeView }     from '../domain/compose-view'
import { emitView }        from '../domain/emit-view'
import { runGates }        from '../domain/run-gates'
import { deliverView }     from '../domain/deliver-view'
import { generateId }      from '@/core/types/primitives'

import type { PresentIntent, PresentView, ViewIdRef } from '../config/present-types'
import type { PresentResult }                         from '../config/present-errors'

export async function presentService(intent: PresentIntent): Promise<PresentResult<PresentView>> {

  // PR1
  const v1 = validateIntent(intent)
  if (!v1.ok) return v1

  // PR2
  const v2 = authorizeIntent(v1.data)
  if (!v2.ok) return v2

  // PR3
  const anchorTrace = deriveAnchor(v2.data)

  // PR4
  const r4 = await dispatchRead(v2.data, anchorTrace)
  if (!r4.ok) return r4

  // Stamp emittedAt between PR4 and PR5 (service layer owns temporal stamp per §3.7)
  const emittedAt = Date.now()
  const viewId    = generateId('view') as unknown as ViewIdRef

  // PR5 — compose-view receives the ordering dimension; perspective IS the ordering
  const { composition, weightingTrace } = composeView({
    records:  r4.data.records,
    anchor:   r4.data.crystallizedAnchor,
    ordering: v2.data.ordering,
    bound:    v2.data.bound,
  })

  // Assemble PresentView candidate (emission id added to provenance after PR6)
  let view: PresentView = {
    viewId,
    derivedFromIntent: v2.data,
    emittedAt,
    composition,
    provenance: {
      sourceStateChangeIds: r4.data.records.map(r => r.id),
      readPrimitivesUsed:   r4.data.traces,
      anchorDerived:        r4.data.crystallizedAnchor,
      weightingApplied:     weightingTrace,
    },
    reversibility: {
      appealCourtIs:    'substrate-state-change-table',
      replayDiscipline: 'invoke F-present with same PresentIntent → equivalent PresentView per PrA8',
    },
  }

  // PR6
  const emission = await emitView({ view, intent: v2.data })
  if (!emission.ok) return emission

  // Append emission id to provenance (LMA4: the emission is itself a state-change witnessing this view)
  view = {
    ...view,
    provenance: {
      ...view.provenance,
      sourceStateChangeIds: [...view.provenance.sourceStateChangeIds, emission.data],
    },
  }

  // PR7
  const gates = runGates({
    intent:               v2.data,
    view,
    emissionId:           emission.data,
    emissionChannel:      'internal-derivation',
    emissionContentClass: 'system-introspection',
    readsLog:             r4.data.traces,
    writesLog: [{
      channel:      'internal-derivation',
      contentClass: 'system-introspection',
      userId:       v2.data.userId,
      scope:        v2.data.scopeRef as string,
    }],
  })

  if (!gates.overall) {
    const failed = gates.gates.find(g => !g.pass)
    return {
      ok: false,
      error: {
        code:       'PRESENT_GATE_FAILED',
        failedGate: failed!.id as 'PrG1' | 'PrG2' | 'PrG3' | 'PrG4' | 'PrG5' | 'PrG6' | 'PrG7' | 'PrG8',
        message:    failed!.detail ?? `gate ${failed!.id} failed`,
      },
    }
  }

  // PR8
  return deliverView({ view, intent: v2.data })
}
