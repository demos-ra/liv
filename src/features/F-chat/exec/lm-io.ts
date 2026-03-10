// [F-chat/R4/C4] lm-io — Living Memory adapter
// R4: I/O boundary. Adapts chat-workflow call signatures to F-memory.
// R4 rule: never imports R3 of another slice.
// Memory functions are injected by R2 chat-workflow via MemoryDeps.
// O3: fail-silent — memory down must never break chat.

export interface MemoryDeps {
  remember:     (text: string, sessionId: string) => Promise<void>
  recall:       (query: string) => Promise<string>
  onSessionEnd: () => Promise<void>
}

export async function lmWriteEvent(
  content:   string,
  _slice:    string,
  sessionId: string,
  deps:      MemoryDeps,
): Promise<void> {
  try {
    await deps.remember(content, sessionId)
  } catch {
    // Memory down — fail silent, chat continues
  }
}

export async function lmRecall(
  query: string,
  deps:  MemoryDeps,
  _deep = false,
): Promise<string> {
  try {
    return await deps.recall(query)
  } catch {
    return ''
  }
}

export async function lmRemember(
  _branch:    string,
  _subject:   string,
  _predicate: string,
  object:     string,
  sessionId:  string,
  deps:       MemoryDeps,
): Promise<void> {
  try {
    await deps.remember(object, sessionId)
  } catch {
    // fail silent
  }
}

export async function lmSessionEnd(
  _sessionId: string,
  deps:       MemoryDeps,
): Promise<void> {
  try {
    await deps.onSessionEnd()
  } catch {
    // fail silent
  }
}

export async function lmHealth(): Promise<boolean> {
  return true
}
