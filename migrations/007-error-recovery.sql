-- 007-error-recovery.sql
-- LIV-Standard v1.3 · step4b2-phase-c
-- Additive to existing builds table (006-pipeline-foundation.sql applied).
-- Existing columns unchanged.
--
-- Changes:
--   1. Extend status check constraint to include 'escalated'.
--   2. Add reentry_count — incremented on re-entry to IN-MAIN, never resets.

BEGIN;

-- 1. Extend status constraint to include 'escalated'
-- 'escalated' = CLASS_3 infrastructure failure after retry exhaustion.
-- Pipeline is terminal; human intervention required.
ALTER TABLE builds DROP CONSTRAINT IF EXISTS builds_status_check;
ALTER TABLE builds ADD CONSTRAINT builds_status_check
  CHECK (status IN ('pending', 'confirmed', 'running', 'complete', 'failed', 'cancelled', 'escalated'));

-- 2. Re-entry counter — incremented when pipeline resets to IN-MAIN after
-- retry exhaustion. Never decrements. Failsafe: MAX_REENTRIES = 3.
ALTER TABLE builds
  ADD COLUMN IF NOT EXISTS reentry_count integer NOT NULL DEFAULT 0;

COMMIT;
