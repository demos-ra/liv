// @liv-standard v1.5
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.4-module-registry
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  FrameworkMode, FrameworkModule  F-codec/R0
// wires-out:
//   W-INJECT  registerModule         → F-codec/R2 (codec-orchestrate, startup)
//   W-INJECT  getModule              → F-codec/R2 (codec-orchestrate, routing)
//   W-INJECT  getRegisteredModules   → F-codec/R2 (future: decode, dashboard)
//   W-INJECT  hasModule              → F-codec/R2 (future: routing)
// deps:
//   R0  ../config/codec-module-types
// validated:  pending

// Phase 6.4 — framework module registry.
// R2: orchestration. Runtime Map indexed by mode.
// 1:1 mapping: one module per mode. Last-write-wins on same mode.
// Populated at startup via registerModule(). Read by routing via getModule().

import type { FrameworkMode, FrameworkModule } from '../config/codec-module-types'

// ── Module-level registry ──────────────────────────────────────────────────
// Not exported directly — accessed through functions only.

const registry = new Map<FrameworkMode, FrameworkModule>()

// ── registerModule ─────────────────────────────────────────────────────────
// Called at startup for each known module. Idempotent by mode (last-write-wins).

export function registerModule(module: FrameworkModule): void {
  registry.set(module.mode, module)
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
