// @liv-standard v1.3
// [F-dashboard/contract/dashboard-ui.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5d-phase1
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-ATOM  WorkspaceHook       ../types/dashboard-types
//   W-ATOM  ActiveProgram       ../types/dashboard-types
//   W-ATOM  ProgramRenderIntent ../types/dashboard-types
//   W-ATOM  OutputActions       ../types/dashboard-types
//   W-ATOM  ProjectActions      ../types/dashboard-types
//   W-ATOM  Surface             @/features/F-design-system/contract/primitives
// wires-out:
//   W-ATOM  DashboardUI  →  src/app/page.tsx
// deps:
//   R0  ../types/dashboard-types
//   R3  @/features/F-design-system/contract/primitives  (A5)
//   R5  react
// Note: ProjectSummary + ProjectId inferred from WorkspaceHook — no direct F-project import needed.
// validated:  pending
//
// step4b3-dashboard (A1, A3, A7):
//   Full rewrite. Single .surface card with project dropdown + status strip.
//   Axiom cite: A1, A7.
//
// step5d-phase1 (A1, A3, A7):
//   Removed: all F-planner imports — PipelineStatus, PipelineStage.
//   Removed: PipelinePanel, StageIcon, StatusDot, STAGE_ORDER, STAGE_NODES,
//   deriveNodeStates, NodeDot, ConnectorLine, StatusStrip, DashboardCard internals
//   that referenced pipeline state. All builder-specific — now owned by F-planner.
//   DashboardCard replaced with DashboardUI surface: iterates programs[],
//   renders each program.component autonomously (zero props — component is self-
//   contained). Project dropdown stays — F-project is universe-layer.
//   Download button: removed from dashboard — F-planner's BuilderStatusCard owns
//   its own output trigger. OutputState kept in WorkspaceHook for future programs
//   that may need it; not rendered here.
//   Axiom cite:
//     A1 — F-dashboard renders protocol surface only; programs render themselves.
//     A7 — all dead pipeline code removed.

'use client'

import {
  Surface,
} from '@/features/F-design-system/contract/primitives'
import type { WorkspaceHook } from '../types/dashboard-types'

// ── DashboardUI — exported root component ─────────────────────────────────────
// Receives full WorkspaceHook spread from page.tsx.
// Renders nothing when dashboardSection.isExpanded is false.
// programs: each program.component is rendered inside its own Surface card.
// Dashboard is a protocol — it does not know what any program is.

export function DashboardUI({
  program,
  programs,
  projects,
  projectActions,
  dashboardSection,
}: WorkspaceHook) {
  if (!dashboardSection.isExpanded) return null

  return (
    <div style={{ marginTop: 'var(--u2)', marginBottom: 'var(--u2)', flexShrink: 0 }}>
      <div className="col">
        <Surface>
          {/* ── Row 1: Project dropdown ── */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            marginBottom:   programs.length > 0 ? 'var(--u3)' : undefined,
            gap:            'var(--u2)',
          }}>
            {projects.length > 0 ? (
              <select
                value={program?.projectId ?? ''}
                onChange={e => projectActions.setActive(e.target.value as Parameters<typeof projectActions.setActive>[0])}
                style={{
                  fontFamily:   'var(--font-mono)',
                  fontSize:     'var(--type-sm)',
                  color:        'var(--text-sec)',
                  background:   'var(--input-panel-bg)',
                  border:       '1px solid var(--border)',
                  borderRadius: 'var(--u1)',
                  height:       'var(--input-h-sm)',
                  padding:      '0 var(--u1)',
                  cursor:       'pointer',
                  outline:      'none',
                  maxWidth:     '240px',
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
          </div>

          {/* ── Registered programs — each component is self-contained ── */}
          {programs.map(p => {
            const ProgramComponent = p.component
            return <ProgramComponent key={p.programId} />
          })}
        </Surface>
      </div>
    </div>
  )
}
