// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    cog-v1.2.1-port-adapter, cog-v1.3-symmetry
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  CognitivePrimitive    ←  F-codec/R0 (codec-types)
//   W-ATOM  CODEC_CONFIG          ←  F-codec/R0 (codec-types)
//   W-ATOM  NodeId                ←  core/R5 (primitives)
//   W-ATOM  RunReportContent      ←  F-multi-instance/R3 (mi-contract)
//   W-ATOM  CognitiveClassificationPort  ←  F-multi-instance/R3 (mi-contract)
//   W-FN    encodeLLM()           ←  F-codec/R2 (codec-encode)
//   W-FN    generateId()          ←  core/R5 (primitives)
// wires-out:
//   W-FN    classifyRunReport()   →  F-codec/R3 (codec-contract)
// deps:
//   R5  @/core/types/primitives
//   R3  ../../F-multi-instance/contract/mi-contract
//   R0  ../config/codec-types
//   R2  ./codec-encode
// validated:  pending

// R2: orchestration adapter. Implements the M-I CognitiveClassificationPort
// shape by wiring encodeLLM -> port return contract.
//
// Cognitive Standard v1.2.1 §7.1 J-classify: A-direction encode produces
// (primitive, label, boundToNodeId); port consumer (F-planner via M-I)
// requires (classificationNodeId, primitive, confidence). This adapter is
// the single mapping site.
//
// CA3 (Cognitive v1.2.1): deterministic-given-inputs + fallback discipline.
//   Success path: confidence = 1.0; classificationNodeId = boundToNodeId
//                 if non-null else minted synthetic NodeId.
//   Fallback path: primitive = 'anchor'; confidence = CODEC_CONFIG.FALLBACK_CONFIDENCE
//                  (= 0.0); classificationNodeId minted.
//
// File-placement Decision-D (Shot 3): new file rather than addition to
// codec-orchestrate.ts. Single Responsibility — orchestrate owns
// processMessage; adapter owns M-I port.

import type { CognitivePrimitive } from '../config/codec-types'
import { CODEC_CONFIG } from '../config/codec-types'
import type { NodeId } from '@/core/types/primitives'
import { generateId } from '@/core/types/primitives'
import type { RunReportContent } from '@/features/F-multi-instance/contract/mi-contract'
import { encodeLLM } from './codec-encode'

// ─── runReport → classify-content serialization ──────────────────────────────
// Decision-D (Shot 3, runReport serialization): canonical key:value newline
// list. Pure structural transform — deterministic across calls per CA3.
// JSON.stringify rejected (loses readability for classify-LLM prompt);
// typed-prose rejected (introduces per-field English-prose decisions that
// are not deterministic and not declared by spec).

function serializeRunReport(report: RunReportContent): string {
  const lines: string[] = []
  lines.push(`planId: ${report.planId}`)
  lines.push(`planAnchorNodeId: ${report.planAnchorNodeId}`)
  lines.push(`planVersion: ${report.planVersion}`)
  lines.push(`bindingDomainId: ${report.bindingDomainId}`)
  lines.push(`bindingDomainVersion: ${report.bindingDomainVersion}`)
  lines.push(`runId: ${report.runId}`)
  lines.push(`startedAt: ${report.startedAt}`)
  lines.push(`completedAt: ${report.completedAt}`)
  lines.push(`outcome: ${report.outcome}`)
  lines.push(`instanceResults: ${JSON.stringify(report.instanceResults)}`)
  lines.push(`setViolations: ${JSON.stringify(report.setViolations)}`)
  lines.push(`aggregation: ${JSON.stringify(report.aggregation)}`)
  return lines.join('\n')
}

// ─── classifyRunReport — M-I port adapter ────────────────────────────────────
// Implements CognitiveClassificationPort from F-multi-instance/R3.
// Port shape is fixed contract per HR-Cog3 (Cognitive v1.3 §6.2); adapter
// preserves shape exactly.

export async function classifyRunReport(args: {
  runReport: RunReportContent
  userId:    string
  runTurnId: string
}): Promise<{
  classificationNodeId: NodeId
  primitive:            CognitivePrimitive
  confidence:           number
}> {
  const { runReport, userId, runTurnId } = args

  // 1. Stringify runReport to natural-language content per Decision-D.
  const content = serializeRunReport(runReport)

  // 2. Invoke encodeLLM per F-codec/R2 default classify path.
  const encodeResult = await encodeLLM(content, userId)

  // 3. Fallback path — encodeLLM returned !ok.
  // Per V-S3.2 + CA3 fallback discipline: primitive='anchor',
  // confidence=CODEC_CONFIG.FALLBACK_CONFIDENCE.
  if (!encodeResult.ok) {
    return {
      classificationNodeId: generateId('cls') as NodeId,
      primitive:            'anchor',
      confidence:           CODEC_CONFIG.FALLBACK_CONFIDENCE,
    }
  }

  // 4. Success path. Map EncodeResult.boundToNodeId to classificationNodeId.
  // Per Decision-D (Shot 3, classificationNodeId minting): when boundToNodeId
  // is null (Reference primitive path or fallback-anchor with no bind target),
  // mint synthetic NodeId rather than re-traverse. Preserves port shape
  // (NodeId non-null) without duplicating encodeLLM's traverse work.
  const { primitive, boundToNodeId } = encodeResult.data
  const classificationNodeId = (boundToNodeId ?? generateId('cls')) as NodeId

  // 5. Confidence at port boundary is binary per spec §5.2 step 5:
  //    success → 1.0; failure → CODEC_CONFIG.FALLBACK_CONFIDENCE.
  //    Full LLM-self-reported ClassifyResult.confidence threading deferred
  //    to post-Sprint-3 backlog (requires R0 EncodeResult shape extension).
  //
  // runTurnId currently unused at adapter — port shape includes it for
  // forward extension (e.g., audit-trail correlation per Cognitive v1.2.1
  // §5.3); referenced via void to satisfy noUnusedParameters.
  void runTurnId

  return {
    classificationNodeId,
    primitive,
    confidence: 1.0,
  }
}
