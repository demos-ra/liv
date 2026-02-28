// [F-commit-log/R3/C2] useCommitLog hook — reads commit_log:: namespace
// R3: client-side contract

'use client'

import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { COMMIT_LOG_NAMESPACE, CommitRecord, Authorship } from '../config/commit-log-config'
import { summarizeAuthorshipBreakdown } from '../domain/commit-log-logic'

export type CommitLogState = {
  projectId: string
  commits: CommitRecord[]
  hasMore: boolean
  cursor: string | null
}

const INITIAL_STATE: CommitLogState = {
  projectId: '',
  commits: [],
  hasMore: false,
  cursor: null,
}

export function useCommitLog(projectId: string): CommitLogState {
  return useNamespace<CommitLogState>(`${COMMIT_LOG_NAMESPACE}:${projectId}`) ?? {
    ...INITIAL_STATE,
    projectId,
  }
}

export function useAuthorshipBreakdown(projectId: string) {
  const { commits } = useCommitLog(projectId)
  return summarizeAuthorshipBreakdown(commits)
}

export function usePendingConfirmations(projectId: string): CommitRecord[] {
  const { commits } = useCommitLog(projectId)
  return commits.filter((c) => c.authorship === 'ai')
}
