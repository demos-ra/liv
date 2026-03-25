// @liv-standard v1.3
// [F-planner/contract/planner-ui.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5e
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-HOOK  usePlanner      ./planner-hook
//   W-HOOK  useOutput       @/features/F-output/contract/output-hook
//   W-ATOM  PipelineStatus  ../types/planner-types
//   W-ATOM  PipelineStage   ../types/planner-types
//   W-ATOM  BuildVersion    ../types/planner-version-types
//   W-ATOM  OutputFile      @/features/F-output/types/output-types  (step5e-fix — A3: typed atom crosses slice)
//   W-ATOM  StatusDot       @/features/F-design-system/contract/primitives
//   W-ATOM  ButtonText      @/features/F-design-system/contract/primitives
//   W-ATOM  Divider         @/features/F-design-system/contract/primitives
//   W-ATOM  Spinner         @/features/F-design-system/contract/primitives
//   W-FN    buildActivityLine       ../domain/planner-summary-logic
//   W-FN    buildCompletionSummary  ../domain/planner-summary-logic
//   W-FN    buildFailureSummary     ../domain/planner-summary-logic
//   W-FN    formatVersion           ../domain/planner-summary-logic
// wires-out:
//   W-ATOM  BuilderStatusCard  →  F-planner/R3 (planner-register.tsx)
// deps:
//   R0  ../types/planner-types
//   R0  ../types/planner-version-types
//   R0  @/features/F-output/types/output-types  (step5e-fix — A3: OutputFile atom only)
//   R1  ../domain/planner-summary-logic
//   R3  ./planner-hook                                        (intra-slice — A5 compliant)
//   R3  @/features/F-output/contract/output-hook             (A5)
//   R3  @/features/F-design-system/contract/primitives       (A5)
//   R5  react
// validated:  pending
//
// step5e (A1, A3, A5, A7):
//   Full rewrite of BuilderStatusCard. Replaces minimal status strip + download
//   with the complete builder experience: 4 states (idle, progress, complete,
//   escalated), version history, acceptance criteria, file tree, push action.
//
//   Four states:
//     Idle    — "Describe what you want to build." One muted line.
//     Progress — status strip + one activity line. 3 user-visible phases only.
//                Re-entry (pipeline reverts to pending/IN_MAIN) → idle state.
//                No failure/retry visibility.
//     Complete — strip all filled + description + version tag + acceptance criteria
//                + file tree (collapsed) + download + push + version history.
//     Escalated — strip with failure node + two-line message, no actions.
//
//   Version history: fetched once on complete via GET /api/planner/[projectId]/versions.
//   Push: opens inline form for remoteUrl + token + branch. Commit message is
//   pre-constructed as "v{version} — {description}" from local state.
//
//   Axiom cite:
//     A1 — F-planner owns all builder UI; version display is a builder concern.
//     A3 — BuildVersion typed atom from planner-version-types (R0).
//     A5 — useOutput via F-output/R3 surface. design-system via R3 surface.
//     A7 — complete file; prior step5d-phase2 version superseded cleanly.

'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePlanner }    from './planner-hook'
import { useOutput }     from '@/features/F-output/contract/output-hook'
import {
  StatusDot,
  ButtonText,
  Divider,
  Spinner,
} from '@/features/F-design-system/contract/primitives'
import {
  buildActivityLine,
  buildCompletionSummary,
  buildFailureSummary,
  formatVersion,
} from '../domain/planner-summary-logic'
import type { PipelineStatus, PipelineStage, PlannerJobId } from '../types/planner-types'
import type { BuildVersion }                                  from '../types/planner-version-types'
import type { OutputFile }                                    from '@/features/F-output/types/output-types'

// ── Stage node definitions ─────────────────────────────────────────────────────

type StageNodeDef = { id: string; label: string }

const STAGE_NODES: StageNodeDef[] = [
  { id: 'specs',     label: 'Specs'     },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'building',  label: 'Building'  },
  { id: 'compiling', label: 'Compiling' },
  { id: 'done',      label: 'Done'      },
]

type NodeState = 'pending' | 'active' | 'complete' | 'failed'

// ── deriveNodeStates ──────────────────────────────────────────────────────────

function deriveNodeStates(
  pipelineStatus: PipelineStatus | null,
  currentStage:   PipelineStage | null,
): NodeState[] {
  const none: NodeState[] = ['pending', 'pending', 'pending', 'pending', 'pending']

  if (!pipelineStatus) return none

  if (pipelineStatus === 'pending' && currentStage === 'IN_MAIN') {
    return ['active', 'pending', 'pending', 'pending', 'pending']
  }
  if (pipelineStatus === 'confirmed') {
    return ['complete', 'active', 'pending', 'pending', 'pending']
  }
  if (pipelineStatus === 'running') {
    if (currentStage === 'IN_BUILD' || currentStage === 'IN_RESOLVE' || currentStage === 'IN_AUDIT') {
      return ['complete', 'complete', 'active', 'pending', 'pending']
    }
    if (currentStage === 'IN_COMPILE') {
      return ['complete', 'complete', 'complete', 'active', 'pending']
    }
    if (currentStage === 'IN_QA') {
      return ['complete', 'complete', 'complete', 'complete', 'active']
    }
    return ['complete', 'complete', 'active', 'pending', 'pending']
  }
  if (pipelineStatus === 'complete') {
    return ['complete', 'complete', 'complete', 'complete', 'complete']
  }
  if (pipelineStatus === 'escalated') {
    const stageToIndex: Partial<Record<PipelineStage, number>> = {
      IN_MAIN:    0,
      IN_BUILD:   2,
      IN_RESOLVE: 2,
      IN_AUDIT:   2,
      IN_COMPILE: 3,
      IN_QA:      4,
    }
    const failIdx = currentStage ? (stageToIndex[currentStage] ?? 2) : 2
    return STAGE_NODES.map((_, i) =>
      i < failIdx ? 'complete' : i === failIdx ? 'failed' : 'pending'
    ) as NodeState[]
  }

  return none
}

// ── NodeDot ───────────────────────────────────────────────────────────────────

function NodeDot({ label, state }: { label: string; state: NodeState }) {
  const dotStatus = state === 'failed' ? 'error' : state === 'pending' ? 'dis' : 'accent'
  const labelColor = state === 'failed'   ? 'var(--error)'
                   : state === 'active'   ? 'var(--text)'
                   : state === 'complete' ? 'var(--text-sec)'
                   : 'var(--text-dis)'
  const glowStyle = state === 'active'  ? { boxShadow: 'var(--glow-accent-subtle)' }
                  : state === 'failed'  ? { boxShadow: 'var(--glow-error)' }
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
        transition:    'color var(--dur-fast)',
      }}>
        {label}
      </span>
    </div>
  )
}

// ── ConnectorLine ─────────────────────────────────────────────────────────────

function ConnectorLine({ complete }: { complete: boolean }) {
  return (
    <div style={{
      flex:         1,
      height:       '1px',
      background:   complete ? 'var(--accent)' : 'var(--border)',
      marginBottom: '10px',
      transition:   'background var(--dur-fast)',
      minWidth:     'var(--u2)',
    }} />
  )
}

// ── StatusStrip ───────────────────────────────────────────────────────────────

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

// ── FileTree ──────────────────────────────────────────────────────────────────
// Collapsed top-level directories with count. Expandable per directory.
// OutputFile from F-output/R0 — typed atom crossing slice boundary (A3).

function FileTree({ files }: { files: OutputFile[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  // Group files by top-level directory
  const groups: Record<string, OutputFile[]> = {}
  for (const f of files) {
    const parts = f.path.split('/')
    const dir   = parts.length > 1 ? parts.slice(0, 2).join('/') : '.'
    if (!groups[dir]) groups[dir] = []
    groups[dir].push(f)
  }

  const toggle = (dir: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(dir) ? next.delete(dir) : next.add(dir)
      return next
    })
  }

  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize:   'var(--type-xs)',
      color:      'var(--text-sec)',
      marginTop:  'var(--u15)',
    }}>
      {Object.entries(groups).map(([dir, dirFiles]) => (
        <div key={dir}>
          <div
            onClick={() => toggle(dir)}
            style={{
              cursor:     'pointer',
              color:      'var(--text)',
              padding:    'var(--u05) 0',
              display:    'flex',
              alignItems: 'center',
              gap:        'var(--u05)',
            }}
          >
            <span style={{ color: 'var(--text-dis)', fontSize: '10px' }}>
              {expanded.has(dir) ? '▾' : '▸'}
            </span>
            <span>{dir}/</span>
            <span style={{ color: 'var(--text-dis)', marginLeft: 'auto' }}>
              {dirFiles.length}
            </span>
          </div>
          {expanded.has(dir) && (
            <div style={{ paddingLeft: 'var(--u2)' }}>
              {dirFiles.map(f => (
                <div key={f.path} style={{ padding: 'var(--u05) 0', color: 'var(--text-dis)' }}>
                  {f.path.split('/').pop()}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── PushForm ──────────────────────────────────────────────────────────────────
// Inline push form — remoteUrl, token, branch. Commit message pre-constructed.

type PushFormProps = {
  jobId:          string
  commitMessage:  string
  onPush:         (remoteUrl: string, token: string, branch: string, message: string) => void
  pushStatus:     'idle' | 'loading' | 'error' | 'success'
  pushError:      { code: string; message: string } | null
  pushResult:     { remoteUrl: string; branch: string; commitSha: string; filesCount: number } | null
  onReset:        () => void
}

function PushForm({ jobId, commitMessage, onPush, pushStatus, pushError, pushResult, onReset }: PushFormProps) {
  const [remoteUrl, setRemoteUrl] = useState('')
  const [token,     setToken]     = useState('')
  const [branch,    setBranch]    = useState('main')
  const [open,      setOpen]      = useState(false)

  const inputStyle: React.CSSProperties = {
    fontFamily:  'var(--font-mono)',
    fontSize:    'var(--type-xs)',
    background:  'var(--surface)',
    border:      '1px solid var(--border)',
    borderRadius: '4px',
    padding:     '6px var(--u1)',
    color:       'var(--text)',
    width:       '100%',
    outline:     'none',
  }

  if (pushStatus === 'success' && pushResult) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-xs)', color: 'var(--text-sec)' }}>
          Pushed · {pushResult.commitSha.slice(0, 7)} → {pushResult.branch}
        </span>
        <ButtonText variant="accent" onClick={onReset}>Push again</ButtonText>
      </div>
    )
  }

  if (!open) {
    return (
      <ButtonText variant="accent" onClick={() => setOpen(true)}>
        ↑ Push to Git
      </ButtonText>
    )
  }

  return (
    <div style={{
      marginTop:   'var(--u15)',
      padding:     'var(--u2)',
      background:  'var(--surface)',
      border:      '1px solid var(--border)',
      borderRadius: '6px',
      display:     'flex',
      flexDirection: 'column',
      gap:         'var(--u1)',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-xs)', color: 'var(--text-dis)', marginBottom: 'var(--u05)' }}>
        Commit: <span style={{ color: 'var(--text-sec)' }}>{commitMessage}</span>
      </div>
      <input
        style={inputStyle}
        placeholder="Remote URL (https://github.com/org/repo)"
        value={remoteUrl}
        onChange={e => setRemoteUrl(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Branch"
        value={branch}
        onChange={e => setBranch(e.target.value)}
      />
      <input
        style={{ ...inputStyle, fontFamily: 'monospace' }}
        type="password"
        placeholder="Personal access token"
        value={token}
        onChange={e => setToken(e.target.value)}
      />
      {pushError && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-xs)', color: 'var(--error)' }}>
          {pushError.message}
        </div>
      )}
      <div style={{ display: 'flex', gap: 'var(--u1)', marginTop: 'var(--u05)' }}>
        <ButtonText
          variant="accent"
          disabled={pushStatus === 'loading' || !remoteUrl || !token || !branch}
          onClick={() => onPush(remoteUrl, token, branch, commitMessage)}
        >
          {pushStatus === 'loading' ? 'Pushing…' : 'Push'}
        </ButtonText>
        <ButtonText variant="danger" onClick={() => setOpen(false)}>
          Cancel
        </ButtonText>
      </div>
    </div>
  )
}

// ── VersionHistory ────────────────────────────────────────────────────────────

function VersionHistory({ versions }: { versions: BuildVersion[] }) {
  if (versions.length === 0) return null

  return (
    <div style={{ marginTop: 'var(--u2)' }}>
      <Divider />
      <div style={{ marginTop: 'var(--u15)', display: 'flex', flexDirection: 'column', gap: 'var(--u05)' }}>
        {versions.map(v => (
          <div
            key={v.buildId}
            style={{
              display:    'flex',
              gap:        'var(--u1)',
              alignItems: 'baseline',
              fontFamily: 'var(--font-mono)',
              fontSize:   'var(--type-xs)',
            }}
          >
            <span style={{ color: 'var(--accent)', minWidth: '44px', flexShrink: 0 }}>
              {formatVersion(v.version)}
            </span>
            <span style={{
              color:        'var(--text-sec)',
              flex:         1,
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
            }}>
              {v.description}
            </span>
            <span style={{ color: 'var(--text-dis)', flexShrink: 0 }}>
              {new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── BuilderStatusCard — self-contained builder program component ───────────────
// Dashboard mounts this as a registered program with zero props — autonomous.
// Tracks jobId in local state — captures from planner.job.jobId on first land.
// Version history fetched once when pipeline completes.

export function BuilderStatusCard() {
  const [jobId,          setJobId]          = useState<string | null>(null)
  const [versions,       setVersions]       = useState<BuildVersion[]>([])
  const [versionsLoaded, setVersionsLoaded] = useState(false)

  const planner        = usePlanner(jobId as PlannerJobId | undefined)
  const isPipelineDone = planner.job?.pipelineStatus === 'complete'
  const output         = useOutput(jobId ?? undefined, isPipelineDone)

  // Capture jobId when first pipeline job lands
  useEffect(() => {
    if (planner.job?.jobId && !jobId) {
      setJobId(planner.job.jobId)
    }
  }, [planner.job?.jobId, jobId])

  // Fetch version history once on complete
  useEffect(() => {
    if (!isPipelineDone || versionsLoaded || !planner.job?.projectId) return
    setVersionsLoaded(true)
    fetch(`/api/planner/${planner.job.projectId}/versions`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if (data.ok) setVersions(data.data) })
      .catch(() => {})
  }, [isPipelineDone, versionsLoaded, planner.job?.projectId])

  const pipelineStatus = planner.job?.pipelineStatus ?? null
  const currentStage   = planner.job?.currentStage   ?? null
  const stageStatus    = planner.job?.stageStatus     ?? null
  const ifContract     = planner.job?.ifContract      ?? null

  // Compute derived display values
  const nodeStates     = deriveNodeStates(pipelineStatus, currentStage)
  const activityLine   = buildActivityLine(currentStage, stageStatus)

  // Version from history: the latest entry (first in desc order)
  const currentVersion = versions[0]?.version ?? null
  const description    = ifContract?.featureIntent ?? null
  const criteria       = ifContract?.acceptanceCriteria ?? []

  // Commit message: "v1.1.0 — Forum with posts and replies"
  const commitMessage  = currentVersion && description
    ? `${formatVersion(currentVersion)} — ${description}`
    : description ?? 'Build complete'

  // File count + duration for completion summary
  const fileCount      = output.files?.length ?? 0
  const startedAt      = planner.job?.createdAt  ?? 0
  const completedAt    = Date.now()
  const durationMs     = startedAt > 0 ? completedAt - startedAt : 0

  // ── Re-entry detection: if pipeline reverts to idle (pending + IN_MAIN),
  // treat as idle state — chat continues, dashboard shows prompt.
  const isReEntry = pipelineStatus === 'pending' && currentStage === 'IN_MAIN' && (planner.job?.reentryCount ?? 0) > 0
  const isIdle      = !pipelineStatus || isReEntry
  const isProgress  = pipelineStatus === 'running' || pipelineStatus === 'confirmed' ||
                      (pipelineStatus === 'pending' && currentStage === 'IN_MAIN' && (planner.job?.reentryCount ?? 0) === 0)
  const isComplete  = pipelineStatus === 'complete'
  const isEscalated = pipelineStatus === 'escalated'

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (isIdle) {
    return (
      <div style={{ padding: 'var(--u15) 0' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   'var(--type-sm)',
          color:      'var(--text-dis)',
        }}>
          Describe what you want to build.
        </span>
      </div>
    )
  }

  // ── Progress ──────────────────────────────────────────────────────────────
  if (isProgress) {
    return (
      <div>
        <StatusStrip states={nodeStates} />
        <div style={{
          marginTop:  'var(--u15)',
          fontFamily: 'var(--font-mono)',
          fontSize:   'var(--type-xs)',
          color:      'var(--text-sec)',
        }}>
          {activityLine}
        </div>
      </div>
    )
  }

  // ── Escalated (LIV error) ─────────────────────────────────────────────────
  if (isEscalated) {
    return (
      <div>
        <StatusStrip states={nodeStates} />
        <div style={{
          marginTop:  'var(--u2)',
          fontFamily: 'var(--font-mono)',
          fontSize:   'var(--type-sm)',
          color:      'var(--text-sec)',
          lineHeight: 1.6,
        }}>
          {buildFailureSummary(true)}
        </div>
      </div>
    )
  }

  // ── Complete ──────────────────────────────────────────────────────────────
  if (isComplete) {
    return (
      <div>
        {/* Status strip — all complete */}
        <StatusStrip states={nodeStates} />

        {/* Description + version */}
        <div style={{
          marginTop:  'var(--u2)',
          display:    'flex',
          alignItems: 'baseline',
          gap:        'var(--u1)',
          flexWrap:   'wrap',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   'var(--type-sm)',
            color:      'var(--text)',
            fontWeight: 500,
          }}>
            {description ?? buildCompletionSummary('Build complete', fileCount, durationMs)}
          </span>
          {currentVersion && (
            <span style={{
              fontFamily:  'var(--font-mono)',
              fontSize:    'var(--type-xs)',
              color:       'var(--accent)',
              background:  'color-mix(in srgb, var(--accent) 10%, transparent)',
              borderRadius: '3px',
              padding:     '1px 6px',
              flexShrink:  0,
            }}>
              {formatVersion(currentVersion)}
            </span>
          )}
        </div>

        {/* Acceptance criteria */}
        {criteria.length > 0 && (
          <div style={{
            marginTop:  'var(--u15)',
            display:    'flex',
            flexDirection: 'column',
            gap:        'var(--u05)',
          }}>
            {criteria.map((c, i) => (
              <div key={i} style={{
                display:    'flex',
                gap:        'var(--u1)',
                fontFamily: 'var(--font-mono)',
                fontSize:   'var(--type-xs)',
                color:      'var(--text-sec)',
              }}>
                <span style={{ color: 'var(--text-dis)', flexShrink: 0 }}>–</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}

        {/* File tree */}
        {output.files && output.files.length > 0 && (
          <FileTree files={output.files} />
        )}
        {output.filesStatus === 'loading' && (
          <div style={{ marginTop: 'var(--u15)' }}><Spinner size="sm" /></div>
        )}

        {/* Actions */}
        {jobId && (
          <div style={{ marginTop: 'var(--u2)', display: 'flex', gap: 'var(--u15)', alignItems: 'center', flexWrap: 'wrap' }}>
            <ButtonText variant="accent" onClick={() => output.download(jobId)}>
              ↓ Download
            </ButtonText>
            <PushForm
              jobId={jobId}
              commitMessage={commitMessage}
              onPush={(remoteUrl, token, branch, message) =>
                output.push(jobId, { remoteUrl, token, branch, message })
              }
              pushStatus={output.pushStatus}
              pushError={output.pushError}
              pushResult={output.pushResult}
              onReset={output.resetPush}
            />
          </div>
        )}

        {/* Version history */}
        <VersionHistory versions={versions} />
      </div>
    )
  }

  // Fallback — should not reach here
  return null
}
