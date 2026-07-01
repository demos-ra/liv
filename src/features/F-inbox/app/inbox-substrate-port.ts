// @liv-standard v1.5.2
// [F-inbox/R2]
// Built with LIV · livai.dev
// [F-inbox/app/inbox-substrate-port.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-inbox
// category:   Domain-loop
// layer:      R2
// wires-in:
//   W-FN     admitWriteRaw / gather / mine / cutCells   @/features/F-memory/contract/substrate-contract  (the ONE substrate face)
//   W-ATOM   SubstratePort                              ./inbox-workflow
// wires-out:
//   W-ATOM   livePort  →  F-inbox/R2 inbox-bus, F-inbox/R3
// deps:
//   R3  @/features/F-memory/contract/substrate-contract  (allowed wire — the substrate face)
//   R2  ./inbox-workflow
// validated:  pending
//
// The ONE place F-memory's substrate face is bound as live values — the DI binding home (the
// inbox-workflow takes an injected SubstratePort; this file supplies the live one). STATIC import:
// the barrel load-cycle is fixed at root (event-schema reads SUBSTRATE_EVENTS from the lean
// substrate-events-contract, not the full barrel), so this is a clean import, not a dodge.
// admitWriteRaw is the sealed cognition write; gather/mine the sealed read; cutCells the canonical
// cutter — F-inbox adds nothing, it only stacks these existing primitives.

import { admitWriteRaw, gather, mine, cutCells } from '@/features/F-memory/contract/substrate-contract'
import type { SubstratePort } from './inbox-workflow'

export const livePort: SubstratePort = {
  write:  admitWriteRaw,
  cut:    cutCells,
  gather,
  mine,
}
