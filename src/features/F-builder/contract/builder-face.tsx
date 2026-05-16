// @liv-standard v1.5.2
// [F-builder/contract/builder-face.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-12-shot-4 (NEW — Render Standard v1.0 DA1–DA5); sprint-b2-unified-close-fix-round-2 (ProgramProps import repointed F-dashboard/types/dashboard-types → F-surface/types/surface-types per L0 ruling A "external consumers import directly from F-surface/R0")
// slice:      F-builder
// layer:      R3
// wires-in:
//   W-HOOK  useRegisterProgram     F-surface/contract/surface-registry
//   W-ATOM  ProgramProps           F-surface/types/surface-types
//   W-FN    threadQuery            F-memory/contract/substrate-contract
//   W-ATOM  StateChangeRecord      core/types/substrate.types
// wires-out:
//   W-HOOK  BuilderFace  →  F-surface/contract/surface-registry
// deps:
//   R3  @/features/F-surface/contract/surface-registry
//   R0  @/features/F-surface/types/surface-types
//   R3  @/features/F-memory/contract/substrate-contract
//   R5  @/core/types/substrate.types
//   R5  react
// validated:  pending
//
// D1 substrate query: identity-recurrence on 'build-emission', scope=projectId.
//   Build completion writes stamp 'build-emission' as first identity.
//   Anchoring on it surfaces all build completions for this project.

'use client'

import React, { useEffect, useState } from 'react'
import { useRegisterProgram }          from '@/features/F-surface/contract/surface-registry'
import { threadQuery }                 from '@/features/F-memory/contract/substrate-contract'
import type { StateChangeRecord, IdentityRef, ScopeRef } from '@/core/types/substrate.types'
import type { ProgramProps }           from '@/features/F-surface/types/surface-types'

export function BuilderFace({ programId, userId, projectId }: ProgramProps) {
  const [records, setRecords]   = useState<StateChangeRecord[]>([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState<string | null>(null)

  useRegisterProgram({
    programId,
    label:       'Pipeline',
    component:   BuilderFace,
    actionKinds: [],
  })

  useEffect(() => {
    if (!userId || !projectId) { setLoading(false); return }
    setLoading(true)
    threadQuery(
      {
        threadKind: 'identity-recurrence',
        anchor:     'build-emission' as IdentityRef,
        scope:      projectId as ScopeRef,
        limit:      10,
      },
      userId,
    ).then(result => {
      if (result.ok) setRecords(result.data.records)
      else setError(result.error.message)
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'query failed')
    }).finally(() => setLoading(false))
  }, [userId, projectId])

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-sm)' }}>
      {loading && <span style={{ color: 'var(--text-dis)' }}>loading…</span>}
      {error   && <span style={{ color: 'var(--error)' }}>{error}</span>}
      {!loading && !error && records.length === 0 && (
        <span style={{ color: 'var(--text-dis)' }}>no build records yet</span>
      )}
      {records.map(r => (
        <div key={r.id} style={{ marginBottom: 'var(--u1)', lineHeight: 1.4 }}>
          <span style={{ color: 'var(--text-dis)', fontSize: 'var(--type-xs)' }}>
            {new Date(r.metadata.time).toISOString().slice(11, 19)}
          </span>
          {' '}
          <span style={{ color: 'var(--text-sec)' }}>
            {r.content.identities.slice(0, 4).join(' · ')}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── End ──────────────────────────────────────────────────────────────────────
