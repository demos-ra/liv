// @liv-standard v1.5.1
// [F-memory/contract/memory-face.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-12-shot-4 (NEW — Render Standard v1.0 DA1–DA5)
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-HOOK  useRegisterProgram     F-dashboard/contract/dashboard-registry
//   W-ATOM  ProgramRenderIntent    F-dashboard/types/dashboard-types
//   W-FN    threadQuery            F-memory/contract/substrate-contract
//   W-ATOM  StateChangeRecord      core/types/substrate.types
// wires-out:
//   W-HOOK  MemoryFace  →  F-dashboard/contract/dashboard-registry
// deps:
//   R3  @/features/F-dashboard/contract/dashboard-registry
//   R0  @/features/F-dashboard/types/dashboard-types
//   R3  ./substrate-contract
//   R5  @/core/types/substrate.types
//   R5  react
// validated:  pending
//
// D1 substrate query: identity-recurrence on userId, scope=projectId.
//   Memory is the raw substrate view — identity-recurrence on userId across
//   the project scope surfaces all writes from the authenticated user.
//   This is the broadest read: every state-change the user produced appears here.
//
// D4: F-memory is a substrate reader, not a routed domain program.
//   No F-router registration. Render face only.

'use client'

import React, { useEffect, useState } from 'react'
import { useRegisterProgram }          from '@/features/F-dashboard/contract/dashboard-registry'
import { threadQuery }                 from './substrate-contract'
import type { StateChangeRecord, IdentityRef, ScopeRef } from '@/core/types/substrate.types'
import type { ProgramProps }           from '@/features/F-dashboard/types/dashboard-types'

export function MemoryFace({ programId, userId, projectId }: ProgramProps) {
  const [records, setRecords]   = useState<StateChangeRecord[]>([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState<string | null>(null)

  useRegisterProgram({
    programId,
    label:       'Memory',
    component:   MemoryFace,
    actionKinds: [],
  })

  useEffect(() => {
    if (!userId || !projectId) { setLoading(false); return }
    setLoading(true)
    threadQuery(
      {
        threadKind: 'identity-recurrence',
        anchor:     userId as IdentityRef,
        scope:      projectId as ScopeRef,
        limit:      20,
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
        <span style={{ color: 'var(--text-dis)' }}>substrate empty</span>
      )}
      {records.map(r => (
        <div key={r.id} style={{
          marginBottom:  'var(--u1)',
          lineHeight:    1.4,
          paddingBottom: 'var(--u1)',
          borderBottom:  '1px solid var(--surface-raised)',
        }}>
          <span style={{ color: 'var(--text-dis)', fontSize: 'var(--type-xs)' }}>
            {new Date(r.metadata.time).toISOString().slice(11, 19)}
          </span>
          {' · '}
          <span style={{ color: 'var(--text-dis)', fontSize: 'var(--type-xs)' }}>
            {r.metadata.source.channel}
          </span>
          <br />
          <span style={{ color: 'var(--text-sec)' }}>
            {r.content.identities.join(' · ')}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── End ──────────────────────────────────────────────────────────────────────
