// [F-state-registry/R1/C2] State namespace enforcement
// R1: depends on R0 only.
// Pure functions. No I/O. No side effects.
// Validates that writes respect namespace ownership.

import type { FSlice, StateViolation } from '@/core/types/primitives'
import { NAMESPACE_OWNER, STATE_NAMESPACES } from '@/core/types/state-registry'

// ─── Core enforcement ─────────────────────────────────────────────────────────

/**
 * Validates that a slice is allowed to write to a given namespace key.
 * Returns a violation if the write is illegal, null if allowed.
 */
export function checkWrite(
  slice: FSlice,
  namespace: string,
  key: string
): StateViolation | null {
  const owner = NAMESPACE_OWNER[namespace]

  if (!owner) {
    // Writing to undeclared namespace — always a violation
    return { slice, namespace: slice, key: `undeclared:${namespace}.${key}` }
  }

  if (owner !== slice) {
    return { slice, namespace: owner, key }
  }

  return null
}

/**
 * Validates a batch of writes.
 * Returns all violations found.
 */
export function checkWrites(
  slice: FSlice,
  writes: Array<{ namespace: string; key: string }>
): StateViolation[] {
  return writes
    .map(({ namespace, key }) => checkWrite(slice, namespace, key))
    .filter((v): v is StateViolation => v !== null)
}

/**
 * Returns all namespace keys a slice is allowed to write to.
 */
export function ownedNamespace(slice: FSlice): string {
  return STATE_NAMESPACES[slice]
}

/**
 * Returns true if the slice owns the namespace.
 */
export function ownsNamespace(slice: FSlice, namespace: string): boolean {
  return STATE_NAMESPACES[slice] === namespace
}

// ─── State shape builder ──────────────────────────────────────────────────────
// Builds a typed initial state tree from namespace declarations.
// Each slice's runtime state is scoped to its declared namespace.

export function buildInitialState<T extends Record<FSlice, unknown>>(
  sliceStates: Partial<T>
): Record<string, unknown> {
  const state: Record<string, unknown> = {}

  for (const [slice, sliceState] of Object.entries(sliceStates)) {
    const ns = STATE_NAMESPACES[slice as FSlice]
    if (ns) {
      state[ns] = sliceState
    }
  }

  return state
}
