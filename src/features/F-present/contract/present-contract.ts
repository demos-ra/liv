// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/present-contract.ts]
// Sprint 2 — Shot 1; read-engine (the lens re-derivation):
//   the v6.0 frame/intent/archive re-export set is gone with present-types /
//   present-errors / present-trpc / present-service; the read surface is now the
//   engine's rendered present. present() and the v6.0 presentRouter re-exports
//   are stripped; readPresent + presentRouter come from read-surface.ts.
//
// Public R3 boundary for F-present. External consumers MUST import from this
// surface only. Do NOT reach into F-present R0/R1/R2/R4 directly.

// The read surface — the removable lens, rendered to context text.
export { readPresent, presentRouter } from './read-surface'

// The cognition composition wire. F-event-system bootstrap() and F-chat call
// this to register F-present's write-compose + read-front upgraders into the core
// cognition seam. The single removable wire: drop the call + this slice and the
// core loop runs its baseline.
export { registerCognitionUpgrades } from '../app/cognition-orchestrator'
