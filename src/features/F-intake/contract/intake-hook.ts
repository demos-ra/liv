// @liv-standard v1.3
// [F-intake/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-intake
// layer:      R3
// wires-in:
//   W-ATOM  IntakeMode             ../types/intake-types
//   W-ATOM  IntakeInput            ../types/intake-types
//   W-ATOM  IntakeState            ../types/intake-types
//   W-ATOM  IntakeValidationError  ../types/intake-types
//   W-ATOM  INTAKE_CONST           ../types/intake-const
//   W-HOOK  usePlanner             @/features/F-planner/contract/planner-hook
//   W-HOOK  useProject             @/features/F-project/contract/project-hook
// wires-out:
//   W-HOOK  useIntake  →  F-intake/R3 (intake-ui.tsx)
// deps:
//   R0  ../types/intake-types
//   R0  ../types/intake-const
//   R1  ../domain/intake-logic
//   R3  @/features/F-planner/contract/planner-hook
//   R3  @/features/F-project/contract/project-hook
//   R5  react
// validated:  2026-03-12

'use client'

import { useState, useCallback }         from 'react'
import { usePlanner }                    from '@/features/F-planner/contract/planner-hook'
import { useProject }                    from '@/features/F-project/contract/project-hook'
import { validateIntakeInput }           from '../domain/intake-logic'
import { INTAKE_CONST }                  from '../types/intake-const'
import type {
  IntakeMode,
  IntakeInput,
  IntakeState,
  IntakeValidationError,
} from '../types/intake-types'

// ── Hook shape ─────────────────────────────────────────────────────────────────
export type IntakeHook = {
  state:          IntakeState
  setMode:        (mode: IntakeMode) => void
  setText:        (text: string) => void
  setGitUrl:      (url: string) => void
  setGitBranch:   (branch: string) => void
  loadZip:        (file: File) => void
  clearZip:       () => void
  submit:         () => void
  canSubmit:      boolean
  pipelineStatus: 'idle' | 'loading' | 'error' | 'success'
  pipelineError:  { code: string; message: string } | null
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

export function useIntake(): IntakeHook {
  const [state, setState] = useState<IntakeState>(INITIAL_STATE)
  const planner           = usePlanner()
  const project           = useProject()

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
  // Validates → generates buildId → calls usePlanner.startPipeline.
  // userId comes from session (server-side) — never threaded through client state.

  const submit = useCallback(() => {
    if (!project.activeProject) {
      setState(s => ({
        ...s,
        errors: [{ field: 'project', code: 'NO_PROJECT', message: 'No active project selected' }],
      }))
      return
    }

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

    // buildId generated client-side — uuid v4 pattern, server accepts it as the build key
    const buildId = crypto.randomUUID()

    planner.startPipeline(buildId, project.activeProject.projectId, 'CONTINUOUS')
  }, [state, project.activeProject, planner])

  // ── canSubmit ─────────────────────────────────────────────────────────────────
  // Optimistic check — prevents obviously invalid submits without running full validation.

  const canSubmit = (() => {
    if (planner.status === 'loading') return false
    if (!project.activeProject) return false
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
    pipelineStatus: planner.status,
    pipelineError:  planner.error,
  }
}
