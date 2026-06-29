// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-memory/R4]
// Built with LIV · livai.dev
// [F-memory/exec/isolation-floor.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    completion-wave1 (isolation rule → one home — the §2.2 collapse)
// slice:      F-memory
// layer:      R4
// wires-in:   (none — bare strings only)
// wires-out:
//   W-FN    isolationFloor  →  Floor A transcript-read · Floor B substrate-repository
// deps:      (none)

// The substrate isolation rule, one home (build-spec §2.2 COLLAPSE). Until now
// `user_id = $1` lived TWICE — once in each read floor (Floor A transcript-read,
// Floor B substrate-repository) — one concern with two homes (drift). It moves
// here: both floors build their WHERE from this one helper.
//
// Bare in, bare out: a principal (or a principal-set) → { clause, params }. It
// imports NOTHING relational — preserving Floor A's zero-relational-import
// invariant, the property that lets the store build with the engine absent
// (Law 2). A caller appends its own further conjuncts (`AND words IS NOT NULL`,
// `AND source_content_class = $n`) AFTER this clause; the floor always owns $1,
// so a caller's own params start at $2.
//
// THE RULE: a reader sees only rows keyed to their own id. A single principal →
// `user_id = $1`. A principal-set (identity reconciliation, the alias-fold) →
// `user_id = ANY($1)`. This is the ONLY widening of "mine" on the user_id axis;
// the public cross-author relaxation lives separately, at the one R2 fill-point.

export type IsolationClause = { clause: string; params: string[] }

export function isolationFloor(principal: string | string[]): IsolationClause {
  // A set folds to ANY($1) — the alias-resolved read (one param: the array).
  // A single id stays `= $1`. Either way the floor occupies exactly $1, so
  // every caller's subsequent param is $2.
  return Array.isArray(principal)
    ? { clause: 'user_id = ANY($1)', params: principal }
    : { clause: 'user_id = $1',      params: [principal] }
}
