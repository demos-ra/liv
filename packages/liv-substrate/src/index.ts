// @liv-standard v1.5.2
// Built with LIV · livai.dev
// liv-substrate — the portable unit. The store + its surface + its body + its pool
// + the fuse point, as one self-sufficient package: typed writes in, raw reads out,
// with no LIV server present. Only raw words travel; marks and the present are
// never stored — they recompose on arrival, in the engine, wherever the store lands.
//
// Law 2 (storage moves house): this barrel is the whole box. `pg` is the single
// runtime dependency; a DATABASE_URL and the `state_change` table are all the store
// needs to run live.

// ── The store surface (the socket) ─────────────────────────────────────────────
export {
  writeRawTurn,
  readTranscript,
  readScope,
  cutCells,
  joinCells,
  isWordCell,
} from './surface/substrate-store'

// ── The fuse point (where the engine plugs in; empty → baseline store) ─────────
export {
  registerReplyComposer,
  registerContextReader,
  getReplyComposer,
  getContextReader,
  markCognitionEnsured,
  isCognitionEnsured,
  resetCognitionSeam,
} from './seam/cognition-seam'
export type {
  CognitionInput,
  CognitionResult,
  ReplyComposer,
  ContextReader,
} from './seam/cognition-seam'

// ── The raw pool (lifecycle) ────────────────────────────────────────────────────
export { db, closeDb } from './db/client'
export type { DbPool } from './db/client'

// ── Atoms (the unit: raw words + coordinates; relational records read back) ────
export type {
  Who,
  Coord,
  RawWord,
  RawTurn,
  Transcript,
} from './types/substrate-raw.types'
export type {
  StateChangeRecord,
  StateChangeId,
  PositionRef,
  ScopeRef,
  IdentityRef,
  RoleRef,
  Relation,
  RelationModality,
  IdentityWithRole,
  SubstrateSourceRef,
  SourceChannel,
  ContentClass,
} from './types/substrate.types'
export type { Result, AppError } from './types/primitives'
