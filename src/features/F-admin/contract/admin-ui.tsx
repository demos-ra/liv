// @liv-standard v1.3
// [F-admin/contract/admin-ui.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseD-fix1
// slice:      F-admin
// layer:      R3
// wires-in:
//   W-ATOM  AdminBuild             ../types/admin-types
//   W-ATOM  PipelineReportSummary  ../types/admin-types
//   W-ATOM  Spinner                @/features/F-design-system/contract/primitives
//   W-ATOM  Label                  @/features/F-design-system/contract/primitives
// wires-out:
//   W-ATOM  AdminDashboard  →  F-admin/R3 (admin-register.tsx)
// deps:
//   R0  ../types/admin-types
//   R3  @/features/F-design-system/contract/primitives  (A5)
//   R5  react
// validated: pending
//
// step5b-phaseD (A1, A3, A4): (see prior history)
//
// step5b-phaseD-fix1:
//   Error 1: React.CSSProperties used without React in scope.
//     Fixed: import { Fragment, type CSSProperties } from 'react'.
//     All React.CSSProperties replaced with CSSProperties.
//   Error 2: <> shorthand fragment inside builds.map() cannot accept key prop.
//     Fixed: <Fragment key={b.buildId}> — keyed fragment, React reconciles correctly.
//     Inner <tr> keys removed (key belongs on the Fragment, not children).

'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import type { CSSProperties } from 'react'
import { Spinner, Label } from '@/features/F-design-system/contract/primitives'
import type { AdminBuild, PipelineReportSummary } from '../types/admin-types'

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtTime(epochMs: number): string {
  return new Date(epochMs).toISOString().replace('T', ' ').slice(0, 16)
}

function fmtDuration(startMs: number, endMs: number): string {
  const s = Math.round((endMs - startMs) / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

// ── PipelineDetail ────────────────────────────────────────────────────────────

function PipelineDetail({ report }: { report: PipelineReportSummary }) {
  return (
    <div style={{ padding: 'var(--u2) 0', borderTop: '1px solid var(--text-dis)' }}>
      <div style={{ display: 'flex', gap: 'var(--u3)', marginBottom: 'var(--u2)', flexWrap: 'wrap' }}>
        <span style={mono}><span style={dim}>outcome</span> {report.outcome ?? '—'}</span>
        <span style={mono}><span style={dim}>transitions</span> {report.totalTransitions}</span>
        <span style={mono}><span style={dim}>reentries</span> {report.reentries}</span>
        {report.failureReason && (
          <span style={{ ...mono, color: 'var(--text-sec)' }}>
            <span style={dim}>reason</span> {report.failureReason}
          </span>
        )}
      </div>
      {report.stages.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 'var(--type-xs)' }}>
          <thead>
            <tr>
              {['instance', 'model', 'duration', 'tokens', 'handoff'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.stages.map((s, i) => (
              <tr key={i}>
                <td style={tdStyle}>{s.instanceId}</td>
                <td style={tdStyle}>{s.model}</td>
                <td style={tdStyle}>{fmtDuration(s.startedAt, s.completedAt)}</td>
                <td style={tdStyle}>{s.tokenCount.toLocaleString()}</td>
                <td style={tdStyle}>{s.handoffValid ? '✓' : '✗'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ── AdminDashboard ────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [builds, setBuilds]               = useState<AdminBuild[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [includeFailed, setIncludeFailed] = useState(false)
  const [expandedId, setExpandedId]       = useState<string | null>(null)

  const fetchBuilds = useCallback(async (failed: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const statuses = failed ? 'escalated,failed' : 'escalated'
      const res = await fetch(`/api/admin/builds?status=${statuses}&limit=50`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as AdminBuild[]
      setBuilds(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load builds')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBuilds(includeFailed) }, [fetchBuilds, includeFailed])

  const toggleRow = (buildId: string) =>
    setExpandedId(prev => prev === buildId ? null : buildId)

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-sm)' }}>
      {/* ── Header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u3)', marginBottom: 'var(--u3)' }}>
        <Label>Admin</Label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)', color: 'var(--text-dis)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={includeFailed}
            onChange={e => setIncludeFailed(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          include failed
        </label>
        <button
          type="button"
          onClick={() => fetchBuilds(includeFailed)}
          style={ghostBtn}
          aria-label="Refresh"
        >
          ↺
        </button>
      </div>

      {/* ── States ── */}
      {loading && <div style={{ color: 'var(--text-dis)' }}><Spinner size="sm" /></div>}
      {error   && <div style={{ color: 'var(--text-sec)' }}>{error}</div>}
      {!loading && !error && builds.length === 0 && (
        <div style={{ color: 'var(--text-dis)' }}>no builds</div>
      )}

      {/* ── Table ── */}
      {!loading && builds.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['user', 'project', 'build', 'status', 'stage', 'updated'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {builds.map(b => (
              <Fragment key={b.buildId}>
                <tr
                  onClick={() => toggleRow(b.buildId)}
                  style={{ cursor: 'pointer', borderTop: '1px solid var(--text-dis)' }}
                >
                  <td style={tdStyle}>{b.userId.slice(0, 8)}</td>
                  <td style={tdStyle}>{b.projectId.slice(0, 8)}</td>
                  <td style={tdStyle}>{b.buildId.slice(0, 8)}</td>
                  <td style={tdStyle}>{b.status}</td>
                  <td style={tdStyle}>{b.currentStage ?? '—'}</td>
                  <td style={tdStyle}>{fmtTime(b.updatedAt)}</td>
                </tr>
                {expandedId === b.buildId && b.pipelineReport && (
                  <tr>
                    <td colSpan={6} style={{ padding: '0 var(--u2)' }}>
                      <PipelineDetail report={b.pipelineReport} />
                    </td>
                  </tr>
                )}
                {expandedId === b.buildId && !b.pipelineReport && (
                  <tr>
                    <td colSpan={6} style={{ ...tdStyle, color: 'var(--text-dis)' }}>
                      no pipeline report
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ── Style constants ───────────────────────────────────────────────────────────

const mono: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize:   'var(--type-sm)',
  color:      'var(--text-sec)',
}

const dim: CSSProperties = {
  color:       'var(--text-dis)',
  marginRight: '4px',
}

const thStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize:   'var(--type-xs)',
  color:      'var(--text-dis)',
  textAlign:  'left',
  padding:    'var(--u1) var(--u2)',
  fontWeight: 'normal',
  whiteSpace: 'nowrap',
}

const tdStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize:   'var(--type-sm)',
  color:      'var(--text-sec)',
  padding:    'var(--u1) var(--u2)',
  whiteSpace: 'nowrap',
}

const ghostBtn: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize:   'var(--type-sm)',
  color:      'var(--text-dis)',
  background: 'none',
  border:     'none',
  cursor:     'pointer',
  padding:    '0',
}
