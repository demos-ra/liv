// @liv-standard v1.3
// [core/types/primitives.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      core
// layer:      R5
// wires-in:   none
// wires-out:
//   W-ATOM  Result    →  all slices
//   W-ATOM  AppError  →  all slices
// deps:       none
// validated:  2026-03-12

// R5: shared infrastructure. Zero domain logic. Zero slice-specific types.
// Phase 3: added canonical Result<T> and AppError per LIV-Standard T1.6 (AK-RES).
// Slices may define scoped result aliases (e.g. ProjectResult<T>) that use this shape.

import { randomUUID } from 'crypto'

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

export type UserId      = string
export type ProjectId   = string
export type SliceId     = string
export type EventId     = string
export type CommitId    = string

// ─── R Layers ────────────────────────────────────────────────────────────────

export type RLayer = 'R0' | 'R1' | 'R2' | 'R3' | 'R4'

// Step 4: F-types, F-state-registry absorbed into core/types/.
//         F-workspace deferred to Phase 2 (IDE surface) — not yet built.
//         Axiom cite: A7 — deletability. Phantom slices removed.
// Step 3: F-executor added — Docker execution slice. FSlice count +1; STATE_NAMESPACES parity maintained.
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
  | 'F-codec'       // W3 — cognitive codec slice
  | 'F-planner'     // Phase 4 — pipeline orchestration
  | 'F-intake'      // Phase 5 — requirements intake UI
  | 'F-output'      // Phase 6 — output assembly, zip download, git push

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
