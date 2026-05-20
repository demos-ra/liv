// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/present-service.ts]
// Sprint 2 — Shot 5
//
// R2 — Orchestration layer. Composes PR1→PR8 in sequence per Present Standard v1.0.1 §3.7.
//
// PR1  validateIntent    — J-operation-binding six criteria C1–C6
// PR2  authorizeIntent   — PS handshake mechanics (userId + scopeRef presence)
// PR3  deriveAnchor      — AnchorTrace dispatch on operation.kind
// PR4  dispatchRead      — LMA9 primitive dispatch + ContentClass filter
// PR5  composeView       — Option C weighting, LMA5 cluster, LMA3 relations
// PR6  emitView          — PresentViewEmission via writeStateChange (atomic, LMA4)
// PR7  runGates          — PrG1–PrG8 runtime audit harness
// PR8  deliverView       — ViewBound enforcement + consumer return
//
// Shot 5 resolves the PerspectiveDeclaration.direction surface from Shot 3:
//   compose-view now receives OperationParameter alongside WearerOperation so that
//   move-trajectory can populate perspective.direction from parameter.direction.
//   compose-view signature extended accordingly (see compose-view.ts amendment note).
//
// emittedAt: stamped here (service layer) at the point between PR4 and PR5,
//   before compose and emit. compose-view receives it as part of the view scaffold;
//   emit-view uses it as metadata.time.

import { validateIntent }  from '../domain/validate-intent'
import { authorizeIntent } from '../domain/authorize-intent'
import { deriveAnchor }    from '../domain/derive-anchor'
import { dispatchRead }    from '../domain/dispatch-read'
import { composeView }     from '../domain/compose-view'
import { emitView }        from '../domain/emit-view'
import { runGates }        from '../domain/run-gates'
import { deliverView }     from '../domain/deliver-view'
import { generateId }      from '@/core/types/primitives'

import type { PresentReadIntent, PresentView, ViewIdRef } from '../config/present-types'
import type { PresentResult }                              from '../config/present-errors'
import type { StateChangeId }                              from '@/core/types/substrate.types'

export async function presentService(intent: PresentReadIntent): Promise<PresentResult<PresentView>> {

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

  // PR5 — compose-view receives OperationParameter for perspective.direction resolution
  const { composition, weightingTrace } = composeView({
    records:   r4.data.records,
    anchor:    r4.data.crystallizedAnchor,
    operation: v2.data.operation,
    parameter: v2.data.parameter,
    bound:     v2.data.bound,
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
      operationApplied:     v2.data.operation,
      anchorDerived:        r4.data.crystallizedAnchor,
      weightingApplied:     weightingTrace,
    },
    reversibility: {
      appealCourtIs:    'substrate-state-change-table',
      replayDiscipline: 'invoke F-present with same PresentReadIntent → equivalent PresentView per PrA8',
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
