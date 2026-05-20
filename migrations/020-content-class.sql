-- 020-content-class.sql
-- Side-Quest Shot 1 (Phase A) — Substrate v1.8.3: ContentClass column on state_change
-- Canonical spec: frameworks/metaframework/frameworks/substrate-v1-1.md (v1.8.3 §4.2 A-24)
--
-- Substrate v1.8.3 A-24 declares ContentClass = 'wearer-life' | 'system-introspection',
-- carried at SubstrateSourceRef.contentClass. This migration adds the
-- corresponding `source_content_class` column to the state_change table and
-- backfills existing rows per the substrate v1.8.3 §4.2 A-24 default-derivation
-- rule (channel → ContentClass).
--
-- LM §3.11 Required indices: source_content_class → positions added as optional
-- optimization (parallel to scope → positions). The deterministic 5-channel
-- mapping makes the index derivable from source_channel for 5/6 channels;
-- only 'internal-derivation' rows benefit from a column-level index since
-- their classification is per emitting Standard (polymorphic).
--
-- Procedure: ADD COLUMN nullable → backfill per channel → NOT NULL → optional index.
-- Rollback: DROP INDEX, DROP COLUMN (block at end).
--
-- Author at deploy: sudo -u postgres psql -d liv -f migrations/020-content-class.sql

BEGIN;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 1: Add source_content_class column as nullable (required before backfill).
-- TEXT typing matches source_channel and source_scope precedent (016-substrate.sql).
-- Column placed alongside source_channel and source_scope per the Categorical-axis
-- clustering derived in substrate v1.8.3 §4.2 A-24 locus derivation.
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE state_change ADD COLUMN source_content_class TEXT;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 2: Backfill per substrate v1.8.3 §4.2 A-24 default-derivation rule.
--   wearer / ai / integration-event → 'wearer-life'
--   cron / system-l0                → 'system-introspection'
--   internal-derivation             → 'system-introspection' (provisional;
--                                       backfill default for legacy rows
--                                       predating Phase D per-Standard
--                                       declarations; Phase D ratifications
--                                       supersede for subsequent writes)
-- ────────────────────────────────────────────────────────────────────────────

UPDATE state_change
   SET source_content_class = 'wearer-life'
 WHERE source_channel IN ('wearer', 'ai', 'integration-event')
   AND source_content_class IS NULL;

UPDATE state_change
   SET source_content_class = 'system-introspection'
 WHERE source_channel IN ('cron', 'system-l0')
   AND source_content_class IS NULL;

-- Provisional backfill for 'internal-derivation' rows pre-Phase-D.
-- Per substrate v1.8.3 §4.2 A-24 boot-time backfill rule: legacy
-- internal-derivation rows are stamped 'system-introspection' provisionally
-- with a one-time migration note. Phase D per-Standard declarations supersede
-- for subsequent writes; legacy row reclassification (if any) is out-of-scope
-- for Phase A and would be a separate post-Phase-D migration.

UPDATE state_change
   SET source_content_class = 'system-introspection'
 WHERE source_channel = 'internal-derivation'
   AND source_content_class IS NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 3: Validate no NULL rows remain (defensive; six-channel union exhausts
-- SourceChannel enum at v1.8.2 ratified set per src/core/types/substrate.types.ts).
-- A NULL after the three UPDATEs above would indicate a row with an
-- unrecognized source_channel value — surface as migration failure.
-- ────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  unclassified_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO unclassified_count
    FROM state_change
   WHERE source_content_class IS NULL;
  IF unclassified_count > 0 THEN
    RAISE EXCEPTION
      'Migration 020 backfill incomplete: % rows with source_content_class IS NULL after backfill (likely unrecognized source_channel value)',
      unclassified_count;
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 4: Enforce NOT NULL constraint now that all rows are populated.
-- Required-field discipline per substrate v1.8.3 §4.2 A-24.
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE state_change ALTER COLUMN source_content_class SET NOT NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- Step 5: source_content_class index — LM §3.11 (OPTIONAL OPTIMIZATION).
-- Decision-D1: optional, not required.
--   Rationale: the substrate v1.8.3 §4.2 A-24 default-derivation rule maps
--   5 of 6 channels deterministically to ContentClass. A query of form
--   `WHERE source_content_class = 'wearer-life'` is equivalent at the row
--   set level to `WHERE source_channel IN ('wearer','ai','integration-event')
--   OR (source_channel = 'internal-derivation' AND <emitter-specific>)`. Only
--   internal-derivation rows benefit from a column-level index — for the
--   other five channels, source_channel queries are sufficient. The index is
--   declared optional pending Phase B (LMA13 anchor-derivation filter usage
--   patterns) and Phase D (per-Standard internal-derivation classification
--   density) — promote to required if Phase B/D execution shows column-level
--   filtering dominates the query mix.
-- ────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS state_change_content_class_idx
  ON state_change (source_content_class);

COMMIT;

-- ────────────────────────────────────────────────────────────────────────────
-- ROLLBACK PROCEDURE (execute manually if needed; not run by this script)
-- ────────────────────────────────────────────────────────────────────────────
-- BEGIN;
-- DROP INDEX IF EXISTS state_change_content_class_idx;
-- ALTER TABLE state_change DROP COLUMN IF EXISTS source_content_class;
-- COMMIT;

-- End 020-content-class.sql
