// [F-git-connector/R4/C2] Git connector I/O — GitHub API + Postgres
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { GITHUB_CONFIG, RepoMeta } from '../config/git-config'

// --- GitHub OAuth token exchange ---

export async function exchangeCodeForToken(code: string): Promise<{ access_token?: string; error?: string }> {
  const res = await fetch(GITHUB_CONFIG.tokenUrl, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: GITHUB_CONFIG.clientId,
      client_secret: GITHUB_CONFIG.clientSecret,
      code,
    }),
  })
  return res.json()
}

// --- GitHub user fetch ---

export async function fetchGitHubUser(token: string): Promise<{ login: string; id: number } | null> {
  try {
    const res = await fetch(`${GITHUB_CONFIG.apiBase}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// --- GitHub repo fetch ---

export async function fetchGitHubRepo(token: string, owner: string, repo: string): Promise<RepoMeta | null> {
  try {
    const res = await fetch(`${GITHUB_CONFIG.apiBase}/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      owner,
      name: repo,
      defaultBranch: data.default_branch,
      private: data.private,
      cloneUrl: data.clone_url,
    }
  } catch {
    return null
  }
}

// --- Agent token persistence ---

export type StoredAgentToken = {
  userId: string
  projectId: string
  githubAccessToken: string
  githubLogin: string
  githubUserId: string
  connectedAt: Date
}

type AgentTokenRow = {
  user_id: string
  project_id: string
  github_access_token: string
  github_login: string
  github_user_id: string
  connected_at: Date
}

function rowToAgentToken(r: AgentTokenRow): StoredAgentToken {
  return {
    userId: r.user_id,
    projectId: r.project_id,
    githubAccessToken: r.github_access_token,
    githubLogin: r.github_login,
    githubUserId: r.github_user_id,
    connectedAt: r.connected_at,
  }
}

export async function storeAgentToken(data: StoredAgentToken): Promise<void> {
  await db.query(
    `INSERT INTO git_connections (user_id, project_id, github_access_token, github_login, github_user_id, connected_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, project_id) DO UPDATE
     SET github_access_token = $3, github_login = $4, github_user_id = $5, connected_at = $6`,
    [data.userId, data.projectId, data.githubAccessToken, data.githubLogin, data.githubUserId, data.connectedAt]
  )
}

export async function getAgentToken(userId: string, projectId: string): Promise<StoredAgentToken | null> {
  const result = await db.query<AgentTokenRow>(
    `SELECT user_id, project_id, github_access_token, github_login, github_user_id, connected_at
     FROM git_connections WHERE user_id = $1 AND project_id = $2`,
    [userId, projectId]
  )
  return result.rows[0] ? rowToAgentToken(result.rows[0]) : null
}

export async function getAgentTokenByAgentId(agentId: string): Promise<StoredAgentToken | null> {
  const result = await db.query<AgentTokenRow>(
    `SELECT user_id, project_id, github_access_token, github_login, github_user_id, connected_at
     FROM git_connections WHERE agent_id = $1`,
    [agentId]
  )
  return result.rows[0] ? rowToAgentToken(result.rows[0]) : null
}

export async function storeRepoMeta(data: RepoMeta & { userId: string; projectId: string }): Promise<void> {
  await db.query(
    `INSERT INTO git_repos (user_id, project_id, owner, name, default_branch, private, clone_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id, project_id) DO UPDATE
     SET owner = $3, name = $4, default_branch = $5, private = $6, clone_url = $7`,
    [data.userId, data.projectId, data.owner, data.name, data.defaultBranch, data.private, data.cloneUrl]
  )
}

export async function recordAgentConnection(agentId: string): Promise<void> {
  await db.query(
    `UPDATE git_connections SET agent_id = $1, last_connected_at = NOW() WHERE agent_id = $1
     OR EXISTS (SELECT 1 FROM git_connections WHERE agent_id = $1)`,
    [agentId]
  )
}

export async function recordAgentDisconnection(agentId: string): Promise<void> {
  await db.query(
    `UPDATE git_connections SET last_disconnected_at = NOW() WHERE agent_id = $1`,
    [agentId]
  )
}
