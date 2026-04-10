// @liv-standard v1.3
// [F-admin/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    w3-20-admin-tab
// slice:      F-admin
// layer:      R3
// wires-in:
//   W-ATOM  GlobalGraphAdmin  @/features/F-codec/contract/global-graph-admin
// wires-out:  none (rendered by page.tsx via AdminRegister)
// deps:
//   R3  ../../F-codec/contract/global-graph-admin
// A2-admin-codec-r3: F-admin → F-codec dependency. The admin shell renders
//   admin tools. F-codec provides an admin tool. Shell imports tool.
//   Same pattern as F-admin importing F-planner build data.
// validated:  pending

// Admin dashboard — protocol shell for admin programs.
// w3-20-admin-tab: added tab toggle between Builds and Global Graph views.

'use client'

import { useState, useEffect } from 'react'
import { GlobalGraphAdmin } from '@/features/F-codec/contract/global-graph-admin'

// ─── Types ────────────────────────────────────────────────────────────────────

type BuildInfo = {
  id: string
  status: string
  flowId: string | null
  startedAt: string
  completedAt: string | null
  error: string | null
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'builds' | 'graph'>('builds')
  const [builds, setBuilds] = useState<BuildInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab !== 'builds') return
    setLoading(true)
    fetch('/api/admin/builds')
      .then((r) => r.json())
      .then((data) => setBuilds(data.builds || []))
      .catch(() => setBuilds([]))
      .finally(() => setLoading(false))
  }, [activeTab])

  return (
    <div style={{ padding: 'var(--u4)', maxWidth: '960px' }}>
      {/* ── Tab Toggle ── */}
      <div style={{ display: 'flex', gap: 'var(--u3)', marginBottom: 'var(--u3)' }}>
        <button
          onClick={() => setActiveTab('builds')}
          style={activeTab === 'builds' ? activeTabStyle : tabStyle}
        >
          Builds
        </button>
        <button
          onClick={() => setActiveTab('graph')}
          style={activeTab === 'graph' ? activeTabStyle : tabStyle}
        >
          Global Graph
        </button>
      </div>

      {/* ── Builds View ── */}
      {activeTab === 'builds' && (
        <>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-base)', marginBottom: 'var(--u3)' }}>
            Build Monitor
          </h3>
          {loading && <p style={dim}>Loading builds…</p>}
          {!loading && builds.length === 0 && <p style={dim}>No builds found.</p>}
          {!loading && builds.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 'var(--type-sm)' }}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Flow</th>
                  <th style={thStyle}>Started</th>
                  <th style={thStyle}>Completed</th>
                  <th style={thStyle}>Error</th>
                </tr>
              </thead>
              <tbody>
                {builds.map((b) => (
                  <tr key={b.id}>
                    <td style={tdStyle}>{b.id.slice(0, 8)}</td>
                    <td style={tdStyle}>{b.status}</td>
                    <td style={tdStyle}>{b.flowId?.slice(0, 8) ?? '—'}</td>
                    <td style={tdStyle}>{new Date(b.startedAt).toLocaleString()}</td>
                    <td style={tdStyle}>{b.completedAt ? new Date(b.completedAt).toLocaleString() : '—'}</td>
                    <td style={tdStyle}>{b.error ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ── Global Graph View ── */}
      {activeTab === 'graph' && <GlobalGraphAdmin />}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--type-sm)' }
const dim: React.CSSProperties = { color: 'var(--text-sec)', fontSize: 'var(--type-sm)' }

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: 'var(--u2)',
  borderBottom: '1px solid var(--border-subtle)',
  color: 'var(--text-sec)',
  fontWeight: 400,
  ...mono,
}

const tdStyle: React.CSSProperties = {
  padding: 'var(--u2)',
  borderBottom: '1px solid var(--border-subtle)',
  color: 'var(--text-pri)',
  ...mono,
}

const ghostBtn: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-sec)',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--type-sm)',
  padding: 'var(--u1) var(--u2)',
  cursor: 'pointer',
  borderRadius: '4px',
}

const tabStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-sec)',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--type-sm)',
  padding: 'var(--u2) var(--u3)',
  cursor: 'pointer',
  borderRadius: '4px',
}

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  background: 'var(--bg-tertiary)',
  color: 'var(--text-pri)',
  borderColor: 'var(--text-sec)',
}
