// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: v1.5
// slice: core
// layer: R5
// wires-in: none
// wires-out:
//   W-ATOM TEMPLATES → core/R5 liv-api
// deps:
//   R5 ./liv-standard.types
// validated: 2026-04-11

// ═══════════════════════════════════════════════════════════════
// §5 TEMPLATES — 14 entries, all with bodies
// Structure: Zone 1 (header/stamp) → Zone 2 (imports) → Zone 3 (declarations)
// IN-BUILD fills slots. Never modifies zones or removes constraints.
// ═══════════════════════════════════════════════════════════════

import type { TemplateId, Template } from './liv-standard.types'

export const TEMPLATES: Record<TemplateId, Template> = {

  // ─── R0 — Types ─────────────────────────────────────────────

  'TPL-R0-TYPES': {
    id: 'TPL-R0-TYPES',
    file: '{slice}-types.ts',
    layer: 'R0',
    slots: ['SLICE_NAME', 'ENTITY_NAME', 'ENTITY_FIELDS', 'SUMMARY_FIELDS', 'ENUM_NAME', 'ENUM_MEMBERS'],
    derived: [],
    system: ['STANDARD_VERSION'],
    platform: [],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R0]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, ENTITY_NAME, ENTITY_FIELDS, SUMMARY_FIELDS, ENUM_NAME, ENUM_MEMBERS

export type {ENTITY_NAME} = {
  id:        string
  {ENTITY_FIELDS}
  createdAt: number
  updatedAt: number
}
export type {ENTITY_NAME}Summary = Pick<{ENTITY_NAME}, "id" | {SUMMARY_FIELDS}>
export type {ENTITY_NAME}Delta   = Partial<Omit<{ENTITY_NAME}, "id" | "createdAt" | "updatedAt">>
export type {ENUM_NAME} = {ENUM_MEMBERS}`,
  },

  // ─── R0 — Events ────────────────────────────────────────────

  'TPL-R0-EVENTS': {
    id: 'TPL-R0-EVENTS',
    file: '{slice}-events.ts',
    layer: 'R0',
    slots: ['SLICE_NAME', 'EVENT_NAME', 'PAYLOAD_FIELDS'],
    derived: [
      { name: 'SLICE_UPPER', from: 'SLICE_NAME', transform: 'upperCase' },
      { name: 'slice_name', from: 'SLICE_NAME', transform: 'snakeCase' },
      { name: 'EventName', from: 'EVENT_NAME', transform: 'pascalCase' },
      { name: 'event-name', from: 'EVENT_NAME', transform: 'kebabCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: [],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R0]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, EVENT_NAME, PAYLOAD_FIELDS

export const {SLICE_UPPER}_EVENTS = {
  {EVENT_NAME}: "{slice_name}.{event-name}",
} as const

export type {EventName}Payload = {
  {PAYLOAD_FIELDS}
}`,
  },

  // ─── R0 — Constants ─────────────────────────────────────────
  // Pattern: F-project/types/project-const.ts

  'TPL-R0-CONST': {
    id: 'TPL-R0-CONST',
    file: '{slice}-const.ts',
    layer: 'R0',
    slots: ['SLICE_NAME', 'CONST_FIELDS'],
    derived: [
      { name: 'SLICE_UPPER', from: 'SLICE_NAME', transform: 'upperCase' },
      { name: 'slice_name', from: 'SLICE_NAME', transform: 'snakeCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: [],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R0]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, CONST_FIELDS
// A6: compile-time constants only. No logic. No derived values.

export const {SLICE_UPPER}_CONST = {
  {CONST_FIELDS}
} as const

export const {SLICE_UPPER}_NAMESPACE = '{slice_name}' as const`,
  },

  // ─── R0 — Wire Declarations ─────────────────────────────────
  // Pattern: F-project/types/project-wires.ts

  'TPL-R0-WIRES': {
    id: 'TPL-R0-WIRES',
    file: '{slice}-wires.ts',
    layer: 'R0',
    slots: ['SLICE_NAME', 'WIRE_TYPE', 'WIRE_ID', 'PAYLOAD_REF', 'WIRE_BLOCKS'],
    derived: [],
    system: ['STANDARD_VERSION'],
    platform: [],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R0]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, WIRE_TYPE, WIRE_ID, PAYLOAD_REF, WIRE_BLOCKS
// A1: F-{SLICE_NAME} owns every wire declared here.
// A6: all outbound wires declared at R0 of the defining slice.
// Consumer list derived by IN-AUDIT from manifest wires-in scan — never authored here.

// @wire
// type:    {WIRE_TYPE}
// id:      {WIRE_ID}
// payload: {PAYLOAD_REF}
// version: 1
// status:  active

{WIRE_BLOCKS}

export {}  // module marker — declarations live in @wire blocks above`,
  },

  // ─── R1 — Pure Logic ────────────────────────────────────────
  // Pattern: F-plan/domain/plan-logic.ts

  'TPL-R1-LOGIC': {
    id: 'TPL-R1-LOGIC',
    file: '{slice}-logic.ts',
    layer: 'R1',
    slots: ['SLICE_NAME', 'TYPES', 'VALIDATORS', 'TRANSFORMERS', 'BUILDERS'],
    derived: [
      { name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' },
      { name: 'SLICE_UPPER', from: 'SLICE_NAME', transform: 'upperCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: [],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R1]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, TYPES, VALIDATORS, TRANSFORMERS, BUILDERS
// A4: pure — no I/O, no throws, no side effects. R1 never logs.

import type { {TYPES} } from '../types/{slice}-types'
import { {SLICE_UPPER}_CONST } from '../types/{slice}-const'

// ── Validators ──────────────────────────────────────────────────

{VALIDATORS}

// ── Transformers ────────────────────────────────────────────────

{TRANSFORMERS}

// ── Builders ────────────────────────────────────────────────────

{BUILDERS}`,
  },

  // ─── R2 — CRUD Workflow ─────────────────────────────────────
  // Pattern: F-project/workflow/project-workflow.ts

  'TPL-R2-WF-CRUD': {
    id: 'TPL-R2-WF-CRUD',
    file: '{slice}-workflow.ts',
    layer: 'R2',
    slots: ['SLICE_NAME', 'ENTITY_NAME', 'CREATE_PAYLOAD', 'EVENT_PAYLOAD_TYPES', 'VALIDATION_FNS', 'DB_INTERFACE', 'CRUD_OPS'],
    derived: [
      { name: 'SLICE_UPPER', from: 'SLICE_NAME', transform: 'upperCase' },
      { name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' },
      { name: 'SliceName', from: 'SLICE_NAME', transform: 'pascalCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: ['PRIMITIVES_PATH', 'EVENT_BUS_PATH'],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R2]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, ENTITY_NAME, CREATE_PAYLOAD, EVENT_PAYLOAD_TYPES, VALIDATION_FNS, DB_INTERFACE, CRUD_OPS
// A2: R2 never imports R4. A4: all I/O via injected interface.
// FL-CRUD: R3 validates → R2 orchestrates → R4 persists → event emit.

import { generateId }  from '{PRIMITIVES_PATH}'
import type { Result } from '{PRIMITIVES_PATH}'
import { emitEvent }   from '{EVENT_BUS_PATH}'
import type {
  {ENTITY_NAME},
  {ENTITY_NAME}Delta,
  {CREATE_PAYLOAD},
} from '../types/{slice}-types'
import { {SLICE_UPPER}_EVENTS, {EVENT_PAYLOAD_TYPES} } from '../types/{slice}-events'
import { {VALIDATION_FNS} } from '../domain/{slice}-logic'

// ── W-INJECT — interface declared at R2, implemented at R4 ──────
// A2: R2 never imports R4. R4 receives this interface and implements it.

export interface I{SliceName}Db {
  {DB_INTERFACE}
}

// ── Workflows ───────────────────────────────────────────────────

{CRUD_OPS}`,
  },

  // ─── R2 — Stream Workflow ───────────────────────────────────
  // Pattern: F-ai-adapter/app/ai-adapter-workflow.ts (corrected to W-INJECT)

  'TPL-R2-WF-STREAM': {
    id: 'TPL-R2-WF-STREAM',
    file: '{slice}-workflow.ts',
    layer: 'R2',
    slots: ['SLICE_NAME', 'TYPES', 'LOGIC_FNS', 'CHUNK_TYPE', 'STREAM_INTERFACE', 'STREAM_FN', 'PARAMS', 'STREAM_OP', 'STREAM_PARAMS', 'SHOULD_RETRY', 'RETRY_DELAY', 'ERROR_EVENT', 'ERROR_CONTEXT'],
    derived: [
      { name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' },
      { name: 'SliceName', from: 'SLICE_NAME', transform: 'pascalCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: ['EVENT_BUS_PATH'],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R2]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, TYPES, LOGIC_FNS, CHUNK_TYPE, STREAM_INTERFACE, STREAM_FN, PARAMS, STREAM_OP, STREAM_PARAMS, SHOULD_RETRY, RETRY_DELAY, ERROR_EVENT, ERROR_CONTEXT
// A2: R2 never imports R4. A4: stream lifecycle owned by R2.
// FL-STREAM: R2 opens → R4 reads chunks → R2 routes → R3 hook owns delivery.
// One owner for stream lifecycle.

import type { {TYPES} } from '../types/{slice}-types'
import { {LOGIC_FNS} }  from '../domain/{slice}-logic'
import { emitEvent }    from '{EVENT_BUS_PATH}'

// ── W-INJECT — interface declared at R2, implemented at R4 ──────
// A2: R2 never imports R4. R4 receives this interface and implements it.

export interface I{SliceName}Stream {
  {STREAM_INTERFACE}
}

// ── Stream workflow ─────────────────────────────────────────────

export async function* {STREAM_FN}(
  deps: { stream: I{SliceName}Stream },
  {PARAMS}
): AsyncGenerator<{CHUNK_TYPE}> {
  let attempt = 0

  while (true) {
    try {
      yield* deps.stream.{STREAM_OP}({STREAM_PARAMS})
      return
    } catch (err) {
      if ({SHOULD_RETRY}) {
        await sleep({RETRY_DELAY})
        attempt++
        continue
      }
      await emitEvent({ type: {ERROR_EVENT}, payload: { {ERROR_CONTEXT} } })
      throw err
    }
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}`,
  },

  // ─── R2 — Auth Workflow ─────────────────────────────────────
  // Pattern: F-identity/app/auth-workflow.ts (corrected to W-INJECT)

  'TPL-R2-WF-AUTH': {
    id: 'TPL-R2-WF-AUTH',
    file: '{slice}-workflow.ts',
    layer: 'R2',
    slots: ['SLICE_NAME', 'AUTH_TYPES', 'VALIDATION_FNS', 'DB_INTERFACE', 'EMAIL_INTERFACE', 'AUTH_DEPS', 'AUTH_OPS'],
    derived: [
      { name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' },
      { name: 'SLICE_UPPER', from: 'SLICE_NAME', transform: 'upperCase' },
      { name: 'SliceName', from: 'SLICE_NAME', transform: 'pascalCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: [],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R2]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, AUTH_TYPES, VALIDATION_FNS, DB_INTERFACE, EMAIL_INTERFACE, AUTH_DEPS, AUTH_OPS
// A2: R2 never imports R4. A4: all I/O via injected interface.
// FL-AUTH: R3 extract token → R2 validate → R4 read session → R3 receives result.
// R3 never reads DB. R2 never skips validation.

import type { {AUTH_TYPES} } from '../types/{slice}-types'
import { {SLICE_UPPER}_EVENTS } from '../types/{slice}-events'
import { {VALIDATION_FNS} } from '../domain/{slice}-logic'

// ── W-INJECT — interfaces declared at R2, implemented at R4 ────
// A2: R2 never imports R4. R4 receives these interfaces and implements them.

export interface I{SliceName}Db {
  {DB_INTERFACE}
}

export interface I{SliceName}Email {
  {EMAIL_INTERFACE}
}

// ── Workflow deps ───────────────────────────────────────────────

export interface {SliceName}WorkflowDeps {
  db: I{SliceName}Db
  email: I{SliceName}Email
  eventBus: { emit: (event: unknown) => Promise<void> }
  {AUTH_DEPS}
}

// ── Auth operations ─────────────────────────────────────────────

{AUTH_OPS}`,
  },

  // ─── R2 — Job Workflow ──────────────────────────────────────
  // Derived from T2.1 FL-JOB invariant

  'TPL-R2-WF-JOB': {
    id: 'TPL-R2-WF-JOB',
    file: '{slice}-workflow.ts',
    layer: 'R2',
    slots: ['SLICE_NAME', 'TYPES', 'LOGIC_FNS', 'JOB_DB_METHODS', 'JOB_PAYLOAD', 'JOB_RESULT', 'JOB_HANDLER', 'COMPLETION_EVENT', 'RESULT_CONTEXT', 'DEAD_LETTER_EVENT'],
    derived: [
      { name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' },
      { name: 'SliceName', from: 'SLICE_NAME', transform: 'pascalCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: ['EVENT_BUS_PATH', 'PRIMITIVES_PATH'],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R2]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, TYPES, LOGIC_FNS, JOB_DB_METHODS, JOB_PAYLOAD, JOB_RESULT, JOB_HANDLER, COMPLETION_EVENT, RESULT_CONTEXT, DEAD_LETTER_EVENT
// A4: all I/O via injected interface.
// FL-JOB: No R3 involved. Errors go to dead-letter.
// Scheduler → R2 → R4 I/O → event emit on completion.

import type { {TYPES} } from '../types/{slice}-types'
import type { Result } from '{PRIMITIVES_PATH}'
import { {LOGIC_FNS} } from '../domain/{slice}-logic'
import { emitEvent }   from '{EVENT_BUS_PATH}'

export interface I{SliceName}JobDb {
  {JOB_DB_METHODS}
}

export async function runJob(
  deps: { db: I{SliceName}JobDb },
  payload: {JOB_PAYLOAD}
): Promise<Result<{JOB_RESULT}>> {
  try {
    {JOB_HANDLER}

    await emitEvent({ type: {COMPLETION_EVENT}, payload: { {RESULT_CONTEXT} } })
    return { ok: true, data: result }
  } catch (err) {
    await emitEvent({ type: {DEAD_LETTER_EVENT}, payload: { error: err instanceof Error ? err.message : 'unknown' } })
    return { ok: false, error: { code: 'JOB_FAILED', message: err instanceof Error ? err.message : 'unknown' } }
  }
}`,
  },

  // ─── R3 — Contract (API Routes) ─────────────────────────────
  // Pattern: F-output/contract/output-contract.ts

  'TPL-R3-CONTRACT': {
    id: 'TPL-R3-CONTRACT',
    file: '{slice}-contract.ts',
    layer: 'R3',
    slots: ['SLICE_NAME', 'WORKFLOW_FNS', 'INJECT_FACTORY', 'INPUT_OUTPUT_ATOMS', 'ROUTE_HANDLERS'],
    derived: [{ name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' }],
    system: ['STANDARD_VERSION'],
    platform: ['FRAMEWORK_SERVER', 'AUTH_CONTRACT_PATH', 'FRAMEWORK_SERVER_PATH', 'AUTH_CONTRACT', 'REQUEST_TYPE'],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R3]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, WORKFLOW_FNS, INJECT_FACTORY, INPUT_OUTPUT_ATOMS, ROUTE_HANDLERS
// A2: R3 never calls R4 directly.
// A3: R3 validates shape — schema, required fields, format.
// R3 maps Result to HTTP status code — never exposes raw error internals.
//
// Sprint 6 Shot 3 wire-in note (template-tier): scaffolding tooling supplying
// AUTH_CONTRACT + AUTH_CONTRACT_PATH placeholders should set:
//   AUTH_CONTRACT      = 'getPerimeterSession'
//   AUTH_CONTRACT_PATH = '@/features/F-identity/contract/perimeter-consultation'
// per Perimeter Standard v1.0 §6.9 (perimeter consultation surface) — distributed
// validateSession pattern dissolved by F-005 closure.

import { {FRAMEWORK_SERVER} } from '{FRAMEWORK_SERVER_PATH}'
import { {AUTH_CONTRACT} } from '{AUTH_CONTRACT_PATH}'
import { {WORKFLOW_FNS} } from '../workflow/{slice}-workflow'
import { {INJECT_FACTORY} } from './{slice}-inject'
import type { {INPUT_OUTPUT_ATOMS} } from '../types/{slice}-types'

// A3: R3 extracts identity into RequestContext before calling R2.
// R2 receives RequestContext — never reads session directly.
// Sprint 6 Shot 3: perimeter validates at unitary site (src/middleware.ts);
// R3 reads middleware-set headers via getPerimeterSession per Perimeter Standard v1.0 §6.9.

async function getSession(req: {REQUEST_TYPE}) {
  return getPerimeterSession(req)
}

{ROUTE_HANDLERS}`,
  },

  // ─── R3 — Hook ──────────────────────────────────────────────

  'TPL-R3-HOOK': {
    id: 'TPL-R3-HOOK',
    file: '{slice}-hook.ts',
    layer: 'R3',
    slots: ['SLICE_NAME', 'ENTITY_NAME', 'WORKFLOW_FN', 'ACTION_NAME', 'ACTION_PARAMS', 'WORKFLOW_CALL'],
    derived: [
      { name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' },
      { name: 'SliceName', from: 'SLICE_NAME', transform: 'pascalCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: ['PRIMITIVES_PATH', 'STATE_IMPORTS', 'STATE_LIB', 'STATE_HOOK', 'CALLBACK_HOOK'],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R3]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, ENTITY_NAME, WORKFLOW_FN, ACTION_NAME, ACTION_PARAMS, WORKFLOW_CALL, STATE_HOOK, CALLBACK_HOOK
// Actions are fire-and-forget. Consumer reads result from state, not return value.

import { {STATE_IMPORTS} } from '{STATE_LIB}'
import type { {ENTITY_NAME} }   from '../types/{slice}-types'
import type { AppError }         from '{PRIMITIVES_PATH}'
import { {WORKFLOW_FN} }         from '../workflow/{slice}-workflow'

export type {SliceName}Hook = {
  data:   {ENTITY_NAME} | null
  status: "idle" | "loading" | "error" | "success"
  error:  AppError | null
  {ACTION_NAME}: ({ACTION_PARAMS}) => void
}

export function use{SliceName}(): {SliceName}Hook {
  const [data,   setData]   = {STATE_HOOK}<{ENTITY_NAME} | null>(null)
  const [status, setStatus] = {STATE_HOOK}<{SliceName}Hook["status"]>("idle")
  const [error,  setError]  = {STATE_HOOK}<AppError | null>(null)
  const {ACTION_NAME} = {CALLBACK_HOOK}(async ({ACTION_PARAMS}) => {
    setStatus("loading")
    const result = await {WORKFLOW_CALL}
    if (result.ok) { setData(result.data); setStatus("success") }
    else           { setError(result.error); setStatus("error") }
  }, [])
  return { data, status, error, {ACTION_NAME} }
}`,
  },

  // ─── R3 — UI Component ─────────────────────────────────────
  // Pattern: F-admin/contract/admin-ui.tsx

  'TPL-R3-UI': {
    id: 'TPL-R3-UI',
    file: '{slice}-ui.tsx',
    layer: 'R3',
    slots: ['SLICE_NAME', 'TYPES', 'COMPONENT_NAME', 'ACTIONS', 'LOADING_JSX', 'ERROR_JSX', 'JSX'],
    derived: [
      { name: 'SliceName', from: 'SLICE_NAME', transform: 'pascalCase' },
      { name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: ['CLIENT_DIRECTIVE', 'UI_LIB', 'UI_IMPORTS'],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R3]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, TYPES, COMPONENT_NAME, ACTIONS, LOADING_JSX, ERROR_JSX, JSX
// A2: R3 imports R0-R2 only. UI reads hook.error — displays user-facing message only.
// No direct R4 calls. No raw error internals.

{CLIENT_DIRECTIVE}

import { {UI_IMPORTS} } from '{UI_LIB}'
import { use{SliceName} }  from './{slice}-hook'
import type { {TYPES} }    from '../types/{slice}-types'

export function {COMPONENT_NAME}() {
  const { data, status, error, {ACTIONS} } = use{SliceName}()

  if (status === 'loading') return {LOADING_JSX}
  if (status === 'error')   return {ERROR_JSX}

  return (
    {JSX}
  )
}`,
  },

  // ─── R4 — Database ──────────────────────────────────────────

  'TPL-R4-DB': {
    id: 'TPL-R4-DB',
    file: '{slice}-db.ts',
    layer: 'R4',
    slots: ['SLICE_NAME', 'TABLE_NAME', 'ENTITY_NAME', 'ROW_FIELDS', 'ROW_MAPPING'],
    derived: [
      { name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: ['DB_CLIENT_PATH', 'PRIMITIVES_PATH'],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R4]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, TABLE_NAME, ENTITY_NAME, ROW_FIELDS, ROW_MAPPING
// No business logic. No throws. All functions return Result<T>.

import { db }                                    from '{DB_CLIENT_PATH}'
import type { {ENTITY_NAME}, {ENTITY_NAME}Delta } from '../types/{slice}-types'
import type { Result }                            from '{PRIMITIVES_PATH}'

type {ENTITY_NAME}Row = { {ROW_FIELDS} }

export async function get{ENTITY_NAME}(id: string): Promise<Result<{ENTITY_NAME}>> {
  const result = await db.query<{ENTITY_NAME}Row>(
    \`SELECT {ROW_FIELDS} FROM {TABLE_NAME} WHERE id = $1\`, [id]
  )
  if (!result.rows[0]) return { ok:false, error:{ code:"NOT_FOUND", message:"{ENTITY_NAME} not found" } }
  return { ok:true, data: mapRow(result.rows[0]) }
}

function mapRow(r: {ENTITY_NAME}Row): {ENTITY_NAME} {
  return { {ROW_MAPPING} }
}`,
  },

  // ─── R4 — External I/O ─────────────────────────────────────
  // Pattern: F-ai-adapter/exec/ai-io.ts

  'TPL-R4-IO': {
    id: 'TPL-R4-IO',
    file: '{slice}-io.ts',
    layer: 'R4',
    slots: ['SLICE_NAME', 'TYPES', 'CONFIG_RESOLUTION', 'SERVICE_OPS'],
    derived: [
      { name: 'slice', from: 'SLICE_NAME', transform: 'kebabCase' },
    ],
    system: ['STANDARD_VERSION'],
    platform: ['PRIMITIVES_PATH'],
    body: `\
// @liv-standard {STANDARD_VERSION}
// [F-{SLICE_NAME}/R4]
// Built with LIV · livai.dev
// Slots: SLICE_NAME, TYPES, CONFIG_RESOLUTION, SERVICE_OPS
// A4: all external I/O lives here — no other file touches this service.
// A1: one R4 file per external service.
// Every function returns Result<T> — no raw throws. Dev stub implements same interface.

import type { {TYPES} }            from '../types/{slice}-types'
import type { Result }             from '{PRIMITIVES_PATH}'

// ── Config / key resolution ─────────────────────────────────────

{CONFIG_RESOLUTION}

// ── Service operations ──────────────────────────────────────────

{SERVICE_OPS}`,
  },

} as const
