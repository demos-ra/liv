// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: v1.5, 4b-stamp-fix
// slice: core
// layer: R5
// wires-in: none
// wires-out:
//   W-ATOM LivStandardTypes → core/R5 liv-standard, core/R5 liv-renderer, core/R5 liv-procedure, core/R5 liv-templates, core/R5 liv-api
//   W-ATOM HandoffValidationResult → core/R5 liv-api (step4b4-handoff)
// deps: none
// validated: 2026-04-11

// ═══════════════════════════════════════════════════════════════
// LIV-STANDARD TYPES
// ═══════════════════════════════════════════════════════════════

// ─── Axiom ───

export type AxiomId = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7'

export type Axiom = {
  readonly id: AxiomId
  readonly name: string
  readonly text: string
  readonly frozen: true
}

// ─── Instance ───

export type InstanceId =
  | 'IN-MAIN'
  | 'IN-BUILD'
  | 'IN-RESOLVE'
  | 'IN-AUDIT'
  | 'IN-COMPILE'
  | 'IN-DIAGNOSE'
  | 'IN-QA'

// v1.4: size field removed. Zero external consumers — consumed only by getModelForInstance() in liv-api.ts,
// removed in same operation. Model selection moved to F-planner deployment config. T1.6-R3 satisfied.

export type Instance = {
  readonly id: InstanceId
  readonly name: string
  readonly count: number | '1/bundle'
  readonly description: string
  readonly parallel: boolean
  readonly routesTo: string
}

// ─── Rule ───

export type RuleId = string

export type Rule = {
  readonly id: RuleId
  readonly section: SectionId
  readonly axiom: AxiomId | AxiomId[]
  readonly text: string
  readonly instances: readonly InstanceId[]
}

// ─── Section ───

export type TierId = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6'

export type SectionId =
  | 'T0'
  | 'T1.1' | 'T1.2' | 'T1.3' | 'T1.4' | 'T1.5' | 'T1.6'
  | 'T2.1' | 'T2.2' | 'T2.3'
  | 'T3.1' | 'T3.2'
  | 'T4.1' | 'T4.2'
  | 'T5.1' | 'T5.2' | 'T5.3' | 'T5.4'
  | 'T6.1' | 'T6.2' | 'T6.3' | 'T6.4' | 'T6.5'

export type Section = {
  readonly id: SectionId
  readonly tier: TierId
  readonly name: string
  readonly preamble: string
  readonly enforcement: 'pipeline' | 'reference'
  readonly instances: readonly InstanceId[]
  readonly tables?: Record<string, readonly Record<string, string>[]>
  readonly templates?: readonly string[]
}

// ─── Flow ───

export type FlowId =
  | 'FL-CRUD'
  | 'FL-QUERY'
  | 'FL-STREAM'
  | 'FL-AUTH'
  | 'FL-MIGRATION'
  | 'FL-EVENT-FAN'
  | 'FL-JOB'
  | 'FL-WEBHOOK'

export type Flow = {
  readonly id: FlowId
  readonly trigger: string
  readonly sequence: string
  readonly invariant: string
}

// ─── Wire ───

export type WireId = 'W-ATOM' | 'W-EVENT' | 'W-INJECT' | 'W-HOOK'

export type Wire = {
  readonly id: WireId
  readonly mechanism: string
  readonly direction: string
  readonly usage: string
  readonly constraint: string
}

// ─── Build Sequence ───

export type BuildStep = {
  readonly step: number | '6a'
  readonly from: string
  readonly to: string
  readonly action: string
}

// ─── IF Field ───

export type IFFieldId = 'IF.01' | 'IF.02' | 'IF.03' | 'IF.04' | 'IF.05' | 'IF.06' | 'IF.07' | 'IF.08' | 'IF.09' | 'IF.10'

export type IFField = {
  readonly id: IFFieldId
  readonly name: string
  readonly description: string
  readonly required: boolean
  readonly consumers: readonly string[]
}

// ─── Wire Change Protocol ───

export type WCRule = {
  readonly id: 'WC.1' | 'WC.2' | 'WC.3'
  readonly axiom: AxiomId | AxiomId[]
  readonly text: string
}

// ─── Compliance Check ───

export type ComplianceCheck = {
  readonly id: string
  readonly text: string
  readonly mechanical: boolean
}

// ─── Error Mapping ───

export type TSErrorMapping = {
  readonly pattern: string
  readonly cause: string
  readonly axiom: AxiomId
  readonly fix: string
}

// ─── Top-level Standard ───

export type LivStandard = {
  readonly version: string
  readonly axioms: Record<AxiomId, Axiom>
  readonly rules: Record<RuleId, Rule>
  readonly sections: Record<SectionId, Section>
  readonly flows: Record<FlowId, Flow>
  readonly wires: Record<WireId, Wire>
  readonly instances: Record<InstanceId, Instance>
  readonly buildSequence: readonly BuildStep[]
  readonly ifFields: Record<IFFieldId, IFField>
  readonly wcRules: Record<string, WCRule>
  readonly complianceChecks: readonly ComplianceCheck[]
  readonly errorMappings: readonly TSErrorMapping[]
}

// ─── Slice key (derived, for consumers) ───

export type SliceKey =
  | 'scope-contract'
  | 'build-rules-a1-a4'
  | 'resolve-rules-a5-a7'
  | 'audit-contract-diff'
  | 'compile-interpret-execution'
  | 'diagnose-root-cause'
  | 'qa-acceptance-criteria'

export type InstanceToSlice = Record<InstanceId, SliceKey>

// ═══════════════════════════════════════════════════════════════
// LIV-PROCEDURE TYPES
// ═══════════════════════════════════════════════════════════════

// ─── Template ───

export type TemplateId =
  | 'TPL-R0-TYPES'
  | 'TPL-R0-EVENTS'
  | 'TPL-R0-CONST'
  | 'TPL-R0-WIRES'
  | 'TPL-R1-LOGIC'
  | 'TPL-R2-WF-CRUD'
  | 'TPL-R2-WF-STREAM'
  | 'TPL-R2-WF-AUTH'
  | 'TPL-R2-WF-JOB'
  | 'TPL-R3-CONTRACT'
  | 'TPL-R3-HOOK'
  | 'TPL-R3-UI'
  | 'TPL-R4-DB'
  | 'TPL-R4-IO'

export type DerivedSlot = {
  readonly name: string
  readonly from: string
  readonly transform: 'upperCase' | 'pascalCase' | 'camelCase' | 'kebabCase' | 'snakeCase'
}

export type Template = {
  readonly id: TemplateId
  readonly file: string
  readonly layer: string
  readonly slots: readonly string[]
  readonly derived: readonly DerivedSlot[]
  readonly system: readonly string[]
  readonly platform: readonly string[]
  readonly body: string
}

// ─── Flow → Template Routing ───

export type FlowTemplateEntry = {
  readonly flowId: FlowId
  readonly layer: string
  readonly templates: readonly TemplateId[]
  readonly condition: string
}

// ─── Handoff ───

export type HandoffFormat = 'HO-FILES' | 'HO-PACKET' | 'HO-REPORT' | 'HO-FILES+LOG'

export type HandoffSpec = {
  readonly from: InstanceId | 'Human'
  readonly to: InstanceId
  readonly format: HandoffFormat
  readonly content: string
}

// ─── Handoff Validation ───
// Result type for validateHandoff() in liv-api.ts (11th public function).
// Declared at R5 alongside HandoffSpec — same concept family (step4b4-handoff).
export type HandoffValidationResult = {
  readonly valid:   boolean
  readonly reason?: string
}

// ─── Packet Slicing ───

export type PacketSlicingRule = {
  readonly id: string
  readonly text: string
}

// ─── Instance Profile ───

export type InstanceProfile = {
  readonly id: InstanceId
  readonly reads: readonly SectionId[]
  readonly receives: readonly string[]
  readonly produces: readonly string[]
  readonly passesTo: readonly InstanceId[]
}

// ─── Atom Kind ───

export type AtomKindId =
  | 'AK-ENT'
  | 'AK-PAY'
  | 'AK-RES'
  | 'AK-CONST'
  | 'AK-ENUM'
  | 'AK-REF'
  | 'AK-SUM'
  | 'AK-DELTA'

// ─── IF Contract Types ───

export type FieldDecl = {
  readonly name: string
  readonly type: string
}

export type AtomDecl = {
  readonly kind: AtomKindId
  readonly name: string
  readonly owner: string
  readonly fields: readonly FieldDecl[]
}

export type MethodSig = {
  readonly name: string
  readonly params: readonly string[]
  readonly returns: string
}

export type WireEntry =
  | { readonly wire: 'W-ATOM';   readonly from: string; readonly to: string; readonly atomName: string }
  | { readonly wire: 'W-EVENT';  readonly from: string; readonly to: string; readonly eventId: string; readonly payloadType: string }
  | { readonly wire: 'W-INJECT'; readonly from: string; readonly to: string; readonly interfaceName: string; readonly methods: readonly MethodSig[] }
  | { readonly wire: 'W-HOOK';   readonly from: string; readonly to: string; readonly hookName: string }

export type EventContract = {
  readonly eventId: string
  readonly owner: string
  readonly payload: string
  readonly consumers: readonly string[]
}

export type MigrationDelta = {
  readonly op: 'create_table' | 'alter_table' | 'drop_table' | 'rename_table' | 'add_column' | 'alter_column' | 'drop_column' | 'rename_column' | 'add_index' | 'drop_index'
  readonly target: string
  readonly detail: string
}

export type IfContract = {
  readonly featureIntent: string
  readonly atomDeclarations: readonly AtomDecl[]
  readonly bundleScope: readonly { readonly name: string; readonly status: 'new' | 'modified' | 'deleted' }[]
  readonly flowSelection: readonly FlowId[]
  readonly wireMap: readonly WireEntry[]
  readonly eventContracts: readonly EventContract[]
  readonly migrationDelta: readonly MigrationDelta[] | null
  readonly acceptanceCriteria: readonly string[]
  readonly standardVersion: string
  readonly procedureVersion: string
}

// ─── Job Packet ───

export type JobPacket = {
  readonly buildId: string
  readonly instanceType: InstanceId
  readonly fields: Partial<IfContract>
}

// ─── Request Context ───
// Canonical identity envelope at R3 boundary. A3: typed boundary between HTTP surface and business logic.

export type RequestContext = {
  readonly userId: string
  readonly sessionId: string
}
