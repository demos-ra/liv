// @liv-standard v1.3
// [F-la-config/R1]
// Built with LIV · livai.dev
// R1: pure functions, no I/O, depends R0 only.
//
// Stubbed pending F-health-panel and F-execution-panel build.

import { randomUUID } from 'crypto'
import type { HealthViolation, ExecutionCheckResult } from '../config/la-types'

export type { HealthViolation, ExecutionCheckResult }

export interface ParsedLayerViolation {
  file: string
  line: number
  sourceLayer: string
  targetLayer: string
  importLine: string
  featureTag: string | null
  rLayer: number | null
}

export function parseLayerViolations(_output: string): ParsedLayerViolation[] {
  return []
}

export interface ParsedFTagResult {
  fTag: string
  rLayer: number
  file: string | null
  passed: boolean
  violations: string[]
}

export function parseFTagResults(_output: string): ParsedFTagResult[] {
  return []
}

export interface ParsedOpsViolation {
  rule: string
  message: string
  file: string
  featureTag: string | null
  rLayer: number | null
}

export function parseOpsViolations(_output: string): ParsedOpsViolation[] {
  return []
}

export interface ParsedExecutionResult {
  file: string
  valid: boolean
  violations: string[]
  featureTag: string | null
  rLayer: number | null
}

export function parseExecutionResults(_output: string): ParsedExecutionResult[] {
  return []
}

export function buildHealthViolation(
  data: Omit<HealthViolation, 'violationId' | 'resolved'>
): HealthViolation {
  return { violationId: randomUUID(), resolved: false, ...data }
}

export function buildExecutionCheckResult(
  data: Omit<ExecutionCheckResult, 'checkId'>
): ExecutionCheckResult {
  return { checkId: randomUUID(), ...data }
}
