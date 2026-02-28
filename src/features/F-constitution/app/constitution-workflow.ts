// [F-constitution/R2/C3] Constitution workflow orchestration
// R2: orchestration, depends R0 + R1 + R4

import { RLayer, FSlice } from '../config/constitution-config'
import {
  buildConstitution,
  buildSlice,
  addSlice,
  updateSliceStatus,
  confirmConstitution,
  lockConstitution,
  bumpVersion,
  validateFeatureTag,
  validateSliceCount,
  hasDuplicateTag,
  hasCyclicDependencies,
} from '../domain/constitution-logic'
import {
  persistConstitution,
  updateConstitution,
  getConstitutionByProject,
} from '../exec/constitution-db'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'

// --- Initialize constitution for a new project ---

export async function initConstitution(projectId: string): Promise<string> {
  const constitution = buildConstitution(projectId)
  await persistConstitution(constitution)
  return constitution.constitutionId
}

// --- Propose slice list (AI-generated, pre-confirmation) ---

export async function proposeSlices(
  projectId: string,
  proposals: Array<{
    featureTag: string
    description: string
    rLayers: RLayer[]
    buildOrder: number
    dependencies?: string[]
  }>
): Promise<{ ok: boolean; error?: string }> {
  let constitution = await getConstitutionByProject(projectId)
  if (!constitution) return { ok: false, error: 'constitution_not_found' }
  if (constitution.status === 'locked') return { ok: false, error: 'constitution_locked' }

  // Validate all tags before touching state
  for (const p of proposals) {
    const tagCheck = validateFeatureTag(p.featureTag)
    if (!tagCheck.valid) return { ok: false, error: tagCheck.error }

    if (hasDuplicateTag(constitution, p.featureTag)) {
      return { ok: false, error: `Duplicate feature tag: ${p.featureTag}` }
    }
  }

  // Add all slices
  for (const p of proposals) {
    const slice = buildSlice(p.featureTag, p.description, p.rLayers, p.buildOrder, p.dependencies)
    const countCheck = validateSliceCount(constitution)
    if (!countCheck.valid) return { ok: false, error: countCheck.error }
    constitution = addSlice(constitution, slice)
  }

  // Cycle check on full proposed graph
  if (hasCyclicDependencies(constitution.slices)) {
    return { ok: false, error: 'Proposed slices contain circular dependencies' }
  }

  const versioned = bumpVersion(constitution)
  await updateConstitution(versioned)

  await emitEvent({
    type: EVENTS.CONSTITUTION.CONSTITUTION_UPDATED,
    payload: { projectId, version: versioned.version, sliceCount: versioned.slices.length },
  })

  return { ok: true }
}

// --- Human confirms the constitution ---

export async function confirmConstitutionForProject(
  projectId: string,
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  const constitution = await getConstitutionByProject(projectId)
  if (!constitution) return { ok: false, error: 'constitution_not_found' }
  if (constitution.slices.length === 0) return { ok: false, error: 'no_slices_proposed' }
  if (constitution.status === 'confirmed') return { ok: false, error: 'already_confirmed' }

  const confirmed = confirmConstitution(constitution, userId)
  await updateConstitution(confirmed)

  await emitEvent({
    type: EVENTS.CONSTITUTION.CONSTITUTION_CONFIRMED,
    payload: { projectId, userId, sliceCount: confirmed.slices.length },
  })

  return { ok: true }
}

// --- Mark slice status (driven by health/execution checks) ---

export async function markSliceStatus(
  projectId: string,
  featureTag: string,
  status: FSlice['status']
): Promise<void> {
  const constitution = await getConstitutionByProject(projectId)
  if (!constitution) return

  const updated = updateSliceStatus(constitution, featureTag, status)
  await updateConstitution(updated)

  if (status === 'complete') {
    await emitEvent({ type: EVENTS.CONSTITUTION.SLICE_COMPLETE, payload: { projectId, featureTag } })
  } else if (status === 'blocked') {
    await emitEvent({ type: EVENTS.CONSTITUTION.SLICE_BLOCKED, payload: { projectId, featureTag } })
  }
}

// --- Lock for integration (Phase 4 trigger) ---

export async function lockForIntegration(projectId: string): Promise<void> {
  const constitution = await getConstitutionByProject(projectId)
  if (!constitution) return
  await updateConstitution(lockConstitution(constitution))
}

// --- Load ---

export async function loadConstitution(projectId: string) {
  return getConstitutionByProject(projectId)
}
