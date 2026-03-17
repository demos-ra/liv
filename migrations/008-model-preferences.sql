-- 008-model-preferences.sql
-- LIV-Standard v1.3 · step4b2-phase-d
-- Additive to existing user_profiles table.
--
-- Adds model_preferences jsonb column — stores per-tier model selection
-- as { largest, medium, smallest } with null per tier meaning "use default".
-- Written by PUT /api/profile/models via F-user-profile/exec/user-profile-db.ts.
-- Read by F-planner/exec/planner-db.ts (structural exception, documented).

BEGIN;

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS model_preferences jsonb DEFAULT NULL;

COMMIT;
