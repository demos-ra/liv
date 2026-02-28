// [F-terminal-bridge/R1/C2] Terminal bridge domain logic — STUB
// R1: pure functions, depends R0 only

import { TERMINAL_CONFIG, TerminalCommand, TerminalOutput } from '../config/terminal-config'
import { generateId } from '@/core/types/primitives'

export function buildCommand(payload: string, userId: string, projectId: string): TerminalCommand {
  return {
    commandId: generateId('cmd'),
    payload,
    projectId,
    userId,
    issuedAt: Date.now(),
  }
}

export function isCommandAllowed(payload: string): boolean {
  const cmd = payload.trim().split(' ')[0]
  return TERMINAL_CONFIG.allowedCommands.includes(cmd as typeof TERMINAL_CONFIG.allowedCommands[number])
}

export function buildStubOutput(commandId: string): TerminalOutput {
  return {
    commandId,
    stdout: '[terminal-bridge] Stub: bridge not yet connected.',
    stderr: '',
    exitCode: 0,
    completedAt: Date.now(),
  }
}
