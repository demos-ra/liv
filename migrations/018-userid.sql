-- 018-userid.sql
-- Sprint 12 Shot 2 — Living Memory v3.2: userId on state_change
-- Canonical spec: frameworks/standards/living-memory.md (v3.2)
--
-- LM v3.2 §2.1: SubstrateWriteInput carries userId (authentication identity of writer).
-- LM v3.2 §2.2: StateChangeRecord carries userId (carried from SubstrateWriteInput per LMA12).
-- LM v3.2 §3.11: userId index required (not optional optimization).
--
-- Procedure: ADD COLUMN nullable → backfill → NOT NULL → indices.
-- Rollback: DROP INDEX × 2, DROP COLUMN (see block at end).
--
-- Author at deploy: sudo -u postgres psql -d liv -f migrations/018-userid.sql

BEGIN;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 1: Add user_id column as nullable (required before backfill).
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE state_change ADD COLUMN user_id TEXT;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 2: Backfill existing rows.
-- Decision-D1: sentinel '__pre-multiuser__'.
--   Rationale: explicit marker for rows written before userId tracking was
--   introduced. Distinguishable from real userId values (prefixed '__').
--   Empty string ('') is less debuggable — log-grep on sentinel is actionable.
--   UUID-shaped values would be indistinguishable from real users in queries.
-- ────────────────────────────────────────────────────────────────────────────

UPDATE state_change SET user_id = '__pre-multiuser__' WHERE user_id IS NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 3: Enforce NOT NULL constraint now that all rows are populated.
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE state_change ALTER COLUMN user_id SET NOT NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 4: userId index — LM v3.2 §3.11 (required).
-- B-tree on user_id alone for identity-filtered reads.
-- ────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS state_change_user_id_idx
  ON state_change (user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- Step 5: Composite index for F-B closure — LM v3.2 §3.11.
-- Decision-D2: shape (user_id TEXT, position BIGINT).
--   Actual column types from 016-substrate.sql:
--     user_id  TEXT   (added in this migration)
--     position BIGINT (primary key, defined in 016)
--   Index supports user-scoped position-ordered reads:
--     WHERE user_id = $1 ORDER BY position ASC/DESC
--   Standard B-tree — no GIN required (both are scalar types).
-- ────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS state_change_user_position_idx
  ON state_change (user_id, position);

COMMIT;

-- ────────────────────────────────────────────────────────────────────────────
-- ROLLBACK PROCEDURE (execute manually if needed; not run by this script)
-- ────────────────────────────────────────────────────────────────────────────
-- BEGIN;
-- DROP INDEX IF EXISTS state_change_user_position_idx;
-- DROP INDEX IF EXISTS state_change_user_id_idx;
-- ALTER TABLE state_change DROP COLUMN IF EXISTS user_id;
-- COMMIT;

-- End 018-userid.sql
