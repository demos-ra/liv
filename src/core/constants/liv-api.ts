// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: v1.5
// slice: core
// layer: R5
// wires-in:
//   W-ATOM getSliceForInstance     core/R5 liv-renderer
//   W-ATOM INSTANCE_PROFILES       core/R5 liv-procedure
//   W-ATOM HANDOFFS                core/R5 liv-procedure
//   W-ATOM FLOW_TEMPLATE_MAP       core/R5 liv-procedure
//   W-ATOM PACKET_SLICING_RULES    core/R5 liv-procedure
//   W-ATOM TEMPLATES               core/R5 liv-templates
//   W-ATOM LIV_STANDARD            core/R5 liv-standard
// wires-out:
//   W-ATOM getSliceForInstance   → F-planner/R2
//   W-ATOM getInstanceProfile    → F-planner/R2
//   W-ATOM getPacketForInstance  → F-planner/R2
//   W-ATOM getTemplatesForFlow   → F-planner/R2
//   W-ATOM getTemplate           → F-planner/R2
//   W-ATOM getHandoff            → F-planner/R2
//   W-ATOM validateHandoff       → F-planner/R2 (step4b4-handoff — 11th public fn)
//   W-ATOM getBuildSequence      → F-planner/R2
//   W-ATOM validateIfContract    → F-planner/R2
//   W-ATOM validateSlotsFilled   → F-planner/R2
//   W-ATOM getPacketSlicingRules → F-planner/R2
// deps:
//   R5 ./liv-renderer
//   R5 ./liv-procedure
//   R5 ./liv-templates
//   R5 ./liv-standard
//   R5 ./liv-standard.types
// validated: 2026-04-11

import { getSliceForInstance } from './liv-renderer'
import { INSTANCE_PROFILES, HANDOFFS, FLOW_TEMPLATE_MAP, PACKET_SLICING_RULES } from './liv-procedure'
import { TEMPLATES } from './liv-templates'
import { LIV_STANDARD } from './liv-standard'
import type {
  InstanceId, InstanceProfile, IfContract, JobPacket, IFFieldId,
  FlowId, FlowTemplateEntry, TemplateId, Template, HandoffSpec, BuildStep,
  PacketSlicingRule, HandoffValidationResult,
} from './liv-standard.types'

// ═══════════════════════════════════════════════════════════════
// PUBLIC API — F-planner's sole import point
// CC.10: No feature slice imports LIV_STANDARD directly — only via this file.
// ═══════════════════════════════════════════════════════════════

// ─── Renderer ─────────────────────────────────────────────────

export { getSliceForInstance }

// ─── Procedure queries ────────────────────────────────────────

export function getInstanceProfile(id: InstanceId): InstanceProfile {
  return INSTANCE_PROFILES[id]
}

export function getPacketForInstance(id: InstanceId, contract: IfContract, bundleName?: string): JobPacket {
  // Slices contract per RS.1-RS.6
  const base: Pick<JobPacket, 'buildId' | 'instanceType'> = {
    buildId: `${contract.standardVersion}-${Date.now()}`,
    instanceType: id,
  }

  // RS.6: IF.09 + IF.10 always included
  const always = {
    standardVersion: contract.standardVersion,
    procedureVersion: contract.procedureVersion,
  }

  switch (id) {
    case 'IN-BUILD': {
      // RS.2: scoped IF fields for its bundle only
      const scopeFilter = (items: readonly { owner?: string; name?: string }[]) =>
        bundleName ? items.filter(i => (i.owner || i.name) === bundleName) : items
      return {
        ...base,
        fields: {
          ...always,
          featureIntent: contract.featureIntent,
          atomDeclarations: scopeFilter(contract.atomDeclarations) as typeof contract.atomDeclarations,
          bundleScope: bundleName
            ? contract.bundleScope.filter(b => b.name === bundleName)
            : contract.bundleScope,
          flowSelection: contract.flowSelection,
          wireMap: bundleName
            ? contract.wireMap.filter(w => w.from === bundleName || w.to === bundleName)
            : contract.wireMap,
          eventContracts: bundleName
            ? contract.eventContracts.filter(e => e.owner === bundleName)
            : contract.eventContracts,
          migrationDelta: contract.migrationDelta,
        },
      }
    }
    case 'IN-RESOLVE':
      // RS.3: full IF.05 + IF.06 + IF.03
      return {
        ...base,
        fields: {
          ...always,
          wireMap: contract.wireMap,
          eventContracts: contract.eventContracts,
          bundleScope: contract.bundleScope,
        },
      }
    case 'IN-AUDIT':
      // IN-AUDIT receives wire map for version parity verification
      return {
        ...base,
        fields: {
          ...always,
          wireMap: contract.wireMap,
        },
      }
    case 'IN-COMPILE':
      // RS.4: no packet fields — file set only
      return { ...base, fields: { ...always } }
    case 'IN-QA':
      // RS.5: IF.08 only
      return {
        ...base,
        fields: {
          ...always,
          acceptanceCriteria: contract.acceptanceCriteria,
        },
      }
    default:
      // IN-MAIN: receives human input directly, not via packet
      // IN-DIAGNOSE: receives file set + error log via HO-FILES+LOG handoff, not via packet
      return { ...base, fields: { ...always } }
  }
}

export function getPacketSlicingRules(): readonly PacketSlicingRule[] {
  return PACKET_SLICING_RULES
}

// ─── Template queries ─────────────────────────────────────────

export function getTemplatesForFlow(flowId: FlowId): FlowTemplateEntry[] {
  return FLOW_TEMPLATE_MAP.filter(e => e.flowId === flowId)
}

export function getTemplate(id: TemplateId): Template {
  return TEMPLATES[id]
}

// ─── Handoff / routing ────────────────────────────────────────

export function getHandoff(from: InstanceId | 'Human', to: InstanceId): HandoffSpec | undefined {
  return HANDOFFS.find(h => h.from === from && h.to === to)
}

export function getBuildSequence(): readonly BuildStep[] {
  return LIV_STANDARD.buildSequence
}

// ─── Validation ───────────────────────────────────────────────

export function validateIfContract(contract: IfContract): { valid: boolean; missing: IFFieldId[] } {
  const missing: IFFieldId[] = []
  const fieldMap: Record<IFFieldId, keyof IfContract> = {
    'IF.01': 'featureIntent',
    'IF.02': 'atomDeclarations',
    'IF.03': 'bundleScope',
    'IF.04': 'flowSelection',
    'IF.05': 'wireMap',
    'IF.06': 'eventContracts',
    'IF.07': 'migrationDelta',
    'IF.08': 'acceptanceCriteria',
    'IF.09': 'standardVersion',
    'IF.10': 'procedureVersion',
  }
  for (const [, field] of Object.entries(LIV_STANDARD.ifFields)) {
    if (!field.required) continue
    const key = fieldMap[field.id]
    const value = contract[key]
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      missing.push(field.id)
    }
  }
  return { valid: missing.length === 0, missing }
}

export function validateSlotsFilled(body: string, slots: readonly string[]): { valid: boolean; unfilled: string[] } {
  const unfilled: string[] = []
  for (const slot of slots) {
    const pattern = `{${slot}}`
    if (body.includes(pattern)) {
      unfilled.push(slot)
    }
  }
  return { valid: unfilled.length === 0, unfilled }
}

// ─── Handoff validation (step4b4-handoff — 11th public function) ──────────────
// Validates that AI output satisfies the declared handoff spec for the given
// instance pair. Looks up the HandoffSpec internally — caller does not need
// to call getHandoff() separately.
//
// Format rules (from HANDOFFS in liv-procedure.ts):
//   HO-FILES     — output.files must be non-empty
//   HO-PACKET    — always valid (packet assembled by R2 before the AI call)
//   HO-REPORT    — output.report must be present and non-empty
//   HO-FILES+LOG — output.files must be non-empty (errorLog is informational)
// If no HandoffSpec is defined for the pair, returns { valid: false, reason }.
//
// CC.10: F-planner imports this via liv-api.ts only — never from liv-procedure.
export function validateHandoff(
  from:   InstanceId | 'Human',
  to:     InstanceId,
  output: { files: readonly { path: string; content: string }[]; report?: string; errorLog?: string }
): HandoffValidationResult {
  const spec = getHandoff(from, to)

  if (!spec) {
    return { valid: false, reason: `No handoff spec defined for ${from}→${to}` }
  }

  switch (spec.format) {
    case 'HO-FILES':
      if (output.files.length === 0)
        return { valid: false, reason: `${from}→${to}: HO-FILES requires at least one file; got 0` }
      return { valid: true }

    case 'HO-PACKET':
      return { valid: true }

    case 'HO-REPORT':
      if (!output.report || !output.report.trim())
        return { valid: false, reason: `${from}→${to}: HO-REPORT requires a report block; none found` }
      return { valid: true }

    case 'HO-FILES+LOG':
      if (output.files.length === 0)
        return { valid: false, reason: `${from}→${to}: HO-FILES+LOG requires files; got 0` }
      return { valid: true }

    default: {
      // Exhaustive guard — unreachable with current HandoffFormat union (4 members).
      // If a new format is added to HandoffFormat without updating this switch,
      // TypeScript will narrow here to never and this return surfaces the gap.
      const _exhaustive: never = spec.format
      return { valid: false, reason: `${from}→${to}: unknown handoff format '${String(_exhaustive)}'` }
    }
  }
}
