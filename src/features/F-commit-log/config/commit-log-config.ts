// [F-commit-log/R0/C2] Commit log configuration and types
// R0: pure config, zero dependencies

export const COMMIT_LOG_CONFIG = {
  pageSize: 30,
  maxSummaryLength: 200,
} as const

export const COMMIT_LOG_NAMESPACE = 'commit_log' as const

// Mirrors LA v2.0 commit format: [F-{feature}/R{layer}/C{code}] Description
export const COMMIT_FORMAT_PATTERN = /^\[F-([a-z][a-z0-9-]*)\/R([0-4])\/C([1-5])\]\s(.+)$/

export type Authorship = 'human' | 'ai' | 'ai_confirmed'
// ai_confirmed = AI generated, human reviewed and confirmed before commit

export type ChangeCode = 'C1' | 'C2' | 'C3' | 'C4' | 'C5'

export const CHANGE_CODE_LABELS: Record<ChangeCode, string> = {
  C1: 'Internal refactor',
  C2: 'New feature',
  C3: 'Contract change',
  C4: 'Structure change',
  C5: 'Migration',
}

export type CommitRecord = {
  commitId: string
  projectId: string
  userId: string
  gitHash: string | null        // null until agent confirms push
  featureTag: string            // F-{name}
  rLayer: number                // 0–4
  changeCode: ChangeCode
  description: string
  authorship: Authorship
  confirmedBy: string | null    // userId who confirmed (for ai_confirmed)
  confirmedAt: number | null
  createdAt: number
  filesChanged: string[]
  additions: number | null
  deletions: number | null
}
