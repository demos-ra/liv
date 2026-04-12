-- Migration 014: Project snapshot and external file cache columns
-- Phase 4.3 — Read phase storage
-- Both nullable. No index needed — queried by build_id primary key only.

ALTER TABLE builds ADD COLUMN IF NOT EXISTS project_snapshot JSONB;
ALTER TABLE builds ADD COLUMN IF NOT EXISTS external_file_cache JSONB;
