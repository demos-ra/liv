// @liv-standard v1.3
// [F-output/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// category:   Modality
// layer:      R1
// wires-in:
//   W-ATOM  OutputFile    ../types/output-types
//   W-ATOM  OutputFiles   ../types/output-types
//   W-ATOM  PushPayload   ../types/output-types
//   W-ATOM  GitHubSlug    ../types/output-types
//   W-ATOM  GitLabSlug    ../types/output-types
//   W-ATOM  GitVenue      ../types/output-types
//   W-ATOM  OUTPUT_CONST  ../types/output-const
// wires-out:  none  (R1 consumed intra-slice by R2 only — A2)
// deps:
//   R0  ../types/output-types
//   R0  ../types/output-const
// validated:  2026-03-12

// A1: pure — no I/O, no throws. All fn return typed results.
// R1 never logs, never fetches, never touches filesystem.

import type { OutputFile, OutputFiles, PushPayload, GitHubSlug, GitLabSlug, GitVenue } from '../types/output-types'
import { OUTPUT_CONST }                               from '../types/output-const'

// ── File-tree validation ───────────────────────────────────────────────────────

export type FileValidationError = {
  path:    string
  code:    string
  message: string
}

export function validateOutputFiles(files: OutputFiles): FileValidationError[] {
  const errors: FileValidationError[] = []

  if (files.length === 0) {
    errors.push({ path: '*', code: 'EMPTY', message: 'Output file tree is empty' })
    return errors
  }
  if (files.length > OUTPUT_CONST.MAX_FILES) {
    errors.push({ path: '*', code: 'TOO_MANY_FILES', message: `Output exceeds ${OUTPUT_CONST.MAX_FILES} files` })
    return errors
  }

  const seen = new Set<string>()
  for (const file of files) {
    if (!file.path || file.path.trim() === '') {
      errors.push({ path: '(empty)', code: 'EMPTY_PATH', message: 'File has empty path' })
      continue
    }
    if (file.path.startsWith('/') || file.path.startsWith('..')) {
      errors.push({ path: file.path, code: 'ABSOLUTE_PATH', message: 'File path must be relative' })
    }
    if (seen.has(file.path)) {
      errors.push({ path: file.path, code: 'DUPLICATE_PATH', message: 'Duplicate file path in output tree' })
    }
    seen.add(file.path)

    const byteLen = new TextEncoder().encode(file.content).length
    if (byteLen > OUTPUT_CONST.MAX_FILE_BYTES) {
      errors.push({
        path:    file.path,
        code:    'FILE_TOO_LARGE',
        message: `File exceeds ${OUTPUT_CONST.MAX_FILE_BYTES / 1_000_000} MB`,
      })
    }
  }

  return errors
}

// ── Total size calculation ─────────────────────────────────────────────────────

export function totalOutputBytes(files: OutputFiles): number {
  return files.reduce((sum, f) => sum + new TextEncoder().encode(f.content).length, 0)
}

// ── Push payload validation ────────────────────────────────────────────────────

export type PushValidationError = {
  field:   string
  code:    string
  message: string
}

const GIT_URL_RE  = /^(https?:\/\/|git@)[^\s]+$/
const BRANCH_RE   = /^[a-zA-Z0-9._\-/]{1,200}$/

export function validatePushPayload(p: PushPayload): PushValidationError[] {
  const errors: PushValidationError[] = []

  if (!p.remoteUrl?.trim()) {
    errors.push({ field: 'remoteUrl', code: 'REQUIRED', message: 'Remote URL is required' })
  } else if (!GIT_URL_RE.test(p.remoteUrl.trim())) {
    errors.push({ field: 'remoteUrl', code: 'INVALID_URL', message: 'Must be a valid https:// or git@ URL' })
  }

  if (!p.token?.trim()) {
    errors.push({ field: 'token', code: 'REQUIRED', message: 'Auth token is required' })
  }

  if (!p.branch?.trim()) {
    errors.push({ field: 'branch', code: 'REQUIRED', message: 'Target branch is required' })
  } else if (!BRANCH_RE.test(p.branch.trim())) {
    errors.push({ field: 'branch', code: 'INVALID_BRANCH', message: 'Branch name contains invalid characters' })
  }

  if (!p.message?.trim()) {
    errors.push({ field: 'message', code: 'REQUIRED', message: 'Commit message is required' })
  } else if (p.message.trim().length > OUTPUT_CONST.COMMIT_MSG_MAX) {
    errors.push({
      field:   'message',
      code:    'MSG_TOO_LONG',
      message: `Commit message subject must be ≤ ${OUTPUT_CONST.COMMIT_MSG_MAX} characters`,
    })
  }

  return errors
}

// ── Git venue detection ────────────────────────────────────────────────────────
// Pure — no network call. Determines which HTTP API to use for the push.
// GitVenue declared at R0 (output-types.ts) — A6.

export function detectVenue(remoteUrl: string): GitVenue {
  const url = remoteUrl.toLowerCase()
  if (url.includes('github.com'))  return OUTPUT_CONST.VENUE_GITHUB
  if (url.includes('gitlab.com'))  return OUTPUT_CONST.VENUE_GITLAB
  return OUTPUT_CONST.VENUE_GENERIC
}

// ── GitHub repo slug parser ────────────────────────────────────────────────────
// Extracts owner/repo from:
//   https://github.com/org/repo(.git)?
//   git@github.com:org/repo(.git)?
// Type declared at R0 (output-types.ts) — A6.

export function parseGitHubSlug(remoteUrl: string): GitHubSlug {
  // https variant
  const https = remoteUrl.match(/github\.com\/([^/]+)\/([^/\s.]+)/)
  if (https) return { owner: https[1], repo: https[2].replace(/\.git$/, '') }

  // ssh variant
  const ssh = remoteUrl.match(/github\.com:([^/]+)\/([^\s.]+)/)
  if (ssh)   return { owner: ssh[1],   repo: ssh[2].replace(/\.git$/, '') }

  return null
}

// ── GitLab project path parser ─────────────────────────────────────────────────
// Type declared at R0 (output-types.ts) — A6.

export function parseGitLabSlug(remoteUrl: string): GitLabSlug {
  const https = remoteUrl.match(/gitlab\.com\/(.+?)(?:\.git)?$/)
  if (https) return { encodedPath: encodeURIComponent(https[1]) }

  const ssh = remoteUrl.match(/gitlab\.com:(.+?)(?:\.git)?$/)
  if (ssh)   return { encodedPath: encodeURIComponent(ssh[1]) }

  return null
}
