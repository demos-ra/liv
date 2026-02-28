// [F-git-connector/R0/C2] Git connector configuration
// R0: pure config, zero dependencies

export const GITHUB_CONFIG = {
  authUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  apiBase: 'https://api.github.com',
  scopes: ['read:user', 'repo'],
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackPath: '/api/git/oauth/callback',
} as const

export const AGENT_CONFIG = {
  websocketPath: '/api/git/agent',
  pingIntervalMs: 30_000,
  reconnectBackoffMs: [1000, 2000, 5000, 10000] as const,
  maxReconnectAttempts: 10,
  commandTimeoutMs: 30_000,
} as const

export const GIT_NAMESPACE = 'git' as const

export type GitConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export type AgentMessage =
  | { type: 'command'; commandId: string; payload: string }
  | { type: 'ping' }
  | { type: 'auth'; token: string }

export type AgentResponse =
  | { type: 'output'; commandId: string; stdout: string; stderr: string; exitCode: number }
  | { type: 'pong' }
  | { type: 'auth_ok'; agentId: string }
  | { type: 'auth_fail'; reason: string }
  | { type: 'error'; commandId?: string; message: string }

export type RepoMeta = {
  owner: string
  name: string
  defaultBranch: string
  private: boolean
  cloneUrl: string
}
