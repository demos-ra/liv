// @liv-standard v1.4
// [F-intake/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.4
// amended:    w5-item-6.5
// slice:      F-intake
// layer:      R3
// wires-in:
//   W-ATOM  IntakeMode             ../types/intake-types
//   W-ATOM  IntakeInput            ../types/intake-types
//   W-ATOM  IntakeState            ../types/intake-types
//   W-ATOM  IntakeValidationError  ../types/intake-types
//   W-ATOM  INTAKE_CONST           ../types/intake-const
// wires-out:
//   W-HOOK  useIntake  →  F-intake/R3 (intake-ui.tsx)
// deps:
//   R0  ../types/intake-types
//   R0  ../types/intake-const
//   R1  ../domain/intake-logic
//   R5  react
// validated:  2026-04-12
//
// w5-item-6.5 (A2, A5, A7):
//   Removed cross-slice imports: usePlanner (F-planner/R3), useProject (F-project/R3).
//   submit() now calls onBuildSubmit callback injected by composition root.
//   Intake owns zero cross-slice hook dependencies — fully deletable (A7).
//   No cross-slice direct invocation (A5). Dependency direction inward only (A2).
//   buildId generation removed — planner generates its own job ID via codec path.
//   pipelineStatus/pipelineError replaced with local submitStatus/submitError.
//   Project existence guard removed — parent owns project context.

'use client'

import { useState, useCallback }         from 'react'
import { validateIntakeInput }           from '../domain/intake-logic'
import { INTAKE_CONST }                  from '../types/intake-const'
import type {
  IntakeMode,
  IntakeInput,
  IntakeState,
  IntakeValidationError,
} from '../types/intake-types'

// ── Hook shape ─────────────────────────────────────────────────────────────────

export type SubmitStatus = 'idle' | 'submitting' | 'submitted' | 'error'

export type IntakeHook = {
  state:         IntakeState
  setMode:       (mode: IntakeMode) => void
  setText:       (text: string) => void
  setGitUrl:     (url: string) => void
  setGitBranch:  (branch: string) => void
  loadZip:       (file: File) => void
  clearZip:      () => void
  submit:        () => void
  canSubmit:     boolean
  submitStatus:  SubmitStatus
  submitError:   string | null
}

const INITIAL_STATE: IntakeState = {
  mode:        'text',
  text:        '',
  gitUrl:      '',
  gitBranch:   INTAKE_CONST.DEFAULT_BRANCH,
  zipFileName: null,
  zipFileSize: null,
  zipFileData: null,
  errors:      [],
}

export function useIntake(onBuildSubmit: (text: string) => void): IntakeHook {
  const [state, setState]             = useState<IntakeState>(INITIAL_STATE)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError]   = useState<string | null>(null)

  // ── Field setters ────────────────────────────────────────────────────────────

  const setMode = useCallback((mode: IntakeMode) => {
    setState(s => ({ ...s, mode, errors: [] }))
  }, [])

  const setText = useCallback((text: string) => {
    setState(s => ({ ...s, text, errors: [] }))
  }, [])

  const setGitUrl = useCallback((url: string) => {
    setState(s => ({ ...s, gitUrl: url, errors: [] }))
  }, [])

  const setGitBranch = useCallback((branch: string) => {
    setState(s => ({ ...s, gitBranch: branch, errors: [] }))
  }, [])

  // ── Zip file loader ───────────────────────────────────────────────────────────
  // Reads file as base64. Pure browser I/O — no server call.

  const loadZip = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      // result is "data:application/zip;base64,<data>" — strip prefix
      const base64 = result.split(',')[1] ?? null
      setState(s => ({
        ...s,
        zipFileName: file.name,
        zipFileSize: file.size,
        zipFileData: base64,
        errors:      [],
      }))
    }
    reader.onerror = () => {
      setState(s => ({
        ...s,
        errors: [{ field: 'file', code: 'UNREADABLE', message: 'Failed to read file' }],
      }))
    }
    reader.readAsDataURL(file)
  }, [])

  const clearZip = useCallback(() => {
    setState(s => ({
      ...s,
      zipFileName: null,
      zipFileSize: null,
      zipFileData: null,
      errors:      [],
    }))
  }, [])

  // ── Submit ────────────────────────────────────────────────────────────────────
  // Validates → calls onBuildSubmit callback with validated text.
  // No cross-slice invocation. Parent wires callback to chat send path.

  const submit = useCallback(() => {
    // Build IntakeInput from state
    let input: IntakeInput
    if (state.mode === 'text') {
      input = { mode: 'text', description: state.text }
    } else if (state.mode === 'zip') {
      input = {
        mode:     'zip',
        fileName: state.zipFileName ?? '',
        fileSize: state.zipFileSize ?? 0,
        fileData: state.zipFileData ?? '',
      }
    } else {
      input = {
        mode:   'git',
        gitUrl: state.gitUrl,
        branch: state.gitBranch || INTAKE_CONST.DEFAULT_BRANCH,
      }
    }

    const errors = validateIntakeInput(input)
    if (errors.length > 0) {
      setState(s => ({ ...s, errors }))
      return
    }

    setState(s => ({ ...s, errors: [] }))
    setSubmitStatus('submitting')
    setSubmitError(null)

    try {
      // Text mode: send description. Zip/git: send intent string.
      // Brief scope: text mode only. Zip/git deferred.
      const text = state.mode === 'text' ? state.text.trim() : ''
      onBuildSubmit(text)
      setSubmitStatus('submitted')
    } catch (err) {
      setSubmitStatus('error')
      setSubmitError(err instanceof Error ? err.message : 'Submission failed')
    }
  }, [state, onBuildSubmit])

  // ── canSubmit ─────────────────────────────────────────────────────────────────
  // Optimistic check — prevents obviously invalid submits without running full validation.

  const canSubmit = (() => {
    if (submitStatus === 'submitting') return false
    switch (state.mode) {
      case 'text': return state.text.trim().length >= INTAKE_CONST.TEXT_MIN_LEN
      case 'zip':  return !!state.zipFileData
      case 'git':  return !!state.gitUrl.trim()
    }
  })()

  return {
    state,
    setMode,
    setText,
    setGitUrl,
    setGitBranch,
    loadZip,
    clearZip,
    submit,
    canSubmit,
    submitStatus,
    submitError,
  }
}
