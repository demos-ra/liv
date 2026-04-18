// @liv-standard v1.3
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-ATOM  MemoryTreeNode    F-codec/R0
//   W-ATOM  MemoryAction      F-codec/R0
//   W-ATOM  MemoryViewState   F-codec/R0
//   W-ATOM  DecodeOutput      F-codec/R0
//   W-ATOM  DecodeCategory    F-codec/R0
//   W-ATOM  DecodedStructure  F-codec/R0
//   W-ATOM  MLayer            F-memory/R0
// wires-out:  none (leaf UI component)
// deps:
//   R0  ../config/codec-memory-types   (type only)
//   R0  ../config/codec-decode-types   (type only)
//   R0  ../../F-memory/config/memory-types  (type only)
// validated:  pending

// Memory program — dashboard program rendering the user's memory graph
// as a navigable tree UI. Read-write: user interactions encode through
// the codec as graph operations via API routes.
//
// A1: F-codec owns the memory program. F-dashboard owns program lifecycle.
// A4: I/O (fetch) at component level — R3 component delegates to R4 API routes.
// A5: uses CSS custom properties from F-design-system — no internal imports.
// CA8: tree structure derived from decode output, not authored.

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { DecodeOutput, DecodeCategory, DecodedStructure } from '../config/codec-decode-types'
import type { MLayer } from '@/features/F-memory/config/memory-types'
import type { MemoryTreeNode, MemoryAction } from '../config/codec-memory-types'

// ─── Categories ──────────────────────────────────────────────────────────────

const CATEGORIES: Array<{ value: DecodeCategory | null; label: string }> = [
  { value: null,       label: 'All' },
  { value: 'entity',   label: 'Entities' },
  { value: 'claim',    label: 'Claims' },
  { value: 'sequence', label: 'Sequences' },
  { value: 'tension',  label: 'Tensions' },
  { value: 'artifact', label: 'Artifacts' },
]

const LAYER_LABELS: Record<number, string> = {
  0: 'M0 Identity',
  1: 'M1 Purpose',
  2: 'M2 Knowledge',
  3: 'M3 Context',
  4: 'M4 Input',
}

// ─── Transform decode output → tree ──────────────────────────────────────────
// CA8: deterministic structural read of DecodeOutput into MemoryTreeNode[].

function buildTree(decoded: DecodeOutput, filter: DecodeCategory | null): MemoryTreeNode[] {
  const nodes: MemoryTreeNode[] = []

  // Entity → relation children mapping
  const entityRelations = new Map<string, MemoryTreeNode[]>()
  for (const rel of decoded.relations) {
    const child: MemoryTreeNode = {
      id:         `rel-${rel.fromNodeId}-${rel.toNodeId}`,
      label:      `→ ${findEntityName(decoded, rel.toNodeId)} (${rel.relationType})`,
      category:   'relation',
      layer:      null,
      energy:     rel.weight,
      confidence: null,
      children:   [],
      expandable: false,
    }
    const existing = entityRelations.get(rel.fromNodeId)
    if (existing) existing.push(child)
    else entityRelations.set(rel.fromNodeId, [child])
  }

  // Entities — root nodes sorted M0→M1→M2, then by energy desc
  if (!filter || filter === 'entity') {
    const sorted = [...decoded.entities].sort((a, b) =>
      a.layer !== b.layer ? a.layer - b.layer : b.energy - a.energy
    )
    for (const e of sorted) {
      const children = entityRelations.get(e.nodeId) ?? []
      nodes.push({
        id:         e.nodeId,
        label:      e.name,
        category:   'entity',
        layer:      e.layer,
        energy:     e.energy,
        confidence: null,
        children,
        expandable: children.length > 0,
      })
    }
  }

  // Claims — root nodes with confidence badge
  if (!filter || filter === 'claim') {
    for (const c of decoded.claims) {
      nodes.push({
        id:         `claim-${c.nodeId}`,
        label:      c.name,
        category:   'claim',
        layer:      null,
        energy:     c.energy,
        confidence: c.confidence,
        children:   [],
        expandable: false,
      })
    }
  }

  // Sequences — root nodes showing ordered chain
  if (!filter || filter === 'sequence') {
    for (const s of decoded.sequences) {
      const children: MemoryTreeNode[] = s.nodeIds.map((nid, i) => ({
        id:         `seq-step-${nid}`,
        label:      `${i + 1}. ${s.labels[i] ?? nid}`,
        category:   'entity' as DecodeCategory,
        layer:      null,
        energy:     0,
        confidence: null,
        children:   [],
        expandable: false,
      }))
      nodes.push({
        id:         `seq-${s.nodeIds.join('-')}`,
        label:      `Sequence: ${s.labels[0] ?? '…'} → ${s.labels[s.labels.length - 1] ?? '…'}`,
        category:   'sequence',
        layer:      null,
        energy:     0,
        confidence: null,
        children,
        expandable: children.length > 0,
      })
    }
  }

  // Tensions — root nodes highlighted as attention items
  if (!filter || filter === 'tension') {
    for (const t of decoded.tensions) {
      nodes.push({
        id:         `tension-${t.nodeIdA}-${t.nodeIdB}`,
        label:      `${t.nameA} ↔ ${t.nameB}`,
        category:   'tension',
        layer:      null,
        energy:     t.bridgeWeight,
        confidence: null,
        children:   [],
        expandable: false,
      })
    }
  }

  // Artifacts — framework output nodes
  if (!filter || filter === 'artifact') {
    for (const a of decoded.artifacts) {
      nodes.push({
        id:         `artifact-${a.nodeId}`,
        label:      a.title,
        category:   'artifact',
        layer:      null,
        energy:     a.energy,
        confidence: null,
        children:   [],
        expandable: false,
      })
    }
  }

  return nodes
}

function findEntityName(decoded: DecodeOutput, nodeId: string): string {
  const entity = decoded.entities.find(e => e.nodeId === nodeId)
  return entity?.name ?? nodeId
}

// ─── Extract real node ID from tree ID ───────────────────────────────────────
// Tree IDs may be prefixed (claim-, tension-, rel-, seq-). Extract the
// underlying graph node ID for actions that need it.

function extractNodeId(treeId: string): string {
  if (treeId.startsWith('claim-'))   return treeId.slice(6)
  if (treeId.startsWith('seq-step-')) return treeId.slice(9)
  // Entity nodes use their raw nodeId as tree ID
  return treeId
}

// ─── Diff flash ──────────────────────────────────────────────────────────────
// Brief says "Before and after." — old value crossed out, new value highlighted,
// then settle to new state.

type DiffEntry = { nodeId: string; oldLabel: string }

// ─── Component ───────────────────────────────────────────────────────────────

export function MemoryProgram() {
  const [decoded, setDecoded]       = useState<DecodeOutput | null>(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [filter, setFilter]         = useState<DecodeCategory | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionPending, setActionPending] = useState(false)
  const [diff, setDiff]             = useState<DiffEntry | null>(null)
  const [connectFrom, setConnectFrom] = useState<string | null>(null)
  const diffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Fetch decoded state ──────────────────────────────────────────────────
  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/memory/state')
      if (!res.ok) {
        const body = await res.text()
        setError(`Failed to load memory: ${res.status} ${body}`)
        return
      }
      const data: DecodeOutput = await res.json()
      setDecoded(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memory')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchState() }, [fetchState])

  // ── Execute action ───────────────────────────────────────────────────────
  const executeAction = useCallback(async (action: MemoryAction) => {
    if (!decoded) return
    setActionPending(true)

    // Capture old label for diff flash
    const targetId = 'nodeId' in action ? action.nodeId : ('fromNodeId' in action ? action.fromNodeId : '')
    const oldNode = decoded.entities.find(e => e.nodeId === extractNodeId(targetId))
    if (oldNode) {
      setDiff({ nodeId: targetId, oldLabel: oldNode.name })
    }

    try {
      const res = await fetch('/api/memory/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      })
      if (!res.ok) {
        const body = await res.text()
        setError(`Action failed: ${res.status} ${body}`)
        return
      }
      // Re-fetch to reflect graph change
      await fetchState()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActionPending(false)
      // Clear diff after settle
      if (diffTimerRef.current) clearTimeout(diffTimerRef.current)
      diffTimerRef.current = setTimeout(() => setDiff(null), 1200)
    }
  }, [decoded, fetchState])

  // ── Toggle expand ────────────────────────────────────────────────────────
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // ── Connect mode (relate) ────────────────────────────────────────────────
  const handleConnect = useCallback((nodeId: string) => {
    if (!connectFrom) {
      setConnectFrom(nodeId)
      return
    }
    if (connectFrom === nodeId) {
      setConnectFrom(null)
      return
    }
    executeAction({
      type:       'relate',
      fromNodeId: extractNodeId(connectFrom),
      toNodeId:   extractNodeId(nodeId),
    })
    setConnectFrom(null)
  }, [connectFrom, executeAction])

  // ── Build tree ───────────────────────────────────────────────────────────
  const tree = decoded ? buildTree(decoded, filter) : []

  // ── Count summary ────────────────────────────────────────────────────────
  const counts = decoded ? {
    entities:  decoded.entities.length,
    claims:    decoded.claims.length,
    sequences: decoded.sequences.length,
    tensions:  decoded.tensions.length,
  } : null

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Memory</h2>
        {counts && (
          <span style={styles.counts}>
            {counts.entities}e · {counts.claims}c · {counts.sequences}s · {counts.tensions}t
          </span>
        )}
      </div>

      {/* Category filter */}
      <div style={styles.filterRow}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            type="button"
            style={{
              ...styles.filterBtn,
              ...(filter === cat.value ? styles.filterBtnActive : {}),
            }}
            onClick={() => setFilter(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Connect mode indicator */}
      {connectFrom && (
        <div style={styles.connectBanner}>
          Connecting from node — click another node to link, or same node to cancel.
        </div>
      )}

      {/* Content */}
      <div style={styles.treeArea}>
        {loading && <div style={styles.muted}>Loading memory graph…</div>}
        {error && <div style={styles.error}>{error}</div>}
        {!loading && !error && tree.length === 0 && (
          <div style={styles.muted}>No structures found{filter ? ` for ${filter}` : ''}.</div>
        )}
        {tree.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            expandedIds={expandedIds}
            selectedId={selectedId}
            connectFrom={connectFrom}
            diff={diff}
            actionPending={actionPending}
            onToggleExpand={toggleExpand}
            onSelect={setSelectedId}
            onSuppress={(id) => executeAction({ type: 'suppress', nodeId: extractNodeId(id) })}
            onReinforce={(id) => executeAction({ type: 'reinforce', nodeId: extractNodeId(id) })}
            onConnect={handleConnect}
          />
        ))}
      </div>

      {/* Detail panel */}
      {selectedId && decoded && (
        <DetailPanel
          nodeId={selectedId}
          decoded={decoded}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}

// ─── TreeNode ────────────────────────────────────────────────────────────────

type TreeNodeProps = {
  node:            MemoryTreeNode
  depth:           number
  expandedIds:     Set<string>
  selectedId:      string | null
  connectFrom:     string | null
  diff:            DiffEntry | null
  actionPending:   boolean
  onToggleExpand:  (id: string) => void
  onSelect:        (id: string) => void
  onSuppress:      (id: string) => void
  onReinforce:     (id: string) => void
  onConnect:       (id: string) => void
}

function TreeNode({
  node, depth, expandedIds, selectedId, connectFrom, diff, actionPending,
  onToggleExpand, onSelect, onSuppress, onReinforce, onConnect,
}: TreeNodeProps) {
  const isExpanded = expandedIds.has(node.id)
  const isSelected = selectedId === node.id
  const isConnectSource = connectFrom === node.id
  const hasDiff = diff?.nodeId === node.id

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div
        style={{
          ...styles.nodeRow,
          ...(isSelected ? styles.nodeRowSelected : {}),
          ...(isConnectSource ? styles.nodeRowConnect : {}),
        }}
      >
        {/* Expand toggle */}
        {node.expandable ? (
          <button
            type="button"
            style={styles.expandBtn}
            onClick={() => onToggleExpand(node.id)}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▾' : '▸'}
          </button>
        ) : (
          <span style={styles.expandPlaceholder}>·</span>
        )}

        {/* Category badge */}
        <span style={{ ...styles.badge, ...categoryColor(node.category) }}>
          {node.category[0].toUpperCase()}
        </span>

        {/* Label */}
        <button
          type="button"
          style={styles.labelBtn}
          onClick={() => onSelect(node.id)}
        >
          {hasDiff && diff && (
            <span style={styles.diffOld}>{diff.oldLabel}</span>
          )}
          <span>{node.label}</span>
        </button>

        {/* Layer tag */}
        {node.layer !== null && (
          <span style={styles.layerTag}>M{node.layer}</span>
        )}

        {/* Confidence */}
        {node.confidence !== null && (
          <span style={styles.confidence}>{Math.round(node.confidence * 100)}%</span>
        )}

        {/* Energy */}
        {node.energy > 0 && (
          <span style={styles.energy}>{node.energy.toFixed(2)}</span>
        )}

        {/* Actions */}
        {node.category !== 'relation' && (
          <span style={styles.actions}>
            <button
              type="button"
              style={styles.actionBtn}
              onClick={() => onReinforce(node.id)}
              disabled={actionPending}
              title="Reinforce"
            >↑</button>
            <button
              type="button"
              style={styles.actionBtn}
              onClick={() => onSuppress(node.id)}
              disabled={actionPending}
              title="Suppress"
            >↓</button>
            <button
              type="button"
              style={{ ...styles.actionBtn, ...(isConnectSource ? styles.actionBtnActive : {}) }}
              onClick={() => onConnect(node.id)}
              disabled={actionPending}
              title="Connect"
            >⟷</button>
          </span>
        )}
      </div>

      {/* Children */}
      {isExpanded && node.children.map(child => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          expandedIds={expandedIds}
          selectedId={selectedId}
          connectFrom={connectFrom}
          diff={diff}
          actionPending={actionPending}
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
          onSuppress={onSuppress}
          onReinforce={onReinforce}
          onConnect={onConnect}
        />
      ))}
    </div>
  )
}

// ─── Detail Panel ────────────────────────────────────────────────────────────

type DetailPanelProps = {
  nodeId:  string
  decoded: DecodeOutput
  onClose: () => void
}

function DetailPanel({ nodeId, decoded, onClose }: DetailPanelProps) {
  const realId = extractNodeId(nodeId)

  // Find entity
  const entity = decoded.entities.find(e => e.nodeId === realId)
  // Find claim
  const claim = decoded.claims.find(c => c.nodeId === realId)
  // Find relations involving this node
  const relations = decoded.relations.filter(
    r => r.fromNodeId === realId || r.toNodeId === realId
  )

  return (
    <div style={styles.detailPanel}>
      <div style={styles.detailHeader}>
        <strong>{entity?.name ?? claim?.name ?? nodeId}</strong>
        <button type="button" style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      {entity && (
        <div style={styles.detailBody}>
          <div>Layer: {LAYER_LABELS[entity.layer] ?? `M${entity.layer}`}</div>
          <div>Energy: {entity.energy.toFixed(3)}</div>
        </div>
      )}
      {claim && (
        <div style={styles.detailBody}>
          <div>Confidence: {Math.round(claim.confidence * 100)}%</div>
          <div>Support count: {claim.supportCount}</div>
          <div>Energy: {claim.energy.toFixed(3)}</div>
        </div>
      )}
      {relations.length > 0 && (
        <div style={styles.detailBody}>
          <div style={styles.detailSubhead}>Connections ({relations.length})</div>
          {relations.map((r, i) => {
            const otherId = r.fromNodeId === realId ? r.toNodeId : r.fromNodeId
            const dir     = r.fromNodeId === realId ? '→' : '←'
            return (
              <div key={i} style={styles.detailRelation}>
                {dir} {findEntityName(decoded, otherId)} ({r.relationType}, w={r.weight.toFixed(2)})
              </div>
            )
          })}
        </div>
      )}
      {!entity && !claim && relations.length === 0 && (
        <div style={styles.detailBody}>
          <div style={styles.muted}>No detail available for this node.</div>
        </div>
      )}
    </div>
  )
}

// ─── Category Colors ─────────────────────────────────────────────────────────
// Uses CSS custom properties from the design system.

function categoryColor(cat: DecodeCategory): React.CSSProperties {
  switch (cat) {
    case 'entity':   return { background: 'var(--color-accent-subtle, #2a3a4a)', color: 'var(--color-accent, #6ea8fe)' }
    case 'relation': return { background: 'var(--color-bg-muted, #1e1e2e)',      color: 'var(--color-text-muted, #888)' }
    case 'claim':    return { background: 'var(--color-success-subtle, #1a3a2a)', color: 'var(--color-success, #6ec96e)' }
    case 'sequence': return { background: 'var(--color-warning-subtle, #3a3a1a)', color: 'var(--color-warning, #ddb56e)' }
    case 'tension':  return { background: 'var(--color-danger-subtle, #3a1a1a)',  color: 'var(--color-danger, #fe6e6e)' }
    case 'artifact': return { background: 'var(--color-artifact-subtle, #2a1a3a)', color: 'var(--color-artifact, #b06efe)' }
  }
}

// ─── Styles ──────────────────────────────────────────────────────────────────
// All visual values use CSS custom properties from the design system board.
// No F-design-system internal imports. Inline styles for dashboard program
// isolation — programs must be deletable (A7) without CSS side effects.

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    fontFamily: 'var(--type-family, inherit)',
    fontSize: 'var(--type-size-sm, 13px)',
    color: 'var(--color-text, #e0e0e0)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-2, 8px) var(--space-3, 12px)',
    borderBottom: '1px solid var(--color-border, #2a2a3a)',
  },
  title: {
    margin: 0,
    fontSize: 'var(--type-size-base, 14px)',
    fontWeight: 600,
  },
  counts: {
    fontSize: 'var(--type-size-xs, 11px)',
    color: 'var(--color-text-muted, #888)',
  },
  filterRow: {
    display: 'flex',
    gap: 'var(--space-1, 4px)',
    padding: 'var(--space-2, 8px) var(--space-3, 12px)',
    borderBottom: '1px solid var(--color-border, #2a2a3a)',
    flexWrap: 'wrap',
  },
  filterBtn: {
    background: 'transparent',
    border: '1px solid var(--color-border, #2a2a3a)',
    borderRadius: 'var(--radius-sm, 4px)',
    color: 'var(--color-text-muted, #888)',
    padding: '2px 8px',
    fontSize: 'var(--type-size-xs, 11px)',
    cursor: 'pointer',
  },
  filterBtnActive: {
    background: 'var(--color-accent-subtle, #2a3a4a)',
    borderColor: 'var(--color-accent, #6ea8fe)',
    color: 'var(--color-accent, #6ea8fe)',
  },
  connectBanner: {
    padding: 'var(--space-2, 8px) var(--space-3, 12px)',
    background: 'var(--color-accent-subtle, #2a3a4a)',
    color: 'var(--color-accent, #6ea8fe)',
    fontSize: 'var(--type-size-xs, 11px)',
  },
  treeArea: {
    flex: 1,
    overflow: 'auto',
    padding: 'var(--space-2, 8px) var(--space-3, 12px)',
  },
  nodeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-1, 4px)',
    padding: '3px 0',
    minHeight: 28,
    transition: 'background var(--motion-attack, 256ms) ease-out',
  },
  nodeRowSelected: {
    background: 'var(--color-bg-muted, #1e1e2e)',
    borderRadius: 'var(--radius-sm, 4px)',
  },
  nodeRowConnect: {
    background: 'var(--color-accent-subtle, #2a3a4a)',
    borderRadius: 'var(--radius-sm, 4px)',
  },
  expandBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-text-muted, #888)',
    cursor: 'pointer',
    padding: '0 2px',
    fontSize: 12,
    width: 16,
    textAlign: 'center' as const,
  },
  expandPlaceholder: {
    width: 16,
    textAlign: 'center' as const,
    color: 'var(--color-text-muted, #444)',
    fontSize: 10,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: 'var(--radius-sm, 4px)',
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
  },
  labelBtn: {
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    textAlign: 'left' as const,
    padding: 0,
    fontSize: 'inherit',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  layerTag: {
    fontSize: 'var(--type-size-xs, 11px)',
    color: 'var(--color-text-muted, #888)',
    background: 'var(--color-bg-muted, #1e1e2e)',
    padding: '1px 4px',
    borderRadius: 'var(--radius-sm, 4px)',
    flexShrink: 0,
  },
  confidence: {
    fontSize: 'var(--type-size-xs, 11px)',
    color: 'var(--color-success, #6ec96e)',
    flexShrink: 0,
  },
  energy: {
    fontSize: 'var(--type-size-xs, 11px)',
    color: 'var(--color-text-muted, #666)',
    flexShrink: 0,
    minWidth: 36,
    textAlign: 'right' as const,
  },
  actions: {
    display: 'flex',
    gap: 2,
    flexShrink: 0,
    marginLeft: 'var(--space-1, 4px)',
  },
  actionBtn: {
    background: 'transparent',
    border: '1px solid var(--color-border, #2a2a3a)',
    borderRadius: 'var(--radius-sm, 4px)',
    color: 'var(--color-text-muted, #888)',
    cursor: 'pointer',
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    padding: 0,
  },
  actionBtnActive: {
    borderColor: 'var(--color-accent, #6ea8fe)',
    color: 'var(--color-accent, #6ea8fe)',
  },
  diffOld: {
    textDecoration: 'line-through',
    color: 'var(--color-danger, #fe6e6e)',
    marginRight: 'var(--space-1, 4px)',
    opacity: 0.7,
  },
  muted: {
    color: 'var(--color-text-muted, #888)',
    padding: 'var(--space-3, 12px) 0',
  },
  error: {
    color: 'var(--color-danger, #fe6e6e)',
    padding: 'var(--space-3, 12px) 0',
  },
  detailPanel: {
    borderTop: '1px solid var(--color-border, #2a2a3a)',
    padding: 'var(--space-3, 12px)',
    maxHeight: '30%',
    overflow: 'auto',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-2, 8px)',
  },
  detailBody: {
    fontSize: 'var(--type-size-xs, 11px)',
    color: 'var(--color-text-muted, #888)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1, 4px)',
  },
  detailSubhead: {
    fontSize: 'var(--type-size-xs, 11px)',
    fontWeight: 600,
    color: 'var(--color-text, #e0e0e0)',
    marginTop: 'var(--space-2, 8px)',
  },
  detailRelation: {
    paddingLeft: 'var(--space-2, 8px)',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-text-muted, #888)',
    cursor: 'pointer',
    fontSize: 14,
    padding: '0 4px',
  },
}
