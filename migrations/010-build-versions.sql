-- 010-build-versions.sql
-- Adds semantic version tracking to builds.
-- version: semver string set on PIPELINE_COMPLETED. NULL until then.
-- version_description: denormalized featureIntent — fast query without JSON parse.
-- Used for: completion display, version history, git commit message.

ALTER TABLE builds ADD COLUMN IF NOT EXISTS version TEXT DEFAULT NULL;
ALTER TABLE builds ADD COLUMN IF NOT EXISTS version_description TEXT DEFAULT NULL;
