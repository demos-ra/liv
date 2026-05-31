-- 024-cognition-words.sql
-- COIN write-side — sprint-COIN-shot-4 — the cognition rail's raw-word column.
-- Governing spec: frameworks/coin-spec.md (COIN v1.0). Manager ruling §8.9.
--
-- Adds `words` to the SINGLE substrate table `state_change` (a COLUMN, not a second
-- table — one store, per L0). A cognition state-change at a position carries its raw
-- words `[{pos, word}]` = `RawTurn.words`. JSONB at the TURN grain: the atom is the
-- turn, words are its payload (a normalized word-table would fragment the atom).
--
-- ── TRANSITIONAL — DUAL REPRESENTATION (Condition 1; read this before extending) ──
-- After this migration the substrate carries TWO row shapes in one table:
--   • COGNITION rows  — `words` populated; `identities = []`, `relations = []`
--     (structure lives in F-present marks, not the substrate). content_class
--     reuses the EXISTING `wearer-life` value (no third class).
--   • SYSTEM-INTROSPECTION rows — `identities` / `relations` populated as today;
--     `words` NULL. Untouched this build (resolvePlan/plan-contract/threadQuery keep
--     working on them).
-- This split is TRANSITIONAL, not permanent legacy. `identities`/`relations` on
-- `state_change` are system-introspection-ONLY going forward and COLLAPSE to
-- words+marks in the NAMED NEXT DERIVATION (system-introspection → raw words + marks;
-- F-artifact version/dependency edges → marks). `words` is the PERMANENT raw-word
-- home — words always live in the substrate; only STRUCTURE ever moves to marks — so
-- this column cements nothing the next derivation rehomes. Do not treat the
-- dual representation as permanent; do not stamp a new ContentClass on the cognition
-- path beyond the reused `wearer-life` value.
--
-- Idempotent — ADD COLUMN IF NOT EXISTS. Pure statement (run-migrations.ts wraps
-- apply-and-record in one transaction; no BEGIN/COMMIT here, per the 022 F7 convention).

ALTER TABLE state_change
  ADD COLUMN IF NOT EXISTS words JSONB;

-- Optional partial index for the cognition transcript read (words-bearing rows by scope).
CREATE INDEX IF NOT EXISTS state_change_cognition_idx
  ON state_change (source_scope, position)
  WHERE words IS NOT NULL;

-- End 024-cognition-words.sql
