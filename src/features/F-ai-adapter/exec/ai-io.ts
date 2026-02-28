// src/features/F-ai-adapter/exec/ai-io.ts
// R4 — AI provider streaming interface

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface StreamChunk {
  content: string
  totalTokens: number | null
  done: boolean
}

// ── Provider Config ───────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE = 'https://api.deepseek.com/v1'


// ── DeepSeek Provider ─────────────────────────────────────────────────────────

async function* streamFromDeepSeek(
  messages: ChatMessage[],
  modelId: string
): AsyncGenerator<StreamChunk> {
  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelId ?? 'deepseek-chat',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  })

  if (!res.ok) throw new Error(`DeepSeek ${res.status}`)

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      if (raw === '[DONE]') return
      try {
        const chunk = JSON.parse(raw)
        const content = chunk.choices?.[0]?.delta?.content
        if (content) yield { content, totalTokens: null, done: false }
      } catch {}
    }
  }
  yield { content: '', totalTokens: null, done: true }
}

// ── Anthropic Provider ────────────────────────────────────────────────────────

async function* streamFromAnthropic(
  messages: ChatMessage[],
  modelId: string
): AsyncGenerator<StreamChunk> {
  const systemMessages = messages.filter(m => m.role === 'system')
  const conversationMessages = messages.filter(m => m.role !== 'system')
  
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelId ?? 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemMessages.length > 0 ? systemMessages[0].content : undefined,
      messages: conversationMessages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  })

  if (!res.ok) throw new Error(`Anthropic ${res.status}`)

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      try {
        const event = JSON.parse(raw)
        if (event.type === 'content_block_delta' && event.delta?.text) {
          yield { content: event.delta.text, totalTokens: null, done: false }
        }
      } catch {}
    }
  }
  yield { content: '', totalTokens: null, done: true }
}

// ── Mock Provider ─────────────────────────────────────────────────────────────

async function* streamMock(messages: ChatMessage[]): AsyncGenerator<StreamChunk> {
  const lastMessage = messages[messages.length - 1]?.content ?? ''
  const response = `Mock response to: "${lastMessage.slice(0, 50)}..."`
  
  for (const char of response) {
    yield { content: char, totalTokens: null, done: false }
    await new Promise(resolve => setTimeout(resolve, 20))
  }
  yield { content: '', totalTokens: null, done: true }
}

// ── Main Export ───────────────────────────────────────────────────────────────

export async function* streamAIResponse(
  messages: ChatMessage[],
  modelId: string
): AsyncGenerator<StreamChunk> {
  // Priority: DeepSeek → Anthropic → Mock
  if (!process.env.DEEPSEEK_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    yield* streamMock(messages)
  } else if (process.env.DEEPSEEK_API_KEY) {
    yield* streamFromDeepSeek(messages, modelId)
  } else if (process.env.ANTHROPIC_API_KEY) {
    yield* streamFromAnthropic(messages, modelId)
  } else {
    yield* streamMock(messages)
  }
}
