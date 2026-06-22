-- 029-state-flag.sql
-- TH1 (the flag field) — capture-integrity flag on state_change.
-- Governing spec: Mechanics M8 (flag vs WriteAck — two layers); Ruling R10
-- (binary pass/fail); Ruling R12 (save-and-flag replaces dropping). Living Memory
-- (substrate atom shape). Canonical atom: src/core/types/substrate.types.ts (StateFlag).
--
-- WHAT: a binary pass/fail honesty bit on EVERY state change, beside source_channel /
-- source_content_class / source_scope. It records CAPTURE INTEGRITY:
--   'pass' — clean first-hand capture (the live write door — cognition as it
--            actually crossed).
--   'fail' — reconstructed / could-not-be-cleanly-captured (import, or a turn that
--            could not be cleanly marked). Per Ruling R12 (save-and-flag replaces
--            dropping): such a turn is SAVED with 'fail', not dropped. The only true
--            drop left is a TRANSPORT failure — which is WriteAck's concern, NOT this
--            column's.
--
-- TWO ORTHOGONAL HONESTIES (Mechanics M8), deliberately not merged:
--   - state_flag (this column) = capture integrity, a field on the stored atom.
--   - WriteAck (F-present, pre-existing) = transport honesty (did the bytes land).
-- This migration provisions ONLY the capture-integrity column. It does not touch,
-- mirror, or duplicate WriteAck.
--
-- Procedure mirrors 020-content-class.sql (ADD COLUMN nullable → backfill → NOT NULL
-- → CHECK), with two additions: a DEFAULT 'pass' so any write path that omits the
-- column self-stamps clean first-hand, and a binary-domain CHECK enforcing R10.
--
-- BACKFILL: every pre-existing row is clean first-hand cognition that was already
-- cleanly captured (the substrate has only ever stored live write-door commits) →
-- 'pass'. There is no historical reconstructed/imported sediment in state_change to
-- mark 'fail' at this migration.
--
-- Idempotent — ADD COLUMN IF NOT EXISTS / guarded constraint adds / CREATE INDEX
-- IF NOT EXISTS.
-- Pure statements: run-migrations.ts wraps apply-and-record in ONE transaction
-- (no BEGIN/COMMIT here, per the 022 F7 / 028 convention).

-- ────────────────────────────────────────────────────────────────────────────
-- Step 1: Add state_flag column.
-- TEXT typing matches source_channel / source_content_class / source_scope
-- precedent (016, 020). DEFAULT 'pass' so the live write door self-stamps clean
-- first-hand for any path that does not supply the column explicitly.
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE state_change ADD COLUMN IF NOT EXISTS state_flag TEXT NOT NULL DEFAULT 'pass';

-- ────────────────────────────────────────────────────────────────────────────
-- Step 2: Backfill existing rows → 'pass'.
-- The DEFAULT above already stamps pre-existing rows 'pass' on ADD COLUMN; this
-- UPDATE is the explicit, defensive backfill (idempotent — only touches non-pass
-- legacy values, of which there are none at first run).
-- ────────────────────────────────────────────────────────────────────────────

UPDATE state_change
   SET state_flag = 'pass'
 WHERE state_flag IS NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 3: Binary-domain CHECK — Ruling R10 (binary pass/fail; exactly two values).
-- Guarded add: skip if a constraint of this name already exists (idempotent).
-- ────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'state_change_state_flag_binary'
  ) THEN
    ALTER TABLE state_change
      ADD CONSTRAINT state_change_state_flag_binary
      CHECK (state_flag IN ('pass', 'fail'));
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 4: state_flag index (OPTIONAL OPTIMIZATION).
-- Supports honesty-audit scans (e.g. "all 'fail' rows for review"). Low
-- cardinality (two values) — a plain B-tree is adequate; a partial index on the
-- minority 'fail' value could be promoted later if audit-scan volume warrants.
-- ────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS state_change_state_flag_idx
  ON state_change (state_flag);

-- ────────────────────────────────────────────────────────────────────────────
-- ROLLBACK PROCEDURE (execute manually if needed; not run by this script)
-- ────────────────────────────────────────────────────────────────────────────
-- DROP INDEX IF EXISTS state_change_state_flag_idx;
-- ALTER TABLE state_change DROP CONSTRAINT IF EXISTS state_change_state_flag_binary;
-- ALTER TABLE state_change DROP COLUMN IF EXISTS state_flag;

-- End 029-state-flag.sql
