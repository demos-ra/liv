// @liv-standard v1.3
// [F-planner/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    A1-nonstandard-dir
// slice:      F-planner
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  TEMPLATE_REGISTRY  →  F-planner/R2
//   W-ATOM  TemplateId         →  F-planner/R2
// deps:       none
// validated:  2026-03-12
//
// A1-nonstandard-dir amendment:
//   Standard R0 lives in types/. This file lives in templates/ because its content
//   is semantically a template registry rather than a domain type. It has zero imports
//   and zero I/O — it is behaviorally R0. templates/ is an A1-acknowledged extension
//   of the R0 layer for this slice only. IN-AUDIT treats it as R0.

// TPL-* slot registry. Pure declarations — zero I/O.
// Each template has a stable ID, a description, and slot names.
// Slot values are resolved at build time by IN-BUILD from IF contract fields.
// New templates: add an entry here, add the corresponding TPL-*.ts file.

export type TemplateId =
  | 'TPL-TYPES'
  | 'TPL-CONST'
  | 'TPL-EVENTS'
  | 'TPL-WIRES'
  | 'TPL-DOMAIN'
  | 'TPL-WORKFLOW'
  | 'TPL-CONTRACT'
  | 'TPL-HOOK'
  | 'TPL-INJECT'
  | 'TPL-DB'
  | 'TPL-IO'
  | 'TPL-ROUTE'
  | 'TPL-MIGRATION'

export type TemplateSlot = {
  name:        string
  description: string
  required:    boolean
  sourceField: string   // IF contract field that populates this slot
}

export type TemplateEntry = {
  id:          TemplateId
  description: string
  targetLayer: 'R0' | 'R1' | 'R2' | 'R3' | 'R4'
  targetDir:   string   // relative to slice root, e.g. 'types/'
  filePattern: string   // e.g. '{slice}-types.ts'
  slots:       TemplateSlot[]
}

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateEntry> = {
  'TPL-TYPES': {
    id:          'TPL-TYPES',
    description: 'R0 type declarations — entities, enums, result types, refs',
    targetLayer: 'R0',
    targetDir:   'types/',
    filePattern: '{slice}-types.ts',
    slots: [
      { name: 'SLICE_NAME',   description: 'F-slice identifier',        required: true,  sourceField: 'IF.03.slice' },
      { name: 'ATOM_TYPES',   description: 'Entity and enum types',      required: true,  sourceField: 'IF.02.atomDeclarations' },
      { name: 'RESULT_TYPE',  description: 'Scoped Result<T> alias',     required: true,  sourceField: 'IF.02.atomDeclarations' },
      { name: 'BRANDED_REFS', description: 'Branded ID types',           required: false, sourceField: 'IF.02.atomDeclarations' },
    ],
  },
  'TPL-CONST': {
    id:          'TPL-CONST',
    description: 'R0 compile-time constants and thresholds',
    targetLayer: 'R0',
    targetDir:   'types/',
    filePattern: '{slice}-const.ts',
    slots: [
      { name: 'SLICE_NAME',  description: 'F-slice identifier',         required: true, sourceField: 'IF.03.slice' },
      { name: 'CONSTANTS',   description: 'Named constant values',       required: true, sourceField: 'IF.02.atomDeclarations' },
      { name: 'NAMESPACE',   description: 'Slice namespace string',      required: true, sourceField: 'IF.03.slice' },
    ],
  },
  'TPL-EVENTS': {
    id:          'TPL-EVENTS',
    description: 'R0 event name constants and payload types',
    targetLayer: 'R0',
    targetDir:   'types/',
    filePattern: '{slice}-events.ts',
    slots: [
      { name: 'SLICE_NAME',     description: 'F-slice identifier',       required: true, sourceField: 'IF.03.slice' },
      { name: 'EVENT_NAMES',    description: 'Event name constants',      required: true, sourceField: 'IF.06.eventContracts' },
      { name: 'PAYLOAD_TYPES',  description: 'Event payload type shapes', required: true, sourceField: 'IF.06.eventContracts' },
    ],
  },
  'TPL-WIRES': {
    id:          'TPL-WIRES',
    description: 'R0 wire contract registry (@wire declarations)',
    targetLayer: 'R0',
    targetDir:   'types/',
    filePattern: '{slice}-wires.ts',
    slots: [
      { name: 'SLICE_NAME', description: 'F-slice identifier',           required: true, sourceField: 'IF.03.slice' },
      { name: 'WIRE_MAP',   description: 'Wire declarations from IF.05',  required: true, sourceField: 'IF.05.wireMap' },
    ],
  },
  'TPL-DOMAIN': {
    id:          'TPL-DOMAIN',
    description: 'R1 pure functions — validators, transformers, derivations',
    targetLayer: 'R1',
    targetDir:   'domain/',
    filePattern: '{slice}-logic.ts',
    slots: [
      { name: 'SLICE_NAME',     description: 'F-slice identifier',       required: true, sourceField: 'IF.03.slice' },
      { name: 'PURE_FUNCTIONS', description: 'Validator and transformer functions', required: true, sourceField: 'IF.04.flowIds' },
    ],
  },
  'TPL-WORKFLOW': {
    id:          'TPL-WORKFLOW',
    description: 'R2 async orchestration + IInterface declarations',
    targetLayer: 'R2',
    targetDir:   'workflow/',
    filePattern: '{slice}-workflow.ts',
    slots: [
      { name: 'SLICE_NAME',  description: 'F-slice identifier',          required: true, sourceField: 'IF.03.slice' },
      { name: 'INTERFACE',   description: 'W-INJECT interface shape',     required: true, sourceField: 'IF.05.wireMap' },
      { name: 'WORKFLOWS',   description: 'Async orchestration functions', required: true, sourceField: 'IF.04.flowIds' },
      { name: 'EVENTS',      description: 'emitEvent calls per IF.06',    required: true, sourceField: 'IF.06.eventContracts' },
    ],
  },
  'TPL-CONTRACT': {
    id:          'TPL-CONTRACT',
    description: 'R3 REST route handlers',
    targetLayer: 'R3',
    targetDir:   'contract/',
    filePattern: '{slice}-contract.ts',
    slots: [
      { name: 'SLICE_NAME',  description: 'F-slice identifier',          required: true, sourceField: 'IF.03.slice' },
      { name: 'ROUTES',      description: 'HTTP method handlers',         required: true, sourceField: 'IF.04.flowIds' },
      { name: 'AUTH_CHECK',  description: 'Session validation pattern',   required: true, sourceField: 'IF.08.acceptanceCriteria' },
    ],
  },
  'TPL-HOOK': {
    id:          'TPL-HOOK',
    description: 'R3 React client state hook',
    targetLayer: 'R3',
    targetDir:   'contract/',
    filePattern: '{slice}-hook.ts',
    slots: [
      { name: 'SLICE_NAME',  description: 'F-slice identifier',          required: true, sourceField: 'IF.03.slice' },
      { name: 'HOOK_SHAPE',  description: 'Hook state + action types',    required: true, sourceField: 'IF.02.atomDeclarations' },
      { name: 'ACTIONS',     description: 'Fetch actions per workflow',   required: true, sourceField: 'IF.04.flowIds' },
    ],
  },
  'TPL-INJECT': {
    id:          'TPL-INJECT',
    description: 'R3 W-INJECT binding factory',
    targetLayer: 'R3',
    targetDir:   'contract/',
    filePattern: '{slice}-inject.ts',
    slots: [
      { name: 'SLICE_NAME',   description: 'F-slice identifier',         required: true, sourceField: 'IF.03.slice' },
      { name: 'INTERFACE',    description: 'IInterface imported from R2', required: true, sourceField: 'IF.05.wireMap' },
      { name: 'DB_FUNCTIONS', description: 'R4 db function bindings',     required: true, sourceField: 'IF.05.wireMap' },
    ],
  },
  'TPL-DB': {
    id:          'TPL-DB',
    description: 'R4 database queries — typed rows, mappers, CRUD',
    targetLayer: 'R4',
    targetDir:   'exec/',
    filePattern: '{slice}-db.ts',
    slots: [
      { name: 'SLICE_NAME',  description: 'F-slice identifier',          required: true, sourceField: 'IF.03.slice' },
      { name: 'TABLE_NAME',  description: 'Primary DB table name',        required: true, sourceField: 'IF.07.migrationDelta' },
      { name: 'ROW_TYPE',    description: 'Typed row interface',          required: true, sourceField: 'IF.02.atomDeclarations' },
      { name: 'QUERIES',     description: 'CRUD query functions',         required: true, sourceField: 'IF.04.flowIds' },
    ],
  },
  'TPL-IO': {
    id:          'TPL-IO',
    description: 'R4 external API I/O wrapper',
    targetLayer: 'R4',
    targetDir:   'exec/',
    filePattern: '{slice}-io.ts',
    slots: [
      { name: 'SLICE_NAME',   description: 'F-slice identifier',         required: true, sourceField: 'IF.03.slice' },
      { name: 'ENDPOINT',     description: 'External service endpoint',   required: true, sourceField: 'IF.01.featureIntent' },
      { name: 'IO_FUNCTIONS', description: 'I/O function signatures',     required: true, sourceField: 'IF.04.flowIds' },
    ],
  },
  'TPL-ROUTE': {
    id:          'TPL-ROUTE',
    description: 'Next.js route file — thin shell importing R3 contract',
    targetLayer: 'R3',
    targetDir:   'src/app/api/{slice}/',
    filePattern: 'route.ts',
    slots: [
      { name: 'SLICE_NAME',    description: 'F-slice identifier',        required: true, sourceField: 'IF.03.slice' },
      { name: 'HTTP_METHODS',  description: 'GET/POST/PATCH/DELETE list', required: true, sourceField: 'IF.04.flowIds' },
      { name: 'CONTRACT_FUNS', description: 'Handler fn names from R3',   required: true, sourceField: 'IF.05.wireMap' },
    ],
  },
  'TPL-MIGRATION': {
    id:          'TPL-MIGRATION',
    description: 'SQL migration file — idempotent DDL',
    targetLayer: 'R4',
    targetDir:   'migrations/',
    filePattern: '{NNN}-{slice}.sql',
    slots: [
      { name: 'SLICE_NAME',   description: 'F-slice identifier',         required: true, sourceField: 'IF.03.slice' },
      { name: 'TABLE_DEFS',   description: 'CREATE TABLE IF NOT EXISTS',  required: true, sourceField: 'IF.07.migrationDelta' },
      { name: 'INDEX_DEFS',   description: 'CREATE INDEX IF NOT EXISTS',  required: false, sourceField: 'IF.07.migrationDelta' },
    ],
  },
}
