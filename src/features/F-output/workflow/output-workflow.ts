// @liv-standard v1.3
// [F-output/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    A2-event-bus-r3
// slice:      F-output
// layer:      R2
// wires-in:
//   W-ATOM    OutputFile             ../types/output-types
//   W-ATOM    OutputFiles            ../types/output-types
//   W-ATOM    OutputResult           ../types/output-types
//   W-ATOM    PushPayload            ../types/output-types
//   W-ATOM    OutputJobId            ../types/output-types
//   W-ATOM    PushResult             ../types/output-types
//   W-ATOM    GitHubSlug             ../types/output-types
//   W-ATOM    GitLabSlug             ../types/output-types
//   W-INJECT  IOutputDb              (self — declared below)
//   W-INJECT  IGitPush               (self — declared below)
// wires-out:
//   W-INJECT  IOutputDb  →  F-output/R3 (output-inject.ts)
//   W-INJECT  IGitPush   →  F-output/R3 (output-inject.ts)
// deps:
//   R0  ../types/output-types
//   R1  ../domain/output-logic
//   R3  @/features/F-event-system/contract/event-bus  (A2-event-bus-r3)
// validated:  2026-03-12
//
// A2-event-bus-r3 amendment (inherited from system-wide debt — same as F-planner):
//   R2 imports event-bus at R3 to emit OUTPUT_EVENTS after terminal operations.
//   This is a structural necessity of the current event-bus implementation.
//   Will be resolved when F-event-system is rebuilt with a proper R0/R2 surface.
//   Scope: output-workflow.ts only. All other R2 files are clean.

import type {
  OutputFile,
  OutputFiles,
  OutputResult,
  PushPayload,
  OutputJobId,
  PushResult,
  GitHubSlug,
  GitLabSlug,
} from '../types/output-types'
import {
  validateOutputFiles,
  validatePushPayload,
  totalOutputBytes,
  detectVenue,
  parseGitHubSlug,
  parseGitLabSlug,
} from '../domain/output-logic'
import { OUTPUT_CONST } from '../types/output-const'
import { OUTPUT_EVENTS } from '../types/output-events'
import type {
  OutputDownloadReadyPayload,
  OutputPushCompletePayload,
  OutputPushFailedPayload,
} from '../types/output-events'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

// ── W-INJECT interfaces — declared at R2, implemented at R4, wired at R3 ──────

export interface IOutputDb {
  getOutputFiles: (jobId: OutputJobId) => Promise<OutputResult<OutputFiles>>
  isPipelineComplete: (jobId: OutputJobId) => Promise<OutputResult<boolean>>
}

export interface IGitPush {
  pushToGitHub: (
    slug:    { owner: string; repo: string },
    files:   OutputFiles,
    branch:  string,
    token:   string,
    message: string,
  ) => Promise<OutputResult<PushResult>>

  pushToGitLab: (
    encodedPath: string,
    files:       OutputFiles,
    branch:      string,
    token:       string,
    message:     string,
  ) => Promise<OutputResult<PushResult>>
}

// ── getFiles ──────────────────────────────────────────────────────────────────
// Returns the assembled OutputFiles for a completed build.
// Guards: pipeline must be complete before files are readable.

export async function getFiles(
  db:    IOutputDb,
  jobId: OutputJobId,
): Promise<OutputResult<OutputFiles>> {
  const completedResult = await db.isPipelineComplete(jobId)
  if (!completedResult.ok) return completedResult

  if (!completedResult.data) {
    return { ok: false, error: { code: 'PIPELINE_NOT_COMPLETE', message: 'Pipeline has not completed yet' } }
  }

  const filesResult = await db.getOutputFiles(jobId)
  if (!filesResult.ok) return filesResult

  const errors = validateOutputFiles(filesResult.data)
  if (errors.length > 0) {
    return {
      ok: false,
      error: {
        code:    'INVALID_OUTPUT',
        message: `Output file tree has ${errors.length} validation error(s)`,
        context: { errors },
      },
    }
  }

  return { ok: true, data: filesResult.data }
}

// ── assembleZip ───────────────────────────────────────────────────────────────
// Assembles OutputFiles into a zip Buffer using fflate (zero-dependency, WASM-free).
// fflate is a Node.js compatible zip library — suitable for server-side streaming.
// No filesystem writes. Buffer returned for streaming in R4 route handler.

export async function assembleZip(
  db:    IOutputDb,
  jobId: OutputJobId,
): Promise<OutputResult<Uint8Array>> {
  const filesResult = await getFiles(db, jobId)
  if (!filesResult.ok) return filesResult

  const files = filesResult.data
  const totalBytes = totalOutputBytes(files)

  if (totalBytes > OUTPUT_CONST.MAX_TOTAL_BYTES) {
    return {
      ok: false,
      error: {
        code:    'PAYLOAD_TOO_LARGE',
        message: `Total output size (${(totalBytes / 1_000_000).toFixed(1)} MB) exceeds limit`,
      },
    }
  }

  try {
    // Dynamic import — fflate must be in package.json
    const { zipSync, strToU8 } = await import('fflate')

    const zipInput: Record<string, Uint8Array> = {}
    for (const file of files) {
      if (file.encoding === 'base64') {
        const binary = Buffer.from(file.content, 'base64')
        zipInput[file.path] = new Uint8Array(binary)
      } else {
        zipInput[file.path] = strToU8(file.content)
      }
    }

    const zipped = zipSync(zipInput, { level: 6 })

    const downloadPayload: OutputDownloadReadyPayload = {
      jobId:      jobId as string,
      filesCount: files.length,
      totalBytes,
    }
    await emitEvent({ type: OUTPUT_EVENTS.DOWNLOAD_READY, slice: 'F-output', payload: downloadPayload })

    return { ok: true, data: zipped }
  } catch (e) {
    return {
      ok: false,
      error: {
        code:    'ZIP_ASSEMBLY_FAILED',
        message: e instanceof Error ? e.message : 'Unknown zip error',
      },
    }
  }
}

// ── pushToRemote ──────────────────────────────────────────────────────────────
// Venue-agnostic dispatch — detects GitHub/GitLab from remoteUrl, delegates to
// the appropriate IGitPush method. Token is never stored or logged.

export async function pushToRemote(
  db:      IOutputDb,
  git:     IGitPush,
  payload: PushPayload,
): Promise<OutputResult<PushResult>> {
  // Validate push payload first (R1 — pure)
  const errors = validatePushPayload(payload)
  if (errors.length > 0) {
    return {
      ok: false,
      error: {
        code:    'INVALID_PUSH_PAYLOAD',
        message: `Push payload has ${errors.length} validation error(s)`,
        context: { errors },
      },
    }
  }

  // Load files
  const filesResult = await getFiles(db, payload.jobId)
  if (!filesResult.ok) return filesResult

  const files = filesResult.data
  if (files.length > OUTPUT_CONST.MAX_PUSH_FILES) {
    return {
      ok: false,
      error: {
        code:    'TOO_MANY_FILES_FOR_PUSH',
        message: `Push exceeds ${OUTPUT_CONST.MAX_PUSH_FILES} files — split into multiple commits`,
      },
    }
  }

  const venue = detectVenue(payload.remoteUrl)
  let result: OutputResult<PushResult>

  if (venue === OUTPUT_CONST.VENUE_GITHUB) {
    const slug = parseGitHubSlug(payload.remoteUrl)
    if (!slug) {
      return { ok: false, error: { code: 'INVALID_GITHUB_URL', message: 'Could not parse GitHub owner/repo from URL' } }
    }
    result = await git.pushToGitHub(slug, files, payload.branch, payload.token, payload.message)
  } else if (venue === OUTPUT_CONST.VENUE_GITLAB) {
    const slug = parseGitLabSlug(payload.remoteUrl)
    if (!slug) {
      return { ok: false, error: { code: 'INVALID_GITLAB_URL', message: 'Could not parse GitLab project path from URL' } }
    }
    result = await git.pushToGitLab(slug.encodedPath, files, payload.branch, payload.token, payload.message)
  } else {
    return {
      ok: false,
      error: { code: 'UNSUPPORTED_VENUE', message: 'Only GitHub and GitLab are supported for HTTP push' },
    }
  }

  // Emit push event regardless of result
  if (result.ok) {
    const successPayload: OutputPushCompletePayload = {
      jobId:      payload.jobId as string,
      remoteUrl:  payload.remoteUrl,
      branch:     payload.branch,
      commitSha:  result.data.commitSha,
      filesCount: files.length,
    }
    await emitEvent({ type: OUTPUT_EVENTS.PUSH_COMPLETE, slice: 'F-output', payload: successPayload })
  } else {
    const failPayload: OutputPushFailedPayload = {
      jobId:    payload.jobId as string,
      remoteUrl: payload.remoteUrl,
      code:     result.error.code,
      message:  result.error.message,
    }
    await emitEvent({ type: OUTPUT_EVENTS.PUSH_FAILED, slice: 'F-output', payload: failPayload })
  }

  return result
}
