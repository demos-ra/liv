// [F-la-config/R2/C2] LA validation runner — patched

import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'
import { db } from '@/core/db/client'
import { runRLayerValidator, runFTagValidator, runOperationsValidator, runExecutionValidator, resolveRepoPath } from '../exec/la-io'
import { parseLayerViolations, parseFTagResults, parseOpsViolations, parseExecutionResults, buildHealthViolation, buildExecutionCheckResult } from '../domain/la-parser'
import { persistHealthResults, persistExecutionResults } from '../exec/la-results-db'
import { loadGridSnapshot, rebuildGrid } from '@/features/F-topography/contract/topography-contract'
import type { HealthViolation } from '@/features/F-health-panel/config/health-panel-config'
import type { ExecutionCheckResult } from '@/features/F-execution-panel/config/execution-panel-config'

export async function buildGridFromResults(projectId: string): Promise<void> {
  // db imported directly from core/db/client
  const repoPath = await resolveRepoPath(projectId)
  if (!repoPath) {
    console.warn(JSON.stringify({ level: 'warn', event: 'la-runner.no-repo', projectId, timestamp: new Date().toISOString() }))
    return
  }

  const [layerRaw, ftagRaw, opsRaw, execRaw] = await Promise.allSettled([
    runRLayerValidator(repoPath),
    runFTagValidator(repoPath),
    runOperationsValidator(repoPath),
    runExecutionValidator(repoPath),
  ])

  const now = Date.now()
  const healthViolations: HealthViolation[] = []
  const executionResults: ExecutionCheckResult[] = []

  if (layerRaw.status === 'fulfilled') {
    for (const v of parseLayerViolations(layerRaw.value)) {
      healthViolations.push(buildHealthViolation({ projectId, featureTag: v.featureTag ?? 'unknown', rLayer: v.rLayer ?? 1, type: 'upward_dependency', filePath: v.file, message: `${v.sourceLayer} → ${v.targetLayer}: ${v.importLine}`, detectedAt: now }))
    }
  }
  if (opsRaw.status === 'fulfilled') {
    for (const v of parseOpsViolations(opsRaw.value)) {
      healthViolations.push(buildHealthViolation({ projectId, featureTag: v.featureTag ?? 'unknown', rLayer: v.rLayer ?? 1, type: 'orphan_code', filePath: v.file, message: v.message, detectedAt: now }))
    }
  }
  if (ftagRaw.status === 'fulfilled') {
    for (const r of parseFTagResults(ftagRaw.value)) {
      executionResults.push(buildExecutionCheckResult({ projectId, featureTag: r.fTag, rLayer: r.rLayer, filePath: r.file ?? '', passed: r.passed, violations: r.violations, checkedAt: now }))
    }
  }
  if (execRaw.status === 'fulfilled') {
    for (const r of parseExecutionResults(execRaw.value)) {
      executionResults.push(buildExecutionCheckResult({ projectId, featureTag: r.featureTag ?? 'unknown', rLayer: r.rLayer ?? 1, filePath: r.file, passed: r.valid, violations: r.violations, checkedAt: now }))
    }
  }

  await persistHealthResults(projectId, healthViolations)
  await persistExecutionResults(projectId, executionResults)

  await emitEvent({ type: EVENTS.HEALTH.CHECK_RUN, slice: 'F-la-config', payload: { projectId, violationCount: healthViolations.length } })
  await emitEvent({ type: EVENTS.EXECUTION.CHECK_RUN, slice: 'F-la-config', payload: { projectId, resultCount: executionResults.length, passedCount: executionResults.filter((r) => r.passed).length } })

  const allHealthData = healthViolations.reduce((acc, v) => {
    const key = `${v.featureTag}:${v.rLayer}`
    if (!acc[key]) acc[key] = { featureTag: v.featureTag, rLayer: v.rLayer, violations: [], fileCount: 1 }
    acc[key].violations.push(v.message)
    return acc
  }, {} as Record<string, { featureTag: string; rLayer: number; violations: string[]; fileCount: number }>)

  for (const r of executionResults) {
    const key = `${r.featureTag}:${r.rLayer}`
    if (!allHealthData[key]) allHealthData[key] = { featureTag: r.featureTag, rLayer: r.rLayer, violations: r.violations, fileCount: 1 }
  }

  const existing = await loadGridSnapshot(projectId)
  const sliceOrder = existing?.sliceOrder ?? Object.keys(Object.fromEntries(Object.values(allHealthData).map((v) => [v.featureTag, true])))
  const edges = existing?.edges ?? []

  await rebuildGrid(projectId, Object.values(allHealthData), edges, sliceOrder)

  console.log(JSON.stringify({ level: 'info', event: 'la-runner.complete', projectId, healthViolations: healthViolations.length, executionResults: executionResults.length, timestamp: new Date().toISOString() }))
}

export async function triggerValidation(projectId: string): Promise<{ ok: true }> {
  buildGridFromResults(projectId).catch((err) => {
    console.error(JSON.stringify({ level: 'error', event: 'la-runner.trigger.failed', projectId, error: err instanceof Error ? err.message : String(err), timestamp: new Date().toISOString() }))
  })
  return { ok: true }
}
