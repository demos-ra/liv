// @liv-standard v1.3
// [F-output/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-phase-b
// slice:      F-output
// category:   Modality
// layer:      R4
// wires-in:
//   W-ATOM  OutputFile    ../types/output-types
//   W-ATOM  OutputFiles   ../types/output-types
//   W-ATOM  OutputResult  ../types/output-types
//   W-ATOM  OutputJobId   ../types/output-types
// wires-out:
//   W-FN  dbReplaceOutputFiles  →  F-planner/R3 (planner-inject.ts — step4b2-phase-b)
// deps:
//   R0  ../types/output-types
//   R5  @/core/db/client
// validated:  pending
//
// step4b2-phase-b:
//   dbReplaceOutputFiles exported — was previously private, reserved for pipeline
//   stages per original comment. Claimed here for F-planner pipeline write path.
//   F-planner/contract/planner-inject.ts imports this under A2-r3-output-write
//   structural exception. No other change to this file.

// A2: R4 never imports R2 or R3. IOutputDb declared at R2, wired at R3.
// A4: all DB I/O lives here. Row mapping only — no logic beyond column extraction.

import { db }          from '@/core/db/client'
import type {
  OutputFile,
  OutputFiles,
  OutputResult,
  OutputJobId,
} from '../types/output-types'

// ── Row types — typed R4 boundary (A3) ────────────────────────────────────────

type BuildStatusRow = {
  status: string
}

type OutputFilesRow = {
  output_files: unknown   // JSONB — parsed by mapper
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function mapOutputFiles(raw: unknown): OutputFiles {
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is OutputFile =>
    item !== null &&
    typeof item === 'object' &&
    typeof (item as OutputFile).path     === 'string' &&
    typeof (item as OutputFile).content  === 'string' &&
    ((item as OutputFile).encoding === 'utf8' || (item as OutputFile).encoding === 'base64')
  )
}

// ── dbIsPipelineComplete ───────────────────────────────────────────────────────
// Returns true only when builds.status = 'complete'.
// F-output refuses to assemble or push until the pipeline has completed.

export async function dbIsPipelineComplete(
  jobId: OutputJobId,
): Promise<OutputResult<boolean>> {
  try {
    const result = await db.query<BuildStatusRow>(
      `SELECT status FROM builds WHERE build_id = $1`,
      [jobId as string]
    )
    if (!result.rows[0]) {
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Build not found' } }
    }
    return { ok: true, data: result.rows[0].status === 'complete' }
  } catch (e) {
    return {
      ok: false,
      error: {
        code:    'DB_ERROR',
        message: e instanceof Error ? e.message : 'Database error',
        context: { jobId },
      },
    }
  }
}

// ── dbGetOutputFiles ───────────────────────────────────────────────────────────
// Reads output_files JSONB column from builds table.
// Column added by migration 003-output.sql.

export async function dbGetOutputFiles(
  jobId: OutputJobId,
): Promise<OutputResult<OutputFiles>> {
  try {
    const result = await db.query<OutputFilesRow>(
      `SELECT output_files FROM builds WHERE build_id = $1`,
      [jobId as string]
    )
    if (!result.rows[0]) {
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Build not found' } }
    }
    const files = mapOutputFiles(result.rows[0].output_files)
    return { ok: true, data: files }
  } catch (e) {
    return {
      ok: false,
      error: {
        code:    'DB_ERROR',
        message: e instanceof Error ? e.message : 'Database error',
        context: { jobId },
      },
    }
  }
}

// ── dbAppendOutputFile ─────────────────────────────────────────────────────────
// Appends a single OutputFile to the output_files JSONB array.
// Called by pipeline stages (IN_BUILD, IN_COMPILE) as they generate files.
// Uses jsonb_insert for atomic append — no read-modify-write race condition.

async function dbAppendOutputFile(
  jobId: OutputJobId,
  file:  OutputFile,
): Promise<OutputResult<void>> {
  try {
    await db.query(
      `UPDATE builds
         SET output_files = COALESCE(output_files, '[]'::jsonb) || $2::jsonb,
             updated_at   = NOW()
       WHERE build_id = $1`,
      [jobId as string, JSON.stringify(file)]
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return {
      ok: false,
      error: {
        code:    'DB_ERROR',
        message: e instanceof Error ? e.message : 'Database error',
        context: { jobId, path: file.path },
      },
    }
  }
}

// ── dbReplaceOutputFiles ───────────────────────────────────────────────────────
// Replaces the entire output_files array atomically.
// Exported for F-planner pipeline use (step4b2-phase-b). Previously unexported —
// comment in original reserved this for pipeline stages. Now claimed.
// Called by F-planner/contract/planner-inject.ts (A2-r3-output-write amendment).

export async function dbReplaceOutputFiles(
  jobId: OutputJobId,
  files: OutputFiles,
): Promise<OutputResult<void>> {
  try {
    await db.query(
      `UPDATE builds
         SET output_files = $2::jsonb,
             updated_at   = NOW()
       WHERE build_id = $1`,
      [jobId as string, JSON.stringify(files)]
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return {
      ok: false,
      error: {
        code:    'DB_ERROR',
        message: e instanceof Error ? e.message : 'Database error',
        context: { jobId },
      },
    }
  }
}
