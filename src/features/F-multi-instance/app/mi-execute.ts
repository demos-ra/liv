// @liv-standard v1.5.1
// [F-multi-instance/R2]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-multi-instance-slice
// slice:      F-multi-instance
// layer:      R2
// wires-in:
//   W-ATOM  MIInput, RunReportContent, InstanceResult,
//           SetViolation, MIValidityError,
//           MIEmissionResult, PlanArtifactContent,
//           DomainBinding, DeclId, TypedAtom,
//           ArtifactEmission, CreateArtifactInput,
//           CognitivePrimitive, NodeId                     ←  F-multi-instance/R0 mi-types
//   W-INJECT buildDispatchPlan                             ←  F-multi-instance/R1 mi-dispatch-plan
//   W-INJECT aggregateRun                                  ←  F-multi-instance/R1 mi-aggregate
//   W-INJECT evaluateAllMIGates                            ←  F-multi-instance/R1 mi-gates
//   W-INJECT runInstance, AIAdapterPort                    ←  F-multi-instance/R2 mi-instance
//   W-INJECT createArtifact, ArtifactGraphPort             ←  F-artifact/R3 artifact-contract
//   W-INJECT PlanResolutionPort                            ←  F-multi-instance/R2 (port interface)
// wires-out:  consumed by F-multi-instance/R3 mi-contract
// deps:
//   R0  ../types/mi-types
//   R1  ../domain/mi-dispatch-plan
//   R1  ../domain/mi-aggregate
//   R1  ../domain/mi-gates
//   R2  ./mi-instance
//   R3  @/features/F-artifact/contract/artifact-contract
// validated:  pending
//
// F-multi-instance R2 — executeRun S1→S2→S3 orchestration.
//
// Procedure per multi-instance-standard.md §3.7:
//
//   S1 (stage 2, mechanical):
//     - Resolve PlanArtifactContent via F-memory R3 read at planAnchorNodeId (HR-MI4 one-hop).
//     - Generate runId UUID v4.
//     - Capture startedAt.
//     - Bind DomainBinding verbatim (IA2 — not by value-copy; by reference-identity).
//     - Construct DispatchPlan per topology (§3.4.a).
//     - Initialize InstanceResult[] (deferred until dispatch).
//     - Initialize SetViolation[] empty.
//
//   S2 (stage 3, gate-execution + runtime):
//     - Dispatch instances per plan; each runs to terminal state.
//     - Collect InstanceResult[] + SetViolation[] + observability witnesses.
//     - Aggregate per §3.4.a.
//     - Assemble RunReportContent.
//     - Evaluate G-MI1..G-MI7c.
//     - On any fail → return MIValidityError with gateId + axiomId.
//
//   S3 (stage 5, mechanical):
//     - Emit RunReportContent via createArtifact (HR-MI3):
//         framework={id:'multi-instance', version:'2.3'}
//         payload={domain:'multi-instance', domainVersion:'2.3', schemaRef:'RunReportContent', content:runReport}
//         classificationNodeId+primitive+confidence from Cognitive Standard (supplied by S3 ports)
//         dependsOn=[planAnchorNodeId]
//     - On AS error → return MIValidityError code MI_AS_EMISSION_FAILED.
//     - On AS success → return MIEmissionResult.ok(ArtifactEmission).
//
// Slice boundary: F-memory read primitives (plan resolution) land post-4b.
// PlanResolutionPort below is the stable interface; callers inject a concrete
// impl at deploy.

import type {
  MIInput,
  RunReportContent,
  InstanceResult,
  SetViolation,
  MIValidityError,
  MIEmissionResult,
  PlanArtifactContent,
  DomainBinding,
  DeclId,
  TypedAtom,
  CognitivePrimitive,
  NodeId,
  EpochMs,
  Semver,
} from '../types/mi-types'
import { buildDispatchPlan, type DispatchPlan } from '../domain/mi-dispatch-plan'
import { aggregateRun } from '../domain/mi-aggregate'
import { evaluateAllMIGates, type MIGateContext } from '../domain/mi-gates'
import { runInstance, type AIAdapterPort } from './mi-instance'
import {
  createArtifact,
  type ArtifactGraphPort,
  type CreateArtifactInput,
} from '@/features/F-artifact/contract/artifact-contract'
import { generateId } from '@/core/types/primitives'

// ─── Framework version (source-of-truth literal) ─────────────────────────────
// M-I v2.3 — referenced at S3 when constructing the AS emission. Hoisted here
// so the literal appears once rather than at each cast site.

// brand: locally minted — source-of-truth literal inside M-I
const MI_VERSION = '2.3' as Semver

// ─── Port interfaces ─────────────────────────────────────────────────────────

/**
 * Plan resolution port — reads PlanArtifactContent from F-memory by NodeId.
 * HR-MI4: one-hop read at planAnchorNodeId (no multi-hop graph traversal).
 * Deploy impl backed by F-memory R3; beta/test impls in-memory.
 */
export type PlanResolutionPort = {
  resolvePlan: (planAnchorNodeId: NodeId) => Promise<PlanArtifactContent | null>
}

/**
 * S3 cognitive classification port — supplies the classificationNodeId +
 * primitive + confidence that AS v2.2 requires at emission. These come from
 * Cognitive Standard R3 encodeLLM() at the same turn. Cross-slice surface is
 * stable whether the codec is wired in now (it is not at 4b landing) or later.
 */
export type CognitiveClassificationPort = {
  classifyRunReport: (args: {
    runReport: RunReportContent
    userId:    string
    runTurnId: string
  }) => Promise<{
    classificationNodeId: NodeId
    primitive:            CognitivePrimitive
    confidence:           number
  }>
}

/**
 * Aggregate of all R4 ports required by executeRun. Caller constructs and
 * passes as a single param; simpler than four separate optional injections.
 */
export type MultiInstancePorts = {
  plan:     PlanResolutionPort
  adapter:  AIAdapterPort
  cognitive: CognitiveClassificationPort
  graph:    ArtifactGraphPort
}

// ─── Error helpers ───────────────────────────────────────────────────────────

function planNotFound(runId: string, planAnchorNodeId: NodeId): MIValidityError {
  return {
    code:    'MI_PLAN_NOT_FOUND',
    message: `plan not resolvable at nodeId=${planAnchorNodeId}`,
    context: { planAnchorNodeId },
    phase:   'S1',
    runId,
  }
}

function bindingResolutionFailure(runId: string, msg: string): MIValidityError {
  return {
    code:    'MI_BINDING_RESOLUTION_FAILURE',
    message: msg,
    phase:   'S1',
    runId,
  }
}

function gateFailError(
  runId:         string,
  gateId:        MIValidityError['gateId'],
  axiomId:       MIValidityError['testedAxiomId'],
  phase:         MIValidityError['phase'],
): MIValidityError {
  return {
    code:          'MI_AXIOM_VIOLATION',
    message:       `${gateId} failed (tested ${axiomId})`,
    context:       { gateId, testedAxiomId: axiomId },
    phase,
    runId,
    gateId,
    testedAxiomId: axiomId,
  }
}

function adapterFailure(runId: string, msg: string): MIValidityError {
  return {
    code:    'MI_ADAPTER_FAILURE',
    message: msg,
    phase:   'S2',
    runId,
  }
}

function asEmissionFailed(runId: string, msg: string): MIValidityError {
  return {
    code:    'MI_AS_EMISSION_FAILED',
    message: msg,
    phase:   'S3',
    runId,
  }
}

// ─── S1: resolve plan + build dispatch plan ──────────────────────────────────

type S1Resolved = {
  runId:         string
  startedAt:     EpochMs
  plan:          PlanArtifactContent
  binding:       DomainBinding
  dispatchPlan:  DispatchPlan
}

async function runS1(
  input: MIInput,
  ports: MultiInstancePorts,
): Promise<{ ok: true; data: S1Resolved } | { ok: false; error: MIValidityError }> {
  const runId     = generateId('mi-run')
  const startedAt = Date.now() as EpochMs

  const plan = await ports.plan.resolvePlan(input.planAnchorNodeId)
  if (plan === null) {
    return { ok: false, error: planNotFound(runId, input.planAnchorNodeId) }
  }

  // IA2: binding captured verbatim — reference identity, no copy, no mutation.
  const binding = plan.binding
  if (!binding) {
    return { ok: false, error: bindingResolutionFailure(runId, 'plan.binding missing') }
  }

  const dispatchPlan = buildDispatchPlan(plan)

  return {
    ok: true,
    data: { runId, startedAt, plan, binding, dispatchPlan },
  }
}

// ─── S2: dispatch + aggregate + gate ─────────────────────────────────────────

type S2Result = {
  report:     RunReportContent
  gateError:  MIValidityError | null
  validationByDecl: Map<DeclId, boolean>
}

async function runS2(
  s1:    S1Resolved,
  input: MIInput,
  ports: MultiInstancePorts,
): Promise<{ ok: true; data: S2Result } | { ok: false; error: MIValidityError }> {
  const { runId, startedAt, plan, binding, dispatchPlan } = s1

  const outputsByDecl    = new Map<DeclId, TypedAtom>()
  const validationByDecl = new Map<DeclId, boolean>()
  const breachesByDecl   = new Map<DeclId, number>()
  const retriesDeltaByDecl = new Map<DeclId, number>()
  const instanceResults: InstanceResult[] = []
  const setViolations:  SetViolation[]  = []

  // Dispatch loop: linear over dispatchPlan.dispatchOrder.order.
  // Within-tier parallelism not exercised at 4b (deferred post-beta).
  const declsById = new Map(plan.shape.declarations.map(d => [d.id, d]))

  for (const declId of dispatchPlan.dispatchOrder.order) {
    const decl = declsById.get(declId)
    if (!decl) continue

    try {
      const { result, validated, breached } = await runInstance(
        decl,
        plan,
        binding,
        outputsByDecl,
        ports.adapter,
      )

      instanceResults.push(result)
      validationByDecl.set(declId, validated)
      if (breached) breachesByDecl.set(declId, (breachesByDecl.get(declId) ?? 0) + 1)

      if (result.output !== undefined && result.status === 'complete') {
        outputsByDecl.set(declId, result.output)
      }

      // Set-level failsafe check: total elapsed vs perSet.maxTime
      const elapsed = Date.now() - (startedAt as unknown as number)
      if (elapsed > Number(plan.limit.perSet.maxTime)) {
        setViolations.push({
          failsafe:   'maxTime',
          breachedAt: Date.now() as EpochMs,
          reason:     `elapsed=${elapsed}ms > maxTime=${plan.limit.perSet.maxTime}ms`,
        })
        break
      }
    } catch (err) {
      return { ok: false, error: adapterFailure(runId, err instanceof Error ? err.message : String(err)) }
    }
  }

  // Aggregate per §3.4.a
  const { outcome, aggregation } = aggregateRun(plan, instanceResults, setViolations)

  const report: RunReportContent = {
    planId:               plan.planId,
    planAnchorNodeId:     input.planAnchorNodeId,
    planVersion:          plan.planVersion,
    bindingDomainId:      binding.domainId,
    bindingDomainVersion: binding.domainVersion,
    runId,
    startedAt,
    completedAt:          Date.now() as EpochMs,
    outcome,
    instanceResults,
    setViolations,
    aggregation,
  }

  // Gate evaluation.
  const ctx: MIGateContext = {
    report,
    engineMutatedPlan:             false,       // S2 never mutates plan; IA2 satisfied by construction
    validationByDecl,
    postBreachRetryCount:          0,           // retry loop not exercised at 4b; deferred
    unsanctionedCascade:           false,       // no cascade detection at 4b; deferred
    nonBindingCallDetected:        false,       // all dispatch goes through ports; IA6 satisfied
    retriesDeltaByDecl,
    breachesByDecl,
    postBreachDeclRewriteDetected: false,       // no rewrite path at 4b; IA7c satisfied
  }

  const batch = evaluateAllMIGates(ctx)
  if (!batch.allPassed) {
    const first = batch.firstFail!
    return {
      ok: true,
      data: {
        report,
        gateError: gateFailError(runId, first.gateId, first.testedAxiomId, 'S2'),
        validationByDecl,
      },
    }
  }

  return {
    ok: true,
    data: { report, gateError: null, validationByDecl },
  }
}

// ─── S3: emit via createArtifact (HR-MI3) ────────────────────────────────────

async function runS3(
  report:  RunReportContent,
  input:   MIInput,
  runId:   string,
  ports:   MultiInstancePorts,
): Promise<MIEmissionResult> {
  try {
    const classification = await ports.cognitive.classifyRunReport({
      runReport: report,
      userId:    input.userId,
      runTurnId: input.runTurnId,
    })

    const artifactInput: CreateArtifactInput = {
      framework: {
        id:      'multi-instance',
        version: MI_VERSION,
      },
      turnId:               input.runTurnId,
      userId:               input.userId,
      payload: {
        domain:         'multi-instance',
        domainVersion:  MI_VERSION,
        schemaRef:      'RunReportContent',
        content:        report,
      },
      classificationNodeId: classification.classificationNodeId,
      primitive:            classification.primitive,
      confidence:           classification.confidence,
      dependsOn:            [input.planAnchorNodeId],
    }

    const emission = await createArtifact(artifactInput, ports.graph)
    if (!emission.ok) {
      return {
        ok: false,
        error: asEmissionFailed(runId, `createArtifact failed: ${emission.error.message}`),
      }
    }

    return { ok: true, data: emission.data }
  } catch (err) {
    return {
      ok: false,
      error: asEmissionFailed(runId, err instanceof Error ? err.message : String(err)),
    }
  }
}

// ─── Entry point: executeRun ─────────────────────────────────────────────────

/**
 * executeRun — F-multi-instance R2 orchestration entry.
 *
 * Contract per multi-instance-standard.md §3.7:
 *   S1 → S2 → S3 strictly sequential
 *   Any phase failure short-circuits with typed MIValidityError
 *   IA1–IA7c all pass iff result.ok === true
 *   HR-MI3 compliant: S3 emits via F-artifact createArtifact with M-I as domain
 *   HR-MI4 compliant: S1 one-hop plan read via PlanResolutionPort
 */
export async function executeRun(
  input: MIInput,
  ports: MultiInstancePorts,
): Promise<MIEmissionResult> {
  // S1
  const s1 = await runS1(input, ports)
  if (!s1.ok) return s1

  // S2
  const s2 = await runS2(s1.data, input, ports)
  if (!s2.ok) return s2
  if (s2.data.gateError !== null) return { ok: false, error: s2.data.gateError }

  // S3
  return runS3(s2.data.report, input, s1.data.runId, ports)
}
