// @liv-standard v1.5.1
// [F-discover/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-5-rs (slice introduction)
// slice:      F-discover
// layer:      R3
// wires-in:
//   W-FN     executeResearch                ←  F-discover/R2 execute-research
//   W-FN     loadResearchBinding            ←  F-discover/R4 discover-binding-loader
//   W-FN     createArtifact                 ←  F-artifact/R3 artifact-contract
//   W-FN     createArtifactGraphPort        ←  F-artifact/R3 artifact-graph-port (relocated from F-memory at Sprint 8 Shot 3b)
//   W-ATOM   ResearchExecuteInput,
//            ResearchEmissionResult,
//            FrameworkModule,
//            ModuleExecutor                 ←  F-discover/R0 + F-codec/R0
// wires-out:
//   W-ATOM   DISCOVER_FRAMEWORK_MODULE       →  F-codec/R2 codec-orchestrate (registry, registered in Shot 2)
//   W-FN     executeResearchFromInput        →  F-discover external callers
//   W-ATOM   discoverRouter                  →  F-app api/router (tRPC, placeholder at v1.0)
// deps:
//   R0 ../config/f-discover-types
//   R2 ../app/execute-research
//   R4 ../exec/discover-binding-loader
//   R3 ../../F-artifact/contract/artifact-contract
//   R3 ../../F-artifact/contract/artifact-graph-port
//   R0 ../../F-codec/config/codec-module-types
// validated:  pending
//
// F-discover R3 — public boundary.
//
// A5: cross-slice calls enter here only. R2 and R1 are slice-internal.
//
// Three exports:
//   1. executeResearchFromInput — direct programmatic entry (preferred).
//      Takes ResearchExecuteInput, returns ResearchEmissionResult.
//   2. DISCOVER_FRAMEWORK_MODULE — codec-orchestrate registry registration.
//      id = 'liv-discovery' (per Sprint 5 D-RS-MODULE-ID decision: 'discovery'
//      module-id retained by codec-discovery.ts as 'narrative-discovery' in
//      Shot 2). Mirror of Sprint 4 D5 codec-verify rename.
//      Executor stub: codec routes epistemic-mode user messages to
//      narrative-discovery (LLM-backed); F-discover is reachable only via
//      programmatic invocation (executeResearchFromInput) at v1.0.
//   3. discoverRouter — tRPC router (placeholder at v1.0; programmatic surface
//      is the active path for first emission per Sprint 5 close criteria).

import type {
  ResearchExecuteInput,
  ResearchEmissionResult,
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '../config/f-discover-types'
// sprint-8-shot-3a: F-codec dissolved.
//   FrameworkModule + ModuleExecutor imports removed; DISCOVER_FRAMEWORK_MODULE
//   and livDiscoveryStubExecutor exports removed (codec registry no longer exists).
//   F-discover remains reachable programmatically via executeResearchFromInput
//   (the Research Standard authoring program path). Sprint 9 wires F-router
//   rules pointing epistemic-mode messages at this entry point directly.
import { executeResearch } from '../app/execute-research'
import type { DiscoverServiceContainer, ArtifactGraphPort } from '../app/execute-research'
import { createArtifact } from '@/features/F-artifact/contract/artifact-contract'
import { createArtifactGraphPort } from '@/features/F-artifact/contract/artifact-graph-port'
import type { EpochMs } from '../config/f-discover-types'

// ─── Default service container (real wiring) ─────────────────────────────────

/**
 * Default service container — wires F-artifact real implementations.
 * Test paths construct alternate containers (in-memory port, fake clock).
 *
 * Mirrors F-verify/contract/verify-contract.ts defaultServices() pattern.
 */
function defaultServices(): DiscoverServiceContainer {
  return {
    createArtifact: async (input: CreateArtifactInput, port: ArtifactGraphPort) => {
      // Cast through unknown: F-artifact's CreateArtifactResult shape matches
      // DiscoverServiceContainer.createArtifact return shape structurally.
      const result = await createArtifact(
        input as unknown as Parameters<typeof createArtifact>[0],
        port  as unknown as Parameters<typeof createArtifact>[1],
      )
      if (result.ok) {
        return { ok: true, data: result.data as unknown as ArtifactEmission }
      }
      return {
        ok: false,
        error: {
          code:    result.error.code,
          message: result.error.message,
          context: result.error.context as Record<string, unknown> | undefined,
        },
      }
    },
    createArtifactGraphPort: () => createArtifactGraphPort() as unknown as ArtifactGraphPort,
    epochNow: () => Date.now() as unknown as EpochMs,
  }
}

// ─── executeResearchFromInput — primary programmatic entry ───────────────────

/**
 * Direct programmatic entry point for RS emission.
 * Callers (F-discover-internal admin, framework-audit runtime probes,
 * future research-authoring-programs) construct ResearchExecuteInput and
 * invoke this. Returns ResearchEmissionResult with success → ArtifactEmission
 * containing the researchAnchorNodeId at writes.a7.artifactAnchorNodeId.
 */
export async function executeResearchFromInput(
  input: ResearchExecuteInput,
): Promise<ResearchEmissionResult> {
  return executeResearch(input, defaultServices())
}

/**
 * Allow callers to inject a custom service container (test paths, alternate
 * graph backends, deterministic clock).
 */
export async function executeResearchFromInputWithServices(
  input:    ResearchExecuteInput,
  services: DiscoverServiceContainer,
): Promise<ResearchEmissionResult> {
  return executeResearch(input, services)
}

// sprint-8-shot-3a: DISCOVER_FRAMEWORK_MODULE + livDiscoveryStubExecutor
// removed (F-codec dissolved). F-discover is reached programmatically via
// executeResearchFromInput. Sprint 9 wires F-router rules pointing
// epistemic-mode messages at this entry point directly.

// ─── discoverRouter — tRPC placeholder at v1.0 ───────────────────────────────
//
// At Sprint 5 close, programmatic invocation is the active path. The tRPC
// surface is declared as a placeholder for HTTP-bound consumers (admin probes,
// future client-side audit triggers). When the first HTTP-bound caller lands,
// this slot is filled with a real tRPC router (mirroring
// F-verify/contract/verify-contract verifyRouter).

export const discoverRouter = {
  // Placeholder. Populated when first HTTP consumer lands.
  __sprint_5_status: 'programmatic-only',
} as const

// ─── Type re-exports — consumers can pull everything from R3 ─────────────────

export type {
  ResearchExecuteInput,
  ResearchEmissionResult,
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '../config/f-discover-types'

// ─── End of discover-contract.ts ────────────────────────────────────────────
