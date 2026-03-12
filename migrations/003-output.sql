-- @liv-standard v1.3
-- [F-output/migration]
-- Built with LIV · livai.dev
--
-- Migration: 003-output.sql
-- Adds output_files JSONB column to builds table.
-- Idempotent — safe to run multiple times.
-- Shape: OutputFile[] = Array<{ path: string, content: string, encoding: 'utf8' | 'base64' }>
--
-- Default '[]'::jsonb — new builds start with empty file tree.
-- Column is written incrementally by pipeline stages (IN_BUILD, IN_COMPILE).
-- Column is read by F-output to assemble zip and push to remote.

ALTER TABLE builds
  ADD COLUMN IF NOT EXISTS output_files JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Index for builds that have non-empty output (useful for admin queries)
CREATE INDEX IF NOT EXISTS idx_builds_has_output
  ON builds ((output_files != '[]'::jsonb))
  WHERE output_files != '[]'::jsonb;

COMMENT ON COLUMN builds.output_files IS
  'Generated file tree. Array of OutputFile: { path, content, encoding }. Written by pipeline stages, read by F-output.';
