// @liv-standard v1.3
// [F-dashboard/contract/dashboard-ui.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b3-dashboard
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-ATOM  WorkspaceHook         ../types/dashboard-types
//   W-ATOM  ActiveProgram         ../types/dashboard-types
//   W-ATOM  PipelineView          ../types/dashboard-types
//   W-ATOM  OutputActions         ../types/dashboard-types
//   W-ATOM  ProjectActions        ../types/dashboard-types
//   W-ATOM  Surface               @/features/F-design-system/contract/primitives
//   W-ATOM  StatusDot             @/features/F-design-system/contract/primitives
//   W-ATOM  ButtonText            @/features/F-design-system/contract/primitives
// wires-out:
//   W-ATOM  DashboardUI  →  src/app/page.tsx
// deps:
//   R0  ../types/dashboard-types
//   R0  @/features/F-planner/types/planner-types  (PipelineStatus, PipelineStage — A5)
//   R3  @/features/F-design-system/contract/primitives  (A5)
//   R5  react
// validated:  pending
//
// step4b3-dashboard (A1, A3, A7):
//   Full rewrite. Replaced ToggleBar/StepBar/ProjectBar/panel system with a
//   single .surface card: project dropdown row + 5-node status strip.
//   No IntakePanel — build creation happens via chat.
//   StatusDot, Label, ButtonText, Surface — all from design system (no new primitives).
//   Status strip derives state purely from program.pipelineStatus +
//   pipelineView.currentStage — no local state needed.
//   Download button only when pipelineStatus === 'complete'.
//   Failure reason shown as one-line text below strip on 'failed'/'escalated'.
//   Info tooltip via title attribute — no custom component.
//   Axiom cite: A1 — DashboardUI owns dashboard surface only.
//   A7 — all dead panel code removed (IntakePanel, ToggleBar, StepBar, OutputPanel).

'use client'

import {
  Surface,
  StatusDot,
  ButtonText,
} from '@/features/F-design-system/contract/primitives'
import type {
  WorkspaceHook,
} from '../types/dashboard-types'
import type { PipelineStatus, PipelineStage } from '@/features/F-planner/types/planner-types'
import type { ProjectSummary, ProjectId } from '@/features/F-project/types/project-types'

// ── Stage node definitions ─────────────────────────────────────────────────────
// Five-node status strip. Maps pipeline state → which node is active.

type StageNodeDef = {
  id:    string
  label: string
}

const STAGE_NODES: StageNodeDef[] = [
  { id: 'specs',      label: 'Specs'      },
  { id: 'confirmed',  label: 'Confirmed'  },
  { id: 'building',   label: 'Building'   },
  { id: 'compiling',  label: 'Compiling'  },
  { id: 'done',       label: 'Done'       },
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
      flex:            1,
      height:          '1px',
      background:      complete ? 'var(--accent)' : 'var(--border)',
      marginBottom:    '10px', // aligns with dot vertical center
      transition:      `background var(--dur-fast)`,
      minWidth:        'var(--u2)',
    }} />
  )
}

// ── StatusStrip — 5-node horizontal strip ─────────────────────────────────────
function StatusStrip({
  states,
}: {
  states: NodeState[]
}) {
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
          marginLeft:  'var(--u1)',
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

// ── DashboardCard — the surface card ──────────────────────────────────────────
function DashboardCard({
  program,
  pipelineView,
  projects,
  projectActions,
  outputActions,
}: {
  program:        WorkspaceHook['program']
  pipelineView:   WorkspaceHook['pipelineView']
  projects:       ProjectSummary[]
  projectActions: WorkspaceHook['projectActions']
  outputActions:  WorkspaceHook['outputActions']
}) {
  const pipelineStatus = program?.pipelineStatus ?? null
  const currentStage   = pipelineView?.currentStage ?? null
  const isPipelineDone = program?.isPipelineDone ?? false
  const jobId          = program?.jobId ?? null

  // Derive failure reason from pipeline log if available
  const failureReason = pipelineView?.pipelineLog
    .filter(e => e.status === 'failed')
    .map(e => e.message)
    .filter(Boolean)
    .at(-1) ?? undefined

  const { states, failureText } = deriveNodeStates(pipelineStatus, currentStage, failureReason ?? undefined)

  return (
    <Surface>
      {/* ── Row 1: Project dropdown + Download ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   'var(--u3)',
        gap:            'var(--u2)',
      }}>
        {/* Project selector */}
        {projects.length > 0 ? (
          <select
            value={program?.projectId ?? ''}
            onChange={e => projectActions.setActive(e.target.value as ProjectId)}
            style={{
              fontFamily:  'var(--font-mono)',
              fontSize:    'var(--type-sm)',
              color:       'var(--text-sec)',
              background:  'var(--input-panel-bg)',
              border:      '1px solid var(--border)',
              borderRadius:'var(--u1)',
              height:      'var(--input-h-sm)',
              padding:     '0 var(--u1)',
              cursor:      'pointer',
              outline:     'none',
              maxWidth:    '240px',
            }}
            aria-label="Select project"
          >
            {projects.map(p => (
              <option key={p.projectId} value={p.projectId}>{p.name}</option>
            ))}
          </select>
        ) : (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-sm)', color: 'var(--text-dis)' }}>
            No projects yet
          </span>
        )}

        {/* Download — only when complete */}
        {isPipelineDone && jobId && (
          <ButtonText
            variant="accent"
            onClick={() => outputActions.download(jobId)}
          >
            ↓ Download
          </ButtonText>
        )}
      </div>

      {/* ── Row 2: Status strip ── */}
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
    </Surface>
  )
}

// ── DashboardUI — exported root component ─────────────────────────────────────
// Receives full WorkspaceHook spread from page.tsx.
// Renders nothing when dashboardSection.isExpanded is false.

export function DashboardUI({
  program,
  pipelineView,
  projects,
  projectActions,
  outputActions,
  dashboardSection,
}: WorkspaceHook) {
  if (!dashboardSection.isExpanded) return null

  return (
    <div style={{ marginTop: 'var(--u2)', marginBottom: 'var(--u2)', flexShrink: 0 }}>
      <div className="col">
        <DashboardCard
          program={program}
          pipelineView={pipelineView}
          projects={projects}
          projectActions={projectActions}
          outputActions={outputActions}
        />
      </div>
    </div>
  )
}
