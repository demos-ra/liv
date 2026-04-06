// @liv-standard v1.3
// [F-dashboard/contract/dashboard-ui.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseB
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-ATOM  WorkspaceHook       ../types/dashboard-types
//   W-ATOM  ProgramRenderIntent ../types/dashboard-types
//   W-ATOM  Surface             @/features/F-design-system/contract/primitives
// wires-out:
//   W-ATOM  DashboardUI  →  src/app/page.tsx
// deps:
//   R0  ../types/dashboard-types
//   R3  @/features/F-design-system/contract/primitives  (A5)
//   R5  react
// validated: pending
//
// step4b3-dashboard (A1, A3, A7): (see prior history)
// step5d-phase1 (A1, A3, A7): (see prior history)
//
// step5b-phaseB (A1, A3):
//   Two render modes driven by activeProgramId:
//     null  → menu: one card per registered program showing label. Click activates.
//     set   → render matching program's component. Back affordance resets to null.
//   Fallback: if activeProgramId is set but program not found (deregistered),
//   dashboard-hook already resolves to null — this branch is defence in depth.
//   Project dropdown: shown in both menu and active-program views (universe-layer).
//   Back affordance: small mono link above the active program surface.
//   Axiom cite:
//     A1 — F-dashboard renders protocol surface only; does not know program internals.
//     A3 — WorkspaceHook typed boundary; no inline type assertions.

'use client'

import { Surface } from '@/features/F-design-system/contract/primitives'
import type { WorkspaceHook } from '../types/dashboard-types'

export function DashboardUI({
  program,
  programs,
  activeProgramId,
  setActiveProgram,
  projects,
  projectActions,
  dashboardSection,
}: WorkspaceHook) {
  if (!dashboardSection.isExpanded) return null

  const activeProgram = activeProgramId !== null
    ? programs.find(p => p.programId === activeProgramId) ?? null
    : null

  return (
    <div style={{ marginTop: 'var(--u2)', marginBottom: 'var(--u2)', flexShrink: 0 }}>
      <div className="col">
        <Surface>

          {/* ── Project dropdown (always visible — universe-layer) ── */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            marginBottom:   'var(--u3)',
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
                  background:   'var(--surface)',
                  border:       'none',
                  borderRadius: 'var(--u1)',
                  height:       'var(--input-h-sm)',
                  padding:      '0 var(--u1)',
                  cursor:       'pointer',
                  outline:      'none',
                  maxWidth:     '240px',
                  boxShadow:    'var(--glow-rest-low)',
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

            {/* Back affordance — only when a program is active */}
            {activeProgram !== null && (
              <button
                type="button"
                onClick={() => setActiveProgram(null)}
                style={{
                  fontFamily:      'var(--font-mono)',
                  fontSize:        'var(--type-sm)',
                  color:           'var(--text-dis)',
                  background:      'none',
                  border:          'none',
                  cursor:          'pointer',
                  padding:         0,
                  marginLeft:      'auto',
                }}
                aria-label="Back to menu"
              >
                ← menu
              </button>
            )}
          </div>

          {/* ── Active program view ── */}
          {activeProgram !== null ? (
            (() => {
              const ProgramComponent = activeProgram.component
              return <ProgramComponent />
            })()
          ) : (
            /* ── Menu view — one card per registered program ── */
            programs.length === 0 ? (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-sm)', color: 'var(--text-dis)' }}>
                No programs registered
              </span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u1)' }}>
                {programs.map(p => (
                  <button
                    key={p.programId}
                    type="button"
                    onClick={() => setActiveProgram(p.programId)}
                    style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      'var(--type-sm)',
                      color:         'var(--text-sec)',
                      background:    'var(--surface)',
                      border:        'none',
                      borderRadius:  'var(--u1)',
                      padding:       'var(--u1) var(--u2)',
                      cursor:        'pointer',
                      textAlign:     'left',
                      boxShadow:     'var(--glow-rest-low)',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )
          )}

        </Surface>
      </div>
    </div>
  )
}
