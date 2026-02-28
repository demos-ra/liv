// src/app/api/chat/[projectId]/messages/route.ts
import { type NextRequest } from 'next/server'
import { GET_messages } from '@/features/F-chat/contract/chat-contract'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const params = await context.params
  return GET_messages(req, { params })
}
