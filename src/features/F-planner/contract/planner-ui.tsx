// @liv-standard v1.3
// [F-planner/contract/planner-ui.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5d-phase2
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-HOOK  usePlanner      ./planner-hook
//   W-ATOM  PipelineStatus  ../types/planner-types
//   W-ATOM  PipelineStage   ../types/planner-types
//   W-ATOM  StatusDot       @/features/F-design-system/contract/primitives
//   W-ATOM  ButtonText      @/features/F-design-system/contract/primitives
// wires-out:
//   W-ATOM  BuilderStatusCard  →  F-planner/R3 (planner-register.tsx)
// deps:
//   R0  ../types/planner-types
//   R3  ./planner-hook           (intra-slice — A5 compliant)
//   R3  @/features/F-design-system/contract/primitives  (A5)
//   R5  react
// validated:  pending
//
// step5d-phase2 (A1, A3, A5, A7):
//   New file. Moved from F-dashboard/contract/dashboard-ui.tsx:
//     deriveNodeStates, NodeDot, ConnectorLine, StatusStrip, STAGE_NODES.
//   BuilderStatusCard: self-contained component. Calls usePlanner() internally.
//   Tracks jobId in local state — captures from planner.job.jobId on first land.
//   Dashboard passes zero props — component is autonomous (ProgramRenderIntent
//   contract: component: React.ComponentType, no props).
//   Download button: BuilderStatusCard owns it — it is a builder concern.
//   useOutput called here for download — F-output is universe-layer, accessible
//   from F-planner via R3 contract surface (A5).
//   Axiom cite:
//     A1 — F-planner owns pipeline UI; status strip is a builder construct.
//     A3 — types imported from F-planner/R0 only (no cross-slice R0 imports).
//     A5 — useOutput accessed via F-output/contract/output-hook (R3 surface).
//     A7 — moved from dashboard, not duplicated.

'use client'

import { useState, useEffect } from 'react'
import { usePlanner }   from './planner-hook'
import { useOutput }    from '@/features/F-output/contract/output-hook'
import {
  StatusDot,
  ButtonText,
} from '@/features/F-design-system/contract/primitives'
import type { PipelineStatus, PipelineStage, PlannerJobId } from '../types/planner-types'

// ── Stage node definitions ─────────────────────────────────────────────────────

type StageNodeDef = {
  id:    string
  label: string
}

const STAGE_NODES: StageNodeDef[] = [
  { id: 'specs',     label: 'Specs'     },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'building',  label: 'Building'  },
  { id: 'compiling', label: 'Compiling' },
  { id: 'done',      label: 'Done'      },
]

type NodeState = 'pending' | 'active' | 'complete' | 'failed'

// ── deriveNodeStates — pure: maps pipeline state to 5 node states ──────────────

function deriveNodeStates(
  pipelineStatus: PipelineStatus | null,
  currentStage:   PipelineStage | null,
  failureReason?: string
): { states: NodeState[]; failureText: string | null } {
  const none: NodeState[] = ['pending', 'pending', 'pending', 'pending', 'pending']

  if (!pipelineStatus) return { states: none, failureText: null }

  if (pipelineStatus === 'pending' && currentStage === 'IN_MAIN') {
    return { states: ['active', 'pending', 'pending', 'pending', 'pending'], failureText: null }
  }

  if (pipelineStatus === 'confirmed') {
    return { states: ['complete', 'active', 'pending', 'pending', 'pending'], failureText: null }
  }

  if (pipelineStatus === 'running') {
    if (currentStage === 'IN_BUILD' || currentStage === 'IN_RESOLVE' || currentStage === 'IN_AUDIT') {
      return { states: ['complete', 'complete', 'active', 'pending', 'pending'], failureText: null }
    }
    if (currentStage === 'IN_COMPILE') {
      return { states: ['complete', 'complete', 'complete', 'active', 'pending'], failureText: null }
    }
    if (currentStage === 'IN_QA') {
      return { states: ['complete', 'complete', 'complete', 'complete', 'active'], failureText: null }
    }
    return { states: ['complete', 'complete', 'active', 'pending', 'pending'], failureText: null }
  }

  if (pipelineStatus === 'complete') {
    return { states: ['complete', 'complete', 'complete', 'complete', 'complete'], failureText: null }
  }

  if (pipelineStatus === 'failed' || pipelineStatus === 'escalated') {
    const stageToIndex: Partial<Record<PipelineStage, number>> = {
      IN_MAIN:    0,
      IN_BUILD:   2,
      IN_RESOLVE: 2,
      IN_AUDIT:   2,
      IN_COMPILE: 3,
      IN_QA:      4,
    }
    const failIdx = currentStage ? (stageToIndex[currentStage] ?? 2) : 2
    const states: NodeState[] = STAGE_NODES.map((_, i) =>
      i < failIdx ? 'complete' : i === failIdx ? 'failed' : 'pending'
    )
    const text = pipelineStatus === 'escalated'
      ? 'Escalated — pipeline could not recover. Check build log.'
      : failureReason ?? 'Build failed — check build log.'
    return { states, failureText: text }
  }

  return { states: none, failureText: null }
}

// ── NodeDot — dot + label for one status strip node ───────────────────────────

function NodeDot({ label, state }: { label: string; state: NodeState }) {
  const dotStatus = state === 'active'   ? 'accent'
                  : state === 'complete' ? 'accent'
                  : state === 'failed'   ? 'error'
                  : 'dis'

  const labelColor = state === 'active'   ? 'var(--text)'
                   : state === 'complete' ? 'var(--text-sec)'
                   : state === 'failed'   ? 'var(--error)'
                   : 'var(--text-dis)'

  const glowStyle = state === 'active'
    ? { boxShadow: 'var(--glow-accent-subtle)' }
    : state === 'failed'
    ? { boxShadow: 'var(--glow-error)' }
    : {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--u05)', position: 'relative' }}>
      <div style={{ ...glowStyle, borderRadius: '50%' }}>
        <StatusDot status={dotStatus} />
      </div>
      <span style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      'var(--type-xs)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color:         labelColor,
        whiteSpace:    'nowrap',
        transition:    `color var(--dur-fast)`,
      }}>
        {label}
      </span>
    </div>
  )
}

// ── ConnectorLine — line between nodes ────────────────────────────────────────

function ConnectorLine({ complete }: { complete: boolean }) {
  return (
    <div style={{
      flex:         1,
      height:       '1px',
      background:   complete ? 'var(--accent)' : 'var(--border)',
      marginBottom: '10px',
      transition:   `background var(--dur-fast)`,
      minWidth:     'var(--u2)',
    }} />
  )
}

// ── StatusStrip — 5-node horizontal strip ─────────────────────────────────────

function StatusStrip({ states }: { states: NodeState[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, width: '100%' }}>
      {STAGE_NODES.map((node, i) => (
        <div key={node.id} style={{ display: 'flex', alignItems: 'center', flex: i < STAGE_NODES.length - 1 ? '1' : 'none' }}>
          <NodeDot label={node.label} state={states[i]} />
          {i < STAGE_NODES.length - 1 && (
            <ConnectorLine complete={states[i] === 'complete' && states[i + 1] !== 'pending'} />
          )}
        </div>
      ))}
      {/* Info tooltip */}
      <div
        title="Complex builds work best with a strong reasoning model. If builds fail, try a more capable model."
        style={{
          marginLeft:   'var(--u1)',
          marginBottom: '10px',
          color:        'var(--text-dis)',
          fontSize:     'var(--type-xs)',
          cursor:       'default',
          userSelect:   'none',
          lineHeight:   1,
        }}
        aria-label="Model capability tip"
      >
        ⓘ
      </div>
    </div>
  )
}

// ── BuilderStatusCard — self-contained builder program component ───────────────
// Calls usePlanner() internally. Renders status strip + download button.
// Dashboard mounts this as a registered program with zero props — autonomous.

export function BuilderStatusCard() {
  const [jobId, setJobId] = useState<string | null>(null)

  const planner        = usePlanner(jobId as PlannerJobId | undefined)
  const isPipelineDone = planner.job?.pipelineStatus === 'complete'
  const output         = useOutput(jobId ?? undefined, isPipelineDone)

  // Capture jobId when first pipeline job lands
  useEffect(() => {
    if (planner.job?.jobId && !jobId) {
      setJobId(planner.job.jobId)
    }
  }, [planner.job?.jobId, jobId])

  const pipelineStatus = planner.job?.pipelineStatus ?? null
  const currentStage   = planner.job?.currentStage ?? null

  // Derive failure reason from pipeline log if available
  const failureReason = planner.job?.pipelineLog
    .filter(e => e.status === 'failed')
    .map(e => e.message)
    .filter(Boolean)
    .at(-1) ?? undefined

  const { states, failureText } = deriveNodeStates(
    pipelineStatus,
    currentStage,
    failureReason ?? undefined
  )

  return (
    <div>
      {/* ── Download — only when complete ── */}
      {isPipelineDone && jobId && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--u2)' }}>
          <ButtonText
            variant="accent"
            onClick={() => output.download(jobId!)}
          >
            ↓ Download
          </ButtonText>
        </div>
      )}

      {/* ── Status strip ── */}
      <StatusStrip states={states} />

      {/* ── Failure reason ── */}
      {failureText && (
        <div style={{
          marginTop:  'var(--u2)',
          fontSize:   'var(--type-xs)',
          color:      'var(--error)',
          fontFamily: 'var(--font-mono)',
        }}>
          {failureText}
        </div>
      )}
    </div>
  )
}
