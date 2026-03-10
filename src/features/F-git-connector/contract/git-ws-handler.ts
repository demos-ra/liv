// [F-git-connector/R3/C2] Git agent WebSocket handler
// R3: contract layer — manages persistent agent connections.
// R3 rule: never imports exec/. Uses R2 workflow functions only.

import { EVENTS } from '@/features/F-event-system/config/event-schema'
import { WebSocket, WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'
import { parseAgentResponse, buildPingMessage } from '../domain/git-logic'
import { lookupAgentToken, connectAgent, disconnectAgent } from '../app/git-workflow'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { AGENT_CONFIG } from '../config/git-config'

type PendingCommand = {
  resolve: (output: { stdout: string; stderr: string; exitCode: number }) => void
  reject: (err: Error) => void
  timer: ReturnType<typeof setTimeout>
}

// In-memory map: agentId → WebSocket + pending commands
const connections = new Map<string, {
  ws: WebSocket
  userId: string
  projectId: string
  pending: Map<string, PendingCommand>
}>()

export function createAgentWebSocketHandler(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    let agentId: string | null = null

    ws.on('message', async (data) => {
      const response = parseAgentResponse(data.toString())
      if (!response) return

      if (response.type === 'auth_ok') {
        agentId = response.agentId
        const stored = await lookupAgentToken(agentId)
        if (!stored) { ws.close(); return }

        connections.set(agentId, {
          ws,
          userId: stored.userId,
          projectId: stored.projectId,
          pending: new Map(),
        })

        await connectAgent(agentId)
        await emitEvent({ type: EVENTS.GIT.CONNECTED, payload: { userId: stored.userId, projectId: stored.projectId } })
      }

      if (response.type === 'output' && agentId) {
        const conn = connections.get(agentId)
        const pending = conn?.pending.get(response.commandId)
        if (pending) {
          clearTimeout(pending.timer)
          conn!.pending.delete(response.commandId)
          pending.resolve({ stdout: response.stdout, stderr: response.stderr, exitCode: response.exitCode })
        }
      }

      if (response.type === 'pong' && agentId) {
        // connection alive — no action needed
      }
    })

    ws.on('close', async () => {
      if (agentId) {
        const conn = connections.get(agentId)
        connections.delete(agentId)
        if (conn) {
          await disconnectAgent(agentId)
          await emitEvent({ type: EVENTS.GIT.DISCONNECTED, payload: { userId: conn.userId, projectId: conn.projectId } })
        }
      }
    })

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(buildPingMessage()))
      }
    }, AGENT_CONFIG.pingIntervalMs)

    ws.on('close', () => clearInterval(pingInterval))
  })
}

export async function sendAgentCommand(
  agentId: string,
  commandId: string,
  payload: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const conn = connections.get(agentId)
  if (!conn || conn.ws.readyState !== WebSocket.OPEN) {
    throw new Error(`Agent ${agentId} not connected`)
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      conn.pending.delete(commandId)
      reject(new Error(`Command ${commandId} timed out`))
    }, AGENT_CONFIG.commandTimeoutMs)

    conn.pending.set(commandId, { resolve, reject, timer })
    conn.ws.send(JSON.stringify({ type: 'command', commandId, payload }))
  })
}

export function isAgentConnected(agentId: string): boolean {
  const conn = connections.get(agentId)
  return conn?.ws.readyState === WebSocket.OPEN
}
