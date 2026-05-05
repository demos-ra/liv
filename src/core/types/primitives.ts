// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in: none
// wires-out:
//   W-ATOM  Result    →  all slices
//   W-ATOM  AppError  →  all slices
//   W-ATOM  NodeId    →  all slices (Artifact Standard v1.0, Living Memory, future consumers)
//   W-ATOM  Semver    →  all slices (Artifact Standard v1.0, framework version pins)
//   W-ATOM  CognitivePrimitive → Artifact Standard v1.1, Cognitive Standard consumers, Living Memory
// deps:       none
// validated:  pending

import { randomUUID } from 'crypto'

// R5: shared infrastructure. Zero domain logic. Zero slice-specific types.
// Phase 3: added canonical Result<T> and AppError per LIV-Standard T1.6 (AK-RES).
// Slices may define scoped result aliases (e.g. ProjectResult<T>) that use this shape.
// Artifact Standard v1.0 landing: added NodeId + Semver (AK-REF branded) for cross-standard use.
// Artifact Standard v1.1 landing: added CognitivePrimitive for cross-standard cognitive-primitive references.
// Artifact Standard v2.1 landing: CreateArtifactInput / ArtifactEmission regenerated against metaframework v2.4;
//                                  no new primitives needed (UserId reused via existing plain alias).

// ── Canonical Result<T> and AppError ─────────────────────────────────────────
// AK-RES: the only permitted shape for fallible operation return values. (T1.6 R4)
// A1: declared once, at R5 core. Slices import — never redeclare.
// A6: declared at origin. Cross-slice result types are aliases of this shape.

export type AppError = {
  code:     string                        // SCREAMING_SNAKE_CASE — stable, treat as public API
  message:  string                        // human-readable — may change
  context?: Record<string, unknown>       // no PII, no raw objects
}

export type Result<T, E extends AppError = AppError> =
  | { ok: true;  data: T }
  | { ok: false; error: E }

// ── ID generation ─────────────────────────────────────────────────────────────

export function generateId(prefix?: string): string {
  const uuid = randomUUID()
  return prefix ? `${prefix}_${uuid}` : uuid
}

// ─── Identity types ───────────────────────────────────────────────────────────
// Backlog: retrofit existing plain aliases (UserId..CommitId) to AK-REF branded.
//          Tracked separately; not in scope for Artifact Standard v1.0 landing.

export type UserId      = string
export type ProjectId   = string
export type SliceId     = string
export type EventId     = string
export type CommitId    = string

// ─── Graph identity (AK-REF branded) ──────────────────────────────────────────
// NodeId: canonical node identifier across Living Memory, Artifact Standard, and
//         any future graph-aware standard. AK-REF pattern per T1.6 atom taxonomy.
// A1: declared once, at R5 core. Slices import — never redeclare.
// Backlog: F-memory retrofit to import this branded type (currently uses plain string).

export type NodeId = string & { readonly _brand: 'NodeId' }

// ─── Versioning (AK-REF branded) ──────────────────────────────────────────────
// Semver: semantic version string. AK-REF pattern per T1.6.
// Used by Artifact Standard v1.0 (framework.version, domainVersion) and future
// consumers needing version pins as typed atoms rather than free strings.

export type Semver = string & { readonly _brand: 'Semver' }

// ─── Cognitive primitive (cross-standard) ─────────────────────────────────────
// CognitivePrimitive: the six codec primitives per Cognitive Standard.
// Cross-standard primitive consumed by:
//   - Cognitive Standard (codec — source of semantics)
//   - Artifact Standard v1.1 (ArtifactWriteA4.primitive per §8)
//   - Living Memory v1.1 (MemEdge.primitiveType via EdgePrimitiveType)
// A1: declared once, at R5 core. Slices import — never redeclare.
// sprint-8-shot-3a: F-codec dissolved; CognitivePrimitive retained as cross-standard
//                   atom (still consumed by Artifact Standard / surviving consumers)
//                   pending review at sprint close.

export type CognitivePrimitive =
  | 'anchor'
  | 'relate'
  | 'restructure'
  | 'reinforce'
  | 'suppress'
  | 'reference'

// ─── R Layers ────────────────────────────────────────────────────────────────

export type RLayer = 'R0' | 'R1' | 'R2' | 'R3' | 'R4'

// Step 4: F-types, F-state-registry absorbed into core/types/.
//         F-workspace deferred to Phase 2 (IDE surface) — not yet built.
//         Axiom cite: A7 — deletability. Phantom slices removed.
// Step 3: F-executor added — Docker execution slice. FSlice count +1; STATE_NAMESPACES parity maintained.
// Phase 4b: F-artifact (AS v2.2 runtime) + F-multi-instance (M-I v2.3 runtime) added.
// Sprint 8 Shot 2: F-router added — pure routing slice (infrastructure, not a governed program).
// Sprint 8 Shot 3a: F-codec removed — dissolved entirely (only codec-ai-io.ts retained as standalone exec utility).
export type FSlice =
  | 'F-executor'      // Step 3 — Docker code execution
  | 'F-design-system'
  | 'F-event-system'
  | 'F-la-config'
  | 'F-identity'
  | 'F-permissions'
  | 'F-git-connector'
  | 'F-terminal-bridge'
  | 'F-project'
  | 'F-topography'
  | 'F-ai-adapter'
  | 'F-chat'
  | 'F-constitution'
  | 'F-notifications'
  | 'F-commit-log'
  | 'F-user-profile'
  | 'F-dashboard'
  | 'F-editor'
  | 'F-health-panel'
  | 'F-execution-panel'
  | 'F-memory'
  | 'F-planner'     // Phase 4 — pipeline orchestration
  | 'F-intake'      // Phase 5 — requirements intake UI
  | 'F-output'      // Phase 6 — output assembly, zip download, git push
  | 'F-artifact'         // Phase 4b — AS v2.2 createArtifact runtime
  | 'F-multi-instance'   // Phase 4b — M-I v2.3 executeRun runtime
  | 'F-router'      // Sprint 8 Shot 2 — message routing infrastructure

// ─── Events ───────────────────────────────────────────────────────────────────

export type EventType   = 'immediate' | 'scheduled' | 'delayed' | 'reactive'
export type EventStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface LivEvent {
  id:            EventId
  type:          EventType
  slice:         FSlice
  name:          string
  payload:       Record<string, unknown>
  status:        EventStatus
  scheduledAt?:  Date
  delayMs?:      number
  afterEventId?: EventId
  createdAt:     Date
  processedAt?:  Date
  error?:        string
}

export interface EventSubscription {
  slice:     FSlice
  eventName: string
  handler:   string
}

export interface EventEmission {
  slice:     FSlice
  eventName: string
}

// ─── State ────────────────────────────────────────────────────────────────────

export interface StateNamespace {
  slice: FSlice
  keys:  string[]
}

export interface StateViolation {
  slice:     FSlice
  namespace: FSlice
  key:       string
}

// ─── Projects ────────────────────────────────────────────────────────────────

export interface Project {
  id:           ProjectId
  userId:       UserId
  name:         string
  repoPath?:    string
  constitution?: Constitution
  createdAt:    Date
  updatedAt:    Date
}

export interface Constitution {
  projectId:   ProjectId
  slices:      ConstitutionSlice[]
  confirmedAt: Date
  confirmedBy: UserId
}

export interface ConstitutionSlice {
  slice:       FSlice
  layers:      RLayer[]
  description: string
}

// ─── Commits ─────────────────────────────────────────────────────────────────

export type CommitAuthor = 'human' | 'ai'
export type ChangeCode   = 'C1' | 'C2' | 'C3' | 'C4' | 'C5'

export interface CommitRecord {
  id:           CommitId
  projectId:    ProjectId
  hash:         string
  message:      string
  slice:        FSlice
  layer:        RLayer
  changeCode:   ChangeCode
  author:       CommitAuthor
  confirmedBy?: UserId
  createdAt:    Date
}

// ─── Topography ───────────────────────────────────────────────────────────────

export type CellHealth = 'ok' | 'warning' | 'violation' | 'empty'

export interface TopographyCell {
  slice:      FSlice
  layer:      RLayer
  health:     CellHealth
  violations: string[]
}

export interface TopographySnapshot {
  projectId:   ProjectId
  cells:       TopographyCell[]
  capturedAt:  Date
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ExecutionCheckResult {
  slice:      FSlice
  passed:     boolean
  violations: string[]
  checkedAt:  Date
}

export interface HealthCheckResult {
  projectId:        ProjectId
  passed:           boolean
  stateViolations:  StateViolation[]
  eventViolations:  string[]
  layerViolations:  string[]
  designViolations: string[]
  checkedAt:        Date
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export type AIProvider = 'anthropic' | 'openai' | 'google' | 'custom'

export interface AIConfig {
  provider:  AIProvider
  apiKey:    string
  model:     string
  endpoint?: string
}

// ─── Git ──────────────────────────────────────────────────────────────────────

export type GitConnectorStatus = 'connected' | 'disconnected' | 'error'

export interface GitConnector {
  projectId:  ProjectId
  status:     GitConnectorStatus
  repoPath:   string
  lastSyncAt?: Date
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface ApiOk<T>  { ok: true;  data: T }
export interface ApiErr    { ok: false; error: string; code?: string }
export type ApiResult<T>   = ApiOk<T> | ApiErr
