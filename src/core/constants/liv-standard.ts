// @liv-standard v1.5.2
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.2
// amended: v1.5
// slice: core
// layer: R5
// wires-in: none
// wires-out:
//   W-ATOM LIV_STANDARD → core/R5 liv-renderer
//   W-ATOM LIV_STANDARD → core/R5 liv-api
// deps:
//   R5 ./liv-standard.types
// validated: 2026-04-11

import type {
  LivStandard,
} from './liv-standard.types'

export const LIV_STANDARD: LivStandard = {

  version: 'v1.5.2',

  axioms: {
    A1: { id: 'A1', name: 'Single ownership',       text: 'Every construct belongs to exactly one category and one owner.', frozen: true },
    A2: { id: 'A2', name: 'Directional dependency',  text: 'Dependencies flow toward lower layers only. No upward imports. No lateral imports across slice boundaries.', frozen: true },
    A3: { id: 'A3', name: 'Typed boundaries',        text: 'State crosses boundaries through declared atom types only. Raw or untyped data never crosses a slice boundary.', frozen: true },
    A4: { id: 'A4', name: 'Isolated execution',      text: 'I/O executes at R4 only. Business logic executes outside R4 only.', frozen: true },
    A5: { id: 'A5', name: 'Event-only notification', text: 'Cross-slice notification uses the event bus only. Slices never call each other directly.', frozen: true },
    A6: { id: 'A6', name: 'Declaration at origin',   text: 'Every construct is declared at R0 of its owning slice. Nothing is declared where it is not owned.', frozen: true },
    A7: { id: 'A7', name: 'Deletability',            text: 'A slice is complete when it can be deleted and no file outside it breaks.', frozen: true },
  },

  sections: {
    'T0':   { id: 'T0',   tier: 'T0', name: 'Axioms — System Invariants',       preamble: 'Seven axioms. Every rule in every tier cites at least one. Violation of an axiom is a structural failure, not a style issue.', enforcement: 'pipeline', instances: ['IN-MAIN','IN-BUILD','IN-RESOLVE','IN-QA','IN-DIAGNOSE'] },
    'T1.1': { id: 'T1.1', tier: 'T1', name: 'Layer Model',                      preamble: 'Every file in a slice belongs to exactly one layer. Layer determines what it may import, what it may export, and what it may execute.', enforcement: 'pipeline', instances: ['IN-BUILD','IN-DIAGNOSE'], tables: { layers: [{ layer: 'R0', dir: 'types/', contains: 'Atom declarations, events, constants', imports: 'nothing', exports: 'anything' },{ layer: 'R1', dir: 'domain/', contains: 'Pure functions, validators, transformers', imports: 'R0 only', exports: 'R2, R3, R4 of same slice only' },{ layer: 'R2', dir: 'workflow/', contains: 'Async orchestration, use-cases', imports: 'R0, R1', exports: 'R3, R4 directly — use interface' },{ layer: 'R3', dir: 'contract/', contains: 'API surface, hooks, UI components', imports: 'R0, R1, R2', exports: 'Consumed by other slices via W-HOOK. Never imported by R4.' },{ layer: 'R4', dir: 'exec/', contains: 'DB queries, external I/O only', imports: 'R0 only', exports: 'Implements interfaces declared at R2 (W-INJECT). Never directly imported.' },{ layer: 'R5', dir: 'core/', contains: 'Shared infrastructure, standard definitions, db client', imports: 'nothing domain', exports: 'Any layer of any slice via liv-api.ts' }] } },
    'T1.2': { id: 'T1.2', tier: 'T1', name: 'Bundle Anatomy',                   preamble: 'A bundle is the unit of feature delivery. One slice = one directory = one R0-R4 stack. Partial bundles are valid. Missing layers are absent, not broken. app/ is an alias for workflow/ (R2). config/ is an alias for types/ (R0). Layer assignment follows the alias target.', enforcement: 'pipeline', instances: ['IN-BUILD'], tables: { bundleFiles: [{ file: '{slice}-types.ts', layer: 'R0', role: 'entities, enums, result types, refs' },{ file: '{slice}-events.ts', layer: 'R0', role: 'event name constants + payload types' },{ file: '{slice}-const.ts', layer: 'R0', role: 'compile-time constants and thresholds' },{ file: '{slice}-wires.ts', layer: 'R0', role: 'wire contract declarations' },{ file: '{slice}-logic.ts', layer: 'R1', role: 'pure functions — no I/O, no state' },{ file: '{slice}-workflow.ts', layer: 'R2', role: 'async orchestrators — calls R4 via injected interface' },{ file: '{slice}-contract.ts', layer: 'R3', role: 'API routes' },{ file: '{slice}-hook.ts', layer: 'R3', role: 'state bridge hook' },{ file: '{slice}-ui.tsx', layer: 'R3', role: 'presentation only' },{ file: '{slice}-db.ts', layer: 'R4', role: 'database queries' },{ file: '{slice}-io.ts', layer: 'R4', role: 'external API calls' }] } },
    'T1.3': { id: 'T1.3', tier: 'T1', name: 'Compliance Stamp',                 preamble: 'Every file in a LIV-compliant build carries a stamp in the header. Present on every generated file. Not optional.', enforcement: 'pipeline', instances: ['IN-AUDIT'], templates: ['// @liv-standard {STANDARD_VERSION}','// [F-{slice}/R{N}]','// Built with LIV · livai.dev'] },
    'T1.4': { id: 'T1.4', tier: 'T1', name: 'Category Table',                   preamble: 'Every construct belongs to exactly one category. Category determines ownership, location, and cross-boundary rules.', enforcement: 'pipeline', instances: ['IN-MAIN','IN-RESOLVE'], tables: { categories: [{ name: 'Atom', what: 'Type, interface, const, enum', location: 'R0 of owner', axioms: 'A1,A6', rule: 'Import by type only. Never redeclare.' },{ name: 'Logic', what: 'Pure function, transformer, validator', location: 'R1 of owner', axioms: 'A2', rule: 'Never exported across slices.' },{ name: 'Workflow', what: 'Async use-case orchestrator', location: 'R2 of owner', axioms: 'A2,A4', rule: 'Called by R3 of same slice only.' },{ name: 'Contract', what: 'API route, state hook, UI component', location: 'R3 of owner', axioms: 'A2,A3', rule: 'Hook is the only external surface.' },{ name: 'Exec', what: 'DB query, external I/O call', location: 'R4 of owner', axioms: 'A4', rule: 'Never called directly. Via injected interface from R2.' },{ name: 'Event', what: 'Event name constant + payload atom', location: 'R0 of emitter', axioms: 'A5,A6', rule: 'Consumed via event-schema barrel only.' },{ name: 'Bundle', what: 'Complete R0-R4 slice directory', location: 'F-{slice}/', axioms: 'A7', rule: 'Connected via 4 wire types only.' },{ name: 'Core', what: 'Shared infra: db client, primitives', location: 'core/ (R5)', axioms: 'A1', rule: 'Any layer may import. Zero domain logic.' },{ name: 'Flow', what: 'Canonical multi-step execution pattern', location: 'LIV-Standard T2', axioms: 'A3', rule: 'Implemented per bundle. Not shared code.' },{ name: 'Wire', what: 'Connection mechanism between bundles', location: 'LIV-Standard T1', axioms: 'A2,A5', rule: 'Exactly 4 types. No other mechanism valid.' }] } },
    'T1.5': { id: 'T1.5', tier: 'T1', name: 'Wires',                            preamble: 'Exactly four wire types. Choosing the wrong wire is a structural violation. No other connection mechanism between bundles is valid.', enforcement: 'pipeline', instances: ['IN-MAIN','IN-RESOLVE','IN-AUDIT','IN-DIAGNOSE'] },
    'T1.6': { id: 'T1.6', tier: 'T1', name: 'Atom Taxonomy',                    preamble: 'Atoms are the typed contracts that travel across wires. Declared at R0. Imported by type. Never contain logic.', enforcement: 'pipeline', instances: ['IN-BUILD'], tables: { atomKinds: [{ id: 'AK-ENT', kind: 'Entity', description: 'Named domain object with identity. Entities with ownership carry an ownerId: string field.', examples: 'AuthUser, Project, Session' },{ id: 'AK-PAY', kind: 'Payload', description: 'Data carried by an event or API call', examples: 'SessionPayload, MessageChunk, CommitPayload' },{ id: 'AK-RES', kind: 'Result', description: 'Typed success/failure envelope', examples: 'Result<T> = {ok:true,data:T}|{ok:false,error:Err}' },{ id: 'AK-CONST', kind: 'Const', description: 'Compile-time constant or tunable threshold', examples: 'SESSION_CONST, CHAT_CONST, PAGE_SIZE' },{ id: 'AK-ENUM', kind: 'Enum', description: 'Closed set of named string values', examples: 'NotificationKind, SessionStatus, Role' },{ id: 'AK-REF', kind: 'Ref', description: 'Stable branded identifier for an entity', examples: "type UserId = string & {_brand:'UserId'}" },{ id: 'AK-SUM', kind: 'Summary', description: 'Read-optimized projection of an Entity', examples: 'ProjectSummary, NotificationItem' },{ id: 'AK-DELTA', kind: 'Delta', description: 'Partial mutation shape for update operations', examples: 'ProjectDelta = Partial<Omit<Project,"id">>' }] } },
    'T2.1': { id: 'T2.1', tier: 'T2', name: 'Flows',                            preamble: 'A flow is a canonical execution sequence. Every implementation in any bundle follows the same step sequence. Deviation is a violation.', enforcement: 'pipeline', instances: ['IN-BUILD'] },
    'T2.2': { id: 'T2.2', tier: 'T2', name: 'Error Propagation',                preamble: 'Errors have a canonical shape and propagation path. Untyped error throwing is a violation of A3.', enforcement: 'reference', instances: [], templates: ['type Result<T, E = AppError> = | { ok: true; data: T } | { ok: false; error: E }','type AppError = { code: string; message: string; context?: Record<string, unknown> }'] },
    'T2.3': { id: 'T2.3', tier: 'T2', name: 'External Service Wrapping',        preamble: 'Every external service is wrapped at R4 behind an interface declared at R2.', enforcement: 'pipeline', instances: ['IN-BUILD'] },
    'T3.1': { id: 'T3.1', tier: 'T3', name: 'State Taxonomy',                   preamble: 'Every piece of state belongs to exactly one category. Category determines ownership, location, and boundary rules.', enforcement: 'pipeline', instances: ['IN-BUILD'], tables: { stateKinds: [{ kind: 'Server', location: 'R4 exec layer', storage: 'DB / external', boundary: 'Via Result<T> atom through R2 → R3' },{ kind: 'Workflow', location: 'R2 workflow function', storage: 'Local scope only', boundary: 'Never. Scoped to one execution.' },{ kind: 'Client', location: 'R3 hook — platform state primitive', storage: 'Component tree', boundary: 'Via prop or context. Never to another slice.' },{ kind: 'Derived', location: 'R1 pure function', storage: 'None — recomputed', boundary: 'Via R1 function call. Never persisted.' },{ kind: 'Shared', location: 'Emitting slice owns', storage: 'Event bus payload', boundary: 'Via W-EVENT only. Never direct reference.' },{ kind: 'Cache', location: 'R3 hook', storage: 'Memory / optional', boundary: 'Via W-HOOK only.' }] } },
    'T3.2': { id: 'T3.2', tier: 'T3', name: 'Hook Contract Shape',              preamble: 'The W-HOOK is the only state surface a bundle exposes externally. Return shape is canonical.', enforcement: 'pipeline', instances: ['IN-BUILD','IN-RESOLVE'], templates: ['export function use{Slice}(): {Slice}Hook { return { data: {Slice}Entity | null, status: "idle"|"loading"|"error"|"success", error: AppError | null } }'] },
    'T4.1': { id: 'T4.1', tier: 'T4', name: 'Auth Boundary',                    preamble: 'Permission checks have a fixed location in the layer model. A check at the wrong layer is a security violation, not a style issue.', enforcement: 'pipeline', instances: ['IN-BUILD', 'IN-QA'], tables: { authByLayer: [{ layer: 'R3', does: 'Session extraction, identity verification, role check. Public routes annotated @public skip auth — all other routes require auth.', must: 'Reject unauthenticated requests', never: 'Execute business logic before auth check' },{ layer: 'R2', does: 'Permission check against domain rules. Ownership verified via RequestContext.userId === entity.ownerId', must: 'Read session from context, check ownership', never: 'Read DB directly to verify permissions' },{ layer: 'R4', does: 'None', must: 'Execute queries for authorized user', never: 'Make authorization decisions' },{ layer: 'R1', does: 'None', must: 'Accept userId as pure function parameter', never: 'Read session or context' },{ layer: 'R0', does: 'Declare Role and Permission atom types', must: 'Define Role, Permission enums', never: 'Contain any auth logic' }] } },
    'T4.2': { id: 'T4.2', tier: 'T4', name: 'Validation Boundary',              preamble: 'Data that reaches R2 is always valid. Data that reaches R4 is always valid and authorized.', enforcement: 'pipeline', instances: ['IN-QA'] },
    'T5.1': { id: 'T5.1', tier: 'T5', name: 'Test Taxonomy',                    preamble: 'Test type is determined by the layer under test. Testing at the wrong layer with the wrong type produces false confidence.', enforcement: 'reference', instances: [], tables: { testTypes: [{ layer: 'R1', type: 'Unit', validates: 'Pure function input → output correctness', mocks: 'None — no I/O to mock', location: '{slice}/domain/__tests__/' },{ layer: 'R2', type: 'Integration', validates: 'Workflow orchestration with injected mock deps', mocks: 'R4 interface implementations', location: '{slice}/workflow/__tests__/' },{ layer: 'R3', type: 'Contract', validates: 'API shape and HTTP status correctness', mocks: 'Full R2 workflow stub', location: '{slice}/contract/__tests__/' },{ layer: 'R4', type: 'Integration', validates: 'DB queries against test DB — no mocks', mocks: 'None — real I/O only', location: '{slice}/exec/__tests__/' },{ layer: 'Cross', type: 'E2E', validates: 'Full flow from trigger to observable outcome', mocks: 'None', location: 'e2e/{flow-name}.test.ts' }] } },
    'T5.2': { id: 'T5.2', tier: 'T5', name: 'Observability',                    preamble: 'Structured logging has a canonical shape. Every log entry is machine-parseable.', enforcement: 'reference', instances: [], templates: ['type LogEntry = { level: "debug"|"info"|"warn"|"error"; event: string; message: string; slice: string; layer: "R0"|"R1"|"R2"|"R3"|"R4"; timestamp: string; context?: Record<string, unknown> }'] },
    'T5.3': { id: 'T5.3', tier: 'T5', name: 'Compliance Checks',                preamble: '', enforcement: 'pipeline', instances: ['IN-RESOLVE','IN-AUDIT','IN-QA'] },
    'T5.4': { id: 'T5.4', tier: 'T5', name: 'TS Error → Violation Mapping',     preamble: 'Every compiler error maps to exactly one violation. IN-COMPILE uses this table to fix without domain knowledge.', enforcement: 'pipeline', instances: ['IN-COMPILE','IN-DIAGNOSE'] },
    'T6.1': { id: 'T6.1', tier: 'T6', name: 'Instance Team',                    preamble: 'Instances are independent AI context windows. Each has one job. Wrong instance for a job produces wrong output.', enforcement: 'reference', instances: [] },
    'T6.2': { id: 'T6.2', tier: 'T6', name: 'Information Flow Contract',        preamble: 'IN-MAIN cannot decompose until all required fields are populated. Empty required field stops the build and returns to Human. IN-MAIN resolves all technically deterministic fields autonomously. A field returns to Human only when its value requires domain authority.', enforcement: 'pipeline', instances: ['IN-MAIN'] },
    'T6.3': { id: 'T6.3', tier: 'T6', name: 'Build Sequence',                   preamble: '', enforcement: 'pipeline', instances: ['IN-MAIN'] },
    'T6.4': { id: 'T6.4', tier: 'T6', name: 'Wire Change Protocol',             preamble: '', enforcement: 'reference', instances: [] },
    'T6.5': { id: 'T6.5', tier: 'T6', name: 'Standard Evolution',               preamble: '', enforcement: 'pipeline', instances: ['IN-MAIN'] },
  },

  rules: {
    'T1.3-R1':   { id: 'T1.3-R1',   section: 'T1.3', axiom: 'A1', text: 'Stamp is line 1–3. Precedes all imports and declarations.', instances: ['IN-AUDIT'] },
    'T1.3-R2':   { id: 'T1.3-R2',   section: 'T1.3', axiom: 'A1', text: 'All files in one build carry the same standard version.', instances: ['IN-AUDIT'] },
    'T1.3-R3':   { id: 'T1.3-R3',   section: 'T1.3', axiom: 'A1', text: 'On upgrade: existing files retain their stamp. Upgraded files get new stamp. Delta is auditable by grep.', instances: ['IN-AUDIT'] },
    'T1.3-R4':   { id: 'T1.3-R4',   section: 'T1.3', axiom: 'A1', text: '"Built with LIV" is never removed or modified. It is part of the artifact.', instances: ['IN-AUDIT'] },
    'T1.3-R5':   { id: 'T1.3-R5',   section: 'T1.3', axiom: 'A1', text: "The manifest extends the stamp. Every R0-R4 file carries the manifest block immediately after the 3-line stamp, before all imports. The manifest is the ground truth of the file's compliance state. Drift between the manifest and the file body is a violation in either direction.", instances: ['IN-AUDIT'] },
    'T1.3-R5.1': { id: 'T1.3-R5.1', section: 'T1.3', axiom: 'A1', text: 'standard pins this file to a LIV-Standard version. Required. A mismatch with the active build version routes the file to IN-AUDIT before IN-BUILD proceeds.', instances: ['IN-AUDIT'] },
    'T1.3-R5.2': { id: 'T1.3-R5.2', section: 'T1.3', axiom: 'A1', text: "amended lists which amendments govern this file's compliance. \"none\" is valid and required. Blank is a violation.", instances: ['IN-AUDIT'] },
    'T1.3-R5.3': { id: 'T1.3-R5.3', section: 'T1.3', axiom: 'A1', text: "slice and layer must match the file's directory location. Mismatch is an A1 violation.", instances: ['IN-AUDIT'] },
    'T1.3-R5.4': { id: 'T1.3-R5.4', section: 'T1.3', axiom: 'A2', text: "wires-in declares every interface or atom imported from outside this file's layer. An import present in the file but absent here is an A2 violation.", instances: ['IN-AUDIT'] },
    'T1.3-R5.5': { id: 'T1.3-R5.5', section: 'T1.3', axiom: 'A6', text: 'wires-out declares every atom or hook this file exports for consumption by another slice or layer. Destination required. An export present in the file but absent here is an A6 violation.', instances: ['IN-AUDIT'] },
    'T1.3-R5.6': { id: 'T1.3-R5.6', section: 'T1.3', axiom: 'A2', text: 'deps declares every file imported, tagged by layer. An import present in the file but absent here is an A2 violation.', instances: ['IN-AUDIT'] },
    'T1.3-R5.7': { id: 'T1.3-R5.7', section: 'T1.3', axiom: 'A1', text: 'validated is the date of last IN-AUDIT verification pass. Staleness does not fail the build but routes the file to IN-AUDIT. The validated date is set by IN-AUDIT, not by IN-BUILD. A date written by IN-BUILD is invalid.', instances: ['IN-AUDIT'] },
    'T1.3-R5.8': { id: 'T1.3-R5.8', section: 'T1.3', axiom: 'A1', text: 'Existing files without a manifest are FM-PENDING. FM-PENDING is not a build failure. IN-AUDIT generates the initial manifest. Once generated, manifest update is required in the same commit as any file change.', instances: ['IN-AUDIT'] },
    'T1.5-R5':   { id: 'T1.5-R5',   section: 'T1.5', axiom: 'A3', text: 'A wire contract is stable across builds. Additive changes to payload atoms are permitted per T1.6 R3. Removal, rename, or structural change to a wire contract is a breaking change. A breaking change requires atomic update of all consumers in the same build. A build containing a broken wire contract with unconsumed consumers is a structural failure.', instances: ['IN-RESOLVE', 'IN-AUDIT'] },
    'T1.5-R6':   { id: 'T1.5-R6',   section: 'T1.5', axiom: ['A1','A6'], text: 'Every outbound wire is declared in {slice}-wires.ts at R0 of the defining slice via a @wire block. Fields: wire type, id, payload or interface reference, version (integer, starts at 1), status (active | deprecated). Consumer list derived by IN-AUDIT from manifest wires-in scan — never authored. W-INJECT declared by the interface-defining slice. One @wire block per wire.', instances: ['IN-RESOLVE', 'IN-AUDIT'] },
    'T1.6-R1':   { id: 'T1.6-R1',   section: 'T1.6', axiom: 'A1', text: 'An atom is declared once. Duplicate declaration violates A1.', instances: ['IN-BUILD'] },
    'T1.6-R2':   { id: 'T1.6-R2',   section: 'T1.6', axiom: 'A1', text: 'An atom file imports nothing except other atoms from the same slice.', instances: ['IN-BUILD'] },
    'T1.6-R3':   { id: 'T1.6-R3',   section: 'T1.6', axiom: 'A3', text: 'Atom fields are additive across versions. No field is removed without a migration path.', instances: ['IN-BUILD'] },
    'T1.6-R4':   { id: 'T1.6-R4',   section: 'T1.6', axiom: 'A3', text: 'Result<T> is the only permitted shape for fallible operation return values.', instances: ['IN-BUILD'] },
    'T2.3-R1':   { id: 'T2.3-R1',   section: 'T2.3', axiom: 'A1', text: 'One R4 file per external service. One owner.', instances: ['IN-BUILD'] },
    'T2.3-R2':   { id: 'T2.3-R2',   section: 'T2.3', axiom: 'A4', text: 'Every external service has a dev stub implementing the same interface.', instances: ['IN-BUILD'] },
    'T2.3-R3':   { id: 'T2.3-R3',   section: 'T2.3', axiom: 'A4', text: 'R2 workflows accept the interface type, not the concrete class.', instances: ['IN-BUILD'] },
    'T2.3-R4':   { id: 'T2.3-R4',   section: 'T2.3', axiom: 'A4', text: 'Environment configuration resolves at R4. R0 declares the config shape. R2 receives config values via injection. Direct process.env reads outside R4 are an A4 violation.', instances: ['IN-BUILD', 'IN-AUDIT'] },
    'T3.1-R1':   { id: 'T3.1-R1',   section: 'T3.1', axiom: 'A4', text: 'Derived state is never stored. Storing derived state creates a synchronization obligation.', instances: ['IN-BUILD'] },
    'T3.1-R2':   { id: 'T3.1-R2',   section: 'T3.1', axiom: 'A5', text: 'Shared state travels as an event payload atom. Never passed by reference.', instances: ['IN-BUILD'] },
    'T3.1-R3':   { id: 'T3.1-R3',   section: 'T3.1', axiom: 'A3', text: 'Client state submits as a Payload atom through R3. Never reaches R2 or R4 directly.', instances: ['IN-BUILD'] },
    'T4.2-R1':   { id: 'T4.2-R1',   section: 'T4.2', axiom: 'A3', text: 'R3 validates shape — schema, required fields, format.', instances: ['IN-QA'] },
    'T4.2-R2':   { id: 'T4.2-R2',   section: 'T4.2', axiom: 'A3', text: 'R2 validates business rules — ownership, state transitions, limits.', instances: ['IN-QA'] },
    'T4.2-R3':   { id: 'T4.2-R3',   section: 'T4.2', axiom: 'A3', text: 'R4 validates nothing. Data arriving at R4 is clean.', instances: ['IN-QA'] },
    'T4.2-R4':   { id: 'T4.2-R4',   section: 'T4.2', axiom: 'A3', text: 'Validation failure returns Result error. Never throws. Never 500s.', instances: ['IN-QA'] },
    'T4.1-R1':   { id: 'T4.1-R1',   section: 'T4.1', axiom: 'A3', text: 'R3 extracts identity into a RequestContext atom before calling R2. R2 receives RequestContext as a parameter. R2 never reads session, cookies, or headers directly. RequestContext is the typed boundary between HTTP surface and business logic.', instances: ['IN-BUILD', 'IN-QA'] },
    'T4.1-R2':   { id: 'T4.1-R2',   section: 'T4.1', axiom: 'A3', text: 'Routes are authenticated by default. A route is public only if its handler is annotated @public. Unannotated routes without session extraction are an A3 violation.', instances: ['IN-BUILD', 'IN-QA'] },
    'T6.5-R1':   { id: 'T6.5-R1',   section: 'T6.5', axiom: 'A1', text: 'A pattern becomes standard when it appears in 3+ independent bundles with identical structure.', instances: ['IN-MAIN'] },
    'T6.5-R2':   { id: 'T6.5-R2',   section: 'T6.5', axiom: 'A1', text: 'New atom kind: name it, define it, cite 2 existing examples. Add to T1.6.', instances: ['IN-MAIN'] },
    'T6.5-R3':   { id: 'T6.5-R3',   section: 'T6.5', axiom: 'A1', text: 'New flow: document trigger, step sequence, invariant. Add to T2.1. Assign FL-ID.', instances: ['IN-MAIN'] },
    'T6.5-R4':   { id: 'T6.5-R4',   section: 'T6.5', axiom: 'A1', text: 'New wire type: requires axiom citation proving no violation of A1-A7. No new wire since v1.0.', instances: ['IN-MAIN'] },
    'T6.5-R5':   { id: 'T6.5-R5',   section: 'T6.5', axiom: 'A1', text: 'Rule change: versioned. Axiom change: new major version. Axiom text is frozen forever.', instances: ['IN-MAIN'] },
    'T6.3-R1':   { id: 'T6.3-R1',   section: 'T6.3', axiom: 'A3', text: 'Build output is a set of stamped files rooted at src/. Every file carries the @liv-standard stamp. Output includes no temporary files, no build artifacts, no dependency directories. The stamped file set is the deliverable.', instances: ['IN-COMPILE', 'IN-QA'] },
  },

  flows: {
    'FL-CRUD':      { id: 'FL-CRUD',      trigger: 'User action',    sequence: 'R3 validate → R2 orchestrate → R4 persist → event emit', invariant: 'R3 never touches R4. R2 never skips emit.' },
    'FL-QUERY':     { id: 'FL-QUERY',     trigger: 'Data request',   sequence: 'R3 hook → R2 workflow → R4 query → R2 maps to atom → R3 renders', invariant: 'R4 returns typed rows. R2 maps. R3 never maps raw rows.' },
    'FL-STREAM':    { id: 'FL-STREAM',    trigger: 'LLM / SSE',     sequence: 'R2 opens stream → R4 reads chunks → R2 routes → R3 hook owns delivery', invariant: 'One owner for stream lifecycle.' },
    'FL-AUTH':      { id: 'FL-AUTH',      trigger: 'Unauth request', sequence: 'R3 extract token → R2 validate → R4 read session → R3 receives result', invariant: 'R3 never reads DB. R2 never skips validation.' },
    'FL-MIGRATION': { id: 'FL-MIGRATION', trigger: 'Cold boot',     sequence: 'startup → runMigrations() → SQL executed → server ready', invariant: 'Migrations run before any request handler registered.' },
    'FL-EVENT-FAN': { id: 'FL-EVENT-FAN', trigger: 'Event emitted', sequence: 'emitter → bus.emit → N handlers execute independently', invariant: 'Emitter has zero knowledge of handlers.' },
    'FL-JOB':       { id: 'FL-JOB',       trigger: 'Queue / cron', sequence: 'Scheduler → R2 workflow → R4 I/O → event emit on completion', invariant: 'No R3 involved. Errors go to dead-letter.' },
    'FL-WEBHOOK':   { id: 'FL-WEBHOOK',   trigger: 'External POST', sequence: 'R3 verify signature → R2 parse → R4 persist → event emit', invariant: 'Signature verification at R3 before any R2 execution.' },
  },

  wires: {
    'W-ATOM':   { id: 'W-ATOM',   mechanism: 'import-atom',   direction: 'A.R0 → B',         usage: 'Need a type from another slice',      constraint: 'R0 atoms only. Never import implementation.' },
    'W-EVENT':  { id: 'W-EVENT',  mechanism: 'event-bus',     direction: 'emitter → bus → *', usage: 'Notify other slices of state change',  constraint: 'No return value. Receiver never imports emitter.' },
    'W-INJECT': { id: 'W-INJECT', mechanism: 'inject',        direction: 'R2 owns interface', usage: 'Workflow needs I/O',                   constraint: 'R2 defines. R4 implements. R2 never imports R4.' },
    'W-HOOK':   { id: 'W-HOOK',   mechanism: 'contract-hook', direction: 'R3 → consumer',     usage: 'Read slice state externally',          constraint: 'Hook is the only external surface of a bundle.' },
  },

  instances: {
    'IN-MAIN':     { id: 'IN-MAIN',     name: 'Main',     count: 1,          description: 'Spec intake → fill IF contract → decompose → accept/reject', parallel: false, routesTo: 'Everything' },
    'IN-BUILD':    { id: 'IN-BUILD',    name: 'Build',    count: '1/bundle', description: 'R0→R4 files for one slice. No structural decisions.', parallel: true,  routesTo: 'IN-RESOLVE' },
    'IN-RESOLVE':  { id: 'IN-RESOLVE',  name: 'Resolve',  count: 1,          description: 'Cross-bundle interface reconciliation', parallel: false, routesTo: 'IN-AUDIT' },
    'IN-AUDIT':    { id: 'IN-AUDIT',    name: 'Audit',    count: 1,          description: 'Manifest diff per file. No cross-file state. Parallelizable.', parallel: true,  routesTo: 'IN-COMPILE' },
    'IN-COMPILE':  { id: 'IN-COMPILE',  name: 'Compile',  count: 1,          description: 'tsc loop → T5.4 error mapping → fix until zero', parallel: false, routesTo: 'IN-QA' },
    'IN-DIAGNOSE': { id: 'IN-DIAGNOSE', name: 'Diagnose', count: 1,          description: 'Root cause analysis on compile stall. Fix if structural, escalate if ambiguous.', parallel: false, routesTo: 'IN-COMPILE (return) or IN-MAIN (escalate)' },
    'IN-QA':       { id: 'IN-QA',       name: 'QA',       count: 1,          description: 'T5.3 checklist. Returns pass/fail with axiom citations.', parallel: false, routesTo: 'Done/Main' },
  },

  buildSequence: [
    { step: 1,    from: 'Human',      to: 'IN-MAIN',     action: 'Feature Intent submitted' },
    { step: 2,    from: 'IN-MAIN',    to: 'IN-MAIN',     action: 'Populates IF.01-IF.10' },
    { step: 3,    from: 'IN-MAIN',    to: 'IN-BUILD',    action: 'Parallel: one IN-BUILD per bundle' },
    { step: 4,    from: 'IN-BUILD',   to: 'IN-RESOLVE',  action: 'All bundle files complete' },
    { step: 5,    from: 'IN-RESOLVE', to: 'IN-AUDIT',    action: 'Reconciled file set' },
    { step: 6,    from: 'IN-AUDIT',   to: 'IN-COMPILE',  action: 'Verified file set with manifests' },
    { step: '6a', from: 'IN-COMPILE', to: 'IN-DIAGNOSE', action: 'Stall detected — root cause analysis' },
    { step: 7,    from: 'IN-COMPILE', to: 'IN-QA',       action: 'Zero-error file set' },
    { step: 8,    from: 'IN-QA',      to: 'IN-MAIN',     action: 'Accept (done) or reject (return to STEP 3)' },
  ],

  ifFields: {
    'IF.01': { id: 'IF.01', name: 'Feature Intent',        description: 'One sentence — what the feature does',       required: true,  consumers: ['ALL'] },
    'IF.02': { id: 'IF.02', name: 'Atom Declarations',     description: 'New types, payloads, enums, result types',    required: true,  consumers: ['IN-BUILD'] },
    'IF.03': { id: 'IF.03', name: 'Bundle Scope',          description: 'Which slices are new, which are modified',    required: true,  consumers: ['IN-BUILD','IN-RESOLVE'] },
    'IF.04': { id: 'IF.04', name: 'Flow Selection',        description: 'FL-IDs this feature implements',              required: true,  consumers: ['IN-BUILD'] },
    'IF.05': { id: 'IF.05', name: 'Wire Map',              description: 'How bundles connect — 4 wire types',          required: true,  consumers: ['IN-RESOLVE','IN-AUDIT'] },
    'IF.06': { id: 'IF.06', name: 'Event Contracts',       description: 'Events emitted, consumed, payload types',     required: true,  consumers: ['IN-BUILD','IN-RESOLVE'] },
    'IF.07': { id: 'IF.07', name: 'Migration Delta',       description: 'New tables, modified columns, index changes', required: false, consumers: ['IN-BUILD','IN-COMPILE'] },
    'IF.08': { id: 'IF.08', name: 'Acceptance Criteria',   description: 'T5.3 checks + feature-specific additions',    required: true,  consumers: ['IN-QA'] },
    'IF.09': { id: 'IF.09', name: 'LIV-Standard Version',  description: 'Version this build targets',                  required: true,  consumers: ['ALL'] },
    'IF.10': { id: 'IF.10', name: 'LIV-Procedure Version', description: 'Procedure version',                           required: true,  consumers: ['ALL'] },
  },

  wcRules: {
    'WC.1': { id: 'WC.1', axiom: ['A3','A6'], text: 'Wire change declared at R0 in {slice}-wires.ts, version incremented.' },
    'WC.2': { id: 'WC.2', axiom: 'A3',        text: 'IN-RESOLVE propagates change to consuming slices. IN-AUDIT verifies version parity — all consumer manifest wires-in versions must match declaration version.' },
    'WC.3': { id: 'WC.3', axiom: ['A3','A7'], text: 'Deprecated status blocks new consumers. Wire declaration persists until IN-AUDIT confirms zero consumers. Then removable.' },
  },

  complianceChecks: [
    { id: 'CC.01', text: 'No features/ file imports from another slice except via R0 atom (W-ATOM) or R3 hook (W-HOOK)', mechanical: true },
    { id: 'CC.02', text: 'No exec/ file imports from workflow/ or contract/ in any slice', mechanical: true },
    { id: 'CC.03', text: 'No event string literal declared outside a {slice}-events.ts file', mechanical: true },
    { id: 'CC.04', text: 'event-schema.ts contains re-exports only — zero declarations', mechanical: true },
    { id: 'CC.05', text: 'Every slice has types/ directory with {slice}-types.ts at minimum', mechanical: true },
    { id: 'CC.06', text: 'No circular dependencies within or across slices', mechanical: true },
    { id: 'CC.07', text: 'Every fallible R4 function returns Result<T> — no raw throws', mechanical: true },
    { id: 'CC.08', text: 'Every file carries @liv-standard stamp in lines 1-3', mechanical: true },
    { id: 'CC.09', text: 'Every slice with wires-out in any manifest has {slice}-wires.ts at R0', mechanical: true },
    { id: 'CC.10', text: 'No feature slice imports LIV_STANDARD directly — only via public API in liv-api', mechanical: true },
    { id: 'CC.11', text: 'Atom fields are additive across versions — no removals without migration', mechanical: true },
    { id: 'CC.12', text: 'Flows implemented consistently with T2.1 step sequence', mechanical: false },
    { id: 'CC.13', text: 'Wire selection correct — no W-ATOM used where W-EVENT was required', mechanical: false },
    { id: 'CC.14', text: 'Auth checks at correct layer per T4.1', mechanical: false },
    { id: 'CC.15', text: 'Validation at R3 before R2 per T4.2', mechanical: false },
    { id: 'CC.16', text: 'Only files under src/ and migrations/ carrying a valid @liv-standard stamp are build inputs. Unstamped files in these directories and all files outside them are not part of the system.', mechanical: true },
    { id: 'CC.17', text: 'Files in src/core/constants/ are immutable build targets. No pipeline instance writes to them. Violation is a structural failure.', mechanical: true },
    { id: 'CC.18', text: 'Every section with enforcement "pipeline" has at least one instance assigned. Sections with enforcement "reference" have instances: [] and contain no rules.', mechanical: true },
    { id: 'CC.19', text: 'Every R2 workflow function that requires identity accepts RequestContext as a parameter. R2 never reads session, cookies, or request headers directly.', mechanical: true },
  ],

  errorMappings: [
    { pattern: "Type 'unknown' not assignable to 'string'",  cause: 'R4 rows untyped — add typed row interface',  axiom: 'A3', fix: 'Add UserRow type to exec/, cast db.query<UserRow>' },
    { pattern: "Cannot find module '@/core/types/...'",      cause: 'Import from deleted/moved atom file',        axiom: 'A6', fix: 'Update import to correct R0 types/ file' },
    { pattern: 'Property X does not exist on type Y',        cause: 'Atom type mismatch — types drifted',         axiom: 'A3', fix: 'Reconcile atom declaration at R0 of owner' },
    { pattern: 'Expected N args but got M',                  cause: 'Interface contract changed at R2',           axiom: 'A3', fix: 'Update caller to match R2 interface signature' },
    { pattern: "Re-exporting a type requires 'export type'", cause: 'Missing isolatedModules compliance',         axiom: 'A6', fix: 'Replace export with export type' },
    { pattern: "Cannot find name 'JSX'",                     cause: 'JSX namespace not imported',                 axiom: 'A2', fix: 'Add JSX type import per platform UI library config' },
    { pattern: 'Type A not assignable to type B (overlap)',  cause: 'Two slices declare same type name',          axiom: 'A1', fix: 'Rename to {Slice}TypeName, import from owner' },
  ],

} as const
