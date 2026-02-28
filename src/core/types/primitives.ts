// [core/types/primitives.ts]
// R5 — shared primitives. Zero dependencies outside Node built-ins.
// Source: consolidated from src/shared/id.ts + src/config/types.ts + src/F-types/shared/id.ts

import { randomUUID } from 'crypto'

// ─── ID generation ────────────────────────────────────────────────────────────

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

export type FSlice =
  | 'F-types'
  | 'F-design-system'
  | 'F-state-registry'
  | 'F-event-system'
  | 'F-la-config'
  | 'F-identity'
  | 'F-session'
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
  | 'F-workspace'
  | 'F-dashboard'
  | 'F-editor'
  | 'F-health-panel'
  | 'F-execution-panel'

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
