// @liv-standard v1.3
// [F-memory/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    lm-v1.1, w3-17-contract-ext, w3-20-admin-write
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-INJECT  runTraversal     F-memory/R2 (memory-service)
//   W-INJECT  getPresentState  F-memory/R2 (memory-service)
//   W-INJECT  onBoot           F-memory/R2 (memory-service)
//   W-INJECT  getGraph         F-memory/R2 (memory-service)
//   W-INJECT  getUserGraph     F-memory/R2 (memory-service)
//   W-INJECT  getArms          F-memory/R2 (memory-service)
//   W-INJECT  getUserArms      F-memory/R2 (memory-service)
//   W-INJECT  seedGlobalNode   F-memory/R2 (memory-admin-service)
//   W-INJECT  removeGlobalNode F-memory/R2 (memory-admin-service)
// wires-out:
//   W-ATOM  traverse          →  F-chat/R4 (lm-io)
//   W-ATOM  getPresentState   →  F-chat/R4 (lm-io)
//   W-ATOM  onBoot            →  F-event-system/R2 (startup)
//   W-ATOM  getGlobalGraph    →  F-codec/R2 (codec-orchestrate)
//   W-ATOM  getUserGraph      →  F-codec/R2 (codec-orchestrate)
//   W-ATOM  getGlobalArms     →  F-codec/R2 (codec-orchestrate)
//   W-ATOM  getUserArms       →  F-codec/R2 (codec-orchestrate)
//   W-ATOM  seedGlobalNode    →  F-codec/R2 (codec-admin-actions)
//   W-ATOM  removeGlobalNode  →  F-codec/R2 (codec-admin-actions)
// deps:
//   R0  ../config/memory-types
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
import type { Result } from '@/core/types/primitives'

import {
  runTraversal,
  getPresentState as _getPresentState,
  onBoot as _onBoot,
  getGraph as _getGraph,
  getUserGraph as _getUserGraph,
  getArms as _getArms,
  getUserArms as _getUserArms,
} from '../app/memory-service'

import {
  seedGlobalNode as _seedGlobalNode,
  removeGlobalNode as _removeGlobalNode,
} from '../app/memory-admin-service'

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
export async function removeGlobalNode(nodeId: string): Promise<Result<void>> {
  return _removeGlobalNode(nodeId)
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
