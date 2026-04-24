// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.4-module-registry, 4b-discovery-unregister
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  FrameworkMode, FrameworkModule  F-codec/R0
// wires-out:
//   W-INJECT  registerModule         → F-codec/R2 (codec-orchestrate, startup)
//   W-INJECT  unregisterModule       → F-codec/R2 (codec-orchestrate, teardown / reload)
//   W-INJECT  clearRegistry          → F-codec/R2 (tests / full reset)
//   W-INJECT  getModule              → F-codec/R2 (codec-orchestrate, routing)
//   W-INJECT  getRegisteredModules   → F-codec/R2 (decode, dashboard)
//   W-INJECT  hasModule              → F-codec/R2 (routing)
// deps:
//   R0  ../config/codec-module-types
// validated:  pending

// Phase 6.4 — framework module registry.
// R2: orchestration. Runtime Map indexed by mode.
// 1:1 mapping: one module per mode. Last-write-wins on same mode.
// Populated at startup via registerModule(). Read by routing via getModule().
//
// Phase 4b — symmetric deregistration (4b-discovery-unregister):
//   Every register operation has a matching unregister path (directional
//   symmetry — every A-direction function has its B-direction counterpart).
//   Discovery was flagged in Phase 4b scope as the canonical case requiring
//   deletability (A7), but the registry itself gets the symmetric pair so
//   any module can be hot-reloaded or torn down.
//
//   Register path:   registerModule(module)         — mode → module
//   Unregister path: unregisterModule(mode)         — mode ↦ ⊥  (returns true iff a module existed)
//   Reset path:      clearRegistry()                — full wipe; test + reload only

import type { FrameworkMode, FrameworkModule } from '../config/codec-module-types'

// ── Module-level registry ──────────────────────────────────────────────────
// Not exported directly — accessed through functions only.

const registry = new Map<FrameworkMode, FrameworkModule>()

// ── registerModule ─────────────────────────────────────────────────────────
// Called at startup for each known module. Idempotent by mode (last-write-wins).

export function registerModule(module: FrameworkModule): void {
  registry.set(module.mode, module)
}

// ── unregisterModule ───────────────────────────────────────────────────────
// Symmetric counterpart to registerModule. Returns true iff a module existed
// for the given mode (and was removed); false if no-op.
//
// Contract:
//   - Idempotent: calling twice with the same mode yields (true, false).
//   - No cascading cleanup: artifacts in the graph produced by the module
//     are NOT removed. This operation only affects routing — the module
//     stops receiving new invocations.
//   - Safe to call at runtime; concurrent getModule() callers may briefly
//     observe a hit that resolves to null on the next call.

export function unregisterModule(mode: FrameworkMode): boolean {
  return registry.delete(mode)
}

// ── clearRegistry ──────────────────────────────────────────────────────────
// Full reset. Only intended for tests or full reload. Not part of normal
// runtime. Equivalent to unregisterModule(mode) for every mode currently
// registered. Returns the count of modules removed.

export function clearRegistry(): number {
  const count = registry.size
  registry.clear()
  return count
}

// ── getModule ──────────────────────────────────────────────────────────────
// Lookup by mode. Returns null if no module registered for that mode.
// Consumed by routing (6.6) to determine dispatch action.

export function getModule(mode: FrameworkMode): FrameworkModule | null {
  return registry.get(mode) ?? null
}

// ── getRegisteredModules ───────────────────────────────────────────────────
// All registered modules. Consumed by decode (6.8) for artifact detection
// and by dashboard (6.11) for program registration.

export function getRegisteredModules(): FrameworkModule[] {
  return Array.from(registry.values())
}

// ── hasModule ──────────────────────────────────────────────────────────────
// Quick check — does a module exist for this mode?

export function hasModule(mode: FrameworkMode): boolean {
  return registry.has(mode)
}
