// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-engine)
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/write-ack-types.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-present
// layer:      R0
// wires-out:
//   W-ATOM  WriteAck  →  ../contract/present-contract (R3 door), ../app/write-ack (deriver)
// deps:       none
export type WriteAck =
  | { landed: true; sc: number; text: string }
  | { landed: false }
