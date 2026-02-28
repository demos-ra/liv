// [F-git-connector/R1/C2] Git connector domain logic
// R1: pure functions, no I/O, depends R0 only

import { GITHUB_CONFIG, AgentMessage, AgentResponse } from '../config/git-config'
import { generateId } from '@/core/types/primitives'

// --- OAuth URL builder ---

export function buildOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GITHUB_CONFIG.clientId,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}${GITHUB_CONFIG.callbackPath}`,
    scope: GITHUB_CONFIG.scopes.join(' '),
    state,
  })
  return `${GITHUB_CONFIG.authUrl}?${params}`
}

export function validateOAuthState(received: string, expected: string): boolean {
  return received === expected && received.length > 0
}

// --- Agent message builders ---

export function buildAuthMessage(token: string): AgentMessage {
  return { type: 'auth', token }
}

export function buildCommandMessage(payload: string): { message: AgentMessage; commandId: string } {
  const commandId = generateId('cmd')
  return { message: { type: 'command', commandId, payload }, commandId }
}

export function buildPingMessage(): AgentMessage {
  return { type: 'ping' }
}

// --- Response parsers ---

export function parseAgentResponse(raw: string): AgentResponse | null {
  try {
    return JSON.parse(raw) as AgentResponse
  } catch {
    return null
  }
}

// --- Git command builders (pure string construction) ---

export function gitLogCommand(branch: string, limit = 20): string {
  return `git log ${branch} --oneline --no-color -n ${limit}`
}

export function gitStatusCommand(): string {
  return 'git status --porcelain'
}

export function gitBranchListCommand(): string {
  return 'git branch -a --no-color'
}

export function gitDiffCommand(ref1: string, ref2: string): string {
  return `git diff ${ref1}..${ref2} --name-only`
}
