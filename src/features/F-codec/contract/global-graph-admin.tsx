// @liv-standard v1.3
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-ATOM  GlobalGraphSummary  F-codec/R0
//   W-ATOM  GlobalSeedInput     F-codec/R0
//   W-ATOM  IngestionSource     F-codec/R0
//   W-ATOM  DecodeOutput        F-codec/R0
//   W-ATOM  DecodedStructure    F-codec/R0
// wires-out:
//   W-ATOM  GlobalGraphAdmin    →  F-admin/R3 (admin-ui)
// deps:
//   R0  ../config/codec-admin-types
//   R0  ../config/codec-decode-types
// validated:  pending

// Global graph admin view — rendered within F-admin's AdminDashboard.
// R3: contract/UI. Fetches from API routes, renders decode output.
// Styling uses CSS custom properties — no F-design-system internal imports (CC.16).

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GlobalGraphSummary } from '../config/codec-admin-types'
import type { DecodedStructure } from '../config/codec-decode-types'

// ─── GlobalGraphAdmin ─────────────────────────────────────────────────────────
// Admin-only view of the global knowledge graph.
// Three capabilities: view, seed, ingest.
// Data: GET /api/admin/global-graph
// Actions: POST /api/admin/global-graph/seed, POST /api/admin/global-graph/ingest

export function GlobalGraphAdmin() {
  // ── State ──
  const [summary, setSummary] = useState<GlobalGraphSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Seed form
  const [seedLabel, setSeedLabel] = useState('')
  const [seedContent, setSeedContent] = useState('')
  const [seedRelatedTo, setSeedRelatedTo] = useState('')

  // Ingest form
  const [ingestType, setIngestType] = useState<'url' | 'text'>('text')
  const [ingestContent, setIngestContent] = useState('')
  const [ingestLabel, setIngestLabel] = useState('')

  // ── Fetch ──
  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/global-graph')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || `HTTP ${res.status}`)
        return
      }
      const data: GlobalGraphSummary = await res.json()
      setSummary(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fetch failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSummary() }, [fetchSummary])

  // ── Actions ──
  const handleSeed = async () => {
    if (!seedLabel.trim() || !seedContent.trim()) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/global-graph/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: seedLabel.trim(),
          content: seedContent.trim(),
          relatedTo: seedRelatedTo.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Seed failed')
        return
      }
      setSeedLabel('')
      setSeedContent('')
      setSeedRelatedTo('')
      await fetchSummary()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Seed failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleIngest = async () => {
    if (!ingestContent.trim() || !ingestLabel.trim()) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/global-graph/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: ingestType,
          content: ingestContent.trim(),
          label: ingestLabel.trim(),
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Ingest failed')
        return
      }
      setIngestContent('')
      setIngestLabel('')
      await fetchSummary()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ingest failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemove = async (nodeId: string) => {
    if (!confirm(`Remove global node ${nodeId}?`)) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/global-graph/seed', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Remove failed')
        return
      }
      await fetchSummary()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Remove failed')
    } finally {
      setActionLoading(false)
    }
  }

  // ── Render ──
  return (
    <div>
      {/* ── Stats Bar ── */}
      <div style={{ display: 'flex', gap: 'var(--u4)', marginBottom: 'var(--u3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--type-sm)' }}>
        <span style={{ color: 'var(--text-sec)' }}>
          Nodes: <strong style={{ color: 'var(--text-pri)' }}>{summary?.nodeCount ?? '—'}</strong>
        </span>
        <span style={{ color: 'var(--text-sec)' }}>
          Edges: <strong style={{ color: 'var(--text-pri)' }}>{summary?.edgeCount ?? '—'}</strong>
        </span>
        <span style={{ color: 'var(--text-sec)' }}>
          Arms: <strong style={{ color: 'var(--text-pri)' }}>{summary?.armCount ?? '—'}</strong>
        </span>
        <button
          onClick={fetchSummary}
          disabled={loading}
          style={ghostBtn}
        >
          {loading ? '…' : '↻ Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'var(--status-error)', fontSize: 'var(--type-sm)', marginBottom: 'var(--u3)' }}>
          {error}
        </div>
      )}

      {/* ── Decode View ── */}
      {summary && (
        <div style={{ marginBottom: 'var(--u4)' }}>
          <h4 style={sectionTitle}>Entities ({summary.decoded.entities.length})</h4>
          {summary.decoded.entities.length === 0 && <p style={emptyText}>No entities</p>}
          {summary.decoded.entities.map((e) => (
            <div key={e.nodeId} style={rowStyle}>
              <span style={mono}>{e.name}</span>
              <span style={dim}>L{e.layer} · E{e.energy.toFixed(2)}</span>
              <button onClick={() => handleRemove(e.nodeId)} disabled={actionLoading} style={ghostBtn}>✕</button>
            </div>
          ))}

          <h4 style={sectionTitle}>Claims ({summary.decoded.claims.length})</h4>
          {summary.decoded.claims.length === 0 && <p style={emptyText}>No claims</p>}
          {summary.decoded.claims.map((c) => (
            <div key={c.nodeId} style={rowStyle}>
              <span style={mono}>{c.name}</span>
              <span style={dim}>conf {c.confidence.toFixed(2)} · {c.supportCount} supports</span>
              <button onClick={() => handleRemove(c.nodeId)} disabled={actionLoading} style={ghostBtn}>✕</button>
            </div>
          ))}

          <h4 style={sectionTitle}>Relations ({summary.decoded.relations.length})</h4>
          {summary.decoded.relations.length === 0 && <p style={emptyText}>No relations</p>}
          {summary.decoded.relations.map((r, i) => (
            <div key={`${r.fromNodeId}-${r.toNodeId}-${i}`} style={rowStyle}>
              <span style={mono}>{r.fromNodeId.slice(0, 8)}→{r.toNodeId.slice(0, 8)}</span>
              <span style={dim}>{r.relationType} · w{r.weight.toFixed(2)}</span>
            </div>
          ))}

          <h4 style={sectionTitle}>Sequences ({summary.decoded.sequences.length})</h4>
          {summary.decoded.sequences.length === 0 && <p style={emptyText}>No sequences</p>}
          {summary.decoded.sequences.map((s, i) => (
            <div key={`seq-${i}`} style={rowStyle}>
              <span style={mono}>{s.labels.join(' → ')}</span>
              <span style={dim}>{s.nodeIds.length} nodes</span>
            </div>
          ))}

          <h4 style={sectionTitle}>Tensions ({summary.decoded.tensions.length})</h4>
          {summary.decoded.tensions.length === 0 && <p style={emptyText}>No tensions</p>}
          {summary.decoded.tensions.map((t, i) => (
            <div key={`tension-${i}`} style={rowStyle}>
              <span style={mono}>{t.nameA} ⟷ {t.nameB}</span>
              <span style={dim}>bridge {t.bridgeWeight.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Seed Panel ── */}
      <div style={panelStyle}>
        <h4 style={sectionTitle}>Seed Global Node</h4>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 'var(--u2)' }}>
          <input
            type="text"
            placeholder="Label (e.g. 'typescript')"
            value={seedLabel}
            onChange={(e) => setSeedLabel(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="Content / description"
            value={seedContent}
            onChange={(e) => setSeedContent(e.target.value)}
            rows={3}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Related to (node ID, optional)"
            value={seedRelatedTo}
            onChange={(e) => setSeedRelatedTo(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleSeed} disabled={actionLoading || !seedLabel.trim() || !seedContent.trim()} style={actionBtn}>
            {actionLoading ? 'Seeding…' : 'Seed Node'}
          </button>
        </div>
      </div>

      {/* ── Ingest Panel ── */}
      <div style={panelStyle}>
        <h4 style={sectionTitle}>Ingest External Source</h4>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 'var(--u2)' }}>
          <div style={{ display: 'flex', gap: 'var(--u2)' }}>
            <label style={{ ...dim, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input type="radio" checked={ingestType === 'text'} onChange={() => setIngestType('text')} /> Text
            </label>
            <label style={{ ...dim, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input type="radio" checked={ingestType === 'url'} onChange={() => setIngestType('url')} /> URL
            </label>
          </div>
          <input
            type="text"
            placeholder="Label (what this source represents)"
            value={ingestLabel}
            onChange={(e) => setIngestLabel(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder={ingestType === 'url' ? 'URL to fetch' : 'Raw text content'}
            value={ingestContent}
            onChange={(e) => setIngestContent(e.target.value)}
            rows={3}
            style={inputStyle}
          />
          <button onClick={handleIngest} disabled={actionLoading || !ingestContent.trim() || !ingestLabel.trim()} style={actionBtn}>
            {actionLoading ? 'Ingesting…' : 'Ingest Source'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
// CSS custom properties from design system. Same pattern as AdminDashboard.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--type-sm)' }
const dim: React.CSSProperties = { color: 'var(--text-sec)', fontSize: 'var(--type-sm)' }
const emptyText: React.CSSProperties = { ...dim, fontStyle: 'italic', margin: '0 0 var(--u2) 0' }

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--type-sm)',
  color: 'var(--text-sec)',
  margin: 'var(--u3) 0 var(--u1) 0',
  fontWeight: 400,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--u3)',
  padding: 'var(--u1) 0',
  borderBottom: '1px solid var(--border-subtle)',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--type-sm)',
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

const panelStyle: React.CSSProperties = {
  border: '1px solid var(--border-subtle)',
  borderRadius: '6px',
  padding: 'var(--u3)',
  marginBottom: 'var(--u3)',
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--type-sm)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-pri)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '4px',
  padding: 'var(--u2)',
  width: '100%',
  boxSizing: 'border-box' as const,
}

const actionBtn: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--type-sm)',
  background: 'var(--bg-tertiary)',
  color: 'var(--text-pri)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '4px',
  padding: 'var(--u2) var(--u3)',
  cursor: 'pointer',
  alignSelf: 'flex-start',
}
