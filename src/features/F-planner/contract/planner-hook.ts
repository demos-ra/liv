// @liv-standard v1.3
// [F-planner/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-ATOM  PlannerJob      ../types/planner-types
//   W-ATOM  PlannerJobId    ../types/planner-types
//   W-ATOM  PipelineStage   ../types/planner-types
//   W-ATOM  PipelineStatus  ../types/planner-types
//   W-ATOM  IfContract      ../types/planner-types
// wires-out:
//   W-HOOK  usePlanner  →  F-workspace/R3, F-intake/R3
// deps:
//   R0  ../types/planner-types
//   R5  react
// validated:  2026-03-12

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { PlannerJob, PlannerJobId, PipelineStatus, IfContract } from '../types/planner-types'

const POLL_INTERVAL_MS = 3_000   // 3s poll while pipeline is running

// ── Hook shape ────────────────────────────────────────────────────────────────
export type PlannerHook = {
  job:            PlannerJob | null
  status:         'idle' | 'loading' | 'error' | 'success'
  error:          { code: string; message: string } | null
  startPipeline:  (buildId: string, projectId: string, source: 'CONTINUOUS' | 'REENTRY') => void
  advanceStage:   (jobId: PlannerJobId, message?: string) => void
  failStage:      (jobId: PlannerJobId, reason: string, axiomCite?: string) => void
  freezeContract: (jobId: PlannerJobId, ifContract: IfContract) => void
  refresh:        (jobId: PlannerJobId) => void
}

export function usePlanner(initialJobId?: PlannerJobId): PlannerHook {
  const [job,    setJob]    = useState<PlannerJob | null>(null)
  const [status, setStatus] = useState<PlannerHook['status']>('idle')
  const [error,  setError]  = useState<PlannerHook['error']>(null)
  const pollRef             = useRef<ReturnType<typeof setInterval> | null>(null)

  const isRunning = (pipelineStatus: PipelineStatus) =>
    pipelineStatus === 'running' || pipelineStatus === 'pending'

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }, [])

  const fetchJob = useCallback(async (jobId: PlannerJobId) => {
    const res  = await fetch(`/api/planner/${jobId}`, { credentials: 'include' })
    const data = await res.json()
    if (data.ok) {
      setJob(data.data)
      setStatus('success')
      if (!isRunning(data.data.pipelineStatus)) stopPolling()
    } else {
      setError(data.error)
      setStatus('error')
      stopPolling()
    }
  }, [stopPolling])

  // Auto-poll while a job is running
  useEffect(() => {
    if (!job || !isRunning(job.pipelineStatus)) return
    stopPolling()
    pollRef.current = setInterval(() => fetchJob(job.jobId), POLL_INTERVAL_MS)
    return stopPolling
  }, [job?.jobId, job?.pipelineStatus, fetchJob, stopPolling])

  // Load initial job if provided
  useEffect(() => {
    if (!initialJobId) return
    setStatus('loading')
    fetchJob(initialJobId).catch(() => {
      setError({ code: 'NETWORK_ERROR', message: 'Failed to load pipeline status' })
      setStatus('error')
    })
  }, [initialJobId, fetchJob])

  // Cleanup on unmount
  useEffect(() => stopPolling, [stopPolling])

  const startPipeline = useCallback((
    buildId:   string,
    projectId: string,
    source:    'CONTINUOUS' | 'REENTRY'
  ) => {
    setStatus('loading')
    fetch('/api/planner/start', {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ buildId, projectId, source }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) { setJob(data.data); setStatus('success') }
        else         { setError(data.error); setStatus('error') }
      })
      .catch(() => { setError({ code: 'NETWORK_ERROR', message: 'Failed to start pipeline' }); setStatus('error') })
  }, [])

  const advanceStage = useCallback((jobId: PlannerJobId, message?: string) => {
    fetch(`/api/planner/${jobId}/advance`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ message: message ?? null }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) setJob(data.data)
        else         setError(data.error)
      })
      .catch(() => setError({ code: 'NETWORK_ERROR', message: 'Failed to advance stage' }))
  }, [])

  const failStage = useCallback((jobId: PlannerJobId, reason: string, axiomCite?: string) => {
    fetch(`/api/planner/${jobId}/fail`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ reason, axiomCite: axiomCite ?? null }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) setJob(data.data)
        else         setError(data.error)
      })
      .catch(() => setError({ code: 'NETWORK_ERROR', message: 'Failed to fail stage' }))
  }, [])

  const freezeContract = useCallback((jobId: PlannerJobId, ifContract: IfContract) => {
    fetch(`/api/planner/${jobId}/contract`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ ifContract }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) setJob(data.data)
        else         setError(data.error)
      })
      .catch(() => setError({ code: 'NETWORK_ERROR', message: 'Failed to freeze contract' }))
  }, [])

  const refresh = useCallback((jobId: PlannerJobId) => {
    fetchJob(jobId).catch(() => setError({ code: 'NETWORK_ERROR', message: 'Failed to refresh' }))
  }, [fetchJob])

  return { job, status, error, startPipeline, advanceStage, failStage, freezeContract, refresh }
}
