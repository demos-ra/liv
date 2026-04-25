// @liv-standard v1.5.1
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.3-module-types, 6.9-6.10-module-exec, 6.11-6.12-artifact-summary, phase-6-sprint-b, phase-6-cleanup
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  Result  ←  core/R5 primitives
// wires-out:
//   W-ATOM  FrameworkMode              → F-codec/*
//   W-ATOM  FrameworkModule            → F-codec/* (runtime: executor required)
//   W-ATOM  FrameworkModuleSummary     → F-codec/*, /api/modules transport (phase-6-cleanup F012)
//   W-ATOM  ModuleExecutor             → F-codec/*  (phase-6-sprint-b)
//   W-ATOM  ArtifactSchema             → F-codec/*
//   W-ATOM  ArtifactField              → F-codec/*
//   W-ATOM  FRAMEWORK_MODES            → F-codec/*
//   W-ATOM  ModuleExecutionResult      → F-codec/*
//   W-ATOM  ModuleArtifactSummary      → F-codec/*
//   W-ATOM  ARTIFACT_ACTIVE_THRESHOLD_MS → F-codec/*
// deps:       core/R5 primitives
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
// phase-6-sprint-b: ModuleExecutor type + required executor field. Replaces
// the codec-orchestrate switch-on-id dispatch with a uniform pointer pattern.
// Modules now declare their own executor at registration time; orchestrate's
// dispatchModule() is a one-line passthrough.
//
// phase-6-cleanup F012: split into two types — runtime (FrameworkModule, with
// executor) and transport (FrameworkModuleSummary, no executor). Functions
// don't serialize over JSON, so the /api/modules HTTP boundary uses
// FrameworkModuleSummary. Server-side registry holds FrameworkModule.
//
// Signature (5 positional args):
//   content:   string                — user message
//   userId:    string                — resolved user id
//   projectId: string | undefined    — project scope (modules that require it
//                                      reject undefined locally; F-plan via
//                                      D-PROJECT)
//   turnId:    string                — minted by codec at pipeline entry
//                                      (T-TURNID-ATOM: branded TurnId atom
//                                      pending at next iteration; string per
//                                      existing convention this sprint)
//   modelId:   string | undefined    — optional model selection passthrough

import type { Result } from '@/core/types/primitives'

export type ModuleExecutor = (
  content:   string,
  userId:    string,
  projectId: string | undefined,
  turnId:    string,
  modelId:   string | undefined,
) => Promise<Result<ModuleExecutionResult>>

/**
 * Transport / display shape — what /api/modules returns and what client-side
 * consumers (dashboard registration, framework-program-register) work with.
 * No executor field: functions don't serialize over JSON.
 */
export type FrameworkModuleSummary = {
  id:             string
  mode:           FrameworkMode
  artifactSchema: ArtifactSchema
  label:          string
}

/**
 * Runtime shape — server-side registry holds these. Carries executor.
 * Constructed at module-declaration sites (DISCOVERY_MODULE, PLAN_MODULE,
 * etc.); registered via codec-registry; invoked at codec-orchestrate
 * dispatchModule. Never crosses the HTTP boundary.
 */
export type FrameworkModule = FrameworkModuleSummary & {
  executor: ModuleExecutor
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
