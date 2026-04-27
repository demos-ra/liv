// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v2-2-shot2, lm-v2-2-shot4, lm-v2-2-shot5-fix-2
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM   FrameworkModule, ModuleExecutionResult  F-codec/R0
//   W-ATOM   CODEC_CONFIG                            F-codec/R0
//   W-ATOM   PresentState                            F-memory/R3
//   W-ATOM   ARTIFACT_PREFIX                         F-codec/R0
//   W-HOOK   executeModule()                         F-codec/R3 (codec-inject)
//   W-HOOK   Present()                               F-memory/R3 (LM v2.2 §D; replaces v2.1 getPresentState)
//   W-HOOK   getUserGraph(), getGlobalGraph()        F-memory/R3 (lm-v2-2-shot4: render projected NodeIds)
//   W-INJECT createArtifact()                        F-codec/R2 (codec-artifact, 6.7)
// wires-out:
//   W-INJECT  executeVerification()  → F-codec/R2 (codec-orchestrate)
//   W-ATOM    VERIFY_MODULE          → F-codec/R2 (codec-orchestrate, registration)
// deps:
//   R0  ../config/codec-module-types
//   R0  ../config/codec-types
//   R0  ../config/codec-artifact-types
//   R2  ./codec-artifact
//   R3  ../contract/codec-inject
//   R3  @/features/F-memory/contract/memory-contract
// validated:  pending

// Phase 6.13 — Verificative module.
// R2: orchestration. Transforms produced → verified.
// Uses LLM to execute structured audit against declared standards.
// Pipeline: graph context → structured prompt → LLM call → parse → artifact → result.

import type { Result } from '@/core/types/primitives'
import type { FrameworkModule, ModuleExecutionResult } from '../config/codec-module-types'
import type { ArtifactData } from '../config/codec-artifact-types'
import { ARTIFACT_PREFIX } from '../config/codec-artifact-types'
import { CODEC_CONFIG } from '../config/codec-types'
import { executeModule } from '../contract/codec-inject'
import { Present, getUserGraph, getGlobalGraph } from '@/features/F-memory/contract/memory-contract'
import { createArtifact } from './codec-artifact'

// ─── Module Definition ──────────────────────────────────────────────────────

export const VERIFY_MODULE: FrameworkModule = {
  id:    'verification',
  mode:  'verificative',
  label: 'Verification',
  artifactSchema: {
    name:   'audit-report',
    fields: [
      { key: 'subject',     label: 'Subject audited',            required: true },
      { key: 'standardRef', label: 'Standard referenced',        required: true },
      { key: 'gaps',        label: 'Gaps found',                  required: true },
      { key: 'gapDetails',  label: 'Gap details with severity',   required: true },
      { key: 'passed',      label: 'Checks passed',              required: true },
      { key: 'resolution',  label: 'Resolution status',          required: false },
    ],
  },
  executor: executeVerification,   // phase-6-sprint-b
}

// ─── Execute Verification ───────────────────────────────────────────────────
// Verificative mode execution. Transforms produced → verified.
// 1. Get graph context
// 2. Identify verification subject from present state (existing artifacts)
// 3. Build verification prompt
// 4. Call LLM (module exec — 1024 tokens)
// 5. Parse JSON response
// 6. Create artifact in graph (with dependency edge to verified subject)
// 7. Build natural-language response
// 8. Return ModuleExecutionResult
//
// phase-6-sprint-b: signature widened to ModuleExecutor shape. turnId unused
// pending T-VERIFY-AS-WIRE.

export async function executeVerification(
  content:    string,
  userId:     string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _projectId: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _turnId:    string,
  modelId:    string | undefined,
): Promise<Result<ModuleExecutionResult>> {
  try {
    // 1. Get graph context.
    // lm-v2-2-shot2: Present({scope: {user: userId}}) per LM v2.2 §D.
    const presentState = Present({ scope: { user: userId } })

    // 2. Identify verification subject — artifact references in present state.
    // lm-v2-2-shot4: render projected NodeIds via F-memory accessors; filter
    // by content prefix.
    const userGraph = getUserGraph(userId)
    const globalGraph = getGlobalGraph()
    const projectedContents = presentState.projected
      .map(id => userGraph.nodes.get(id)?.content ?? globalGraph.nodes.get(id)?.content ?? '')
      .filter(s => s.length > 0)
    const artifactRefs = projectedContents.filter(c => c.includes(ARTIFACT_PREFIX))

    // 3. Build verification prompt.
    // Content-only rendering per D-RENDERING-PATTERN.
    const statementsBlock = projectedContents.length > 0
      ? projectedContents.join('\n')
      : '(no prior knowledge)'

    const prompt = [
      'You are operating in verificative mode. Your task is verification — transform produced into verified.',
      '',
      'Context from the user\'s knowledge graph:',
      statementsBlock,
      '',
      'The user\'s input:',
      content,
      '',
      'Identify what is being verified and which standard applies. Execute a structured audit:',
      '',
      'For each applicable check:',
      '- State the check',
      '- Evaluate: pass or fail',
      '- If fail: classify the gap (fidelity | structural | completeness | safety) and rate severity (must-fix | should-fix | note)',
      '- Provide evidence for your assessment',
      '',
      'Respond in JSON only, no preamble, no markdown fencing:',
      '{',
      '  "subject": "what was audited",',
      '  "standardRef": "which standard or framework was applied",',
      '  "gaps": "count of gaps found, by severity",',
      '  "gapDetails": "gap1: [type] [severity] description | gap2: ...",',
      '  "passed": "count of checks passed / total checks",',
      '  "resolution": "open — awaiting fixes"',
      '}',
    ].join('\n')

    // 4. Call LLM
    const llmResult = await executeModule(prompt, modelId ?? CODEC_CONFIG.CLASSIFY_MODEL)
    if (!llmResult.ok) {
      return { ok: false, error: { code: 'VERIFY_LLM_FAILED', message: llmResult.error.message } }
    }

    // 5. Parse response — fallback if JSON parse fails
    const artifactData = parseVerificationResponse(llmResult.data, content)

    // 6. Create artifact in graph
    // dependsOn: artifact references found in present state (what was verified)
    const dependsOn = artifactRefs.length > 0 ? artifactRefs : undefined

    const artifactPayload: ArtifactData = {
      moduleId:  VERIFY_MODULE.id,
      mode:      VERIFY_MODULE.mode,
      schema:    VERIFY_MODULE.artifactSchema,
      fields:    artifactData,
      title:     `Audit: ${artifactData.subject.slice(0, 80)}`,
      version:   1,
      createdAt: Date.now(),
    }

    const artifactResult = await createArtifact(artifactPayload, userId, dependsOn)
    if (!artifactResult.ok) {
      console.error('[F-codec] verification artifact creation failed:', artifactResult.error.message)
    }

    // 7. Build response string for system prompt injection
    const response = [
      `Subject audited: ${artifactData.subject}`,
      '',
      `Standard referenced: ${artifactData.standardRef}`,
      '',
      `Checks passed: ${artifactData.passed}`,
      `Gaps found: ${artifactData.gaps}`,
      '',
      `Gap details:\n${artifactData.gapDetails}`,
      artifactData.resolution ? `\nResolution: ${artifactData.resolution}` : '',
    ].filter(Boolean).join('\n')

    // 8. Return ModuleExecutionResult
    return {
      ok: true,
      data: {
        module:       VERIFY_MODULE,
        artifactData,
        response,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[F-codec] executeVerification error:', message)
    return { ok: false, error: { code: 'VERIFY_EXECUTION_FAILED', message } }
  }
}

// ─── Parse Verification Response ─────────────────────────────────────────────
// Attempts JSON parse. Falls back to raw response with user content as subject.
// Never throws — always produces a Record<string, string>.

function parseVerificationResponse(
  raw: string,
  originalContent: string,
): Record<string, string> {
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      subject:     String(parsed.subject     ?? originalContent),
      standardRef: String(parsed.standardRef ?? ''),
      gaps:        String(parsed.gaps        ?? ''),
      gapDetails:  String(parsed.gapDetails  ?? ''),
      passed:      String(parsed.passed      ?? ''),
      resolution:  String(parsed.resolution  ?? ''),
    }
  } catch {
    return {
      subject:     originalContent,
      standardRef: '',
      gaps:        '',
      gapDetails:  raw,
      passed:      '',
      resolution:  '',
    }
  }
}
