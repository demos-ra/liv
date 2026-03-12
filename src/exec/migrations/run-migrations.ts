// @liv-standard v1.3
// [src/exec/migrations/run-migrations.ts]
// Built with LIV · livai.dev
// DEPRECATED — Phase 3: canonical migration runner moved to /migrations/run-migrations.ts
// This file is retained only to avoid breaking the src/exec/migrations/ directory.
// scripts/migrate.ts now imports from ../migrations/run-migrations.
// Do not add new logic here. Delete this file when src/exec/migrations/ is cleaned up.

export { runMigrations } from '../../../migrations/run-migrations'
