// [F-constitution/R0/C2] Constitution configuration and types
// R0: pure config, zero dependencies

export const CONSTITUTION_CONFIG = {
  maxSlices: 100,
  maxSliceNameLength: 60,
  maxSliceDescriptionLength: 300,
} as const

export const CONSTITUTION_NAMESPACE = 'constitution' as const

// Mirrors LA v2.0 R-layer model exactly
export type RLayer = 0 | 1 | 2 | 3 | 4

export const R_LAYER_NAMES: Record<RLayer, string> = {
  0: 'Config',
  1: 'Domain',
  2: 'Application',
  3: 'Contract',
  4: 'Execution',
}

// One F-slice entry in the constitution
export type FSlice = {
  sliceId: string
  featureTag: string          // e.g. 'F-auth'
  description: string
  rLayers: RLayer[]           // which R layers this slice spans
  status: SliceStatus
  buildOrder: number          // position in build sequence
  dependencies: string[]      // other featureTags this slice depends on
}

export type SliceStatus =
  | 'proposed'    // AI proposed, not yet confirmed
  | 'confirmed'   // human confirmed, build can begin
  | 'building'    // build in progress
  | 'complete'    // all layers built + checks pass
  | 'blocked'     // health/execution violation

export type ConstitutionStatus = 'draft' | 'confirmed' | 'locked'
// locked = Phase 4 integration started, no more slice changes

export type Constitution = {
  constitutionId: string
  projectId: string
  version: number
  status: ConstitutionStatus
  slices: FSlice[]
  confirmedBy: string | null
  confirmedAt: number | null
  createdAt: number
  updatedAt: number
}
