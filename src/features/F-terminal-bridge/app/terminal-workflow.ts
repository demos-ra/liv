// [F-terminal-bridge/R2/C2] Terminal bridge workflow — STUB
// R2: orchestration, depends R0 + R1 + R4

import { EVENTS } from '@/features/F-event-system/config/event-schema'
import { buildCommand, isCommandAllowed, buildStubOutput } from '../domain/terminal-logic'
import { logCommandStub } from '../exec/terminal-db'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

export async function executeCommand(
  payload: string,
  userId: string,
  projectId: string
): Promise<{ output: string; stderr: string; exitCode: number }> {
  const command = buildCommand(payload, userId, projectId)

  if (!isCommandAllowed(payload)) {
    return { output: '', stderr: `Command not allowed: ${payload.split(' ')[0]}`, exitCode: 1 }
  }

  // STUB: log intent, return stub output
  await logCommandStub(command)
  const output = buildStubOutput(command.commandId)

  await emitEvent({
    type: EVENTS.TERMINAL.STUBBED,
    payload: { userId, projectId, commandId: command.commandId },
  })

  return { output: output.stdout, stderr: output.stderr, exitCode: output.exitCode }
}

export async function connectTerminal(userId: string, projectId: string): Promise<boolean> {
  // STUB: emit event, return false until bridge is implemented
  await emitEvent({ type: EVENTS.TERMINAL.CONNECTED, payload: { userId, projectId, stub: true } })
  return false
}
