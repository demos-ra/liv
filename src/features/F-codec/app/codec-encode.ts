// @liv-standard v1.4
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.4
// amended:    phase-b-item1
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  EncodeResult, CognitivePrimitive, MutatingPrimitive, MECHANICAL_MAPPINGS, CODEC_CONFIG  ←  F-codec/R0
//   W-ATOM  CODEC_EVENTS  ←  F-codec/R0
//   W-FN    buildClassifyPrompt(), parseClassifyResponse()  ←  F-codec/R1
//   W-FN    normalizeLabel(), parseLabelResponse()  ←  F-codec/R1
//   W-FN    classifyAndLabel()  ←  F-codec/R3 (codec-inject)
//   W-FN    traverse(), getPresentState()  ←  F-memory/R3
//   W-FN    emitEvent()  ←  F-event-system/R3
// wires-out:
//   W-FN  encodeLLM()         →  F-codec/R3
//   W-FN  encodeMechanical()  →  F-codec/R3
// deps:
//   R0  ../config/codec-types
//   R0  ../config/codec-events
//   R1  ../domain/codec-classify
//   R1  ../domain/codec-label
//   R3  ../contract/codec-inject
// validated:  pending
//
// phase-b-item1 (A2, T1.1):
//   classifyAndLabel() import moved from R4 (codec-ai-io) to R3 (codec-inject).
//   R2 no longer imports R4 directly. T1.1: "R4: Never directly imported."
//   Axiom cite: A2 — directional deps, lower layers only.

// R2: orchestration. No I/O of its own — delegates to R4 for LLM, F-memory/R3 for graph.
// Two encode modes: LLM (conversation) and Mechanical (system events).
// CA1: intent → state → delta. Each encode produces exactly one primitive cycle.

import type { Result } from '@/core/types/primitives'
import type { EncodeResult, CognitivePrimitive, MutatingPrimitive } from '../config/codec-types'
import { CODEC_CONFIG, MECHANICAL_MAPPINGS } from '../config/codec-types'
import { CODEC_EVENTS } from '../config/codec-events'
import { buildClassifyPrompt, parseClassifyResponse } from '../domain/codec-classify'
import { normalizeLabel, parseLabelResponse } from '../domain/codec-label'
import { classifyAndLabel } from '../contract/codec-inject'
import { traverse, getPresentState } from '@/features/F-memory/contract/memory-contract'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

// ─── Encode LLM (Conversation) ───────────────────────────────────────────────
// The conversation encode pipeline. Single LLM call for classify + label.
// CA5: primitive determined from content + graph state.
//
// Pipeline:
// 1. getPresentState(userId) — graph context for classification
// 2. buildClassifyPrompt(content, presentState) — R1 builds prompt
// 3. classifyAndLabel(prompt) — R4 makes LLM call
// 4. parseClassifyResponse(raw) — R1 parses classify + label
// 5. If Reference: return immediately, no graph mutation
// 6. traverse(label, userId, { primitiveType }) — F-memory executes
// 7. Emit codec.encode-complete
//
// Fallbacks:
// - Classify failure → default to 'anchor' (safest — creates new structure)
// - Label failure → normalizeLabel(content.slice(0, 100))

export async function encodeLLM(
  content: string,
  userId:  string,
): Promise<Result<EncodeResult>> {
  try {
    // 1. Get present state — graph context for classification
    const presentState = getPresentState(userId)

    // 2. Build prompt — single call for classify + label (R1)
    const prompt = buildClassifyPrompt(content, presentState)

    // 3. Call LLM (R4)
    const llmResult = await classifyAndLabel(prompt, CODEC_CONFIG.CLASSIFY_MODEL)
    if (!llmResult.ok) {
      // LLM call failed — fallback to anchor with content-derived label
      console.error('[F-codec] LLM call failed:', llmResult.error)
      return buildFallbackAnchor(content, userId)
    }

    // 4. Parse classify + label response (R1)
    const parsed = parseClassifyResponse(llmResult.data)
    if (!parsed) {
      // Parse failure — fallback to anchor
      console.error('[F-codec] classify parse failed, raw:', llmResult.data)
      return buildFallbackAnchor(content, userId)
    }

    const { primitive, label: rawLabel } = parsed

    // 5. Reference — read-only, no graph mutation
    if (primitive === 'reference') {
      await emitEncodeComplete(primitive, null, userId, 'llm')
      return {
        ok: true,
        data: {
          primitive:     'reference',
          label:         null,
          boundToNodeId: null,
          userId,
          source:        'llm',
        },
      }
    }

    // 6. Parse and normalize label
    const label = parseLabelResponse(rawLabel)
      ?? normalizeLabel(content.slice(0, CODEC_CONFIG.LABEL_MAX_LENGTH))

    // 7. Execute traversal — F-memory handles graph mutation
    // A2: F-codec tells F-memory what primitive. F-memory executes without knowing why.
    const traversalResult = await traverse(
      label,
      userId,
      { primitiveType: primitive as MutatingPrimitive, returnActivation: true },
    )

    // Extract boundToNodeId from traversal result if available
    const boundToNodeId = traversalResult.ok && traversalResult.data
      ? traversalResult.data.topNodes[0]?.nodeId ?? null
      : null

    // 8. Emit encode-complete event
    await emitEncodeComplete(primitive, label, userId, 'llm')

    return {
      ok: true,
      data: {
        primitive,
        label,
        boundToNodeId,
        userId,
        source: 'llm',
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[F-codec] encodeLLM error:', message)
    await emitEncodeFailed(userId, 'llm', message)
    return { ok: false, error: { code: 'ENCODE_LLM_FAILED', message } }
  }
}

// ─── Encode Mechanical (System Events) ────────────────────────────────────────
// Structured data with known primitive mappings. No LLM needed.
// CA5: observable transition from structured event data.
//
// Pipeline:
// 1. Look up primitive from MECHANICAL_MAPPINGS
// 2. Extract label from payload
// 3. Normalize label
// 4. traverse(label, userId, { primitiveType })
// 5. Emit codec.encode-complete

export async function encodeMechanical(
  eventType: string,
  payload:   Record<string, unknown>,
  userId:    string,
): Promise<Result<EncodeResult>> {
  try {
    // 1. Look up primitive — known mapping
    const primitive = MECHANICAL_MAPPINGS[eventType]
    if (!primitive) {
      return { ok: false, error: { code: 'ENCODE_UNKNOWN_EVENT', message: `unknown event type: ${eventType}` } }
    }

    // 2. Extract label from payload — use most identifying field
    const rawLabel = extractMechanicalLabel(eventType, payload)

    // 3. Normalize
    const label = normalizeLabel(rawLabel)
    if (!label) {
      return { ok: false, error: { code: 'ENCODE_EMPTY_LABEL', message: `empty label from event: ${eventType}` } }
    }

    // 4. Execute traversal — same graph mutation path as LLM encode
    const traversalResult = await traverse(
      label,
      userId,
      { primitiveType: primitive },
    )

    const boundToNodeId = traversalResult.ok && traversalResult.data
      ? traversalResult.data.topNodes[0]?.nodeId ?? null
      : null

    // 5. Emit encode-complete
    await emitEncodeComplete(primitive, label, userId, 'mechanical')

    return {
      ok: true,
      data: {
        primitive,
        label,
        boundToNodeId,
        userId,
        source: 'mechanical',
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[F-codec] encodeMechanical error:', message)
    await emitEncodeFailed(userId, 'mechanical', message)
    return { ok: false, error: { code: 'ENCODE_MECHANICAL_FAILED', message } }
  }
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function extractMechanicalLabel(
  eventType: string,
  payload:   Record<string, unknown>,
): string {
  // Pipeline events: use jobId + stage for specificity
  // Stage events: use stage name as primary label
  const stage = typeof payload.stage === 'string' ? payload.stage : null
  const jobId = typeof payload.jobId === 'string' ? payload.jobId : null

  if (eventType.startsWith('stage.') && stage) {
    return stage
  }

  if (jobId && stage) {
    return `${stage}-${jobId.slice(0, 8)}`
  }

  if (jobId) {
    return `pipeline-${jobId.slice(0, 8)}`
  }

  // Fallback — event type itself
  return eventType.replace(/\./g, '-')
}

async function buildFallbackAnchor(
  content: string,
  userId:  string,
): Promise<Result<EncodeResult>> {
  // Fallback: anchor with content-derived label. Safest default — creates new structure.
  // An anchor that doesn't execute isn't an anchor. Call traverse.
  const label = normalizeLabel(content.slice(0, CODEC_CONFIG.LABEL_MAX_LENGTH)) || 'unknown'

  const traversalResult = await traverse(
    label,
    userId,
    { primitiveType: 'anchor' as MutatingPrimitive, returnActivation: true },
  )

  if (!traversalResult.ok) {
    return { ok: false, error: { code: 'ENCODE_FALLBACK_TRAVERSE_FAILED', message: traversalResult.error.message } }
  }

  const boundToNodeId = traversalResult.data
    ? traversalResult.data.topNodes[0]?.nodeId ?? null
    : null

  await emitEncodeComplete('anchor', label, userId, 'llm')

  return {
    ok: true,
    data: {
      primitive:     'anchor',
      label,
      boundToNodeId,
      userId,
      source:        'llm',
    },
  }
}

async function emitEncodeComplete(
  primitive: CognitivePrimitive,
  label:     string | null,
  userId:    string,
  source:    'llm' | 'mechanical',
): Promise<void> {
  await emitEvent({
    type:    CODEC_EVENTS.ENCODE_COMPLETE,
    payload: { primitive, label, userId, source },
    slice:   'F-codec',
  })
}

async function emitEncodeFailed(
  userId: string,
  source: 'llm' | 'mechanical',
  reason: string,
): Promise<void> {
  await emitEvent({
    type:    CODEC_EVENTS.ENCODE_FAILED,
    payload: { userId, source, reason },
    slice:   'F-codec',
  })
}
