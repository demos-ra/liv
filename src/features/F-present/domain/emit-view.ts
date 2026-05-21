// @liv-standard v1.5.2
// @present-standard v2.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/emit-view.ts]
// Sprint 2 — Shot 3; present-rederive — Shot 3 (v2.0 domain re-wire)
//
// PR6 — PresentViewEmission via writeStateChange per Present Standard v2.0 §3.7 + §2.1.
//
// PresentViewEmission ≡ SubstrateWriteInput where (PrA3 non-negotiables):
//   source.channel      = 'internal-derivation'
//   source.contentClass = 'system-introspection'
//   source.scope        = intent.scopeRef
//   carrier             = 'self' (Present Standard §2.1; no external handoff at write time)
//
// LMA4: atomic write — one writeStateChange call per emission.
// Returns StateChangeId of the committed record so service can stamp
// PresentView.provenance.sourceStateChangeIds.
//
// SubstrateWriteInput shape (source-of-truth substrate.types.ts):
//   userId:   string
//   content:  { identities: IdentityRef[]; relations: Relation[] }
//   metadata: { time: number; source: SubstrateSourceRef }
//
// content.identities encodes the view identity:
//   [0] viewId               — the view being emitted (primary identity)
//   [1] intent.intentId      — the intent that produced this view
//   [2] intent.consumerRef   — consuming slice identity
//   [3] intent.focus.kind as IdentityRef — focus kind applied (v2.0: replaces
//       the v1.0.1 operation.kind label; the verb is now always `present`, so
//       the focus dimension is the stable identity label for what was emitted)
//
// content.relations: [] (empty — the emission is a presence record, not a relation record).
//
// Imports: writeStateChange from substrate-contract R3 (cross-slice via A5).

import { writeStateChange } from '@/features/F-memory/contract/substrate-contract'

import type {
  StateChangeId,
  IdentityRef,
} from '@/core/types/substrate.types'

import type { PresentView, PresentIntent } from '../config/present-types'
import type { PresentResult } from '../config/present-errors'

export async function emitView(input: {
  view:   PresentView
  intent: PresentIntent
}): Promise<PresentResult<StateChangeId>> {
  const { view, intent } = input

  const emission = {
    userId: intent.userId,
    content: {
      identities: [
        view.viewId        as unknown as IdentityRef,   // viewId branded string → IdentityRef
        intent.intentId    as unknown as IdentityRef,   // intentId branded string → IdentityRef
        intent.consumerRef as unknown as IdentityRef,   // FrameworkRef → IdentityRef (slice-name identity)
        intent.focus.kind  as IdentityRef,              // v2.0: focus kind as identity label
      ] satisfies IdentityRef[],
      relations: [] as [],
    },
    metadata: {
      time:   view.emittedAt,     // ms epoch stamped by service before calling emitView
      source: {
        channel:      'internal-derivation' as const,
        contentClass: 'system-introspection' as const,
        scope:        intent.scopeRef,
      },
    },
  }

  const result = await writeStateChange(emission)

  if (!result.ok) {
    return {
      ok: false,
      error: {
        code:       'PRESENT_EMISSION_REJECTED',
        message:    result.error.message,
        underlying: result.error,
      },
    }
  }

  // writeStateChange returns StateChangeRecord | { revoked: ...; position: ... }
  // A revoke outcome is structurally impossible here (no REVOKE_REF in emission identities).
  // Guard for type safety — treat as rejection if somehow triggered.
  const data = result.data
  if ('revoked' in data) {
    return {
      ok: false,
      error: {
        code:    'PRESENT_EMISSION_REJECTED',
        message: 'unexpected revoke outcome on PresentViewEmission write — structural violation',
      },
    }
  }

  return { ok: true, data: data.id }
}
