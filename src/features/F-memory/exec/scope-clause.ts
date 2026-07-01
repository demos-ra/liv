// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-memory/R4]
// Built with LIV · livai.dev
// [F-memory/exec/scope-clause.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    completion-wave1 (isolation rule → one home, the §2.2 collapse, as isolationFloor) ·
//             completion-wave2 (renamed isolationFloor → scopeClause — it now BUILDS the read's
//             scope-clause from a scope dial, not only isolates; honest name, the keystone)
// slice:      F-memory
// layer:      R4
// wires-in:   (none — bare values only)
// wires-out:
//   W-FN    scopeClause / mine  →  Floor A transcript-read · Floor B substrate-repository
// deps:      (none)

// THE ONE BUILDER — the read face of the one wall (Wave-2 keystone). Every substrate read's
// scope-clause is built HERE, and ONLY here: both floors (Floor A transcript-read, Floor B
// substrate-repository) construct their WHERE from this one function. There is NO second
// WHERE-builder — that structural fact IS the safety guarantee below.
//
// It reads the scope DIAL and tunes the clause to the connection:
//   - mine    → user_id bound (`= $1`, or `= ANY($1)` for the alias-fold / principal-set)
//   - public  → source_scope = 'public', user_id bound DROPPED   ← the ONE relaxation
//   (Wave: inbox → an inbox bound)
//
// THE SAFETY INVARIANT (structural, not a convention): the user_id bound is dropped in EXACTLY
// ONE branch — `kind:'public'` — and 'public' is the ONLY kind that omits user_id. 'mine' (and the
// alias-fold) ALWAYS bind user_id. Because this is the sole clause-builder (§2.2 one-home), no read
// can lose its user_id bound except the public branch — private CANNOT, there is no other place a
// substrate WHERE is built. One place the bound is decided is the one place it can relax, audited.
//
// Bare in, bare out: imports NOTHING relational — Floor A keeps its zero-relational-import
// invariant (Law 2). Callers append their own conjuncts after this clause; positions follow the
// returned params array's length (public carries no param → a caller's first conjunct is $1; mine
// owns $1 → the caller's first conjunct is $2 — both handled by params.length at the call site).

export type ScopeClause = { clause: string; params: string[] }

// PUBLIC_SCOPE — the one reserved source_scope value: the visibility marker the read relaxes on and
// the write stamps. Defined HERE because this is where the relaxation lives (the keystone owns the
// value it relaxes on); re-exported via substrate-contract R3 for the write + billing sides, so the
// literal is never hand-duplicated. A compile-time constant — no injection surface in the clause.
export const PUBLIC_SCOPE = 'public' as const

// The scope DIAL — the visibility value a read receives. 'mine' carries the principal(s): a single
// id, or the reader's alias-set (string[]) for the principal-set fold. 'public' carries nothing —
// the relaxation needs no identity (source_scope='public' is cross-author by construction).
export type ScopeSpec =
  | { kind: 'mine'; principals: string | string[] }
  | { kind: 'public'; reader: string }   // reader = the session user carried on the dial; the public clause drops user_id and does NOT bind it
  // Wave: | { kind: 'inbox'; reader: string }

export function scopeClause(scope: ScopeSpec): ScopeClause {
  switch (scope.kind) {
    case 'mine':
      // user_id is ALWAYS bound. A set folds to ANY($1) (the alias-resolved read); a single id
      // stays `= $1`. This branch can never omit user_id.
      return Array.isArray(scope.principals)
        ? { clause: 'user_id = ANY($1)', params: scope.principals }
        : { clause: 'user_id = $1',      params: [scope.principals] }
    case 'public':
      // THE ONE RELAXATION — the user_id bound is dropped, and ONLY here. Bound to the literal
      // 'public' source_scope (cross-author); never any other scope, never private.
      return { clause: `source_scope = '${PUBLIC_SCOPE}'`, params: [] }
    default: {
      // FAIL-CLOSED. A new ScopeSpec kind that reaches here is a COMPILE error — the `never`
      // assignment fails until this switch decides that kind's bound, so a kind cannot ship
      // without a bound. At runtime the default THROWS (loud) — it is NEVER "no clause" / all
      // rows. The floor is bind-or-throw; there is no fall-through to an unbounded read.
      const _exhaustive: never = scope
      throw new Error(`scopeClause: unhandled scope kind — no bound decided for ${JSON.stringify(_exhaustive)}`)
    }
  }
}

// mine(reader) — the terse constructor for the overwhelmingly common scope (a reader's own
// substrate). A single id, or the reader's resolved alias-set (the principal-set fold).
export function mine(principals: string | string[]): ScopeSpec {
  return { kind: 'mine', principals }
}
