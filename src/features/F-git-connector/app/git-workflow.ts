// [F-git-connector/R2/C2] Git connector workflow orchestration
// R2: orchestration, depends R0 + R1 + R4

import { GITHUB_CONFIG, GIT_NAMESPACE } from '../config/git-config'
import { buildOAuthUrl, validateOAuthState } from '../domain/git-logic'
import { exchangeCodeForToken, fetchGitHubUser, storeAgentToken, getAgentToken, storeRepoMeta } from '../exec/git-io'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { generateId } from '@/core/types/primitives'

// --- OAuth initiation ---

export function initiateOAuth(): { url: string; state: string } {
  const state = generateId('oauth')
  const url = buildOAuthUrl(state)
  return { url, state }
}

// --- OAuth callback: exchange code → token → user → persist ---

export async function handleOAuthCallback(
  code: string,
  receivedState: string,
  expectedState: string,
  userId: string,
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  if (!validateOAuthState(receivedState, expectedState)) {
    return { success: false, error: 'invalid_state' }
  }

  const tokenResult = await exchangeCodeForToken(code)
  if (!tokenResult.access_token) {
    return { success: false, error: 'token_exchange_failed' }
  }

  const githubUser = await fetchGitHubUser(tokenResult.access_token)
  if (!githubUser) {
    return { success: false, error: 'user_fetch_failed' }
  }

  await storeAgentToken({
    userId,
    projectId,
    githubAccessToken: tokenResult.access_token,
    githubLogin: githubUser.login,
    githubUserId: String(githubUser.id),
    connectedAt: new Date(),
  })

  await emitEvent({
    type: 'git.connected',
    payload: { userId, projectId, githubLogin: githubUser.login },
  })

  return { success: true }
}

// --- Repo sync: fetch meta from GitHub API ---

export async function syncRepoMeta(
  userId: string,
  projectId: string,
  owner: string,
  repo: string
): Promise<boolean> {
  const stored = await getAgentToken(userId, projectId)
  if (!stored) return false

  const repoData = await fetchRepoFromGitHub(stored.githubAccessToken, owner, repo)
  if (!repoData) return false

  await storeRepoMeta({ userId, projectId, ...repoData })

  await emitEvent({
    type: 'git.repo.synced',
    payload: { userId, projectId, owner, repo },
  })

  return true
}

// --- Local helper: GitHub repo API call (via exec) ---

async function fetchRepoFromGitHub(token: string, owner: string, repo: string) {
  const { fetchGitHubRepo } = await import('../exec/git-io')
  return fetchGitHubRepo(token, owner, repo)
}
