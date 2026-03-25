-- 011-add-project-description.sql
-- Adds description column to projects table.
-- project-db.ts queries p.description; column was missing from 000-schema.sql.
-- Idempotent: IF NOT EXISTS guard.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description text;
