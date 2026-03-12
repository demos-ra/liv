// @liv-standard v1.3
// [F-intake/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-intake
// layer:      R1
// wires-in:
//   W-ATOM  IntakeInput           ../types/intake-types
//   W-ATOM  IntakeInputText       ../types/intake-types
//   W-ATOM  IntakeInputZip        ../types/intake-types
//   W-ATOM  IntakeInputGit        ../types/intake-types
//   W-ATOM  IntakeValidationError ../types/intake-types
//   W-ATOM  INTAKE_CONST          ../types/intake-const
// wires-out:  none  (R1 consumed intra-slice by R3 only — A2)
//   buildFeatureIntent — reserved: produces IF.01 intent string.
//   Currently unexported to pipeline — StartPipelinePayload has no description field yet.
//   Will be wired when F-planner StartPipelinePayload gains intentText: string.
// deps:
//   R0  ../types/intake-types
//   R0  ../types/intake-const
// validated:  2026-03-12

// A4: pure — no I/O, no throws. Returns typed validation results.
// R1 never logs.

import type { IntakeInput, IntakeValidationError } from '../types/intake-types'
import { INTAKE_CONST } from '../types/intake-const'

// ── Text validator ─────────────────────────────────────────────────────────────

export function validateTextInput(description: string): IntakeValidationError[] {
  const errors: IntakeValidationError[] = []
  const trimmed = description.trim()

  if (!trimmed) {
    errors.push({ field: 'description', code: 'REQUIRED', message: 'Description is required' })
    return errors
  }
  if (trimmed.length < INTAKE_CONST.TEXT_MIN_LEN) {
    errors.push({
      field:   'description',
      code:    'TOO_SHORT',
      message: `Description must be at least ${INTAKE_CONST.TEXT_MIN_LEN} characters`,
    })
  }
  if (trimmed.length > INTAKE_CONST.TEXT_MAX_LEN) {
    errors.push({
      field:   'description',
      code:    'TOO_LONG',
      message: `Description must be under ${INTAKE_CONST.TEXT_MAX_LEN.toLocaleString()} characters`,
    })
  }
  return errors
}

// ── Zip validator ──────────────────────────────────────────────────────────────

export function validateZipInput(
  fileName: string,
  fileSize: number,
  fileData: string | null
): IntakeValidationError[] {
  const errors: IntakeValidationError[] = []

  if (!fileName) {
    errors.push({ field: 'file', code: 'REQUIRED', message: 'No file selected' })
    return errors
  }
  if (!fileName.toLowerCase().endsWith('.zip')) {
    errors.push({ field: 'file', code: 'INVALID_TYPE', message: 'File must be a .zip archive' })
  }
  if (fileSize > INTAKE_CONST.ZIP_MAX_BYTES) {
    errors.push({
      field:   'file',
      code:    'TOO_LARGE',
      message: `File must be under ${INTAKE_CONST.ZIP_MAX_BYTES / 1_000_000} MB`,
    })
  }
  if (!fileData) {
    errors.push({ field: 'file', code: 'UNREADABLE', message: 'File could not be read' })
  }
  return errors
}

// ── Git validator ──────────────────────────────────────────────────────────────

export function validateGitInput(
  gitUrl: string,
  branch: string
): IntakeValidationError[] {
  const errors: IntakeValidationError[] = []

  if (!gitUrl.trim()) {
    errors.push({ field: 'gitUrl', code: 'REQUIRED', message: 'Repository URL is required' })
    return errors
  }
  if (!INTAKE_CONST.GIT_URL_PATTERN.test(gitUrl.trim())) {
    errors.push({ field: 'gitUrl', code: 'INVALID_URL', message: 'Must be a valid https:// or git@ URL' })
  }
  if (branch && !INTAKE_CONST.BRANCH_PATTERN.test(branch)) {
    errors.push({ field: 'branch', code: 'INVALID_BRANCH', message: 'Branch name contains invalid characters' })
  }
  return errors
}

// ── Union dispatcher ───────────────────────────────────────────────────────────

export function validateIntakeInput(input: IntakeInput): IntakeValidationError[] {
  switch (input.mode) {
    case 'text': return validateTextInput(input.description)
    case 'zip':  return validateZipInput(input.fileName, input.fileSize, input.fileData)
    case 'git':  return validateGitInput(input.gitUrl, input.branch)
  }
}

// ── Payload builder ────────────────────────────────────────────────────────────
// Produces the human-readable feature intent string written to IF.01.
// R1 transforms input → intent string. No I/O.

export function buildFeatureIntent(input: IntakeInput): string {
  switch (input.mode) {
    case 'text':
      return input.description.trim().slice(0, 200)
    case 'zip':
      return `Build from uploaded archive: ${input.fileName}`
    case 'git':
      return `Build from repository: ${input.gitUrl} (branch: ${input.branch || 'main'})`
  }
}
