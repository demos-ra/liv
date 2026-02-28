// [F-constitution/R1/C2] Constitution domain logic
// R1: pure functions, no I/O, depends R0 only

import {
  Constitution,
  ConstitutionStatus,
  FSlice,
  SliceStatus,
  CONSTITUTION_CONFIG,
  RLayer,
} from '../config/constitution-config'
import { generateId } from '@/core/types/primitives'

// --- Factory ---

export function buildConstitution(projectId: string): Constitution {
  const now = Date.now()
  return {
    constitutionId: generateId('const'),
    projectId,
    version: 1,
    status: 'draft',
    slices: [],
    confirmedBy: null,
    confirmedAt: null,
    createdAt: now,
    updatedAt: now,
  }
}

export function buildSlice(
  featureTag: string,
  description: string,
  rLayers: RLayer[],
  buildOrder: number,
  dependencies: string[] = []
): FSlice {
  if (!featureTag.startsWith('F-')) {
    throw new Error(`Feature tag must start with 'F-': ${featureTag}`)
  }
  return {
    sliceId: generateId('slice'),
    featureTag,
    description,
    rLayers,
    status: 'proposed',
    buildOrder,
    dependencies,
  }
}

// --- Mutations (all return new constitution, never mutate) ---

export function addSlice(constitution: Constitution, slice: FSlice): Constitution {
  return {
    ...constitution,
    slices: [...constitution.slices, slice],
    updatedAt: Date.now(),
  }
}

export function updateSliceStatus(
  constitution: Constitution,
  featureTag: string,
  status: SliceStatus
): Constitution {
  return {
    ...constitution,
    slices: constitution.slices.map((s) =>
      s.featureTag === featureTag ? { ...s, status } : s
    ),
    updatedAt: Date.now(),
  }
}

export function confirmConstitution(constitution: Constitution, userId: string): Constitution {
  return {
    ...constitution,
    status: 'confirmed',
    confirmedBy: userId,
    confirmedAt: Date.now(),
    slices: constitution.slices.map((s) => ({ ...s, status: 'confirmed' as SliceStatus })),
    updatedAt: Date.now(),
  }
}

export function lockConstitution(constitution: Constitution): Constitution {
  return { ...constitution, status: 'locked', updatedAt: Date.now() }
}

export function bumpVersion(constitution: Constitution): Constitution {
  return { ...constitution, version: constitution.version + 1, updatedAt: Date.now() }
}

// --- Validation ---

export function validateFeatureTag(tag: string): { valid: boolean; error?: string } {
  if (!tag.startsWith('F-')) return { valid: false, error: "Feature tag must start with 'F-'" }
  if (!/^F-[a-z][a-z0-9-]*$/.test(tag)) {
    return { valid: false, error: 'Feature tag must be kebab-case: F-my-feature' }
  }
  if (tag.length > CONSTITUTION_CONFIG.maxSliceNameLength) {
    return { valid: false, error: `Feature tag exceeds ${CONSTITUTION_CONFIG.maxSliceNameLength} chars` }
  }
  return { valid: true }
}

export function validateSliceCount(constitution: Constitution): { valid: boolean; error?: string } {
  if (constitution.slices.length >= CONSTITUTION_CONFIG.maxSlices) {
    return { valid: false, error: `Constitution cannot exceed ${CONSTITUTION_CONFIG.maxSlices} slices` }
  }
  return { valid: true }
}

export function hasDuplicateTag(constitution: Constitution, featureTag: string): boolean {
  return constitution.slices.some((s) => s.featureTag === featureTag)
}

// --- Derived queries ---

export function getSliceByTag(constitution: Constitution, featureTag: string): FSlice | null {
  return constitution.slices.find((s) => s.featureTag === featureTag) ?? null
}

export function getBlockedSlices(constitution: Constitution): FSlice[] {
  return constitution.slices.filter((s) => s.status === 'blocked')
}

export function getCompleteSlices(constitution: Constitution): FSlice[] {
  return constitution.slices.filter((s) => s.status === 'complete')
}

export function isFullyComplete(constitution: Constitution): boolean {
  return (
    constitution.slices.length > 0 &&
    constitution.slices.every((s) => s.status === 'complete')
  )
}

export function buildProgressPercent(constitution: Constitution): number {
  if (constitution.slices.length === 0) return 0
  const complete = getCompleteSlices(constitution).length
  return Math.round((complete / constitution.slices.length) * 100)
}

// --- Circular dependency detection ---

export function hasCyclicDependencies(slices: FSlice[]): boolean {
  const tagSet = new Set(slices.map((s) => s.featureTag))
  const visited = new Set<string>()
  const inStack = new Set<string>()

  function dfs(tag: string): boolean {
    if (inStack.has(tag)) return true   // cycle detected
    if (visited.has(tag)) return false

    visited.add(tag)
    inStack.add(tag)

    const slice = slices.find((s) => s.featureTag === tag)
    for (const dep of slice?.dependencies ?? []) {
      if (tagSet.has(dep) && dfs(dep)) return true
    }

    inStack.delete(tag)
    return false
  }

  return slices.some((s) => dfs(s.featureTag))
}
