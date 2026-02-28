// [F-memory/R3/C3] Memory hook — client-side vital signs read
// R3: React hook. Read-only. Health panel display only.
// Returns latest vital signs snapshot from server.

'use client'

import { useState, useEffect } from 'react'
import type { MemoryVitalSigns } from '../config/memory-types'

const EMPTY_VITALS: MemoryVitalSigns = {
  activationEntropy:    0,
  top1ActivationRatio:  0,
  meanDegree:           0,
  p95Degree:            0,
  saturationRatio:      0,
  identityDensity:      0,
  utilityCorrelation:   0,
}

export function useMemoryStatus(): MemoryVitalSigns {
  const [vitals, setVitals] = useState<MemoryVitalSigns>(EMPTY_VITALS)

  useEffect(() => {
    // Vital signs are logged to server on session_end.
    // Client hook polls a lightweight endpoint when available.
    // For now: returns empty until a tRPC/REST endpoint is wired.
    // This hook is intentionally minimal — health panel can extend it.
    return () => {}
  }, [])

  return vitals
}
