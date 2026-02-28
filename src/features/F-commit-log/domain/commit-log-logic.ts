// [F-commit-log/R1/C2] Commit log domain logic
// R1: pure functions, no I/O, depends R0 only

import {
  CommitRecord,
  COMMIT_FORMAT_PATTERN,
  COMMIT_LOG_CONFIG,
  Authorship,
  ChangeCode,
} from '../config/commit-log-config'
import { generateId } from '@/core/types/primitives'

// --- Parse LA commit message ---

export type ParsedCommitMessage = {
  featureTag: string
  rLayer: number
  changeCode: ChangeCode
  description: string
}

export function parseCommitMessage(message: string): ParsedCommitMessage | null {
  const match = message.match(COMMIT_FORMAT_PATTERN)
  if (!match) return null
  return {
    featureTag: `F-${match[1]}`,
    rLayer: Number(match[2]),
    changeCode: `C${match[3]}` as ChangeCode,
    description: match[4].trim(),
  }
}

export function validateCommitMessage(message: string): { valid: boolean; error?: string } {
  const parsed = parseCommitMessage(message)
  if (!parsed) {
    return {
      valid: false,
      error: 'Commit message must match format: [F-{feature}/R{0-4}/C{1-5}] Description',
    }
  }
  if (parsed.description.length > COMMIT_LOG_CONFIG.maxSummaryLength) {
    return {
      valid: false,
      error: `Description exceeds ${COMMIT_LOG_CONFIG.maxSummaryLength} character limit`,
    }
  }
  return { valid: true }
}

// --- Build commit record ---

export function buildCommitRecord(
  projectId: string,
  userId: string,
  message: string,
  authorship: Authorship,
  options: {
    filesChanged?: string[]
    additions?: number
    deletions?: number
    gitHash?: string
  } = {}
): CommitRecord | null {
  const parsed = parseCommitMessage(message)
  if (!parsed) return null

  return {
    commitId: generateId('commit'),
    projectId,
    userId,
    gitHash: options.gitHash ?? null,
    featureTag: parsed.featureTag,
    rLayer: parsed.rLayer,
    changeCode: parsed.changeCode,
    description: parsed.description,
    authorship,
    confirmedBy: authorship === 'ai_confirmed' ? userId : null,
    confirmedAt: authorship === 'ai_confirmed' ? Date.now() : null,
    createdAt: Date.now(),
    filesChanged: options.filesChanged ?? [],
    additions: options.additions ?? null,
    deletions: options.deletions ?? null,
  }
}

// --- Confirmation ---

export function confirmCommit(record: CommitRecord, confirmedByUserId: string): CommitRecord {
  return {
    ...record,
    authorship: 'ai_confirmed',
    confirmedBy: confirmedByUserId,
    confirmedAt: Date.now(),
  }
}

export function attachGitHash(record: CommitRecord, gitHash: string): CommitRecord {
  return { ...record, gitHash }
}

// --- Stats helpers ---

export function summarizeAuthorshipBreakdown(records: CommitRecord[]): {
  human: number
  ai: number
  aiConfirmed: number
  total: number
} {
  return records.reduce(
    (acc, r) => {
      acc.total++
      if (r.authorship === 'human') acc.human++
      else if (r.authorship === 'ai') acc.ai++
      else acc.aiConfirmed++
      return acc
    },
    { human: 0, ai: 0, aiConfirmed: 0, total: 0 }
  )
}
