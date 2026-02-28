// [F-constitution/R3/C2] useConstitution hook — reads constitution:: namespace
// R3: client-side contract

'use client'

import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { CONSTITUTION_NAMESPACE, Constitution, FSlice } from '../config/constitution-config'
import {
  getBlockedSlices,
  getCompleteSlices,
  buildProgressPercent,
  isFullyComplete,
} from '../domain/constitution-logic'

export function useConstitution(projectId: string): Constitution | null {
  return useNamespace<Constitution>(`${CONSTITUTION_NAMESPACE}:${projectId}`) ?? null
}

export function useConstitutionProgress(projectId: string): {
  percent: number
  complete: number
  total: number
  isFullyComplete: boolean
  blocked: FSlice[]
} {
  const constitution = useConstitution(projectId)
  if (!constitution) return { percent: 0, complete: 0, total: 0, isFullyComplete: false, blocked: [] }

  return {
    percent: buildProgressPercent(constitution),
    complete: getCompleteSlices(constitution).length,
    total: constitution.slices.length,
    isFullyComplete: isFullyComplete(constitution),
    blocked: getBlockedSlices(constitution),
  }
}

export function useConstitutionStatus(projectId: string): Constitution['status'] | null {
  return useConstitution(projectId)?.status ?? null
}

export function useSlices(projectId: string): FSlice[] {
  return useConstitution(projectId)?.slices ?? []
}
