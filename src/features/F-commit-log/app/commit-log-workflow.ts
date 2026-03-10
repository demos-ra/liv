// [F-commit-log/R2/C3] Commit log workflow orchestration
// R2: orchestration, depends R0 + R1 + R4

import { Authorship } from '../config/commit-log-config'
import {
  buildCommitRecord,
  confirmCommit,
  attachGitHash,
  validateCommitMessage,
} from '../domain/commit-log-logic'
import {
  persistCommitRecord,
  updateCommitRecord,
  getCommitsByProject,
  getCommitById,
} from '../exec/commit-log-db'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'

// --- Record a new commit (pre-git-push) ---

export async function recordCommit(
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
): Promise<{ commitId: string } | { error: string }> {
  const validation = validateCommitMessage(message)
  if (!validation.valid) return { error: validation.error! }

  const record = buildCommitRecord(projectId, userId, message, authorship, options)
  if (!record) return { error: 'Failed to parse commit message' }

  await persistCommitRecord(record)

  await emitEvent({
    type: EVENTS.COMMIT_LOG.COMMIT_RECORDED,
    payload: {
      projectId,
      commitId: record.commitId,
      userId,
      featureTag: record.featureTag,
      authorship,
    },
  })

  return { commitId: record.commitId }
}

// --- Human confirms AI-generated commit ---

export async function confirmAiCommit(
  commitId: string,
  confirmedByUserId: string
): Promise<boolean> {
  const record = await getCommitById(commitId)
  if (!record) return false
  if (record.authorship !== 'ai') return false

  const confirmed = confirmCommit(record, confirmedByUserId)
  await updateCommitRecord(confirmed)

  await emitEvent({
    type: EVENTS.COMMIT_LOG.COMMIT_CONFIRMED,
    payload: {
      projectId: confirmed.projectId,
      commitId,
      userId: confirmedByUserId,
      featureTag: confirmed.featureTag,
    },
  })

  return true
}

// --- Attach git hash once agent confirms push ---

export async function attachHash(commitId: string, gitHash: string): Promise<void> {
  const record = await getCommitById(commitId)
  if (!record) return
  const updated = attachGitHash(record, gitHash)
  await updateCommitRecord(updated)
}

// --- Load paginated commit history ---

export async function loadCommitHistory(
  projectId: string,
  cursor: string | null,
  filters: { featureTag?: string; authorship?: Authorship } = {}
) {
  return getCommitsByProject(projectId, cursor, filters)
}
