// @liv-standard v1.4
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.4
// amended: v1.4
// slice: core
// layer: R5
// wires-in:
//   W-ATOM LIV_STANDARD core/R5 liv-standard
// wires-out:
//   W-ATOM getSliceForInstance → core/R5 liv-api
// deps:
//   R5 ./liv-standard
//   R5 ./liv-standard.types
// validated: 2026-04-11

import { LIV_STANDARD } from './liv-standard'
import type {
  InstanceId, InstanceToSlice, SliceKey, SectionId,
} from './liv-standard.types'

// ═══════════════════════════════════════════════════════════════
// ROUTING CONFIG
// ═══════════════════════════════════════════════════════════════

const INSTANCE_TO_SLICE: InstanceToSlice = {
  'IN-MAIN':     'scope-contract',
  'IN-BUILD':    'build-rules-a1-a4',
  'IN-RESOLVE':  'resolve-rules-a5-a7',
  'IN-AUDIT':    'audit-contract-diff',
  'IN-COMPILE':  'compile-interpret-execution',
  'IN-DIAGNOSE': 'diagnose-root-cause',
  'IN-QA':       'qa-acceptance-criteria',
}

// Section rendering order per slice — from Procedure §6.2
const SLICE_SECTION_ORDER: Record<SliceKey, SectionId[]> = {
  'scope-contract':              ['T0', 'T1.4', 'T1.5', 'T6.2', 'T6.3'],
  'build-rules-a1-a4':          ['T0', 'T1.1', 'T1.2', 'T1.6', 'T2.1', 'T3.2'],
  'resolve-rules-a5-a7':        ['T0', 'T1.5', 'T1.4', 'T3.2', 'T5.3'],
  'audit-contract-diff':        ['T1.3', 'T1.5', 'T5.3'],
  'compile-interpret-execution': ['T5.4'],
  'diagnose-root-cause':        ['T0', 'T5.4', 'T1.1', 'T1.5'],
  'qa-acceptance-criteria':     ['T0', 'T5.3', 'T4.1', 'T4.2'],
}

// ═══════════════════════════════════════════════════════════════
// RENDERER
// ═══════════════════════════════════════════════════════════════

function renderTable(rows: readonly Record<string, string>[]): string {
  if (rows.length === 0) return ''
  return rows.map(row => Object.values(row).join(' | ')).join('\n')
}

function renderSectionForInstance(sectionId: SectionId, instanceId: InstanceId): string {
  const section = LIV_STANDARD.sections[sectionId]
  if (!section) {
    throw new Error(`[LIV-Standard] renderSectionForInstance: unknown sectionId '${sectionId}' for instance '${instanceId}'. Check SLICE_SECTION_ORDER config.`)
  }

  const lines: string[] = []
  const s = LIV_STANDARD
  const num = sectionId.replace('T', '')
  const sliceKey = INSTANCE_TO_SLICE[instanceId]

  if (sectionId === 'T0') {
    // Axiom section — render axioms per slice
    lines.push('T0 · Axioms — System Invariants')
    lines.push(section.preamble)
    lines.push('')
    const axiomSets: Record<string, readonly ('A1'|'A2'|'A3'|'A4'|'A5'|'A6'|'A7')[]> = {
      'build-rules-a1-a4':     ['A1','A2','A3','A4'],
      'resolve-rules-a5-a7':   ['A5','A6','A7'],
      'scope-contract':        ['A1','A2','A3','A4','A5','A6','A7'],
      'qa-acceptance-criteria': ['A1','A2','A3','A4','A5','A6','A7'],
      'diagnose-root-cause':   ['A1','A2','A3','A4','A5','A6','A7'],
    }
    const axiomIds = axiomSets[sliceKey] || []
    for (const aid of axiomIds) {
      const ax = s.axioms[aid]
      lines.push(`${ax.id} ${ax.name}. ${ax.text}`)
    }

  } else if (sectionId === 'T6.2') {
    lines.push('6.2 Information Flow Contract')
    lines.push(section.preamble)
    lines.push('')
    for (const [, field] of Object.entries(s.ifFields)) {
      lines.push(`${field.id} | ${field.name} | ${field.description} | ${field.required ? 'Yes' : 'No'} | ${field.consumers.join(', ')}`)
    }

  } else if (sectionId === 'T6.3') {
    lines.push('6.3 Build Sequence')
    // IN-MAIN gets full routing table
    for (const step of s.buildSequence) {
      lines.push(`STEP ${step.step} ${step.from} → ${step.to} ${step.action}`)
    }

  } else {
    // Standard section rendering
    // IN-AUDIT gets T1.3 as "Manifest Verification Rules"
    if (sectionId === 'T1.3' && sliceKey === 'audit-contract-diff') {
      lines.push('Manifest Verification Rules')
    } else {
      lines.push(`${num} ${section.name}`)
    }
    if (section.preamble) {
      lines.push(section.preamble)
    }
    lines.push('')

    // Tables
    if (section.tables) {
      for (const [tableName, rows] of Object.entries(section.tables)) {
        // T1.4 Category Table: filter rows by axiom group per instance
        if (sectionId === 'T1.4' && tableName === 'categories') {
          const buildAxioms = new Set(['A1','A2','A3','A4'])
          const resolveAxioms = new Set(['A5','A6','A7'])
          let filtered = rows
          if (sliceKey === 'build-rules-a1-a4') {
            filtered = rows.filter(r => {
              const axs = (r.axioms || '').split(',')
              return axs.some(a => buildAxioms.has(a))
            })
          } else if (sliceKey === 'resolve-rules-a5-a7') {
            filtered = rows.filter(r => {
              const axs = (r.axioms || '').split(',')
              return axs.some(a => resolveAxioms.has(a))
            })
          }
          lines.push(renderTable(filtered))
        } else {
          lines.push(renderTable(rows))
        }
      }
      lines.push('')
    }

    // Templates
    if (section.templates) {
      for (const t of section.templates) {
        lines.push(t)
      }
      lines.push('')
    }

    // Section-specific content
    if (sectionId === 'T1.3') {
      lines.push('Canonical manifest format:')
      lines.push('// @manifest')
      lines.push('// standard: LIV-Standard {STANDARD_VERSION}')
      lines.push('// amended: A1, A2 ← or "none"')
      lines.push('// slice: F-{slice}')
      lines.push('// layer: R{0-4}')
      lines.push('// wires-in:')
      lines.push('// W-INJECT {InterfaceName} {source-path}')
      lines.push('// W-ATOM {TypeName} {source-path}')
      lines.push('// wires-out:')
      lines.push('// W-ATOM {TypeName} → {consuming-slice/layer}')
      lines.push('// W-HOOK {hookName} → {consuming-slice/layer}')
      lines.push('// deps:')
      lines.push('// R{N} {relative-path}')
      lines.push('// validated: {YYYY-MM-DD}')
    }

    if (sectionId === 'T1.5') {
      for (const [, w] of Object.entries(s.wires)) {
        lines.push(`${w.id} | ${w.mechanism} | ${w.direction} | ${w.usage} | ${w.constraint}`)
      }
      lines.push('')
    }

    if (sectionId === 'T2.1') {
      for (const [, fl] of Object.entries(s.flows)) {
        lines.push(`${fl.id} | ${fl.trigger} | ${fl.sequence} | ${fl.invariant}`)
      }
      lines.push('')
    }

    if (sectionId === 'T5.3') {
      // Compliance checks — context-dependent rendering
      if (sliceKey === 'resolve-rules-a5-a7') {
        lines.push('Mechanical — import rules only')
        for (const cc of s.complianceChecks.filter(c => c.mechanical && (c.id === 'CC.01' || c.id === 'CC.10'))) {
          lines.push(`- ${cc.text}`)
        }
      } else if (sliceKey === 'audit-contract-diff') {
        lines.push('Mechanical — run at compile/commit time')
        for (const cc of s.complianceChecks.filter(c => c.mechanical)) {
          lines.push(`- ${cc.text}`)
        }
      } else if (sliceKey === 'qa-acceptance-criteria') {
        lines.push('Full checklist')
        lines.push('')
        lines.push('Mechanical — run at compile/commit time')
        for (const cc of s.complianceChecks.filter(c => c.mechanical)) {
          lines.push(`- ${cc.text}`)
        }
        lines.push('')
        lines.push('Non-mechanical — IN-QA review')
        for (const cc of s.complianceChecks.filter(c => !c.mechanical)) {
          lines.push(`- ${cc.text}`)
        }
      }
    }

    if (sectionId === 'T5.4') {
      for (const em of s.errorMappings) {
        lines.push(`${em.pattern} | ${em.cause} | ${em.axiom} | ${em.fix}`)
      }
      lines.push('')
    }

    // Rules for this section relevant to this instance
    const sectionRules = Object.values(s.rules).filter(
      r => r.section === sectionId && r.instances.includes(instanceId)
    )
    if (sectionRules.length > 0) {
      lines.push('')
      for (const r of sectionRules) {
        const shortId = r.id.split('-').slice(1).join('-')
        lines.push(`${shortId} ${r.text}`)
      }
    }
  }

  return lines.join('\n')
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC — Standard slice rendering
// ═══════════════════════════════════════════════════════════════

export function getSliceForInstance(instanceId: InstanceId): string {
  const sliceKey = INSTANCE_TO_SLICE[instanceId]
  const sectionOrder = SLICE_SECTION_ORDER[sliceKey]
  if (!sectionOrder) {
    throw new Error(`[LIV-Standard] getSliceForInstance: no section order defined for slice '${sliceKey}' (instance '${instanceId}'). Check SLICE_SECTION_ORDER config.`)
  }

  const parts: string[] = []
  if (sliceKey === 'scope-contract') {
    parts.push(`LIV-Standard ${LIV_STANDARD.version} · Universal Software Organization Standard`)
    parts.push('Axioms are invariants. Every rule derives from exactly one axiom. A rule that cannot cite its axiom is not a rule — it is a preference. Preferences are not in this document.')
    parts.push('')
    parts.push('Scope: All software systems built on LIV')
    parts.push('Axioms: Frozen — never modified')
    parts.push('Rules: Versioned — cite axiom or invalid')
    parts.push('')
  }

  for (const sid of sectionOrder) {
    const rendered = renderSectionForInstance(sid, instanceId)
    if (rendered) {
      parts.push(rendered)
      parts.push('')
    }
  }

  return parts.join('\n').trim()
}
