// src/app/api/chat/[projectId]/message/route.ts
import { type NextRequest } from 'next/server'
import { POST_message } from '@/features/F-chat/contract/chat-contract'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const params = await context.params
  return POST_message(req, { params })
}
