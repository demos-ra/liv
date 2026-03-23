// @liv-standard v1.3
// [F-planner/domain/planner-library-logic.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4d-corrective
// slice:      F-planner
// layer:      R1
// wires-in:
//   W-ATOM  AtomDecl  @/core/constants/liv-standard.types
// wires-out:
//   W-FN  reslotFiles       →  F-planner/R2
//   W-FN  extractSlotValues →  F-planner/R2
// deps:
//   R0  @/core/constants/liv-standard.types  (AtomDecl — A1, canonical)
// validated:  pending
//
// step4d-phase1 (A2, A4, A6):
//   New file. Pure R1 functions — no I/O, no throws. All return typed values.
//   Transform names (upperCase|pascalCase|camelCase|kebabCase|snakeCase) taken
//   verbatim from liv-standard.types.ts DerivedSlot.transform union.
//   Axiom cite: A2 — R1 imports R0 only. A4 — pure, no I/O.
//   A6 — all types declared at R0 of owning slice (planner-library-types.ts).
//
// step4d-corrective (A2):
//   hashAtomShape, hashWireSignature, wireStructureKey moved to planner-library-db.ts (R4).
//   Reason: createHash (Node crypto) is infrastructure — R4 only per A2.
//   WireEntry import removed — no longer needed in R1.
//   R1 retains reslotFiles + extractSlotValues — pure string ops, no imports needed.
//   Axiom cite: A2 — R1 imports R0 only. crypto belongs at R4.

import type { AtomDecl } from '@/core/constants/liv-standard.types'

// ── applyTransform — mirrors DerivedSlot.transform from liv-standard.types.ts ──
// Names taken verbatim from: 'upperCase'|'pascalCase'|'camelCase'|'kebabCase'|'snakeCase'
// Pure. No throws.

function applyTransform(value: string, transform: 'upperCase' | 'pascalCase' | 'camelCase' | 'kebabCase' | 'snakeCase'): string {
  switch (transform) {
    case 'upperCase':
      return value.toUpperCase()
    case 'snakeCase':
      return value
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .toLowerCase()
    case 'kebabCase':
      return value
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase()
    case 'pascalCase': {
      const words = value.replace(/[-_\s]+/g, ' ').split(' ')
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
    }
    case 'camelCase': {
      const words = value.replace(/[-_\s]+/g, ' ').split(' ')
      return words
        .map((w, i) => i === 0
          ? w.toLowerCase()
          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join('')
    }
  }
}

// ── allDerivations — all 5 transforms for a value ─────────────────────────────
// Returns array of [original, ...all 5 transforms], deduplicated.

function allDerivations(value: string): string[] {
  const transforms = ['upperCase', 'pascalCase', 'camelCase', 'kebabCase', 'snakeCase'] as const
  const results = [value, ...transforms.map(t => applyTransform(value, t))]
  return [...new Set(results)]
}

// ── reslotFiles ───────────────────────────────────────────────────────────────
// Replaces all slot value derivations in file paths and content.
// For each slot key present in both oldSlots and newSlots:
//   - Derive all 5 transforms of the old value and new value
//   - Replace old derived values with corresponding new derived values
// Pure. Deterministic. No throws. No AI.
// Longer values replaced before shorter to avoid partial-match corruption.

export function reslotFiles(
  cachedFiles: { path: string; content: string }[],
  oldSlots:    Record<string, string>,
  newSlots:    Record<string, string>
): { path: string; content: string }[] {
  const pairs: [string, string][] = []

  for (const key of Object.keys(oldSlots)) {
    if (!(key in newSlots)) continue
    const oldVal = oldSlots[key]
    const newVal = newSlots[key]
    if (oldVal === newVal) continue

    const oldDerivations = allDerivations(oldVal)
    const newDerivations = allDerivations(newVal)

    for (let i = 0; i < oldDerivations.length; i++) {
      const o = oldDerivations[i]
      const n = newDerivations[i]
      if (o !== n && o.length > 0) {
        pairs.push([o, n])
      }
    }
  }

  if (pairs.length === 0) return cachedFiles

  pairs.sort((a, b) => b[0].length - a[0].length)

  return cachedFiles.map(file => {
    let path    = file.path
    let content = file.content

    for (const [oldStr, newStr] of pairs) {
      path    = path.split(oldStr).join(newStr)
      content = content.split(oldStr).join(newStr)
    }

    return { path, content }
  })
}

// ── extractSlotValues ─────────────────────────────────────────────────────────
// Derives the slot values map from an IF contract for a given bundle.
// Returns Record<string, string> mapping slot key → concrete value.
// Pure. No throws.

export function extractSlotValues(
  contract:   { atomDeclarations: readonly AtomDecl[]; bundleScope: readonly { name: string; status: string }[] },
  bundleName: string
): Record<string, string> {
  const slots: Record<string, string> = {}

  slots['SLICE_NAME'] = bundleName

  const bundleAtoms = contract.atomDeclarations.filter(a => a.owner === bundleName)
  if (bundleAtoms.length > 0) {
    slots['ENTITY_NAME'] = bundleAtoms[0].name
  }

  return slots
}
