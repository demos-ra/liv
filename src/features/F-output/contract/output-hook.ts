// @liv-standard v1.3
// [F-output/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// category:   Modality
// layer:      R3
// wires-in:
//   W-ATOM  OutputFile       ../types/output-types
//   W-ATOM  OutputFiles      ../types/output-types
//   W-ATOM  OutputJobId      ../types/output-types
//   W-ATOM  PushPayload      ../types/output-types
//   W-ATOM  PushResult       ../types/output-types
//   prop    isPipelineDone   boolean — passed by caller (F-workspace reads usePlanner)
// wires-out:
//   W-HOOK  useOutput  →  F-workspace/R3, F-output UI components
// deps:
//   R0  ../types/output-types
//   R5  react
// validated:  2026-03-12

// A5 fix (f1-fix): removed usePlanner cross-slice import.
// isPipelineDone is now a boolean prop passed in by the caller.
// The caller (e.g. F-workspace) reads planner state in its own slice and passes the flag down.
// No amendment needed — this is the canonical single-slice pattern.

'use client'

import { useState, useCallback, useEffect } from 'react'
import type {
  OutputFiles,
  PushPayload,
  PushResult,
} from '../types/output-types'

// ── Hook shape ─────────────────────────────────────────────────────────────────
export type OutputHook = {
  files:          OutputFiles | null
  filesStatus:    'idle' | 'loading' | 'error' | 'success'
  filesError:     { code: string; message: string } | null
  pushStatus:     'idle' | 'loading' | 'error' | 'success'
  pushResult:     PushResult | null
  pushError:      { code: string; message: string } | null
  isPipelineDone: boolean
  loadFiles:      (jobId: string) => void
  download:       (jobId: string) => void
  push:           (jobId: string, opts: Omit<PushPayload, 'jobId'>) => void
  resetPush:      () => void
}

export function useOutput(jobId?: string, isPipelineDone?: boolean): OutputHook {
  const [files,       setFiles]       = useState<OutputFiles | null>(null)
  const [filesStatus, setFilesStatus] = useState<OutputHook['filesStatus']>('idle')
  const [filesError,  setFilesError]  = useState<OutputHook['filesError']>(null)
  const [pushStatus,  setPushStatus]  = useState<OutputHook['pushStatus']>('idle')
  const [pushResult,  setPushResult]  = useState<PushResult | null>(null)
  const [pushError,   setPushError]   = useState<OutputHook['pushError']>(null)

  // Auto-load files when pipeline completes
  useEffect(() => {
    if (isPipelineDone && jobId && filesStatus === 'idle') {
      loadFiles(jobId)
    }
  }, [isPipelineDone, jobId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── loadFiles ────────────────────────────────────────────────────────────────

  const loadFiles = useCallback((jId: string) => {
    setFilesStatus('loading')
    setFilesError(null)
    fetch(`/api/output/${jId}/files`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setFiles(data.data)
          setFilesStatus('success')
        } else {
          setFilesError(data.error)
          setFilesStatus('error')
        }
      })
      .catch(() => {
        setFilesError({ code: 'NETWORK_ERROR', message: 'Failed to load output files' })
        setFilesStatus('error')
      })
  }, [])

  // ── download ─────────────────────────────────────────────────────────────────
  // Triggers a browser download by creating a temporary anchor.
  // No state change — download is fire-and-forget from the UI perspective.

  const download = useCallback((jId: string) => {
    const anchor = document.createElement('a')
    anchor.href     = `/api/output/${jId}/download`
    anchor.download = `liv-output-${jId.slice(0, 8)}.zip`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }, [])

  // ── push ─────────────────────────────────────────────────────────────────────
  // Token passed per-request — never stored in hook state beyond the request lifecycle.

  const push = useCallback((jId: string, opts: Omit<PushPayload, 'jobId'>) => {
    setPushStatus('loading')
    setPushError(null)
    setPushResult(null)

    fetch(`/api/output/${jId}/push`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify(opts),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setPushResult(data.data)
          setPushStatus('success')
        } else {
          setPushError(data.error)
          setPushStatus('error')
        }
      })
      .catch(() => {
        setPushError({ code: 'NETWORK_ERROR', message: 'Push request failed' })
        setPushStatus('error')
      })
  }, [])

  const resetPush = useCallback(() => {
    setPushStatus('idle')
    setPushResult(null)
    setPushError(null)
  }, [])

  return {
    files,
    filesStatus,
    filesError,
    pushStatus,
    pushResult,
    pushError,
    isPipelineDone: isPipelineDone ?? false,
    loadFiles,
    download,
    push,
    resetPush,
  }
}
