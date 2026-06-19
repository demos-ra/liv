// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-engine — the honest acknowledgement)
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/write-ack-types.ts]
//
// THE WRITE-ACK — the one honest outcome of a write attempt at the R3 door (§0/§2.3). A NEW
// concern: neither read-engine-types (read-side) nor mark-types (marks) fits, so it homes here,
// OUTSIDE the frozen engine set, declared at origin (A6). Zero dependencies.
//
// Three outcomes, NOT symmetric (§1a):
//   - rejected — a false claim (word-index↔surface mismatch) THROWS MarkSurfaceError before any
//     write (atomic, the loud rail). It never becomes an ack — it is not in this type.
//   - dropped  — a graceful no-write (empty/malformed reply → the recorder no-op'd).
//   - landed   — a real write.
// This type carries only the two that RETURN (dropped + landed); the throw stays a throw.
//
// DISCRIMINATE ON THE WRITE EVIDENCE, NEVER ON sc (§1a, F1): persistence is read from the
// `landed` tag — derived from the written reply grid (cells), the write evidence — never from
// sc's value. sc===0 is the recorder's internal EMPTY sentinel and the store's 0-floor is
// unproven; testing sc would be a fake-coordinate trap. So `landed:false` carries NO sc.
export type WriteAck =
  | { landed: true; sc: number; text: string }
  | { landed: false }
