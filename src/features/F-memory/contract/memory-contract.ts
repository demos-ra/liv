// @liv-standard v1.5.1
// [F-memory/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1, w3-17-contract-ext, w3-20-admin-write, 6.1-global-seed, 4b-nodeid-propagation
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-ATOM   GlobalSeedNode    F-memory/R0 (memory-seed-data)
// wires-out:
//   W-HOOK  traverse           →  F-chat/R4 (lm-io)
//   W-HOOK  getPresentState    →  F-chat/R4 (lm-io)
//   W-HOOK  onBoot             →  F-event-system/R2 (startup)
//   W-HOOK  reloadGlobalGraph  →  app/R4 (seed route)
//   W-HOOK  getGlobalGraph     →  F-codec/R2 (codec-orchestrate)
//   W-HOOK  getUserGraph       →  F-codec/R2 (codec-orchestrate)
//   W-HOOK  getGlobalArms      →  F-codec/R2 (codec-orchestrate)
//   W-HOOK  getUserArms        →  F-codec/R2 (codec-orchestrate)
//   W-HOOK  seedGlobalNode     →  F-codec/R2 (codec-admin-actions)
//   W-HOOK  removeGlobalNode   →  F-codec/R2 (codec-admin-actions)
//   W-HOOK  seedAndTraverseGlobal → F-codec/R2 (codec-admin-actions)
// deps:
//   R0  ../config/memory-types
//   R0  ../config/memory-seed-data
//   R2  ../app/memory-service
//   R2  ../app/memory-admin-service
// validated:  pending

// Living Memory v1.1 — public contract.
// R3: thin wire. No logic. No DB. No physics.
// §20: two surfaces for F-chat integration:
//   traverse(text, userId, options?) — real-time traversal for specific query context
//   getPresentState(userId)          — inject into system prompt before LLM call
// All other slices import from here — never from app/, domain/, exec/.
//
// lm-v1.1 changes (Amendment 3):
//   traverse: +userId param (A6: scoped traversal)
//   getPresentState: +userId param (A6: per-user present state)
//   F-chat will break at compile — intentional. F-chat must pass userId through.
//
// w3-17-contract-ext:
//   A3: typed boundary — graph read surface for cross-slice consumption (F-codec decode/routing).
//   getGlobalGraph(), getUserGraph(), getGlobalArms(), getUserArms() — thin wrappers over R2 accessors.
//
// w3-20-admin-write:
//   A3: typed boundary — admin write surface for global graph management.
//   seedGlobalNode() — thin wrapper over R2 admin service (userId: null).
//   removeGlobalNode() — thin wrapper over R2 admin service (cascade delete).

import type {
  TraversalResult,
  TraversalOptions,
  PresentState,
  MemGraph,
  MemArm,
  MemNode,
  MemEdge,
} from '../config/memory-types'
import type { Result, NodeId } from '@/core/types/primitives'

import {
  runTraversal,
  getPresentState as _getPresentState,
  onBoot as _onBoot,
  reloadGlobalGraph as _reloadGlobalGraph,
  getGraph as _getGraph,
  getUserGraph as _getUserGraph,
  getArms as _getArms,
  getUserArms as _getUserArms,
} from '../app/memory-service'

import {
  seedGlobalNode as _seedGlobalNode,
  removeGlobalNode as _removeGlobalNode,
  seedAndTraverseGlobal as _seedAndTraverseGlobal,
} from '../app/memory-admin-service'

import type { GlobalSeedNode } from '../config/memory-seed-data'

// ─── traverse ─────────────────────────────────────────────────────────────────
// §20: real-time traversal for specific query context.
// Also recomputes Present State as side effect.
// Amendment 3: +userId — scoped to per-user graph (A6).
//
// Usage per §20 flow:
//   1. getPresentState(userId)              → inject as system context
//   2. traverse(userMessage, userId, { returnActivation: true })  → query-specific context
//   3. Both injected into LLM context
//   4. LLM responds
//   5. traverse(llmResponse, userId)        → write path, no activation returned

export async function traverse(
  text: string,
  userId: string,
  options?: TraversalOptions,
): Promise<Result<TraversalResult | null>> {
  return runTraversal(text, userId, options)
}

// ─── getPresentState ──────────────────────────────────────────────────────────
// §20: inject into system prompt before LLM call.
// G2: reads precomputed values only — never triggers recomputation.
// Amendment 3: +userId — per-user present state (A6).

export function getPresentState(userId: string): PresentState {
  return _getPresentState(userId)
}

// ─── onBoot ───────────────────────────────────────────────────────────────────
// Called by F-event-system/app/startup.ts on server start.
// Loads global graph only. Per-user graphs lazy-loaded on first traversal.

export async function onBoot(): Promise<void> {
  return _onBoot()
}

// ─── reloadGlobalGraph ────────────────────────────────────────────────────────
// 6.1-global-seed: force-reload global graph from DB after batch seed.
// Bypasses onBoot() idempotency guard. Admin-only.
export async function reloadGlobalGraph(): Promise<void> {
  return _reloadGlobalGraph()
}

// ─── Graph Read Surface (w3-17-contract-ext) ──────────────────────────────────
// A3: typed boundary — exposing graph read surface for cross-slice consumption.
// F-codec decode needs the full graph (ScopedGraphSet) and arms to classify
// structures. These are thin R3 wrappers over existing R2 accessors.
// No mutations — read-only by design.

// Global graph — loaded at boot, shared read-only.
export function getGlobalGraph(): MemGraph {
  return _getGraph()
}

// Per-user graph — lazy-loaded on first traversal.
export function getUserGraph(userId: string): MemGraph {
  return _getUserGraph(userId)
}

// Global arms — community structure across all users.
export function getGlobalArms(): MemArm[] {
  return _getArms()
}

// Per-user arms — community structure within user's graph.
export function getUserArms(userId: string): MemArm[] {
  return _getUserArms(userId)
}

// ─── Admin Write Surface (w3-20-admin-write) ──────────────────────────────────
// A3: typed boundary — admin-only write path for global graph management.
// Thin R3 wrappers over R2 admin service. Same pattern as traverse → runTraversal.

// Seed a global node with optional edges. Admin-authored knowledge.
export async function seedGlobalNode(
  node: Omit<MemNode, 'cachedLayer' | 'cachedClosure' | 'cachedAsymmetry'>,
  edges: MemEdge[],
): Promise<Result<void>> {
  return _seedGlobalNode(node, edges)
}

// Remove a global node and all connected edges. Cascade delete.
// 4b-nodeid-propagation: scalar nodeId typed NodeId. Upstream callers
// (HTTP route handlers) brand raw body strings `as NodeId` at the external-origin
// ingress site per amended Confirm 3 — this R3 signature receives NodeId and
// passes through.
export async function removeGlobalNode(nodeId: NodeId): Promise<Result<void>> {
  return _removeGlobalNode(nodeId)
}

// Batch seed + self-traversal. Phase 6.1.
// Caller must call reloadGlobalGraph() after completion to reload global graph.
export async function seedAndTraverseGlobal(
  nodes: GlobalSeedNode[],
): Promise<Result<{ seeded: number; traversed: number }>> {
  return _seedAndTraverseGlobal(nodes)
}

// ─── Re-exports for consumers ─────────────────────────────────────────────────
// A3: atoms only cross slice boundaries.
export type {
  MemGraph,
  MemArm,
  MemNode,
  MemEdge,
  ScopedGraphSet,
  PresentState,
  TraversalResult,
  TraversalOptions,
  MLayer,
  EdgePrimitiveType,
} from '../config/memory-types'

export type { GlobalSeedNode, GlobalSeedEdge } from '../config/memory-seed-data'
