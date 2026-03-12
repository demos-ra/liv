// @liv-standard v1.3
// [F-project/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R3
// wires-in:
//   W-ATOM  ProjectSummary       ../types/project-types
//   W-ATOM  Project              ../types/project-types
//   W-ATOM  ProjectId            ../types/project-types
//   W-ATOM  CreateProjectPayload ../types/project-types
//   W-ATOM  ProjectDelta         ../types/project-types
//   W-ATOM  AppError             @/core/types/primitives
// wires-out:
//   W-HOOK  useProject  →  F-chat/R3, F-workspace/R3
// deps:
//   R0  ../types/project-types
//   R5  react
// validated:  2026-03-12

'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ProjectSummary, ProjectId, CreateProjectPayload, ProjectDelta } from '../types/project-types'

// ── Hook shape — canonical T3.2 ───────────────────────────────────────────────
export type ProjectHook = {
  projects:       ProjectSummary[]
  activeProject:  ProjectSummary | null
  status:         'idle' | 'loading' | 'error' | 'success'
  error:          { code: string; message: string } | null
  create:         (input: CreateProjectPayload) => void
  update:         (projectId: ProjectId, delta: ProjectDelta) => void
  remove:         (projectId: ProjectId) => void
  setActive:      (projectId: ProjectId) => void
}

export function useProject(): ProjectHook {
  const [projects,      setProjects]      = useState<ProjectSummary[]>([])
  const [activeProject, setActiveProject] = useState<ProjectSummary | null>(null)
  const [status,        setStatus]        = useState<ProjectHook['status']>('idle')
  const [error,         setError]         = useState<ProjectHook['error']>(null)

  // Load project list on mount
  useEffect(() => {
    setStatus('loading')
    fetch('/api/projects', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setProjects(data.data)
          setStatus('success')
          // Auto-select first project if none active
          if (data.data.length > 0) setActiveProject(data.data[0])
        } else {
          setError(data.error)
          setStatus('error')
        }
      })
      .catch(() => {
        setError({ code: 'NETWORK_ERROR', message: 'Failed to load projects' })
        setStatus('error')
      })
  }, [])

  const create = useCallback((input: CreateProjectPayload) => {
    setStatus('loading')
    fetch('/api/projects', {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify(input),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          const summary: ProjectSummary = { ...data.data, latestBuild: null }
          setProjects((prev: ProjectSummary[]) => [summary, ...prev])
          setActiveProject(summary)
          setStatus('success')
        } else {
          setError(data.error)
          setStatus('error')
        }
      })
      .catch(() => {
        setError({ code: 'NETWORK_ERROR', message: 'Failed to create project' })
        setStatus('error')
      })
  }, [])

  const update = useCallback((projectId: ProjectId, delta: ProjectDelta) => {
    setStatus('loading')
    fetch(`/api/projects/${projectId}`, {
      method:      'PATCH',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify(delta),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setProjects((prev: ProjectSummary[]) => prev.map((p: ProjectSummary) =>
            p.projectId === projectId ? { ...p, ...data.data } : p
          ))
          if (activeProject?.projectId === projectId)
            setActiveProject((prev: ProjectSummary | null) => prev ? { ...prev, ...data.data } : null)
          setStatus('success')
        } else {
          setError(data.error)
          setStatus('error')
        }
      })
      .catch(() => {
        setError({ code: 'NETWORK_ERROR', message: 'Failed to update project' })
        setStatus('error')
      })
  }, [activeProject])

  const remove = useCallback((projectId: ProjectId) => {
    fetch(`/api/projects/${projectId}`, {
      method:      'DELETE',
      credentials: 'include',
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setProjects((prev: ProjectSummary[]) => prev.filter((p: ProjectSummary) => p.projectId !== projectId))
          if (activeProject?.projectId === projectId) setActiveProject(null)
        } else {
          setError(data.error)
        }
      })
      .catch(() => setError({ code: 'NETWORK_ERROR', message: 'Failed to delete project' }))
  }, [activeProject])

  const setActive = useCallback((projectId: ProjectId) => {
    const found = projects.find((p: ProjectSummary) => p.projectId === projectId) ?? null
    setActiveProject(found)
  }, [projects])

  return { projects, activeProject, status, error, create, update, remove, setActive }
}
