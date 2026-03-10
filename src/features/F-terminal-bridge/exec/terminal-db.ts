// [F-terminal-bridge/R4/C2] Terminal bridge I/O — STUB
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { TerminalCommand } from '../config/terminal-config'

// STUB: logs command intent only, no live execution

export async function logCommandStub(command: TerminalCommand): Promise<void> {
  await db.query(
    `INSERT INTO terminal_command_log (command_id, user_id, project_id, payload, issued_at, status)
     VALUES ($1, $2, $3, $4, to_timestamp($5 / 1000.0), 'stub')`,
    [command.commandId, command.userId, command.projectId, command.payload, command.issuedAt]
  )
}

export async function getCommandLog(projectId: string, limit = 50): Promise<TerminalCommand[]> {
  const result = await db.query<{
    command_id: string; user_id: string; project_id: string; payload: string; issued_at: string
  }>(
    `SELECT command_id, user_id, project_id, payload, EXTRACT(EPOCH FROM issued_at) * 1000 as issued_at
     FROM terminal_command_log WHERE project_id = $1 ORDER BY issued_at DESC LIMIT $2`,
    [projectId, limit]
  )
  return result.rows.map((r) => ({
    commandId: r.command_id,
    userId: r.user_id,
    projectId: r.project_id,
    payload: r.payload,
    issuedAt: Number(r.issued_at),
  }))
}
