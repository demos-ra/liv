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
//   W-ATOM  Declaration, DeclId, DomainBinding,
//           PlanArtifactContent, InstanceResult,
//           InstanceError, ErrorClass, TypedAtom        ←  F-multi-instance/R0 mi-types
//   W-INJECT AIAdapterPort                              ←  F-multi-instance/R2 (port interface)
// wires-out:  consumed by F-multi-instance/R2 mi-execute
// deps:
//   R0  ../types/mi-types
// validated:  pending
//
// F-multi-instance R2 — per-declaration instance invocation.
//
// Per §3.3 role invocation:
//   - Resolve role class via plan.intent[declId].role → binding.roleClasses[role].
//   - Compose input payload using validated predecessor outputs (dataFlow edges).
//   - Invoke via AI adapter port (LLM roles) or engine-native routine.
//   - Capture output, token count, duration, retries.
//   - On error, populate InstanceError with class + reason + resolution.
//
// IA6 compliance: every call goes through binding.* or engine-native. Adapter
// invocation is threaded through AIAdapterPort (W-INJECT); no module-global
// adapter reach-around.

import type {
  Declaration,
  DeclId,
  DomainBinding,
  PlanArtifactContent,
  InstanceResult,
  InstanceError,
  TypedAtom,
} from '../types/mi-types'

// ─── Port interface (R4 runtime dependency surface) ──────────────────────────

/**
 * R4 runtime dependency surface for F-multi-instance.
 *
 * Adapter invocation is framed as a port; concrete impl (F-ai-adapter R3
 * streamAIResponse) is wired in at slice boundary per A5.
 *
 * validateContract is injected as a resolvable function keyed by the binding's
 * contractRef string. The port owns the contractRef → function mapping.
 */
export type AIAdapterPort = {
  /** Per-role LLM invocation. Returns the produced atom and token accounting. */
  invokeRole: (args: {
    declId:       DeclId
    role:         string
    inputPayload: unknown
    tierBudget:   { budget: number; unit: string }
  }) => Promise<{
    output:       TypedAtom
    tokenCount:   number
    durationMs:   number
  }>

  /** Resolve validateContract.contractRef to a validation function. */
  resolveValidateContract: (contractRef: string) => (args: {
    declId: DeclId
    output: TypedAtom
  }) => boolean
}

// ─── Input composition ───────────────────────────────────────────────────────

/**
 * Compose the input payload for one declaration from its dataFlow edges.
 * Inputs that are not yet satisfied return undefined — caller should not
 * dispatch in that case. Pure; does not walk beyond declared edges.
 */
export function composeInstanceInput(
  decl:               Declaration,
  outputsByDecl:      Map<DeclId, TypedAtom>,
): unknown {
  const inputs: Record<string, unknown> = {}
  for (const edge of decl.dataFlow) {
    const upstream = outputsByDecl.get(edge.from)
    if (upstream === undefined) return undefined
    inputs[String(edge.from)] = upstream.value
  }
  return inputs
}

// ─── Error helpers ───────────────────────────────────────────────────────────

function capacityBreachError(message: string): InstanceError {
  return {
    class:      'CLASS_2',
    reason:     'capacity-breach:tier-budget-exceeded',
    message,
    resolution: 'retried',
  }
}

function validateFailError(message: string): InstanceError {
  return {
    class:      'CLASS_2',
    reason:     'validate-contract-failed',
    message,
    resolution: 'terminal',
  }
}

function adapterFailError(message: string): InstanceError {
  return {
    class:      'CLASS_3',
    reason:     'adapter-invocation-failed',
    message,
    resolution: 'terminal',
  }
}

// ─── Instance runner ─────────────────────────────────────────────────────────

export type RunInstanceResult = {
  result:     InstanceResult
  validated:  boolean                    // feeds G-MI3 validationByDecl
  breached:   boolean                    // feeds G-MI7b breachesByDecl
}

/**
 * Run one declaration to terminal state.
 *
 * Contract:
 *   - Resolves role class per intent; caller guarantees plan.intent[declId] exists.
 *   - Pulls tier budget from binding.tierLimits[intent.tierHint].
 *   - Invokes port.invokeRole; on success, applies port validateContract.
 *   - Returns RunInstanceResult with the terminal InstanceResult + observability flags.
 *
 * Retry handling is NOT inside this function — the mi-execute dispatcher owns
 * retry budgets and reinvokes on CLASS_2 + retry budget available.
 */
export async function runInstance(
  decl:             Declaration,
  plan:             PlanArtifactContent,
  binding:          DomainBinding,
  outputsByDecl:    Map<DeclId, TypedAtom>,
  port:             AIAdapterPort,
): Promise<RunInstanceResult> {
  const entry = plan.intent[String(decl.id)]
  if (!entry) {
    return {
      result: {
        declId:     decl.id,
        status:     'failed',
        tokenCount: 0,
        durationMs: 0,
        retries:    0,
        errors:     [adapterFailError(`no intent entry for declId=${decl.id}`)],
      },
      validated: false,
      breached:  false,
    }
  }

  const tierBudget = binding.tierLimits[String(entry.tierHint)]
  if (!tierBudget) {
    return {
      result: {
        declId:     decl.id,
        status:     'failed',
        tokenCount: 0,
        durationMs: 0,
        retries:    0,
        errors:     [adapterFailError(`no tier budget for tierHint=${entry.tierHint}`)],
      },
      validated: false,
      breached:  false,
    }
  }

  const inputPayload = composeInstanceInput(decl, outputsByDecl)
  if (inputPayload === undefined) {
    return {
      result: {
        declId:     decl.id,
        status:     'failed',
        tokenCount: 0,
        durationMs: 0,
        retries:    0,
        errors:     [adapterFailError('dataFlow predecessors not yet satisfied')],
      },
      validated: false,
      breached:  false,
    }
  }

  try {
    const invocation = await port.invokeRole({
      declId:       decl.id,
      role:         String(entry.role),
      inputPayload,
      tierBudget,
    })

    // Capacity breach check: any tier overage surfaces as CLASS_2 + retry signal.
    const breached = invocation.tokenCount > tierBudget.budget

    // validateContract per binding
    const validate = port.resolveValidateContract(binding.validateContract.contractRef)
    const validated = validate({ declId: decl.id, output: invocation.output })

    if (!validated) {
      return {
        result: {
          declId:     decl.id,
          status:     'failed',
          output:     invocation.output,
          tokenCount: invocation.tokenCount,
          durationMs: invocation.durationMs,
          retries:    0,
          errors:     [validateFailError('validateContract returned false')],
        },
        validated: false,
        breached,
      }
    }

    return {
      result: {
        declId:     decl.id,
        status:     'complete',
        output:     invocation.output,
        tokenCount: invocation.tokenCount,
        durationMs: invocation.durationMs,
        retries:    0,
        errors:     breached ? [capacityBreachError(`tokenCount=${invocation.tokenCount} > budget=${tierBudget.budget}`)] : [],
      },
      validated,
      breached,
    }
  } catch (err) {
    return {
      result: {
        declId:     decl.id,
        status:     'failed',
        tokenCount: 0,
        durationMs: 0,
        retries:    0,
        errors:     [adapterFailError(err instanceof Error ? err.message : String(err))],
      },
      validated: false,
      breached:  false,
    }
  }
}
