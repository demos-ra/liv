// @liv-standard v1.3
// [F-event-system/R3]
// Built with LIV · livai.dev
// [F-event-system/contract/event-bus.ts]
// R3 — event bus public interface for all slices.
// Slices import from here, never from app/event-dispatch directly.

import { emit as _emit, subscribe as _subscribe, unsubscribe as _unsubscribe } from '../app/event-dispatch'
import { db } from '@/core/db/client'
import type { LivEvent, FSlice } from '@/core/types/primitives'

export async function emitEvent(opts: {
  type:     string
  payload?: Record<string, unknown>
  slice?:   FSlice
}): Promise<void> {
  const slice = opts.slice ?? eventTypeToSlice(opts.type)
  await _emit(db as Parameters<typeof _emit>[0], slice, opts.type, opts.payload ?? {})
}

export function subscribeToEvent(
  eventName: string,
  handler: (event: LivEvent) => Promise<void>
): () => void {
  _subscribe(eventName, handler)
  return () => _unsubscribe(eventName, handler)
}

function eventTypeToSlice(eventType: string): FSlice {
  const prefix = eventType.split('.')[0]
  const map: Record<string, FSlice> = {
    'identity':      'F-identity',
    'session':       'F-identity',  // session events owned by F-identity (A1)
    'permissions':   'F-permissions',
    'git':           'F-git-connector',
    'terminal':      'F-terminal-bridge',
    'project':       'F-project',
    'constitution':  'F-constitution',
    'ai':            'F-ai-adapter',
    'chat':          'F-chat',
    'plan':          'F-plan',            // Sprint 11 Shot 6c
    'discover':      'F-discover',         // Sprint 11 Shot 6c
    'verify':        'F-verify',           // Sprint 11 Shot 6c
    'build':         'F-builder',          // Sprint 11 Shot 6c
    'topography':    'F-topography',
    'commit-log':    'F-commit-log',
    'health':        'F-health-panel',
    'execution':     'F-execution-panel',
    'notifications': 'F-notifications',
  }
  return map[prefix] ?? 'F-event-system'
}
