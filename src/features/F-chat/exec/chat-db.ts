// @liv-standard v1.3
// [F-chat/R4]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-chat
// category:   Modality
// layer:      R4
// wires-in:
//   W-FN    db                core/db/client
//   W-ATOM  ChatMessage       F-chat/R0 (chat-config)
//   W-ATOM  ChatThread        F-chat/R0 (chat-config)
//   W-FN    parseCursor       F-chat/R1 (chat-logic)
//   W-FN    buildCursor       F-chat/R1 (chat-logic)
// wires-out:
//   W-FN    persistMessage    →  F-chat/R2 (chat-workflow)
//   W-FN    updateMessage     →  F-chat/R2 (chat-workflow)
//   W-FN    getMessageById    →  F-chat/R2 (chat-workflow)
//   W-FN    getMessages       →  F-chat/R2 (chat-workflow)
// deps:
//   R0  ../config/chat-config
//   R1  ../domain/chat-logic
//   R5  @/core/db/client
// validated:  pending
// [F-chat/R4/C2] Chat database I/O
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import type { Result } from '@/core/types/primitives'
import { ChatMessage, ChatThread } from '../config/chat-config'
import { parseCursor, buildCursor } from '../domain/chat-logic'

export async function persistMessage(message: ChatMessage): Promise<Result<void>> {
  try {
    await db.query(
      `INSERT INTO chat_messages (
        message_id, project_id, session_id, user_id, role, content,
        status, created_at, completed_at, token_count, model_id, parent_message_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,
        to_timestamp($8 / 1000.0),
        to_timestamp($9 / 1000.0),
        $10,$11,$12)`,
      [
        message.messageId,
        message.projectId,
        message.sessionId,
        message.userId,
        message.role,
        message.content,
        message.status,
        message.createdAt,
        message.completedAt,
        message.tokenCount,
        message.modelId,
        message.parentMessageId,
      ]
    )
    return { ok: true, data: undefined }
  } catch (err) {
    const message_ = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'CHAT_DB_PERSIST_FAILED', message: message_ } }
  }
}

export async function updateMessage(message: ChatMessage): Promise<Result<void>> {
  try {
    await db.query(
      `UPDATE chat_messages
       SET content = $2, status = $3,
           completed_at = to_timestamp($4 / 1000.0),
           token_count = $5
       WHERE message_id = $1`,
      [message.messageId, message.content, message.status, message.completedAt, message.tokenCount]
    )
    return { ok: true, data: undefined }
  } catch (err) {
    const message_ = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'CHAT_DB_UPDATE_FAILED', message: message_ } }
  }
}

export async function getMessageById(messageId: string): Promise<Result<ChatMessage | null>> {
  try {
    const result = await db.query(
      `SELECT * FROM chat_messages WHERE message_id = $1`,
      [messageId]
    )
    return { ok: true, data: result.rows[0] ? rowToMessage(result.rows[0]) : null }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'CHAT_DB_QUERY_FAILED', message } }
  }
}

export async function getMessages(
  projectId: string,
  cursor: string | null,
  limit: number
): Promise<Result<ChatThread>> {
  try {
    const parsed = cursor ? parseCursor(cursor) : null

    const result = await db.query(
      `SELECT * FROM chat_messages
       WHERE project_id = $1
         ${parsed ? `AND (created_at < to_timestamp($3 / 1000.0) OR (created_at = to_timestamp($3 / 1000.0) AND message_id < $4))` : ''}
       ORDER BY created_at DESC, message_id DESC
       LIMIT $2`,
      parsed
        ? [projectId, limit + 1, parsed.createdAt, parsed.messageId]
        : [projectId, limit + 1]
    )

    const rows = result.rows
    const hasMore = rows.length > limit
    const messages = rows.slice(0, limit).map(rowToMessage).reverse()

    return {
      ok: true,
      data: {
        projectId,
        messages,
        hasMore,
        oldestCursor: messages.length > 0 ? buildCursor(messages[0]) : null,
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'CHAT_DB_QUERY_FAILED', message } }
  }
}

function rowToMessage(row: Record<string, unknown>): ChatMessage {
  return {
    messageId: row.message_id as string,
    projectId: row.project_id as string,
    sessionId: row.session_id as string,
    userId: row.user_id as string,
    role: row.role as ChatMessage['role'],
    content: row.content as string,
    status: row.status as ChatMessage['status'],
    createdAt: Number(new Date(row.created_at as string)),
    completedAt: row.completed_at ? Number(new Date(row.completed_at as string)) : null,
    tokenCount: row.token_count as number | null,
    modelId: row.model_id as string | null,
    parentMessageId: row.parent_message_id as string | null,
  }
}
