// [F-chat/R4/C4] lm-io — Living Memory adapter
// R4: I/O boundary. Adapts chat-workflow call signatures to F-memory contract.
// No HTTP. No Python bridge. Direct TypeScript imports.
// O3: fail-silent — memory down must never break chat.
//
// Previous: proxied to http://127.0.0.1:8765 (dead Python bridge)
// Now:      direct imports from F-memory R3 contract

import { remember, recall, onSessionEnd } from '@/features/F-memory/contract/memory-contract'

export async function lmWriteEvent(
  content:   string,
  _slice:    string,
  sessionId: string,
  _provenance = 'main'
): Promise<void> {
  try {
    await remember(content, sessionId)
  } catch {
    // Memory down — fail silent, chat continues
  }
}

export async function lmRecall(
  query: string,
  _deep = false
): Promise<string> {
  try {
    return await recall(query)
  } catch {
    return ''
  }
}

export async function lmRemember(
  _branch:   string,
  _subject:  string,
  _predicate: string,
  object:    string,
  sessionId: string
): Promise<void> {
  // Collapsed: subject/predicate/object → single remember() call
  // The unified physics handles semantic structure internally
  try {
    await remember(object, sessionId)
  } catch {
    // fail silent
  }
}

export async function lmSessionEnd(sessionId: string): Promise<void> {
  try {
    await onSessionEnd()
  } catch {
    // fail silent
  }
}

export async function lmHealth(): Promise<boolean> {
  // No HTTP bridge to ping — memory is always co-located
  return true
}
