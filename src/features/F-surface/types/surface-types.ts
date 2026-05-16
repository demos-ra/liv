// @liv-standard v1.5.2
// [F-surface/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-b2-unified-close (slice authoring — F-surface extracted from F-dashboard; full projection ownership: atoms + registry hooks per L0 ruling at brief §4)
// slice:      F-surface
// category:   Tool
// layer:      R0
// wires-in:
//   W-ATOM  ComponentType  ←  react (R5)
// wires-out:
//   W-ATOM  ProgramRenderIntent  →  F-surface/R3 (surface-registry.tsx), F-dashboard/R3 (cross-slice via A5), all Modality programs that register
//   W-ATOM  ProgramProps         →  F-surface/R3, F-dashboard/R3 (consumer of program components), all Modality programs
// deps:
//   R5  react
// validated:  pending

import type { ComponentType } from 'react'

// ── ProgramProps ──────────────────────────────────────────────────────────────
// Shape passed to every registered program's component on render. The context
// triple (programId, userId, projectId) is threaded by the dashboard shell
// per Render Standard v1.0 G-RS4.
export type ProgramProps = {
  programId:  string
  userId:     string
  projectId:  string
}

// ── ProgramRenderIntent (A3) ──────────────────────────────────────────────────
// sprint-12-shot-4: actionKinds added per Render Standard v1.0 DA1.
// sprint-b2-unified-close: atom relocated from F-dashboard/R0 to F-surface/R0
// per L0 ruling — F-surface owns the projection layer (atoms + hooks); F-dashboard
// remains the render surface, consuming this atom cross-slice via A5.
export type ProgramRenderIntent = {
  programId:   string
  label:       string
  component:   ComponentType<ProgramProps>
  actionKinds: string[]           // v1.0: empty; DA2/DA3 dispatch wired post-beta
  statusDot?:  'accent' | 'dis' | 'error'
  statusLine?: string
}
