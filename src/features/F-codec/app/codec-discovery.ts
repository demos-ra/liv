// @liv-standard v1.5
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
//   W-HOOK   executeModule()                         F-codec/R3 (codec-inject)
//   W-HOOK   getPresentState()                       F-memory/R3
//   W-INJECT createArtifact()                        F-codec/R2 (codec-artifact, 6.7)
// wires-out:
//   W-INJECT  executeDiscovery()  → F-codec/R2 (codec-orchestrate)
//   W-ATOM    DISCOVERY_MODULE    → F-codec/R2 (codec-orchestrate, registration)
// deps:
//   R0  ../config/codec-module-types
//   R0  ../config/codec-types
//   R0  ../config/codec-artifact-types
//   R2  ./codec-artifact
//   R3  ../contract/codec-inject
//   R3  @/features/F-memory/contract/memory-contract
// validated:  pending

// Phase 6.9 — Discovery module (epistemic).
// R2: orchestration. Uses LLM to execute discovery against confirmed axes.
// Pipeline: graph context → structured prompt → LLM call → parse → artifact → result.

import type { Result } from '@/core/types/primitives'
import type { FrameworkModule, ModuleExecutionResult } from '../config/codec-module-types'
import type { ArtifactData } from '../config/codec-artifact-types'
import { CODEC_CONFIG } from '../config/codec-types'
import { executeModule } from '../contract/codec-inject'
import { getPresentState } from '@/features/F-memory/contract/memory-contract'
import { createArtifact } from './codec-artifact'

// ─── Module Definition ──────────────────────────────────────────────────────

export const DISCOVERY_MODULE: FrameworkModule = {
  id:    'discovery',
  mode:  'epistemic',
  label: 'Discovery',
  artifactSchema: {
    name:   'findings',
    fields: [
      { key: 'question',      label: 'Research question',   required: true },
      { key: 'axes',          label: 'Axes explored',       required: true },
      { key: 'findings',      label: 'What was learned',    required: true },
      { key: 'confidence',    label: 'Confidence level',    required: true },
      { key: 'openQuestions', label: 'Open questions',      required: false },
    ],
  },
}

// ─── Execute Discovery ──────────────────────────────────────────────────────
// Epistemic mode execution. Transforms unknown → known.
// 1. Get graph context
// 2. Build discovery prompt
// 3. Call LLM (module exec — 1024 tokens)
// 4. Parse JSON response
// 5. Create artifact in graph
// 6. Build natural-language response
// 7. Return ModuleExecutionResult

export async function executeDiscovery(
  content:    string,
  userId:     string,
  projectId?: string,
  modelId?:   string,
): Promise<Result<ModuleExecutionResult>> {
  try {
    // 1. Get graph context
    const presentState = getPresentState(userId)

    // 2. Build discovery prompt
    const statementsBlock = presentState.statements.length > 0
      ? presentState.statements.map(s => s.value).join('\n')
      : '(no prior knowledge)'

    const prompt = [
      'You are operating in epistemic mode. Your task is discovery — transform unknown into known.',
      '',
      'Context from the user\'s knowledge graph:',
      statementsBlock,
      '',
      'The user\'s input:',
      content,
      '',
      'Decompose this into orthogonal axes of inquiry. For each axis, state what is known and what remains unknown. Rate your confidence (0–1) for each axis.',
      '',
      'Respond in JSON only, no preamble, no markdown fencing:',
      '{',
      '  "question": "the core research question",',
      '  "axes": "axis1: known/unknown summary | axis2: known/unknown summary | ...",',
      '  "findings": "what was learned at each axis",',
      '  "confidence": "overall confidence 0–1 with per-axis breakdown",',
      '  "openQuestions": "questions that remain unanswered"',
      '}',
    ].join('\n')

    // 3. Call LLM
    const llmResult = await executeModule(prompt, modelId ?? CODEC_CONFIG.CLASSIFY_MODEL)
    if (!llmResult.ok) {
      return { ok: false, error: { code: 'DISCOVERY_LLM_FAILED', message: llmResult.error.message } }
    }

    // 4. Parse response — fallback if JSON parse fails
    const artifactData = parseDiscoveryResponse(llmResult.data, content)

    // 5. Create artifact in graph
    const artifactPayload: ArtifactData = {
      moduleId:  DISCOVERY_MODULE.id,
      mode:      DISCOVERY_MODULE.mode,
      schema:    DISCOVERY_MODULE.artifactSchema,
      fields:    artifactData,
      title:     `Discovery: ${artifactData.question.slice(0, 80)}`,
      version:   1,
      createdAt: Date.now(),
    }

    const artifactResult = await createArtifact(artifactPayload, userId)
    if (!artifactResult.ok) {
      console.error('[F-codec] discovery artifact creation failed:', artifactResult.error.message)
      // Non-fatal — module still returns result even if artifact persistence fails
    }

    // 6. Build response string for system prompt injection
    const response = [
      `Research question: ${artifactData.question}`,
      '',
      `Axes explored:\n${artifactData.axes}`,
      '',
      `Findings:\n${artifactData.findings}`,
      '',
      `Confidence: ${artifactData.confidence}`,
      artifactData.openQuestions ? `\nOpen questions:\n${artifactData.openQuestions}` : '',
    ].filter(Boolean).join('\n')

    // 7. Return ModuleExecutionResult
    return {
      ok: true,
      data: {
        module:       DISCOVERY_MODULE,
        artifactData,
        response,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[F-codec] executeDiscovery error:', message)
    return { ok: false, error: { code: 'DISCOVERY_EXECUTION_FAILED', message } }
  }
}

// ─── Parse Discovery Response ────────────────────────────────────────────────
// Attempts JSON parse. Falls back to raw response with user content as question.
// Never throws — always produces a Record<string, string>.

function parseDiscoveryResponse(
  raw: string,
  originalContent: string,
): Record<string, string> {
  try {
    // Strip markdown fencing if present
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      question:      String(parsed.question      ?? originalContent),
      axes:          String(parsed.axes          ?? ''),
      findings:      String(parsed.findings      ?? ''),
      confidence:    String(parsed.confidence    ?? ''),
      openQuestions: String(parsed.openQuestions ?? ''),
    }
  } catch {
    // Fallback: raw response as findings
    return {
      question:      originalContent,
      axes:          '',
      findings:      raw,
      confidence:    '',
      openQuestions: '',
    }
  }
}
