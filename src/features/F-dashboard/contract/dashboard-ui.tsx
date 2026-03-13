// @liv-standard v1.3
// [F-dashboard/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-HOOK  useDashboard    ./dashboard-hook
//   W-ATOM  DashboardPanel  ../types/dashboard-types
//   W-ATOM  PlannerJob      @/features/F-planner/types/planner-types
//   W-HOOK  IntakePanel     @/features/F-intake/contract/intake-ui
// wires-out:  none  (root UI surface — no cross-slice consumers)
// deps:
//   R0  ../types/dashboard-types
//   R0  @/features/F-planner/types/planner-types
//   R3  ./dashboard-hook
//   R3  @/features/F-intake/contract/intake-ui
//   R5  react
// validated:  2026-03-12

'use client'

import { useState }     from 'react'
import { useDashboard } from './dashboard-hook'
import { IntakePanel }  from '@/features/F-intake/contract/intake-ui'
import type { DashboardPanel } from '../types/dashboard-types'
import type { ProjectId } from '@/features/F-project/types/project-types'
import type { PlannerJob, PipelineStage } from '@/features/F-planner/types/planner-types'
import type { PushPayload } from '@/features/F-output/types/output-types'

// ── Constants ─────────────────────────────────────────────────────────────────

const PANELS: DashboardPanel[] = ['intake', 'pipeline', 'output']
const PANEL_LABELS: Record<DashboardPanel, string> = {
  intake:   'Intake',
  pipeline: 'Pipeline',
  output:   'Output',
}

const STAGE_ORDER: PipelineStage[] = [
  'IN_MAIN', 'IN_BUILD', 'IN_RESOLVE', 'IN_AUDIT', 'IN_COMPILE', 'IN_QA',
]

// ── Step breadcrumb ───────────────────────────────────────────────────────────

function StepBar({
  activePanel,
  jobId,
  pipelineDone,
  goToPanel,
}: {
  activePanel:  DashboardPanel
  jobId:        string | null
  pipelineDone: boolean
  goToPanel:    (p: DashboardPanel) => void
}) {
  const activeIdx = PANELS.indexOf(activePanel)

  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      gap:            'var(--u1)',
      padding:        'var(--u15) var(--u4)',
      borderBottom:   '1px solid var(--border)',
      background:     'var(--surface)',
    }}>
      {PANELS.map((panel, i) => {
        const done      = i < activeIdx || (panel === 'output' && pipelineDone)
        const active    = panel === activePanel
        const reachable = i === 0 || (i === 1 && !!jobId) || (i === 2 && pipelineDone)

        return (
          <div key={panel} style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)', flex: i < PANELS.length - 1 ? 1 : 'none' }}>
            <button
              onClick={() => reachable && goToPanel(panel)}
              disabled={!reachable}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          'var(--u1)',
                background:   'transparent',
                border:       'none',
                cursor:       reachable ? 'pointer' : 'default',
                padding:      0,
                opacity:      reachable ? 1 : 0.4,
              }}
            >
              <div style={{
                width:        22,
                height:       22,
                borderRadius: '50%',
                background:   done    ? 'var(--accent)'
                            : active  ? 'var(--amber)'
                            : 'var(--elevated)',
                border:       `1px solid ${done || active ? 'transparent' : 'var(--border)'}`,
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                fontSize:     10,
                color:        done || active ? 'var(--bg)' : 'var(--text-dis)',
                fontFamily:   'var(--font-mono)',
                flexShrink:   0,
                transition:   'background 0.2s ease',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize:   13,
                fontFamily: 'var(--font-ui)',
                color:      active ? 'var(--text)' : 'var(--text-sec)',
                fontWeight: active ? 500 : 400,
              }}>
                {PANEL_LABELS[panel]}
              </span>
            </button>
            {i < PANELS.length - 1 && (
              <div style={{
                flex:       1,
                height:     1,
                background: done ? 'var(--accent)' : 'var(--border)',
                transition: 'background 0.2s ease',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Project selector ──────────────────────────────────────────────────────────

function ProjectBar({
  projects,
  activeProject,
  onSelect,
  onCreate,
}: {
  projects:      Array<{ projectId: string; name: string }>
  activeProject: { projectId: string; name: string } | null
  onSelect:      (projectId: ProjectId) => void
  onCreate:      () => void
}) {
  const [creating, setCreating] = useState(false)
  const [name,     setName]     = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate()
    setCreating(false)
    setName('')
  }

  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          'var(--u2)',
      padding:      'var(--u15) var(--u4)',
      borderBottom: '1px solid var(--border)',
      background:   'var(--bg)',
    }}>
      <span style={{ fontSize: 12, color: 'var(--text-sec)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
        project
      </span>

      {creating ? (
        <div style={{ display: 'flex', gap: 'var(--u1)', flex: 1 }}>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
            placeholder="project name"
            style={{
              flex:         1,
              padding:      'var(--u05) var(--u15)',
              background:   'var(--elevated)',
              border:       '1px solid var(--accent)',
              borderRadius: 'var(--radius)',
              color:        'var(--text)',
              fontSize:     13,
              fontFamily:   'var(--font-mono)',
              outline:      'none',
            }}
          />
          <button onClick={handleCreate} style={btnStyle('accent')}>Create</button>
          <button onClick={() => setCreating(false)} style={btnStyle('ghost')}>Cancel</button>
        </div>
      ) : (
        <>
          <select
            value={activeProject?.projectId ?? ''}
            onChange={e => onSelect(e.target.value as ProjectId)}
            style={{
              flex:         1,
              maxWidth:     280,
              padding:      'var(--u05) var(--u15)',
              background:   'var(--elevated)',
              border:       '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color:        activeProject ? 'var(--text)' : 'var(--text-dis)',
              fontSize:     13,
              fontFamily:   'var(--font-mono)',
              outline:      'none',
              cursor:       'pointer',
            }}
          >
            {projects.length === 0 && (
              <option value="" disabled>No projects yet</option>
            )}
            {projects.map(p => (
              <option key={p.projectId} value={p.projectId}>{p.name}</option>
            ))}
          </select>
          <button onClick={() => setCreating(true)} style={btnStyle('ghost')}>
            + New
          </button>
        </>
      )}
    </div>
  )
}

// ── Pipeline status panel ─────────────────────────────────────────────────────

function PipelinePanel({ job }: { job: PlannerJob | null }) {
  if (!job) {
    return (
      <div style={centeredStyle}>
        <span style={{ color: 'var(--text-dis)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          No pipeline running
        </span>
      </div>
    )
  }

  const currentIdx = job.currentStage ? STAGE_ORDER.indexOf(job.currentStage) : -1

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      gap:           'var(--u3)',
      padding:       'var(--u4)',
      maxWidth:      640,
      width:         '100%',
      animation:     'fadeUp 0.15s ease forwards',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u05)' }}>
        <h2 style={{ fontFamily: 'var(--font-brand)', fontWeight: 600, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          Pipeline
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)' }}>
          <StatusDot status={job.pipelineStatus} />
          <span style={{ fontSize: 13, color: 'var(--text-sec)', fontFamily: 'var(--font-mono)' }}>
            {job.pipelineStatus}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-dis)', fontFamily: 'var(--font-mono)' }}>
            · {job.jobId.slice(0, 8)}
          </span>
        </div>
      </div>

      {/* Stage list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u1)' }}>
        {STAGE_ORDER.map((stage, i) => {
          const logEntry = job.pipelineLog.find(l => l.stage === stage)
          const stageStatus = i < currentIdx   ? 'complete'
                            : i === currentIdx  ? job.stageStatus
                            : 'pending'

          return (
            <div key={stage} style={{
              display:      'flex',
              alignItems:   'flex-start',
              gap:          'var(--u2)',
              padding:      'var(--u15) var(--u2)',
              background:   stageStatus === 'running' ? 'color-mix(in srgb, var(--amber) 6%, transparent)' : 'var(--elevated)',
              border:       `1px solid ${stageStatus === 'running' ? 'color-mix(in srgb, var(--amber) 25%, transparent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              transition:   'all 0.2s ease',
            }}>
              <StageIcon status={stageStatus} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                  {stage}
                </span>
                {logEntry?.message && (
                  <span style={{ fontSize: 12, color: 'var(--text-sec)', fontFamily: 'var(--font-ui)' }}>
                    {logEntry.message}
                  </span>
                )}
                {logEntry?.axiomCite && stageStatus === 'failed' && (
                  <span style={{ fontSize: 11, color: 'var(--error)', fontFamily: 'var(--font-mono)' }}>
                    cite: {logEntry.axiomCite}
                  </span>
                )}
              </div>
              {stageStatus === 'running' && <Spinner />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Output panel ──────────────────────────────────────────────────────────────

function OutputPanel({
  jobId,
  output,
}: {
  jobId:  string
  output: ReturnType<typeof import('./dashboard-hook').useDashboard>['output']
}) {
  const [pushOpen,  setPushOpen]  = useState(false)
  const [remoteUrl, setRemoteUrl] = useState('')
  const [token,     setToken]     = useState('')
  const [branch,    setBranch]    = useState('main')
  const [message,   setMessage]   = useState('chore: LIV output')

  const handlePush = () => {
    if (!remoteUrl.trim() || !token.trim()) return
    output.push(jobId, {
      remoteUrl: remoteUrl.trim(),
      token:     token.trim(),
      branch:    branch.trim() || 'main',
      message:   message.trim() || 'chore: LIV output',
    } as Omit<PushPayload, 'jobId'>)
  }

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      gap:           'var(--u3)',
      padding:       'var(--u4)',
      maxWidth:      640,
      width:         '100%',
      animation:     'fadeUp 0.15s ease forwards',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u05)' }}>
        <h2 style={{ fontFamily: 'var(--font-brand)', fontWeight: 600, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          Output
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-sec)', fontFamily: 'var(--font-ui)' }}>
          Pipeline complete. Download the generated files or push to a repository.
        </p>
      </div>

      {/* File summary */}
      {output.filesStatus === 'loading' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)', color: 'var(--text-sec)', fontSize: 13, fontFamily: 'var(--font-ui)' }}>
          <Spinner /> Loading files…
        </div>
      )}
      {output.files && (
        <div style={{
          padding:      'var(--u2)',
          background:   'var(--elevated)',
          border:       '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
              {output.files.length} file{output.files.length !== 1 ? 's' : ''} generated
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-sec)', fontFamily: 'var(--font-mono)' }}>
              job {jobId.slice(0, 8)}
            </span>
          </div>
          <button
            onClick={() => output.download(jobId)}
            style={btnStyle('accent')}
          >
            ↓ Download .zip
          </button>
        </div>
      )}

      {/* Push to git */}
      {!pushOpen && (
        <button onClick={() => setPushOpen(true)} style={btnStyle('ghost')}>
          Push to GitHub / GitLab
        </button>
      )}

      {pushOpen && (
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           'var(--u2)',
          padding:       'var(--u3)',
          background:    'var(--elevated)',
          border:        '1px solid var(--border)',
          borderRadius:  'var(--radius)',
          animation:     'fadeUp 0.1s ease forwards',
        }}>
          <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
            Push to repository
          </span>

          {[
            { label: 'Remote URL', value: remoteUrl, set: setRemoteUrl, placeholder: 'https://github.com/org/repo', type: 'text' },
            { label: 'Token',      value: token,     set: setToken,     placeholder: 'ghp_… or glpat-…',           type: 'password' },
            { label: 'Branch',     value: branch,    set: setBranch,    placeholder: 'main',                       type: 'text' },
            { label: 'Message',    value: message,   set: setMessage,   placeholder: 'commit message',             type: 'text' },
          ].map(({ label, value, set, placeholder, type }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u05)' }}>
              <label style={{ fontSize: 11, color: 'var(--text-sec)', fontFamily: 'var(--font-mono)' }}>
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                style={inputStyle}
              />
            </div>
          ))}

          {output.pushError && (
            <span style={{ fontSize: 12, color: 'var(--error)', fontFamily: 'var(--font-ui)' }}>
              {output.pushError.message}
            </span>
          )}

          {output.pushResult && (
            <div style={{ padding: 'var(--u15)', background: 'color-mix(in srgb, var(--accent) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)', borderRadius: 'var(--radius)' }}>
              <span style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                ✓ Pushed · {output.pushResult.commitSha.slice(0, 7)} → {output.pushResult.branch}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--u1)', marginTop: 'var(--u1)' }}>
            <button
              onClick={handlePush}
              disabled={output.pushStatus === 'loading'}
              style={btnStyle('accent')}
            >
              {output.pushStatus === 'loading' ? 'Pushing…' : 'Push'}
            </button>
            <button onClick={() => { setPushOpen(false); output.resetPush() }} style={btnStyle('ghost')}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Primitives ────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const color = status === 'complete'  ? 'var(--accent)'
              : status === 'running'   ? 'var(--amber)'
              : status === 'failed'    ? 'var(--error)'
              : 'var(--text-dis)'
  return (
    <div style={{
      width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0,
      animation: status === 'running' ? 'pulse 1.5s ease-in-out infinite' : 'none',
    }} />
  )
}

function StageIcon({ status }: { status: string }) {
  const color = status === 'complete' ? 'var(--accent)'
              : status === 'running'  ? 'var(--amber)'
              : status === 'failed'   ? 'var(--error)'
              : 'var(--text-dis)'
  const char  = status === 'complete' ? '✓'
              : status === 'failed'   ? '✗'
              : '·'
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      background:     status === 'pending' ? 'transparent' : 'color-mix(in srgb, ' + color + ' 12%, transparent)',
      border:         `1px solid ${status === 'pending' ? 'var(--border)' : color}`,
      display:        'flex', alignItems: 'center', justifyContent: 'center',
      fontSize:       11, color, fontFamily: 'var(--font-mono)', flexShrink: 0,
      marginTop:      2,
    }}>
      {char}
    </div>
  )
}

function Spinner() {
  return (
    <div style={{
      width: 14, height: 14,
      border: '1.5px solid var(--border)',
      borderTopColor: 'var(--accent)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  )
}

// ── Style helpers ─────────────────────────────────────────────────────────────

function btnStyle(variant: 'accent' | 'ghost'): React.CSSProperties {
  return {
    padding:      'var(--u1) var(--u2)',
    background:   variant === 'accent' ? 'var(--accent)' : 'transparent',
    border:       `1px solid ${variant === 'accent' ? 'transparent' : 'var(--border)'}`,
    borderRadius: 'var(--radius)',
    color:        variant === 'accent' ? 'var(--bg)' : 'var(--text-sec)',
    fontSize:     13,
    fontFamily:   'var(--font-ui)',
    fontWeight:   variant === 'accent' ? 500 : 400,
    cursor:       'pointer',
    transition:   'all 0.1s ease',
    whiteSpace:   'nowrap',
  }
}

const inputStyle: React.CSSProperties = {
  width:        '100%',
  padding:      'var(--u1) var(--u15)',
  background:   'var(--surface)',
  border:       '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color:        'var(--text)',
  fontSize:     13,
  fontFamily:   'var(--font-mono)',
  outline:      'none',
}

const centeredStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  flex:           1,
  padding:        'var(--u6)',
}

// ── Root component ────────────────────────────────────────────────────────────

export function DashboardUI() {
  const dash = useDashboard()

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100%',
      background:    'var(--bg)',
    }}>
      {/* Project bar */}
      <ProjectBar
        projects={dash.project.projects}
        activeProject={dash.project.activeProject}
        onSelect={dash.project.setActive}
        onCreate={() => {
          // Name is handled inline in ProjectBar — create called after name confirmed
          dash.project.create({ name: 'New Project', description: null })
        }}
      />

      {/* Step breadcrumb */}
      <StepBar
        activePanel={dash.activePanel}
        jobId={dash.jobId}
        pipelineDone={dash.isPipelineDone}
        goToPanel={dash.goToPanel}
      />

      {/* Panel content */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
        {dash.activePanel === 'intake' && (
          <IntakePanel />
        )}

        {dash.activePanel === 'pipeline' && (
          <PipelinePanel job={dash.planner.job} />
        )}

        {dash.activePanel === 'output' && dash.jobId && (
          <OutputPanel jobId={dash.jobId} output={dash.output} />
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
