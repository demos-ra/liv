// @liv-standard v1.5
// [F-codec/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.5-mode-classify
// slice:      F-codec
// layer:      R1
// wires-in:
//   W-ATOM  EncodeResult       F-codec/R0
//   W-ATOM  FrameworkMode      F-codec/R0
//   W-ATOM  PresentState       F-memory/R0
//   W-ATOM  MemArm             F-memory/R0
// wires-out:
//   W-INJECT  classifyMode()  → F-codec/R2 (codec-orchestrate)
// deps:
//   R0  ../config/codec-types
//   R0  ../config/codec-module-types
//   R0  ../../F-memory/config/memory-types
// validated:  pending

// Phase 6.5 — mode classification.
// R1: pure function. No I/O, no side effects. Deterministic.
// Two-tier classification: graph-topological first, bootstrap heuristic second.
// Only returns a mode if the registry has a module for it — prevents
// classifying into a mode that has no handler.

import type { EncodeResult } from '../config/codec-types'
import type { FrameworkMode } from '../config/codec-module-types'
import type { PresentState, MemArm } from '@/features/F-memory/config/memory-types'

// ─── Mode Signals (Bootstrap Heuristic) ──────────────────────────────────────
// Keyword signals per mode. Training wheels — as the graph densifies,
// Tier 1 (arm membership) becomes the primary classification path.

const MODE_SIGNALS: Record<FrameworkMode, readonly string[]> = {
  generative:   ['build', 'create', 'make', 'implement', 'deploy', 'compile', 'bundle',
                 'pipeline', 'construct'],
  epistemic:    ['research', 'discover', 'explore', 'investigate', 'understand', 'learn',
                 'find out', 'what is', 'how does', 'analyze'],
  structural:   ['plan', 'design', 'organize', 'structure', 'outline', 'architect',
                 'sequence', 'roadmap', 'strategy'],
  verificative: ['verify', 'audit', 'check', 'validate', 'test', 'review', 'confirm',
                 'inspect'],
} as const

// Node keys for global graph mode nodes (seeded by 6.1).
const MODE_NODE_KEYS: readonly string[] = [
  'mode-epistemic',
  'mode-structural',
  'mode-generative',
  'mode-verificative',
] as const

// ─── Registry Interface ──────────────────────────────────────────────────────
// R1 functions are pure — they don't import R2 modules.
// The R2 orchestrator passes the registry in as this interface.

type RegistryCheck = {
  hasModule: (mode: FrameworkMode) => boolean
}

// ─── classifyMode ─────────────────────────────────────────────────────────────
// Determines which framework mode the input belongs to.
// Returns the mode if a module is registered for it, null otherwise.
//
// Tier 1: Graph-topological — which arm did bind land in? Does that arm
//         connect to a mode node in the global graph?
// Tier 2: Bootstrap heuristic — keyword signals in label/content.
// Tier 3: No match → null (conversational fallback).

export function classifyMode(
  encodeResult: EncodeResult,
  _presentState: PresentState,
  arms: MemArm[],
  registry: RegistryCheck,
  originalContent?: string,
): FrameworkMode | null {
  // Tier 1 — Arm membership (graph-topological)
  // If bound to an existing node, check if its arm connects to a mode node.
  if (encodeResult.boundToNodeId !== null) {
    for (const arm of arms) {
      if (!arm.nodeIds.includes(encodeResult.boundToNodeId)) continue

      // Check if any node in this arm is a mode node (seeded by 6.1)
      const modeFromArm = detectModeFromArm(arm, registry)
      if (modeFromArm !== null) return modeFromArm

      // Arm matched but doesn't connect to a mode node — fall through to Tier 2
      break
    }
  }

  // Tier 2 — Bootstrap heuristic (keyword signals)
  const modeFromSignals = detectModeFromSignals(encodeResult, registry, originalContent)
  if (modeFromSignals !== null) return modeFromSignals

  // Tier 3 — No match
  return null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Check if an arm contains a mode node (nodeId matching a MODE_NODE_KEY).
 * Returns the mode if found and registered, null otherwise.
 */
function detectModeFromArm(
  arm: MemArm,
  registry: RegistryCheck,
): FrameworkMode | null {
  for (const nodeId of arm.nodeIds) {
    const mode = modeFromNodeId(nodeId)
    if (mode !== null && registry.hasModule(mode)) return mode
  }

  // Also check arm label for mode signals (same keyword approach)
  if (arm.label !== null) {
    const mode = matchSignals(arm.label, registry)
    if (mode !== null) return mode
  }

  return null
}

/**
 * Extract mode from a node ID if it matches the mode-{name} pattern.
 * Returns null if the node ID is not a mode node.
 */
function modeFromNodeId(nodeId: string): FrameworkMode | null {
  // Mode node IDs follow the pattern: 'mode-{modeName}' or contain it as content
  // Check against known mode node keys
  for (const key of MODE_NODE_KEYS) {
    if (nodeId === key || nodeId.endsWith(key)) {
      const modeName = key.replace('mode-', '') as FrameworkMode
      return modeName
    }
  }
  return null
}

/**
 * Check encoded label and original content against mode signals.
 * Returns the first matching mode that has a registered module.
 */
function detectModeFromSignals(
  encodeResult: EncodeResult,
  registry: RegistryCheck,
  originalContent?: string,
): FrameworkMode | null {
  // Check label first (normalized, higher signal)
  if (encodeResult.label !== null) {
    const mode = matchSignals(encodeResult.label, registry)
    if (mode !== null) return mode
  }

  // Fallback: check original content (brief: "encoded label and original content")
  if (originalContent) {
    const mode = matchSignals(originalContent, registry)
    if (mode !== null) return mode
  }

  return null
}

/**
 * Match text against MODE_SIGNALS. Returns the first mode whose signal
 * matches and whose module is registered. Null if no match.
 */
function matchSignals(
  text: string,
  registry: RegistryCheck,
): FrameworkMode | null {
  const lower = text.toLowerCase()

  for (const [mode, signals] of Object.entries(MODE_SIGNALS) as [FrameworkMode, readonly string[]][]) {
    for (const signal of signals) {
      if (lower.includes(signal) && registry.hasModule(mode)) {
        return mode
      }
    }
  }

  return null
}
