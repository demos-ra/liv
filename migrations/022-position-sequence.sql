-- 022-position-sequence.sql
-- Fix-round: sequence-owned substrate position (Axis-1 coordinate).
--
-- Root closed: position was app-assigned via SELECT MAX(position)+1 — a
-- read-then-write race. Concurrent writes read the same MAX and collide on
-- state_change_pkey. The fix is structural: the database owns the monotonic
-- Axis-1 coordinate via a sequence; the app-side position logic is deleted
-- (substrate-repository.ts nextPosition + the SubstrateWriteValidated.position
-- sentinel). nextval() is intrinsic to the INSERT — atomic, no read-then-write.
--
-- TRUNCATE: the single existing state_change row is malformed debris from the
-- pre-fix broken writer — no real wearer turn. L0-confirmed: the substrate
-- enters beta as the honest empty ledger it is defined to be. This is a
-- structural reset of an empty-of-real-data ledger, not an operational data
-- call.
--
-- The state_change_pkey PRIMARY KEY (position) and the position > 0 CHECK
-- (state_change_position_positive) are retained — a sequence starting at 1
-- satisfies both: nextval yields 1, 2, 3, … each unique and positive.
--
-- MA4 (identity refs persistent, not reused): unaffected — nextval is
-- monotonic and never reissues a value within a sequence's life.
--
-- Author at deploy: applied server-side via migrations/run-migrations.ts
-- BEFORE pm2 restart liv.
--
-- F7 re-open: this file carries NO BEGIN/COMMIT — the runner
-- (run-migrations.ts) wraps it in one transaction together with the
-- schema_migrations record, so apply-and-record are atomic. Pure statements.

-- ────────────────────────────────────────────────────────────────────────────
-- Step 1: Clear the malformed pre-fix row. The substrate enters beta empty.
-- TRUNCATE (not DELETE) — resets the table cleanly; there is no real data and
-- no FK dependent on state_change.
-- ────────────────────────────────────────────────────────────────────────────

TRUNCATE TABLE state_change;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 2: Create the sequence that owns state_change.position.
-- OWNED BY ties the sequence's lifecycle to the column — dropping the column
-- (or table) drops the sequence. No second source of position.
-- ────────────────────────────────────────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS state_change_position_seq
  AS BIGINT
  START WITH 1
  INCREMENT BY 1
  NO MAXVALUE
  NO CYCLE
  OWNED BY state_change.position;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 3: setval to 0 so the first nextval() — the first real write — yields 1.
-- (is_called = true means the next nextval returns last_value + 1 = 1.)
-- Axis-1 monotonic from 1, per LMA10.
-- ────────────────────────────────────────────────────────────────────────────

SELECT setval('state_change_position_seq', 0, true);

-- ────────────────────────────────────────────────────────────────────────────
-- Step 4: The column takes its value from the sequence by DEFAULT. The INSERT
-- omits position entirely; the DB assigns it. position stays BIGINT NOT NULL —
-- the default always supplies a value, so NOT NULL is never violated.
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE state_change
  ALTER COLUMN position SET DEFAULT nextval('state_change_position_seq');

-- ────────────────────────────────────────────────────────────────────────────
-- ROLLBACK PROCEDURE (execute manually if needed; not run by this script)
-- ────────────────────────────────────────────────────────────────────────────
-- BEGIN;
-- ALTER TABLE state_change ALTER COLUMN position DROP DEFAULT;
-- DROP SEQUENCE IF EXISTS state_change_position_seq;
-- COMMIT;
-- Note: rollback does not restore the TRUNCATE'd row — it was malformed debris
-- with no recovery value. A rolled-back substrate is simply empty.

-- End 022-position-sequence.sql
