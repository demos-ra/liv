// @liv-standard v1.3
// [F-builder/exec/planner-version-db.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5e
// slice:      F-builder
// amended:    sprint-12-shot-3 (moved from F-planner/exec — dissolution)
// layer:      R4
// wires-in:
//   W-ATOM  BuildVersion   ../types/planner-version-types
//   W-ATOM  PlannerResult  ../types/planner-types
// wires-out:  none  (R4 is never imported — bound via IPlannerDb at R3)
// deps:
//   R0  ../types/planner-version-types
//   R0  ../types/planner-types
//   R5  @/core/db/client
// validated:  pending
//
// A2: R4 never imports R2 or R3. Bound via IPlannerDb at R3 (planner-inject.ts).
// A4: all DB I/O lives here. No logic beyond row mapping.
//
// step5e (A1, A4, A6):
//   New file. Three DB functions for version management.
//   All return PlannerResult<T> — consistent with planner-db.ts pattern (A4).
//   Queries filter by status = 'complete' and version IS NOT NULL to exclude
//   in-progress or failed builds from version history.
//   Axiom cite: A1 — sole owner of version DB operations. A4 — I/O at R4 only.
//   A6 — types declared at R0.

import { db }                  from '@/core/db/client'
import type { BuildVersion }   from '@/features/F-plan/types/planner-version-types'
import type { PlannerResult }  from '@/features/F-plan/types/pipeline-types'

// ── dbGetLatestVersion ────────────────────────────────────────────────────────
// Returns the latest version string for completed builds in this project.
// Returns null if no prior versions exist (first build).

export async function dbGetLatestVersion(
  projectId: string,
): Promise<PlannerResult<string | null>> {
  try {
    const result = await db.query<{ version: string }>(
      `SELECT version
         FROM builds
        WHERE project_id = $1
          AND status     = 'complete'
          AND version    IS NOT NULL
        ORDER BY created_at DESC
        LIMIT 1`,
      [projectId],
    )
    return { ok: true, data: result.rows[0]?.version ?? null }
  } catch (err) {
    return {
      ok:    false,
      error: { code: 'DB_ERROR', message: err instanceof Error ? err.message : 'dbGetLatestVersion failed' },
    }
  }
}

// ── dbSetBuildVersion ─────────────────────────────────────────────────────────
// Writes version and version_description to the build record on completion.
// Called once per build, after dbCompletePipeline succeeds.

export async function dbSetBuildVersion(
  buildId:     string,
  version:     string,
  description: string,
): Promise<PlannerResult<void>> {
  try {
    await db.query(
      `UPDATE builds
          SET version             = $2,
              version_description = $3
        WHERE build_id = $1`,
      [buildId, version, description],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return {
      ok:    false,
      error: { code: 'DB_ERROR', message: err instanceof Error ? err.message : 'dbSetBuildVersion failed' },
    }
  }
}

// ── dbGetVersionHistory ───────────────────────────────────────────────────────
// Returns all versioned completed builds for a project, newest first, max 50.
// Used by the builder UI to render the version history section.

export async function dbGetVersionHistory(
  projectId: string,
): Promise<PlannerResult<BuildVersion[]>> {
  try {
    const result = await db.query<{
      build_id:            string
      project_id:          string
      version:             string
      version_description: string
      created_at:          Date
    }>(
      `SELECT build_id,
              project_id,
              version,
              version_description,
              created_at
         FROM builds
        WHERE project_id = $1
          AND status     = 'complete'
          AND version    IS NOT NULL
        ORDER BY created_at DESC
        LIMIT 50`,
      [projectId],
    )
    const versions: BuildVersion[] = result.rows.map(row => ({
      buildId:     row.build_id,
      projectId:   row.project_id,
      version:     row.version,
      description: row.version_description,
      createdAt:   new Date(row.created_at).getTime(),
    }))
    return { ok: true, data: versions }
  } catch (err) {
    return {
      ok:    false,
      error: { code: 'DB_ERROR', message: err instanceof Error ? err.message : 'dbGetVersionHistory failed' },
    }
  }
}
