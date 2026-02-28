// [F-terminal-bridge/R0/C2] Terminal bridge configuration — STUB
// R0: pure config, zero dependencies
// Status: contract declared, I/O stubbed. Full implementation Phase 4+.

export const TERMINAL_CONFIG = {
  websocketPath: '/api/terminal/agent',
  commandTimeoutMs: 30_000,
  maxOutputBytes: 1024 * 512, // 500KB per command output
  allowedCommands: ['npm', 'npx', 'node', 'python3', 'git'] as const,
} as const

export const TERMINAL_NAMESPACE = 'terminal' as const

export type TerminalConnectionStatus = 'disconnected' | 'stub' | 'connected' | 'error'

export type TerminalCommand = {
  commandId: string
  payload: string
  projectId: string
  userId: string
  issuedAt: number
}

export type TerminalOutput = {
  commandId: string
  stdout: string
  stderr: string
  exitCode: number
  completedAt: number
}

// Stub marker — any consumer checking this knows bridge is not live
export const TERMINAL_IS_STUB = true as const
