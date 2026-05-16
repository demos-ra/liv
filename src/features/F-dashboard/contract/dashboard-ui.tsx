// @liv-standard v1.5.2
// [F-dashboard/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    step5b-phaseB, phase-5.2, phase-5.3, phase-5.4; sprint-b2-unified-close-fix-round (LIV-Standard pin sweep → v1.5.2 per cascade discipline); sprint-b2-unified-close-fix-round-2 (ProgramRenderIntent import repointed F-dashboard/types/dashboard-types → F-surface/types/surface-types per L0 ruling A)
// slice:      F-dashboard
// category:   Modality
// layer:      R3
// wires-in:
//   W-ATOM  WorkspaceHook       ../types/dashboard-types
//   W-ATOM  ProgramRenderIntent @/features/F-surface/types/surface-types  (sprint-b2-unified-close-fix-round-2 — repointed from F-dashboard/types/dashboard-types per L0 ruling A)
//   W-ATOM  Surface             @/features/F-design-system/contract/primitives
//   W-ATOM  StatusDot           @/features/F-design-system/contract/primitives
//   W-ATOM  Spinner             @/features/F-design-system/contract/primitives
// wires-out:
//   W-ATOM  DashboardUI  →  src/app/page.tsx
// deps:
//   R0  ../types/dashboard-types
//   R0  @/features/F-surface/types/surface-types
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
//
// phase-5.2 (A1, A3, A7):
//   ProgramCard: internal wrapper providing header strip (label + back affordance)
//     and content area. Active program renders inside this frame.
//   MenuCard: card preview for menu view showing label, optional status dot,
//     and optional one-line status. Replaces bare text buttons.
//   Back affordance moved from project dropdown bar into ProgramCard header.
//   StatusDot imported from F-design-system/contract/primitives.
//   Axiom cite:
//     A1 — F-dashboard owns the card frame.
//     A3 — typed atoms at boundary (ProgramRenderIntent.statusDot, statusLine).
//     A7 — ProgramCard is internal, deleting it leaves programs renderable.
//
// phase-5.3 (A1):
//   ProgramCard bug fixes: --border → var(--text-dis), 0.02em → 0.06em (LETTER_SPACING.monoSm).
//   Mobile close affordance added inside Surface (CSS-hidden by default, shown at BREAKPOINT_SM).
//   dash-menu-btn className on MenuCard, dash-back-btn className on ProgramCard back button
//   for CSS-driven touch target enforcement at mobile.
//   Axiom cite: A1 — F-dashboard owns dashboard layout. Mockup build rule.
//
// phase-5.4 (A1, A7):
//   Suspense boundary added around program component render with Spinner fallback.
//   ProgramLoadingFallback: internal, centered Spinner in dash-min-h container.
//   MenuCard and ProgramCard wrapped in React.memo — prevents unnecessary re-renders
//   when parent re-renders with unchanged card props. Named function expressions
//   preserve React DevTools component names.
//   Spinner imported from F-design-system/contract/primitives.
//   Axiom cite: A1 — F-dashboard owns render optimization. A7 — memo transparent.

'use client'

import React, { Suspense } from 'react'
import { Surface, StatusDot, Spinner } from '@/features/F-design-system/contract/primitives'
import type { WorkspaceHook } from '../types/dashboard-types'
import type { ProgramRenderIntent } from '@/features/F-surface/types/surface-types'

// ── ProgramLoadingFallback (internal) ────────────────────────────────────────
// Spinner centered in dash-min-h container. Shown while lazy program chunk loads.

function ProgramLoadingFallback() {
  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      minHeight:      'var(--dash-min-h)',
    }}>
      <Spinner />
    </div>
  )
}

// ── ProgramCard (internal) ─────────────────────────────────────────────────────
// Header strip + content area for the active program view.
// Not exported — internal to DashboardUI.

const ProgramCard = React.memo(function ProgramCard({
  label,
  onBack,
  children,
}: {
  label:    string
  onBack:  () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header strip */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        'var(--u1) 0',
        marginBottom:   'var(--u2)',
        borderBottom:   '1px solid var(--text-dis)',
      }}>
        <span style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      'var(--type-sm)',
          color:         'var(--text)',
          fontWeight:    500,
          letterSpacing: '0.06em',  // LETTER_SPACING.monoSm
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
        <button
          type="button"
          className="dash-back-btn"
          onClick={onBack}
          style={{
            fontFamily:  'var(--font-mono)',
            fontSize:    'var(--type-xs)',
            color:       'var(--text-dis)',
            background:  'none',
            border:      'none',
            cursor:      'pointer',
            padding:     0,
          }}
          aria-label="Back to menu"
        >
          ← menu
        </button>
      </div>
      {/* Content area */}
      <div>{children}</div>
    </div>
  )
})

// ── MenuCard (internal) ────────────────────────────────────────────────────────
// Card preview for the menu view. Shows label, optional status dot, optional status line.
// Not exported — internal to DashboardUI.

const MenuCard = React.memo(function MenuCard({
  program,
  onActivate,
}: {
  program:    ProgramRenderIntent
  onActivate: () => void
}) {
  return (
    <button
      type="button"
      className="dash-menu-btn"
      onClick={onActivate}
      style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      'var(--type-sm)',
        color:         'var(--text-sec)',
        background:    'var(--surface)',
        border:        'none',
        borderRadius:  'var(--u1)',
        padding:       'var(--u15) var(--u2)',
        cursor:        'pointer',
        textAlign:     'left',
        boxShadow:     'var(--glow-rest-low)',
        display:       'flex',
        alignItems:    'center',
        gap:           'var(--u1)',
        width:         '100%',
      }}
    >
      {program.statusDot && (
        <StatusDot status={program.statusDot} />
      )}
      <span style={{ flex: 1 }}>{program.label}</span>
      {program.statusLine && (
        <span style={{
          fontSize:      'var(--type-xs)',
          color:         'var(--text-dis)',
          overflow:      'hidden',
          textOverflow:  'ellipsis',
          whiteSpace:    'nowrap',
          maxWidth:      '50%',
        }}>
          {program.statusLine}
        </span>
      )}
    </button>
  )
})

// ── DashboardUI ──────────────────────────────────────────────────────────────

export function DashboardUI({
  program,
  programs,
  activeProgramId,
  setActiveProgram,
  userId,
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

          {/* Mobile close affordance — visible via CSS media query only */}
          <button
            type="button"
            className="dash-close-mobile"
            onClick={dashboardSection.toggleExpanded}
            aria-label="Close dashboard"
            style={{
              fontFamily:  'var(--font-mono)',
              fontSize:    'var(--type-xs)',
              color:       'var(--text-dis)',
              background:  'none',
              border:      'none',
              cursor:      'pointer',
              padding:     'var(--u1)',
              display:     'none',  // default hidden; CSS media query shows at mobile
              textAlign:   'right',
              width:       '100%',
            }}
          >
            ✕ close
          </button>

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
          </div>

          {/* ── Program view ── */}
          {activeProgram !== null ? (
            <ProgramCard
              label={activeProgram.label}
              onBack={() => setActiveProgram(null)}
            >
              {(() => {
                const ProgramComponent = activeProgram.component
                return (
                  <Suspense fallback={<ProgramLoadingFallback />}>
                    <ProgramComponent
                      programId={activeProgram.programId}
                      userId={userId}
                      projectId={program?.projectId ?? ''}
                    />
                  </Suspense>
                )
              })()}
            </ProgramCard>
          ) : (
            /* ── Menu view — one card per registered program ── */
            programs.length === 0 ? (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-sm)', color: 'var(--text-dis)' }}>
                No programs registered
              </span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u1)' }}>
                {programs.map(p => (
                  <MenuCard
                    key={p.programId}
                    program={p}
                    onActivate={() => setActiveProgram(p.programId)}
                  />
                ))}
              </div>
            )
          )}

        </Surface>
      </div>
    </div>
  )
}
