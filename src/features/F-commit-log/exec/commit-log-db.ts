// [F-commit-log/R4/C2] Commit log database I/O
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { CommitRecord, COMMIT_LOG_CONFIG, Authorship } from '../config/commit-log-config'

export async function persistCommitRecord(record: CommitRecord): Promise<void> {
  await db.query(
    `INSERT INTO commit_log (
      commit_id, project_id, user_id, git_hash,
      feature_tag, r_layer, change_code, description,
      authorship, confirmed_by, confirmed_at, created_at,
      files_changed, additions, deletions
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      to_timestamp($11 / 1000.0),
      to_timestamp($12 / 1000.0),
      $13,$14,$15)`,
    [
      record.commitId, record.projectId, record.userId, record.gitHash,
      record.featureTag, record.rLayer, record.changeCode, record.description,
      record.authorship, record.confirmedBy, record.confirmedAt, record.createdAt,
      JSON.stringify(record.filesChanged), record.additions, record.deletions,
    ]
  )
}

export async function updateCommitRecord(record: CommitRecord): Promise<void> {
  await db.query(
    `UPDATE commit_log
     SET git_hash = $2, authorship = $3, confirmed_by = $4,
         confirmed_at = to_timestamp($5 / 1000.0)
     WHERE commit_id = $1`,
    [record.commitId, record.gitHash, record.authorship, record.confirmedBy, record.confirmedAt]
  )
}

export async function getCommitById(commitId: string): Promise<CommitRecord | null> {
  const result = await db.query(
    `SELECT * FROM commit_log WHERE commit_id = $1`,
    [commitId]
  )
  return result.rows[0] ? rowToRecord(result.rows[0]) : null
}

export async function getCommitsByProject(
  projectId: string,
  cursor: string | null,
  filters: { featureTag?: string; authorship?: Authorship }
): Promise<{ commits: CommitRecord[]; hasMore: boolean; cursor: string | null }> {
  const conditions: string[] = ['project_id = $1']
  const params: unknown[] = [projectId]
  let idx = 2

  if (cursor) {
    conditions.push(`created_at < to_timestamp($${idx++} / 1000.0)`)
    params.push(Number(cursor))
  }
  if (filters.featureTag) {
    conditions.push(`feature_tag = $${idx++}`)
    params.push(filters.featureTag)
  }
  if (filters.authorship) {
    conditions.push(`authorship = $${idx++}`)
    params.push(filters.authorship)
  }

  const limit = COMMIT_LOG_CONFIG.pageSize
  params.push(limit + 1)

  const result = await db.query(
    `SELECT * FROM commit_log WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC LIMIT $${idx}`,
    params
  )

  const rows = result.rows
  const hasMore = rows.length > limit
  const commits = rows.slice(0, limit).map(rowToRecord)

  return {
    commits,
    hasMore,
    cursor: commits.length > 0 ? String(commits[commits.length - 1].createdAt) : null,
  }
}

function rowToRecord(row: Record<string, unknown>): CommitRecord {
  return {
    commitId: row.commit_id as string,
    projectId: row.project_id as string,
    userId: row.user_id as string,
    gitHash: row.git_hash as string | null,
    featureTag: row.feature_tag as string,
    rLayer: row.r_layer as number,
    changeCode: row.change_code as CommitRecord['changeCode'],
    description: row.description as string,
    authorship: row.authorship as CommitRecord['authorship'],
    confirmedBy: row.confirmed_by as string | null,
    confirmedAt: row.confirmed_at ? Number(new Date(row.confirmed_at as string)) : null,
    createdAt: Number(new Date(row.created_at as string)),
    filesChanged: (row.files_changed as string[]) ?? [],
    additions: row.additions as number | null,
    deletions: row.deletions as number | null,
  }
}
