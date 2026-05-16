// @liv-standard v1.5.1
// [F-discover/contract/discover-face.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-12-shot-4 (NEW — Render Standard v1.0 DA1–DA5)
// slice:      F-discover
// layer:      R3
// wires-in:
//   W-HOOK  useRegisterProgram     F-surface/contract/surface-registry
//   W-ATOM  ProgramRenderIntent    F-dashboard/types/dashboard-types
//   W-FN    threadQuery            F-memory/contract/substrate-contract
//   W-ATOM  ThreadQueryInput       core/types/substrate.types
//   W-ATOM  StateChangeRecord      core/types/substrate.types
// wires-out:
//   W-HOOK  DiscoverFace  →  F-surface/contract/surface-registry
// deps:
//   R3  @/features/F-surface/contract/surface-registry
//   R0  @/features/F-dashboard/types/dashboard-types
//   R3  @/features/F-memory/contract/substrate-contract
//   R5  @/core/types/substrate.types
//   R5  react
// validated:  pending
//
// Render Standard v1.0 alignment:
//   DA1 — RenderDeclaration: programId='discover', label='Discovery', actionKinds=[]
//   DA4 — props: (programId, userId, projectId) only
//   DA5 — useRegisterProgram at mount
//
// D1 substrate query: identity-recurrence on 'research-output' IdentityRef, scope=projectId.
//   Research completion writes stamp 'research-output' as the first identity in the
//   record. Anchoring on this surfaces all discovery completions for this project.

'use client'

import React, { useEffect, useState } from 'react'
import { useRegisterProgram }          from '@/features/F-surface/contract/surface-registry'
import { threadQuery }                 from '@/features/F-memory/contract/substrate-contract'
import type { StateChangeRecord, IdentityRef, ScopeRef } from '@/core/types/substrate.types'
import type { ProgramProps }           from '@/features/F-dashboard/types/dashboard-types'

export function DiscoverFace({ programId, userId, projectId }: ProgramProps) {
  const [records, setRecords]   = useState<StateChangeRecord[]>([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState<string | null>(null)

  useRegisterProgram({
    programId,
    label:       'Discovery',
    component:   DiscoverFace,
    actionKinds: [],
  })

  useEffect(() => {
    if (!userId || !projectId) { setLoading(false); return }
    setLoading(true)
    threadQuery(
      {
        threadKind: 'identity-recurrence',
        anchor:     'research-output' as IdentityRef,
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
        <span style={{ color: 'var(--text-dis)' }}>no research records yet</span>
      )}
      {records.map(r => (
        <div key={r.id} style={{ marginBottom: 'var(--u1)', lineHeight: 1.4 }}>
          <span style={{ color: 'var(--text-dis)', fontSize: 'var(--type-xs)' }}>
            {new Date(r.metadata.time).toISOString().slice(11, 19)}
          </span>
          {' '}
          <span style={{ color: 'var(--text-sec)' }}>
            {r.content.identities.slice(0, 3).join(' · ')}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── End ──────────────────────────────────────────────────────────────────────
