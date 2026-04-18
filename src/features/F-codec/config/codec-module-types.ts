// @liv-standard v1.5
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.3-module-types, 6.9-6.10-module-exec, 6.11-6.12-artifact-summary
// slice:      F-codec
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  FrameworkMode              → F-codec/*
//   W-ATOM  FrameworkModule            → F-codec/*
//   W-ATOM  ArtifactSchema             → F-codec/*
//   W-ATOM  ArtifactField              → F-codec/*
//   W-ATOM  FRAMEWORK_MODES            → F-codec/*
//   W-ATOM  ModuleExecutionResult      → F-codec/*
//   W-ATOM  ModuleArtifactSummary      → F-codec/*
//   W-ATOM  ARTIFACT_ACTIVE_THRESHOLD_MS → F-codec/*
// deps:       none
// validated:  pending

// ─── Framework Mode ─────────────────────────────────────────────────────────

export type FrameworkMode = 'epistemic' | 'structural' | 'generative' | 'verificative'

export const FRAMEWORK_MODES: readonly FrameworkMode[] = [
  'epistemic',
  'structural',
  'generative',
  'verificative',
] as const

// ─── Artifact Schema ────────────────────────────────────────────────────────

export type ArtifactField = {
  key:      string
  label:    string
  required: boolean
}

export type ArtifactSchema = {
  name:   string
  fields: ArtifactField[]
}

// ─── Framework Module ───────────────────────────────────────────────────────

export type FrameworkModule = {
  id:             string
  mode:           FrameworkMode
  artifactSchema: ArtifactSchema
  label:          string
}

// ─── Module Execution Result (6.9-6.10) ─────────────────────────────────────

export type ModuleExecutionResult = {
  module:       FrameworkModule
  artifactData: Record<string, string>
  response:     string
}

// ─── Artifact Status Threshold (6.11) ───────────────────────────────────────

export const ARTIFACT_ACTIVE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000

// ─── Module Artifact Summary (6.11) ─────────────────────────────────────────

export type ModuleArtifactSummary = {
  nodeId:      string
  name:        string
  moduleId:    string
  mode:        FrameworkMode
  fields:      Record<string, string>
  energy:      number
  createdAt:   number
  status:      'active' | 'completed' | 'archived'
}
