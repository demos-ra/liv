// [F-memory/R3/C3] Memory contract — the only public surface of F-memory
// R3: thin wire. No logic. No DB. No physics.
// All other slices import from here — never from app/, domain/, exec/.

import {
  remember as _remember,
  recall   as _recall,
  onSessionEnd as _onSessionEnd,
  onBoot   as _onBoot,
} from '../app/memory-service'

export async function remember(text: string, sessionId: string): Promise<void> {
  return _remember(text, sessionId)
}

export async function recall(query: string): Promise<string> {
  return _recall(query)
}

export async function onSessionEnd(): Promise<void> {
  return _onSessionEnd()
}

export async function onBoot(): Promise<void> {
  return _onBoot()
}
