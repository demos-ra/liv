// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    none
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM   FrameworkModule, ModuleExecutionResult  F-codec/R0
//   W-ATOM   CODEC_CONFIG                            F-codec/R0
//   W-ATOM   PresentState                            F-memory/R0
//   W-ATOM   ARTIFACT_PREFIX                         F-codec/R0
//   W-HOOK   executeModule()                         F-codec/R3 (codec-inject)
//   W-HOOK   getPresentState()                       F-memory/R3
//   W-INJECT createArtifact()                        F-codec/R2 (codec-artifact, 6.7)
// wires-out:
//   W-INJECT  executePlanning()  → F-codec/R2 (codec-orchestrate)
//   W-ATOM    PLANNING_MODULE    → F-codec/R2 (codec-orchestrate, registration)
// deps:
//   R0  ../config/codec-module-types
//   R0  ../config/codec-types
//   R0  ../config/codec-artifact-types
//   R2  ./codec-artifact
//   R3  ../contract/codec-inject
//   R3  @/features/F-memory/contract/memory-contract
// validated:  pending

// Phase 6.10 — Planning module (structural).
// R2: orchestration. Transforms known → structured.
// Pipeline: graph context → structured prompt → LLM call → parse → artifact → result.
// Cross-module reference: if findings artifacts exist in graph context,
// the planning prompt includes them and the artifact gets dependency edges.

import type { Result } from '@/core/types/primitives'
import type { FrameworkModule, ModuleExecutionResult } from '../config/codec-module-types'
import type { ArtifactData } from '../config/codec-artifact-types'
import { ARTIFACT_PREFIX } from '../config/codec-artifact-types'
import { CODEC_CONFIG } from '../config/codec-types'
import { executeModule } from '../contract/codec-inject'
import { getPresentState } from '@/features/F-memory/contract/memory-contract'
import { createArtifact } from './codec-artifact'

// ─── Module Definition ──────────────────────────────────────────────────────

export const PLANNING_MODULE: FrameworkModule = {
  id:    'planning',
  mode:  'structural',
  label: 'Planner',
  artifactSchema: {
    name:   'plan',
    fields: [
      { key: 'objectives',   label: 'Objectives',             required: true },
      { key: 'dependencies', label: 'Dependencies',           required: true },
      { key: 'sequence',     label: 'Execution sequence',     required: true },
      { key: 'status',       label: 'Status per objective',   required: true },
      { key: 'inputs',       label: 'Input artifacts',        required: false },
    ],
  },
  executor: executePlanning,   // phase-6-sprint-b (unhooked from registry per D-PLANNING-UNHOOK)
}

// ─── Execute Planning ───────────────────────────────────────────────────────
// Structural mode execution. Transforms known → structured.
// 1. Get graph context
// 2. Detect existing findings artifacts in present state
// 3. Build planning prompt (including findings references)
// 4. Call LLM (module exec — 1024 tokens)
// 5. Parse JSON response
// 6. Create artifact in graph (with dependency edges to findings)
// 7. Build natural-language response
// 8. Return ModuleExecutionResult
//
// phase-6-sprint-b: signature widened to ModuleExecutor shape. PLANNING_MODULE
// is unhooked from registry at orchestrate per D-PLANNING-UNHOOK; this
// function is dead code pending T-CODEC-01 retirement. Signature still
// updated to keep the module type-conformant for the file-as-archive period.

export async function executePlanning(
  content:    string,
  userId:     string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _projectId: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _turnId:    string,
  modelId:    string | undefined,
): Promise<Result<ModuleExecutionResult>> {
  try {
    // 1. Get graph context
    const presentState = getPresentState(userId)

    // 2. Detect existing findings artifacts in present state
    // Artifact nodes use the [artifact:...] prefix convention (6.7).
    const findingsRefs = presentState.statements
      .filter(s => s.value.includes(ARTIFACT_PREFIX) && s.value.includes('discovery'))
      .map(s => s.value)

    // 3. Build planning prompt
    const statementsBlock = presentState.statements.length > 0
      ? presentState.statements.map(s => s.value).join('\n')
      : '(no prior knowledge)'

    const prompt = [
      'You are operating in structural mode. Your task is planning — transform known into structured.',
      '',
      'Context from the user\'s knowledge graph:',
      statementsBlock,
      '',
      'The user\'s input:',
      content,
      '',
      'Identify the objectives, establish dependencies between them, and determine the execution sequence. If any findings or research artifacts are present in the context, reference them as inputs.',
      '',
      'Respond in JSON only, no preamble, no markdown fencing:',
      '{',
      '  "objectives": "objective1: description | objective2: description | ...",',
      '  "dependencies": "objective2 depends on objective1 | ...",',
      '  "sequence": "1. objective1 → 2. objective2 → ...",',
      '  "status": "objective1: ready | objective2: blocked by objective1 | ...",',
      '  "inputs": "references to findings or research that inform this plan"',
      '}',
    ].join('\n')

    // 4. Call LLM
    const llmResult = await executeModule(prompt, modelId ?? CODEC_CONFIG.CLASSIFY_MODEL)
    if (!llmResult.ok) {
      return { ok: false, error: { code: 'PLANNING_LLM_FAILED', message: llmResult.error.message } }
    }

    // 5. Parse response — fallback if JSON parse fails
    const artifactData = parsePlanningResponse(llmResult.data, content)

    // 6. Create artifact in graph
    // If findings artifacts exist, pass their content as dependency references.
    // createArtifact (6.7) creates relate edges to dependency nodes.
    const dependsOn = findingsRefs.length > 0 ? findingsRefs : undefined

    const artifactPayload: ArtifactData = {
      moduleId:  PLANNING_MODULE.id,
      mode:      PLANNING_MODULE.mode,
      schema:    PLANNING_MODULE.artifactSchema,
      fields:    artifactData,
      title:     `Plan: ${artifactData.objectives.slice(0, 80)}`,
      version:   1,
      createdAt: Date.now(),
    }

    const artifactResult = await createArtifact(artifactPayload, userId, dependsOn)
    if (!artifactResult.ok) {
      console.error('[F-codec] planning artifact creation failed:', artifactResult.error.message)
      // Non-fatal — module still returns result even if artifact persistence fails
    }

    // 7. Build response string for system prompt injection
    const response = [
      `Objectives:\n${artifactData.objectives}`,
      '',
      `Dependencies:\n${artifactData.dependencies}`,
      '',
      `Execution sequence:\n${artifactData.sequence}`,
      '',
      `Status:\n${artifactData.status}`,
      artifactData.inputs ? `\nInputs:\n${artifactData.inputs}` : '',
    ].filter(Boolean).join('\n')

    // 8. Return ModuleExecutionResult
    return {
      ok: true,
      data: {
        module:       PLANNING_MODULE,
        artifactData,
        response,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[F-codec] executePlanning error:', message)
    return { ok: false, error: { code: 'PLANNING_EXECUTION_FAILED', message } }
  }
}

// ─── Parse Planning Response ─────────────────────────────────────────────────
// Attempts JSON parse. Falls back to raw response with user content as objectives.
// Never throws — always produces a Record<string, string>.

function parsePlanningResponse(
  raw: string,
  originalContent: string,
): Record<string, string> {
  try {
    // Strip markdown fencing if present
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      objectives:   String(parsed.objectives   ?? originalContent),
      dependencies: String(parsed.dependencies ?? ''),
      sequence:     String(parsed.sequence     ?? ''),
      status:       String(parsed.status       ?? ''),
      inputs:       String(parsed.inputs       ?? ''),
    }
  } catch {
    // Fallback: raw response as sequence
    return {
      objectives:   originalContent,
      dependencies: '',
      sequence:     raw,
      status:       '',
      inputs:       '',
    }
  }
}
