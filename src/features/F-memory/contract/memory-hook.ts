// @liv-standard v1.5.1
// [F-memory/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    none
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-ATOM  MemoryVitalSigns  F-memory/R0
//   W-ATOM  MLayer            F-memory/R0
// wires-out:
//   W-HOOK  useMemoryStatus   →  F-dashboard (health panel)
// deps:
//   R0  ../config/memory-types
// validated:  pending

// Living Memory v1.0 — client-side vital signs hook.
// R3: React hook. Read-only. Dashboard health panel display.
// §15: all ranges graph-relative — no hardcoded safe ranges.
// Fetches vital signs from a lightweight API endpoint.

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MemoryVitalSigns } from '../config/memory-types'

const EMPTY_VITALS: MemoryVitalSigns = {
  activationEntropy:    0,
  top1ActivationRatio:  0,
  meanDegree:           0,
  layerDistribution:    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
  closureMean:          0,
  asymmetryMean:        0,
  attractorStability:   0,
  armCount:             0,
  armDepthDistribution: [],
}

export function useMemoryStatus(pollIntervalMs = 30_000): MemoryVitalSigns {
  const [vitals, setVitals] = useState<MemoryVitalSigns>(EMPTY_VITALS)

  const fetchVitals = useCallback(async () => {
    try {
      const res = await fetch('/api/memory/vitals')
      if (res.ok) {
        const data = await res.json() as MemoryVitalSigns
        setVitals(data)
      }
    } catch {
      // Fail silent — dashboard shows stale vitals
    }
  }, [])

  useEffect(() => {
    fetchVitals()
    const interval = setInterval(fetchVitals, pollIntervalMs)
    return () => clearInterval(interval)
  }, [fetchVitals, pollIntervalMs])

  return vitals
}
