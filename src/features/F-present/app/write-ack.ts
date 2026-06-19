// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-engine — the honest acknowledgement)
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/write-ack.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-present
// layer:      R2
// wires-in:
//   W-ATOM  RecordedTurn  @/features/F-present/app/scored-turn-recorder  (the recorder's return — type-only, same-slice R2)
//   W-ATOM  WriteAck      @/features/F-present/config/write-ack-types     (the honest acknowledgement — R0)
// wires-out:
//   W-FN    toWriteAck    →  ../contract/present-contract (R3 door wrapper), ../app/cognition-orchestrator (native prong)
// deps:
//   R0  @/features/F-present/config/write-ack-types
//   R2  @/features/F-present/app/scored-turn-recorder  (type-only — same-slice)
//
// THE ONE WRITE-ACK DERIVER (R2). Every prong (native, MCP, REST) derives the honest
// acknowledgement HERE — none reconstructs it. It reads the write EVIDENCE — the written reply
// grid (`cells`) — and NEVER sc's value (§1a, F1): empty cells ⇔ the recorder no-op'd (an empty
// reply wrote zero rows) → dropped; otherwise → landed, carrying the assigned coordinate and the
// byte-identical reply render. `markCount` is dropped — consumed by no one, no excess. This is a
// PURE READ over the recorder's return, in a NEW sibling module — never in the recorder, never
// in domain/. The engine (domain/* + scored-turn-recorder) stays byte-untouched.

import type { RecordedTurn } from '@/features/F-present/app/scored-turn-recorder'
import type { WriteAck } from '@/features/F-present/config/write-ack-types'

export function toWriteAck(recorded: RecordedTurn): WriteAck {
  return recorded.cells.length === 0
    ? { landed: false }
    : { landed: true, sc: recorded.sc, text: recorded.text }
}
