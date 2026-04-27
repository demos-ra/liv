// @liv-standard v1.5.1
// [F-memory/app/memory-artifact-store.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5.5, lm-v2-2-shot5
// slice:      F-memory
// layer:      R2
// wires-in:
//   W-ATOM  NodeId, CognitivePrimitive  ← core/R5 primitives
//   W-ATOM  ArtifactEmission, ArtifactEdge, ArtifactPayload  ← core/R5 artifact-standard.types
//   W-ATOM  PlanArtifactContent  ← core/R5 plan-standard.types
//   W-FN    db (Postgres pool proxy)  ← core/R5 db/client (lm-v2-2-shot5)
// wires-out:
//   W-FN    artifactStore (singleton)  → F-memory/R3 memory-graph-contract (Phase 5.5)
//   W-FN    hydrateArtifactStore()     → F-memory/R2 memory-service (lm-v2-2-shot5: boot-side hydration)
// deps:
//   R5  @/core/types/primitives
//   R5  @/core/types/artifact-standard.types
//   R5  @/core/types/plan-standard.types
//   R5  @/core/db/client (lm-v2-2-shot5)
// validated:  pending
//
// Phase 5.5 — Artifact substore for AS v2.2 emissions.
// Phase 9 (lm-v2-2-shot5) — Postgres-backed persistence per A4 closure.
//
//   F-memory owns graph state (A1). This module owns the artifact graph —
//   structurally distinct from the LM v2.1 traversal graph (semantic, embedded,
//   layered). The artifact graph is append-only, structural, and indexed by
//   emissionId / anchorNodeId.
//
//   Why a separate substore: see Phase 5.5 header (preserved verbatim below).
//
//   ─── Phase 9 closure (lm-v2-2-shot5) ─────────────────────────────────────
//   Storage backing swapped from process-warm in-memory Maps to Postgres-
//   backed persistence per Shot 5 brief §B + migration 015. R2 surface
//   stable — all 9 exported functions retain their signatures (8 async ports
//   + 1 sync collision predicate). Cross-slice consumer count = 1
//   (memory-graph-contract.ts re-export); D-A4-CONSUMER-COUNT records.
//
//   Cache layer (D-A4-CACHE-LAYER): the in-memory Maps from Phase 5.5 remain
//   as a write-through cache. Reads hit the cache; writes update both
//   Postgres and the cache atomically (Postgres-first, cache-on-success).
//   This (a) preserves v2.1 read latency (cache-hit common case), (b) keeps
//   the sync `isEmissionIdCollision` correct without DB I/O on the hot
//   path, (c) survives pm2 restart via boot-side hydration.
//
//   Async propagation (D-A4-ASYNC-PROPAGATION): contained at R2. The 8
//   port methods were already declared `Promise<...>` in Phase 5.5 in
//   anticipation of Phase 9 — Postgres async-ness lands in the existing
//   shape with no R3 contract surface change. The single sync method
//   `isEmissionIdCollision` remains sync, backed by the cache (populated
//   at boot + on every registerEmission call). Sync correctness preserved.
//
//   Hydration policy (D-A4-HYDRATION-POLICY): eager at boot. The artifact
//   graph is process-shared (no userId scoping at the partition level —
//   userId is a column on emissions for chain-key lookup). Eager hydration
//   loads all 6 tables into the in-memory cache before any consumer reads.
//   `hydrateArtifactStore()` is called from F-memory `onBoot()` after the
//   semantic graph load.
//
//   MA1 conservation (sprint-close gate 3): Postgres writes are atomic per
//   pg simple-query; the cache update follows the DB success and is the
//   only update path. Across pm2 restart: `_inspectStore()` count constant
//   pre/post restart — verified by re-hydration loading the same row count
//   that was last persisted. No probabilistic mass to redistribute; A4
//   conservation is presence/absence of nodes, conserved trivially by
//   atomic INSERTs and idempotent boot.
//
//   LM v2.1 conformance for the artifact substore (preserved):
//     MA1 (conservation): writes are total + persistent; nothing leaks.
//     MA2 (traversal): node/edge writes are the only mutation paths.
//     MA3 (connectivity): edges persisted via persistEdges; structural integrity
//          enforced — fromId/toId must reference existing nodes (validated).
//     MA4 (directionality): ArtifactEdge.fromId → toId is directional and
//          carries kind (classification-lineage / categorical / version / dependency).
//     MA5 (emergent identity): mode-node interning keyed by CognitivePrimitive —
//          one stable NodeId per primitive across all emissions, persisted.
//     MA6 (deletability): _deleteAnchorCascade(nodeId) cascades; system re-equilibrates
//          (no orphan dangling references). ON DELETE CASCADE on Postgres FKs
//          mirrors the in-memory cascade. Test-only path; not exposed at R3.

import type { NodeId, CognitivePrimitive } from '@/core/types/primitives'
import type {
  ArtifactEmission,
  ArtifactEdge,
  ArtifactPayload,
} from '@/core/types/artifact-standard.types'
import type { PlanArtifactContent } from '@/core/types/plan-standard.types'
import { generateId } from '@/core/types/primitives'
import { db } from '@/core/db/client'

// ─── Internal node shapes ────────────────────────────────────────────────────
// Two node kinds in the artifact graph. Both are R2-internal — never cross
// the slice boundary; consumers see ArtifactGraphPort + PlanResolutionPort
// methods only.

/** Anchor node — minted per emission per ArA1/ArA2. */
type ArtifactAnchorNode = {
  id:         NodeId
  framework:  { id: string; version: string }
  turnId:     string
  emissionId: string
  createdAt:  number
}

/** Companion node — carries payload verbatim per ArA2. */
type ArtifactCompanionNode = {
  id:         NodeId
  emissionId: string
  payload:    unknown    // typed by domain at consumption site (e.g. PlanArtifactContent)
  createdAt:  number
}

/** Content node — materialized children per ArA3 (cardinality ≥ 1). */
type ArtifactContentNode = {
  id:           NodeId
  emissionId:   string
  contentValue: unknown
  createdAt:    number
}

/** Mode node — primitive-keyed registry per MA5 / ArA4b. */
type ArtifactModeNode = {
  id:        NodeId
  primitive: CognitivePrimitive
  createdAt: number
}

// ─── Artifact substore (cache layer; backed by Postgres) ───────────────────

type ArtifactStore = {
  // Indices keyed for the eight ArtifactGraphPort methods.
  anchorById:           Map<NodeId, ArtifactAnchorNode>
  companionById:        Map<NodeId, ArtifactCompanionNode>
  contentById:          Map<NodeId, ArtifactContentNode>

  // emissionId → anchor for in-flight resolution (materializeContent runs
  // before registerEmission in the AS R2 procedure; we need to find the
  // anchor minted seconds earlier in the same emission).
  anchorByEmissionId:   Map<string, NodeId>

  // Companion lookup by anchor — used by resolvePlan one-hop read (HR-MI4).
  companionByAnchor:    Map<NodeId, NodeId>

  // Mode-node registry per MA5 — one stable NodeId per CognitivePrimitive.
  // lm-v2-2-shot5: now persistent across process restart via art_mode_node.
  modeByPrimitive:      Map<string, NodeId>
  modeNodes:            Map<NodeId, ArtifactModeNode>

  // Emission registry — backs G-Ar8 uniqueness + supports lookupPriorAnchor.
  // lm-v2-2-shot5: cache layer; durable backing in art_emission.
  emissions:            Map<string, ArtifactEmission>

  // Prior-anchor index — keyed by (framework.id, framework.version, domain,
  // schemaRef, userId). Plan v2.2 PA5 re-entry path: F-planner emits a
  // re-plan; we look up the prior plan's anchor for this user+framework+schema
  // tuple to populate the version edge. Latest wins.
  priorAnchorIndex:     Map<string, NodeId>

  // Edge log — ArA4 edges persisted via persistEdges (S3, post-emission).
  edges:                ArtifactEdge[]

  // lm-v2-2-shot5: hydration latch. True after hydrateArtifactStore() runs
  // successfully; `isEmissionIdCollision` reads cache regardless, but
  // diagnostics surface (`_inspectStore`) reports hydration status.
  hydrated:             boolean
}

function priorAnchorKey(args: {
  framework: { id: string; version: string }
  domain:    string
  schemaRef: string
  userId:    string
}): string {
  return [args.framework.id, args.framework.version, args.domain, args.schemaRef, args.userId].join('|')
}

// Process-singleton state. lm-v2-2-shot5: Maps as cache; durable backing
// in Postgres tables created by migration 015.
const _store: ArtifactStore = {
  anchorById:         new Map(),
  companionById:      new Map(),
  contentById:        new Map(),
  anchorByEmissionId: new Map(),
  companionByAnchor:  new Map(),
  modeByPrimitive:    new Map(),
  modeNodes:          new Map(),
  emissions:          new Map(),
  priorAnchorIndex:   new Map(),
  edges:              [],
  hydrated:           false,
}

// ─── Hydration (lm-v2-2-shot5) ──────────────────────────────────────────────
// Eager boot-side hydration per D-A4-HYDRATION-POLICY. Loads all 6 tables
// into the cache before any consumer reads. Idempotent — re-running clears
// the cache first then reloads, preserving consistency if called from
// admin-only force-reload paths.
//
// Called from F-memory onBoot() after semantic graph load.

type AnchorRow = {
  id: string
  framework_id: string
  framework_version: string
  turn_id: string
  emission_id: string
  created_at: string  // pg returns BIGINT as string
}

type CompanionRow = {
  id: string
  emission_id: string
  payload: unknown
  created_at: string
}

type ContentRow = {
  id: string
  emission_id: string
  content_value: unknown
  created_at: string
}

type ModeRow = {
  id: string
  primitive: string
  created_at: string
}

type EmissionRow = {
  emission_id: string
  framework_id: string
  framework_version: string
  domain: string
  schema_ref: string
  user_id: string
  anchor_id: string
  emission: ArtifactEmission
  created_at: string
}

type EdgeRow = {
  id: string
  from_id: string
  to_id: string
  kind: string
  metadata: Record<string, unknown> | null
  created_at: string
}

export async function hydrateArtifactStore(): Promise<void> {
  // Clear cache before hydration — idempotency for re-run paths.
  _store.anchorById.clear()
  _store.companionById.clear()
  _store.contentById.clear()
  _store.anchorByEmissionId.clear()
  _store.companionByAnchor.clear()
  _store.modeByPrimitive.clear()
  _store.modeNodes.clear()
  _store.emissions.clear()
  _store.priorAnchorIndex.clear()
  _store.edges.length = 0

  try {
    // Anchor + emissionId index
    const anchors = await db.query<AnchorRow>('SELECT id, framework_id, framework_version, turn_id, emission_id, created_at FROM art_anchor')
    for (const r of anchors.rows) {
      const node: ArtifactAnchorNode = {
        id:         r.id as NodeId,
        framework:  { id: r.framework_id, version: r.framework_version },
        turnId:     r.turn_id,
        emissionId: r.emission_id,
        createdAt:  Number(r.created_at),
      }
      _store.anchorById.set(node.id, node)
      _store.anchorByEmissionId.set(r.emission_id, node.id)
    }

    // Companion + companionByAnchor index (resolved via emission_id → anchor)
    const companions = await db.query<CompanionRow>('SELECT id, emission_id, payload, created_at FROM art_companion')
    for (const r of companions.rows) {
      const node: ArtifactCompanionNode = {
        id:         r.id as NodeId,
        emissionId: r.emission_id,
        payload:    r.payload,
        createdAt:  Number(r.created_at),
      }
      _store.companionById.set(node.id, node)
      const anchorId = _store.anchorByEmissionId.get(r.emission_id)
      if (anchorId) _store.companionByAnchor.set(anchorId, node.id)
    }

    // Content
    const contents = await db.query<ContentRow>('SELECT id, emission_id, content_value, created_at FROM art_content')
    for (const r of contents.rows) {
      _store.contentById.set(r.id as NodeId, {
        id:           r.id as NodeId,
        emissionId:   r.emission_id,
        contentValue: r.content_value,
        createdAt:    Number(r.created_at),
      })
    }

    // Mode nodes
    const modes = await db.query<ModeRow>('SELECT id, primitive, created_at FROM art_mode_node')
    for (const r of modes.rows) {
      const id = r.id as NodeId
      _store.modeByPrimitive.set(r.primitive, id)
      _store.modeNodes.set(id, {
        id,
        primitive: r.primitive as CognitivePrimitive,
        createdAt: Number(r.created_at),
      })
    }

    // Emissions + prior-anchor index (latest-wins per chain key)
    const emissions = await db.query<EmissionRow>(
      'SELECT emission_id, framework_id, framework_version, domain, schema_ref, user_id, anchor_id, emission, created_at FROM art_emission ORDER BY created_at ASC'
    )
    for (const r of emissions.rows) {
      _store.emissions.set(r.emission_id, r.emission)
      const key = priorAnchorKey({
        framework: { id: r.framework_id, version: r.framework_version },
        domain:    r.domain,
        schemaRef: r.schema_ref,
        userId:    r.user_id,
      })
      // Latest wins — ORDER BY created_at ASC means later rows overwrite
      _store.priorAnchorIndex.set(key, r.anchor_id as NodeId)
    }

    // Edges
    const edges = await db.query<EdgeRow>('SELECT id, from_id, to_id, kind, metadata, created_at FROM art_edge ORDER BY id ASC')
    for (const r of edges.rows) {
      _store.edges.push({
        fromId:   r.from_id as NodeId,
        toId:     r.to_id as NodeId,
        kind:     r.kind as ArtifactEdge['kind'],
        ...(r.metadata !== null ? { metadata: r.metadata } : {}),
      } as ArtifactEdge)
    }

    _store.hydrated = true

    console.log(JSON.stringify({
      level:     'info',
      event:     'memory.artifact.hydrate.complete',
      counts:    {
        anchors:    _store.anchorById.size,
        companions: _store.companionById.size,
        contents:   _store.contentById.size,
        modes:      _store.modeNodes.size,
        emissions:  _store.emissions.size,
        edges:      _store.edges.length,
        priors:     _store.priorAnchorIndex.size,
      },
      timestamp: new Date().toISOString(),
    }))
  } catch (err) {
    // Non-fatal — start with empty cache. Mirror onBoot() pattern.
    console.error(JSON.stringify({
      level:     'error',
      event:     'memory.artifact.hydrate.failed',
      message:   (err as Error).message,
      timestamp: new Date().toISOString(),
    }))
    _store.hydrated = false
  }
}

// ─── Public API (consumed by F-memory R3) ───────────────────────────────────

/**
 * Mint anchor node. ArA1: present every emission.
 *
 * lm-v2-2-shot5: Postgres INSERT first, cache-on-success. The DB write is
 * the source of truth; the cache reflects what's persisted. Cache index
 * `anchorByEmissionId` updated in lockstep so a later
 * createCompanionNode / materializeContent in the same emission can locate
 * the anchor without a DB roundtrip.
 */
export async function createAnchorNode(args: {
  framework:  { id: string; version: string }
  turnId:     string
  emissionId: string
}): Promise<NodeId> {
  const id = generateId('anchor') as NodeId
  const createdAt = Date.now()

  await db.query(
    'INSERT INTO art_anchor (id, framework_id, framework_version, turn_id, emission_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, args.framework.id, args.framework.version, args.turnId, args.emissionId, createdAt],
  )

  const node: ArtifactAnchorNode = {
    id,
    framework:  { id: args.framework.id, version: args.framework.version },
    turnId:     args.turnId,
    emissionId: args.emissionId,
    createdAt,
  }
  _store.anchorById.set(id, node)
  _store.anchorByEmissionId.set(args.emissionId, id)
  return id
}

/**
 * Mint companion node. ArA2: 1:1 with anchor by emissionId.
 * Companion-by-anchor index updated for HR-MI4 one-hop resolution.
 *
 * lm-v2-2-shot5: Postgres INSERT first, cache-on-success.
 */
export async function createCompanionNode(args: {
  emissionId: string
  payload:    unknown
}): Promise<NodeId> {
  const id = generateId('companion') as NodeId
  const createdAt = Date.now()

  await db.query(
    'INSERT INTO art_companion (id, emission_id, payload, created_at) VALUES ($1, $2, $3::jsonb, $4)',
    [id, args.emissionId, JSON.stringify(args.payload), createdAt],
  )

  const node: ArtifactCompanionNode = {
    id,
    emissionId: args.emissionId,
    payload:    args.payload,
    createdAt,
  }
  _store.companionById.set(id, node)
  // Anchor must already be minted in this emission (AS R2 ordering).
  const anchor = _store.anchorByEmissionId.get(args.emissionId)
  if (anchor) _store.companionByAnchor.set(anchor, id)
  return id
}

/**
 * Materialize content. ArA3: cardinality ≥ 1.
 *
 * lm-v2-2-shot5: Postgres INSERT first, cache-on-success.
 */
export async function materializeContent(args: {
  emissionId:   string
  contentValue: unknown
}): Promise<NodeId[]> {
  const id = generateId('content') as NodeId
  const createdAt = Date.now()

  await db.query(
    'INSERT INTO art_content (id, emission_id, content_value, created_at) VALUES ($1, $2, $3::jsonb, $4)',
    [id, args.emissionId, JSON.stringify(args.contentValue), createdAt],
  )

  const node: ArtifactContentNode = {
    id,
    emissionId:   args.emissionId,
    contentValue: args.contentValue,
    createdAt,
  }
  _store.contentById.set(id, node)
  return [id]
}

/**
 * Mode-node registry per MA5. One stable NodeId per primitive for the
 * process lifetime.
 *
 * lm-v2-2-shot5: cache-first read (post-hydration the cache reflects DB).
 * On miss, INSERT into Postgres, populate cache. Race condition between two
 * concurrent calls with the same primitive: Postgres UNIQUE constraint on
 * `primitive` rejects the second INSERT; second call falls back to a
 * SELECT for the existing row.
 *
 * Signature accepts string per ArtifactGraphPort contract.
 */
export async function lookupModeNode(primitive: string): Promise<NodeId> {
  const key = String(primitive)
  const existing = _store.modeByPrimitive.get(key)
  if (existing) return existing

  const id = generateId(`mode-${key}`) as NodeId
  const createdAt = Date.now()

  try {
    await db.query(
      'INSERT INTO art_mode_node (id, primitive, created_at) VALUES ($1, $2, $3)',
      [id, key, createdAt],
    )
    _store.modeByPrimitive.set(key, id)
    _store.modeNodes.set(id, {
      id,
      primitive: primitive as CognitivePrimitive,
      createdAt,
    })
    return id
  } catch (err) {
    // Likely UNIQUE conflict from concurrent insert; fall back to SELECT.
    const result = await db.query<ModeRow>(
      'SELECT id, primitive, created_at FROM art_mode_node WHERE primitive = $1',
      [key],
    )
    const row = result.rows[0]
    if (!row) {
      // Genuine error, not a race
      throw err
    }
    const existingId = row.id as NodeId
    _store.modeByPrimitive.set(key, existingId)
    _store.modeNodes.set(existingId, {
      id:        existingId,
      primitive: row.primitive as CognitivePrimitive,
      createdAt: Number(row.created_at),
    })
    return existingId
  }
}

/**
 * Lookup prior anchor for ArA4c version edge. Returns null if no prior
 * exists for this (framework, domain, schemaRef, userId) tuple.
 *
 * lm-v2-2-shot5: cache-first. Cache populated at boot from priorAnchorIndex
 * which is built from art_emission rows ordered ASC (latest wins).
 */
export async function lookupPriorAnchor(args: {
  framework: { id: string; version: string }
  domain:    string
  schemaRef: string
  turnId:    string
  userId?:   string
}): Promise<NodeId | null> {
  const userKey = args.userId ?? args.turnId
  const key = priorAnchorKey({
    framework: args.framework,
    domain:    args.domain,
    schemaRef: args.schemaRef,
    userId:    userKey,
  })
  return _store.priorAnchorIndex.get(key) ?? null
}

/**
 * Register emission. G-Ar8 uniqueness + version-edge index update.
 * Called at AS S3 after gate evaluation passes.
 *
 * lm-v2-2-shot5: Postgres INSERT first, cache-on-success. Both registries
 * (emissions, priorAnchorIndex) updated in lockstep.
 */
export async function registerEmission(emission: ArtifactEmission): Promise<void> {
  const userId = String(emission.userId)
  const createdAt = Date.now()

  await db.query(
    `INSERT INTO art_emission
       (emission_id, framework_id, framework_version, domain, schema_ref, user_id, anchor_id, emission, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)`,
    [
      emission.emissionId,
      emission.framework.id,
      emission.framework.version,
      emission.payload.domain,
      emission.payload.schemaRef,
      userId,
      emission.writes.a7.artifactAnchorNodeId,
      JSON.stringify(emission),
      createdAt,
    ],
  )

  _store.emissions.set(emission.emissionId, emission)

  // Update prior-anchor index — latest wins.
  const key = priorAnchorKey({
    framework: { id: emission.framework.id, version: emission.framework.version },
    domain:    emission.payload.domain,
    schemaRef: emission.payload.schemaRef,
    userId,
  })
  _store.priorAnchorIndex.set(key, emission.writes.a7.artifactAnchorNodeId)
}

/**
 * G-Ar8 sync collision predicate.
 *
 * lm-v2-2-shot5: stays sync per D-A4-ASYNC-PROPAGATION (containment at R2).
 * Backed by the cache, which is populated at boot via hydrateArtifactStore()
 * and updated atomically on every registerEmission call. Sync correctness
 * preserved without DB I/O on the gate path.
 */
export function isEmissionIdCollision(emissionId: string): boolean {
  return _store.emissions.has(emissionId)
}

/**
 * Persist ArA4 edges. MA3: structural integrity check — both ends must
 * reference nodes already in the graph (anchor / companion / content / mode).
 * Phase 5.5: log on integrity failure; do not throw — AS R2 G-Ar* gates
 * already validated edge shape, this is defense-in-depth.
 *
 * lm-v2-2-shot5: Postgres INSERT first per validated edge, cache-on-success.
 * EXPECTED PRE-PHASE-8 NOISE: classification-lineage edges target
 * classificationNodeIds minted by the cognitive stub; those NodeIds are not
 * registered in F-memory until F-codec R3 lands at Phase 8. The dangling
 * warnings on those edges are expected and resolve when the stub is replaced.
 * The edges themselves are NOT persisted (they fail the integrity check) —
 * that is correct behavior.
 */
export async function persistEdges(edges: ArtifactEdge[]): Promise<void> {
  const createdAt = Date.now()
  for (const edge of edges) {
    const fromExists = nodeExists(edge.fromId)
    const toExists   = nodeExists(edge.toId)
    if (!fromExists || !toExists) {
      console.warn(JSON.stringify({
        level:     'warn',
        event:     'memory.artifact.edge.dangling',
        edge:      { fromId: edge.fromId, toId: edge.toId, kind: edge.kind, fromExists, toExists },
        slice:     'F-memory',
        timestamp: new Date().toISOString(),
      }))
      continue
    }
    const meta = (edge as { metadata?: unknown }).metadata
    await db.query(
      'INSERT INTO art_edge (from_id, to_id, kind, metadata, created_at) VALUES ($1, $2, $3, $4::jsonb, $5)',
      [edge.fromId, edge.toId, edge.kind, meta !== undefined ? JSON.stringify(meta) : null, createdAt],
    )
    _store.edges.push(edge)
  }
}

function nodeExists(id: NodeId): boolean {
  return _store.anchorById.has(id)
      || _store.companionById.has(id)
      || _store.contentById.has(id)
      || _store.modeNodes.has(id)
}

// ─── Plan resolution (HR-MI4 one-hop) ────────────────────────────────────────

/**
 * One-hop read at planAnchorNodeId. Returns the PlanArtifactContent carried
 * by the companion node. Null when:
 *   - anchor not found
 *   - anchor has no companion (impossible per ArA2 if AS R2 wrote correctly)
 *   - companion payload domain != 'plan' (the anchor is not a plan emission)
 *   - companion content shape is not PlanArtifactContent
 *
 * lm-v2-2-shot5: cache-only read. Cache reflects DB post-hydration.
 */
export async function resolvePlan(planAnchorNodeId: NodeId): Promise<PlanArtifactContent | null> {
  const companionId = _store.companionByAnchor.get(planAnchorNodeId)
  if (!companionId) return null
  const companion = _store.companionById.get(companionId)
  if (!companion) return null

  const payload = companion.payload as ArtifactPayload | undefined
  if (!payload || typeof payload !== 'object' || payload.domain !== 'plan') return null

  const content = payload.content as Partial<PlanArtifactContent> | null
  if (!content || typeof content !== 'object'
      || !('planId'   in content)
      || !('binding'  in content)
      || !('shape'    in content)) {
    return null
  }
  return content as PlanArtifactContent
}

// ─── Test / introspection helpers (R2-internal; not exposed at R3) ──────────

/**
 * Process-state inspection for tests + sprint-close MA1 gate.
 * Not part of the R3 contract.
 *
 * lm-v2-2-shot5: counts reflect cache state (which mirrors DB post-hydration).
 * For the MA1 across-pm2-restart audit gate: count this pre-restart, restart,
 * count post-restart-and-hydration — should be equal.
 */
export function _inspectStore(): {
  anchors:    number
  companions: number
  contents:   number
  modes:      number
  emissions:  number
  edges:      number
  priors:     number
  hydrated:   boolean
} {
  return {
    anchors:    _store.anchorById.size,
    companions: _store.companionById.size,
    contents:   _store.contentById.size,
    modes:      _store.modeNodes.size,
    emissions:  _store.emissions.size,
    edges:      _store.edges.length,
    priors:     _store.priorAnchorIndex.size,
    hydrated:   _store.hydrated,
  }
}

/**
 * MA6 deletability (test-only path; spec note "no-op delete must not throw").
 *
 * lm-v2-2-shot5: Postgres DELETE with CASCADE handles companion + emission
 * removal at the FK level (art_companion.emission_id REFERENCES
 * art_anchor(emission_id) ON DELETE CASCADE; art_emission.anchor_id
 * REFERENCES art_anchor(id) ON DELETE CASCADE). Content nodes are not
 * FK-bound to anchor (multiple content per emission), so manual DELETE.
 * Cache cleared in lockstep.
 */
export async function _deleteAnchorCascade(anchorId: NodeId): Promise<void> {
  const anchor = _store.anchorById.get(anchorId)
  if (!anchor) return

  // Delete from DB — cascades remove companion + emission rows.
  await db.query('DELETE FROM art_anchor WHERE id = $1', [anchorId])
  // Content not FK-bound; remove manually by emission_id.
  await db.query('DELETE FROM art_content WHERE emission_id = $1', [anchor.emissionId])

  // Cache: companion, content, prior-index entries pointing at this anchor.
  const companionId = _store.companionByAnchor.get(anchorId)
  if (companionId) {
    _store.companionById.delete(companionId)
    _store.companionByAnchor.delete(anchorId)
  }
  for (const [id, c] of _store.contentById.entries()) {
    if (c.emissionId === anchor.emissionId) _store.contentById.delete(id)
  }
  _store.anchorById.delete(anchorId)
  _store.anchorByEmissionId.delete(anchor.emissionId)
  _store.emissions.delete(anchor.emissionId)
  for (const [k, v] of _store.priorAnchorIndex.entries()) {
    if (v === anchorId) _store.priorAnchorIndex.delete(k)
  }
}

/**
 * Test-only reset.
 * lm-v2-2-shot5: clears cache only. To reset the DB tables, run migration
 * 015 against a fresh DB or use TRUNCATE in a test setup script.
 * Production never calls this.
 */
export function _resetForTests(): void {
  _store.anchorById.clear()
  _store.companionById.clear()
  _store.contentById.clear()
  _store.anchorByEmissionId.clear()
  _store.companionByAnchor.clear()
  _store.modeByPrimitive.clear()
  _store.modeNodes.clear()
  _store.emissions.clear()
  _store.priorAnchorIndex.clear()
  _store.edges.length = 0
  _store.hydrated = false
}
