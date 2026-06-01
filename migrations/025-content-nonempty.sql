-- 025-content-nonempty.sql
-- COIN substrate content invariant — cognition path fix.
-- Governing spec: COIN v1.0; LM-Standard v3.1. L0-confirmed dispatch.
--
-- ── ROOT ────────────────────────────────────────────────────────────────────
-- Migration 016 instated `state_change_identities_nonempty`: identities ≥ 1
-- table-wide. Migration 024 added `words` and introduced cognition rows that
-- carry content in `words` with `identities = []`. The 016 constraint rejects
-- every cognition wearer-write at the DB layer → turn dies before any provider
-- call.
--
-- ── FIX ─────────────────────────────────────────────────────────────────────
-- Drop `state_change_identities_nonempty`.
-- Add `state_change_content_nonempty`: a row is valid iff it carries content —
-- non-empty `words` OR non-empty `identities`.
--
--   Predicate (verified against live column types):
--     words      — JSONB, nullable (024 ADD COLUMN IF NOT EXISTS words JSONB)
--     identities — JSONB NOT NULL (016 CREATE TABLE)
--
--   A row carries content iff:
--     words is non-null AND jsonb_typeof(words) = 'array'
--                        AND jsonb_array_length(words) >= 1
--     OR
--     jsonb_typeof(identities) = 'array'
--     AND jsonb_array_length(identities) >= 1
--
--   Cognition rows:   words populated, identities = [] → pass on words branch.
--   Program rows:     words NULL,      identities ≥ 1  → pass on identities branch
--                     (during open program-loop transition; out of scope this shot).
--   Empty rows:       words NULL or [], identities []   → fail. No silent writes.
--
-- ── CARRY-FORWARD ────────────────────────────────────────────────────────────
-- When the program/domain loop converts (F-plan, F-discover, F-verify,
-- F-builder, F-artifact, proxy — 7 writers), program emission content moves to
-- words and structure moves to F-present marks. At that point `identities` and
-- `relations` columns + the identities GIN index retire, and this invariant
-- simplifies to words-only in its own migration. No legacy is enshrined here —
-- the predicate spans the transition and collapses cleanly.
--
-- ── SCOPE ────────────────────────────────────────────────────────────────────
-- Cognition path (core loop + core loop+) only. Program/domain loop conversion
-- is out of scope (carried forward; L0 rules when scoped).
-- `relations` and the identities GIN index are unchanged this migration.
--
-- ── IDEMPOTENCY ──────────────────────────────────────────────────────────────
-- DROP CONSTRAINT IF EXISTS / ADD CONSTRAINT IF NOT EXISTS — safe to re-run.
-- No BEGIN/COMMIT — run-migrations.ts wraps apply-and-record in one transaction
-- (022/024 convention).
--
-- ── DEPLOY PROCEDURE ─────────────────────────────────────────────────────────
-- Pre-migrate: snapshot state_change (pg_dump -t state_change or equivalent).
-- Dry-run: server rolled-back-transaction test (§1.43) before apply.
-- Apply: via run-migrations.ts (standard runner; no manual psql).
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1: Drop the constraint that rejects cognition rows.
-- IF EXISTS — safe if a prior partial run already dropped it.
ALTER TABLE state_change
  DROP CONSTRAINT IF EXISTS state_change_identities_nonempty;

-- Step 2: Add the COIN content invariant.
-- A row is valid iff it carries content: non-empty words OR non-empty identities.
-- words is nullable JSONB (024); identities is JSONB NOT NULL (016).
-- The words branch guards nullability before calling jsonb_array_length.
-- The identities branch mirrors the 016 pattern (jsonb_typeof guard retained for
-- defense-in-depth; column is NOT NULL but type guard costs nothing).
ALTER TABLE state_change
  ADD CONSTRAINT state_change_content_nonempty
    CHECK (
      (
        words IS NOT NULL
        AND jsonb_typeof(words) = 'array'
        AND jsonb_array_length(words) >= 1
      )
      OR
      (
        jsonb_typeof(identities) = 'array'
        AND jsonb_array_length(identities) >= 1
      )
    );

-- End 025-content-nonempty.sql
