---
kind: cycle-record
placement: frameworks/sprint-records/mark-gate-perimeter/
placement-status: TEMPORARY — this record lives in the repo as a placeholder. Under
  the repo-purification item (post-substrate-migration) it migrates to substrate as
  system-introspection rows. Repo home is interim, not the destination.
governing: LIV-Standard v1.5.2 · COIN v1.0 (vocabulary + gate) · Placement Standard
frozen: false   # Builder output — pending Auditor (Pattern A) + L0 ratify
---

# Cycle Record — Mark-Gate Perimeter (read crossing)

Ground tree: `bd49cf2`. Builder phase complete; Auditor + L0 pending.

## Problem (ground)

Two mark crossings into the engine. Crossing 1 — emission via
`emissionFromStructured` — was gated through `isMark` (✅). Crossing 2 — the store
read-back `present-mark-store-db.read()` — cast `mark as Mark` ungated (❌). The
store carries pre-`dfbdedf` sediment (bare-number Refs; QUALIFY/IDENTIFY with
missing `target`). On read that sediment reaches the engine and
`resolve-dimension.ts:69` calls `keyOf(target).who` on an absent target →
`Cannot read properties of undefined (reading 'who')` → the whole wake dies. Chat
Standard §5.6 caught the throw but logged only a bare message — the silence that
hid the crash (2-A).

## Placement (ruling applied)

`isCoord` + `isRef` + `isMark` extracted from `coin-score.ts` into
`F-present/domain/mark-gate.ts` (R1, pure — no I/O, no logging). Single home beside
the vocabulary (`mark-types.ts`) it guards. `coin-score.ts` imports `{ isCoord,
isMark }`; `present-mark-store-db.ts` imports `{ isMark }`. No copies, no variants —
both crossings narrow against the identical predicate. Zero behavior change on the
write path (the moved functions are byte-identical to their prior definitions).

## Build

- **B0 (placement):** `src/features/F-present/domain/mark-gate.ts` — new R1 pure
  module. `coin-score.ts` imports from it; local defs removed.
- **B1 (perimeter):** `present-mark-store-db.read()` filters each row through
  `isMark`. A row that fails the gate, or whose jsonb will not parse, is SKIPPED
  with one structured line `mark-gate.rejected` (`crossing: store-read`, `seq`,
  `user_id`, `op`, `reason`). Never wake-fatal, never silent. Engine internals
  untouched.
- **B2 (reconciliation):**
  - `migrations/028-present-marks-quarantine.sql` — `present_marks_quarantine`
    (full row copy, original `seq` preserved as PK, + `reason` + `quarantined_at`;
    deliberately permissive — no home_who / jsonb-object CHECK, so it can hold the
    sediment). Idempotent, pure statements (runner owns the transaction).
  - `scripts/reconcile-present-marks.ts` — imports the SAME `isMark` (the gate is
    the criterion; no hand-curated list). Dry-run by default (snapshot + counts, no
    mutation); `--apply` moves failing rows in one transaction (INSERT quarantine +
    DELETE present_marks) and writes a manifest, then re-reads and asserts the live
    store is gate-clean; `--reverse` restores all quarantined rows. Snapshot written
    every run before any mutation. Reversible by construction (quarantine holds the
    full row).
- **V4 (§5.6):** `chat-contract.ts` wake-reader catch now emits a visible structured
  line `present.wake.degraded` (`reason: context-read-failed`, `user_id`, `error`).
  Behavior unchanged — empty system prompt, LLM call not suppressed; the ONLY change
  is logging.

## Verify (Builder grounding — Auditor re-runs independently)

- **V1 — consumer sweep.** Every reader of `present_marks` funnels through ONE
  `createDbPresentMarkStore().read()` call (`cognition-orchestrator.ts:154`,
  inside `presentContext`). All external readers reach it through `presentContext`:
  the wake/cognition loop (`chat-contract` → `getContextReader`), the MCP `present`
  tool and the REST `/api/present` route and the tRPC `present.read` route (all →
  `readPresent` → `presentContext`, `read-surface.ts:19`). No third crossing.
  Gating the single `read()` covers every reader. ✅
- **V2 — MCP write path.** Grounded, not inherited. The MCP `write` tool
  (`mcp-contract.ts:93-96`) calls `writeRawTurn` only — raw words to the substrate.
  It produces NO marks and never touches `present_marks`. So there is no `isMark`
  crossing on the MCP write path because there is no mark to gate. The sole
  mark-producing write path is `composeAndWrite` (gated via
  `emissionFromStructured`). The connector-sprint claim "MCP write routes through
  isMark" is corrected: it is vacuous — the MCP write path cannot inject an ungated
  mark. ✅
- **V3 — adversarial corpus, both crossings.**
  `domain/__tests__/mark-gate.corpus.test.ts`. Corpus: well-formed (every op, name
  + coord refs); the malformed-payload class that shipped the `dfbdedf` bug (missing
  / undefined `target`, missing / empty `peers`, non-string `coloring`, peers-not-
  array, unknown / missing `op`, non-objects); and the bare-number-Ref sediment.
  Asserts the gate verdict, that the write crossing (`marks.filter(isMark)`) drops
  the bad set without throwing, and that the read crossing (parse-then-`isMark`)
  skips every failing row including the exact 2-A precursor (QUALIFY missing
  target) and unparseable jsonb. Single-gate property asserted (both crossings call
  the one `isMark`). **Executed — 8/8 pass** (see Done criteria for output). ✅
- **V4 — §5.6 logs visibly.** `present.wake.degraded` structured line on wake-reader
  failure; recovery behavior unchanged. ✅

## Done criteria — status

- [x] **corpus green both crossings — EXECUTED.** Node v24.16.0 (local, fetched to
      `~/.local/node`; no system change), `npx tsx --test`. 8/8 pass:
      ```
      ✔ isMark — well-formed marks pass (every op, name + coord refs)
      ✔ isMark — malformed payload class is rejected (the dfbdedf bug class)
      ✔ isMark — bare-number Refs are rejected at every op that carries a Ref
      ✔ isMark — non-objects are rejected, never throw
      ✔ isRef / isCoord — bare numbers are neither a Ref nor a Coord
      ✔ write crossing — marks.filter(isMark) drops malformed + bare-number, keeps well-formed
      ✔ read crossing — failing rows are skipped, including the missing-target crasher
      ✔ single gate — write and read crossings share one isMark (no variants)
      ℹ tests 8 · pass 8 · fail 0
      ```
      Full-project `tsc --noEmit` also passes (exit 0); touched files clean.
- [ ] dry-run counts reconcile (moved + remaining = total) — invariant emitted as
      `reconcile.counts.reconciles`. **No local present_marks dump and no local
      Postgres in the builder env (checked: no .env.local, no DATABASE_URL, no
      psql/pg_isready, no dump file). Per ruling, the dry-run RUNS AT THE DEPLOY
      GATE** (step 2 below), before `--apply`. Script load path smoke-tested with no
      DB: it imports the gate and parses args, failing only at the
      `MIGRATION_DATABASE_URL is not set` guard — DB I/O is the only unexercised path.
- [ ] post-migration: full store passes gate — `reconcile.verify.clean` asserted in
      `--apply`; **runs at deploy gate** (step 3).
- [ ] deploy — downstream (after Auditor + L0).
- [ ] name test passes live — downstream.
- [x] constraint A-isMark amended in record — see below.

## Constraint A-isMark — amendment (proposed; L0 ratifies)

> **A-isMark (amended):** every path that admits a Mark into the engine — write
> AND read — narrows it through the single honest gate `isMark`
> (`F-present/domain/mark-gate.ts`). Scope amended from "every NEW path" to "every
> path": the read crossing pre-dated the gate and was the gap. There is one gate, no
> copies; a malformed mark is dropped (write) or skipped + logged (read), never
> placed and never read back into the engine.

## Deploy sequence (downstream)

1. `npm run migrate` (applies 028 — creates the quarantine sink).
2. `npx tsx scripts/reconcile-present-marks.ts` (dry-run — confirm counts reconcile).
3. `npx tsx scripts/reconcile-present-marks.ts --apply` (move sediment; verify clean).
4. Deploy app (B0/B1/V4 code).
5. Name test live.

## Gate-2 dispositions

Applied (this amendment round, scope held to manifests + contract path):
- **F1** — `mark-gate.ts` wires-out made exact and per-symbol; every real consumer
  listed, nothing phantom; reconciled manifest ↔ imports both directions.
- **F2** — `coin-score.ts` given a full `@manifest` block (slice/layer/wires-in/out/
  deps); the gate dependency declared as a `W-FN isCoord/isMark ../domain/mark-gate`
  wire-in, not prose.
- **F5** — `isMark` re-exported from `present-contract.ts` (R3); the reconcile script
  (an external consumer) now imports it via the contract surface, not domain directly.
  Both manifests + F1's consumer list updated to the new path.

Ratified, no action:
- **F4** — thin test/script headers are standing convention.
- **O2** — F-present category omission is repo convention.

Deferred by L0 (no action here) → governance/repo-purification item, post-substrate-
migration:
- **F3**, **F6** — folded into the repo-purification item alongside this record's own
  migration to substrate system-introspection rows (see frontmatter `placement-status`).

## Out of scope (held)

Engine internals (the `keyOf` crash site stays — the gate prevents the input that
trips it), downstream re-guards, 2-B, render path, MCP surface changes.
