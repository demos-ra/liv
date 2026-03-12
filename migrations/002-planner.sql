-- [migrations/002-planner.sql]
-- Built with LIV · livai.dev
-- F-planner migration delta — adds pipeline orchestration columns to builds.
-- Idempotent — safe to run on every deployment.
-- Owned by: F-planner. Do not modify from other slices.
-- Run after: 000-schema.sql (which creates the builds table)

-- ── F-planner columns on builds ───────────────────────────────────────────────
-- current_stage: which pipeline stage is active (NULL before pipeline starts)
-- stage_status:  status of the current stage
-- pipeline_log:  append-only jsonb array of StageLogEntry records

ALTER TABLE builds
  ADD COLUMN IF NOT EXISTS current_stage  TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS stage_status   TEXT    NOT NULL DEFAULT 'pending'
    CHECK (stage_status IN ('pending','running','complete','failed','skipped')),
  ADD COLUMN IF NOT EXISTS pipeline_log   JSONB   NOT NULL DEFAULT '[]'::jsonb;

-- if_contract already exists as TEXT on builds (from 000-schema.sql).
-- No change needed — F-planner writes serialised IfContract JSON to this column.

CREATE INDEX IF NOT EXISTS idx_builds_current_stage ON builds(current_stage) WHERE current_stage IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_builds_stage_status  ON builds(stage_status);
