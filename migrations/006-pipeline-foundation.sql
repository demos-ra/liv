-- 006-pipeline-foundation.sql
-- LIV-Standard v1.3 · step4b2-phase-a
-- Additive to existing builds table (created in 003-output.sql).
-- Existing columns unchanged: build_id, project_id, user_id, status,
-- current_stage, stage_status, source, if_contract, pipeline_log,
-- started_at, completed_at, created_at, updated_at.
--
-- Changes:
--   1. Extend status check constraint to include 'confirmed'.
--   2. Add transition_count — incremented on every pipeline state transition.
--   3. Add pipeline_report — jsonb audit log written by IN-MAIN on completion.
--   4. Add index on status for active-build polling queries.

BEGIN;

-- 1. Extend status constraint to include 'confirmed'
ALTER TABLE builds DROP CONSTRAINT IF EXISTS builds_status_check;
ALTER TABLE builds ADD CONSTRAINT builds_status_check
  CHECK (status IN ('pending', 'confirmed', 'running', 'complete', 'failed', 'cancelled'));

-- 2. Transition counter — atomic increment, never decrements
ALTER TABLE builds
  ADD COLUMN IF NOT EXISTS transition_count integer NOT NULL DEFAULT 0;

-- 3. Pipeline report — written once by IN-MAIN, null while running
ALTER TABLE builds
  ADD COLUMN IF NOT EXISTS pipeline_report jsonb DEFAULT NULL;

-- 4. Index for active-build polling (chat route handler checks status IN ('pending','confirmed'))
CREATE INDEX IF NOT EXISTS idx_builds_pipeline_status
  ON builds (status);

COMMIT;
