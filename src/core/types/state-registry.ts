// [core/types/state-registry.ts]
// R5 — pure namespace declaration. Zero dependencies.
// Enforcement logic lives in F-la-config/domain/state-enforce.ts (R1).
// React hook lives in F-la-config/contract/registry-hook.tsx (R3).

import type { FSlice } from './primitives'

export const STATE_NAMESPACES: Record<FSlice, string> = {
  'F-types':           'types',
  'F-design-system':   'designSystem',
  'F-state-registry':  'stateRegistry',
  'F-event-system':    'eventSystem',
  'F-la-config':       'laConfig',
  'F-identity':        'identity',
  'F-permissions':     'permissions',
  'F-git-connector':   'gitConnector',
  'F-terminal-bridge': 'terminalBridge',
  'F-project':         'project',
  'F-topography':      'topography',
  'F-ai-adapter':      'aiAdapter',
  'F-chat':            'chat',
  'F-constitution':    'constitution',
  'F-notifications':   'notifications',
  'F-commit-log':      'commitLog',
  'F-user-profile':    'userProfile',
  'F-workspace':       'workspace',
  'F-dashboard':       'dashboard',
  'F-editor':          'editor',
  'F-health-panel':    'healthPanel',
  'F-execution-panel': 'executionPanel',
}

export const NAMESPACE_OWNER: Record<string, FSlice> = Object.fromEntries(
  Object.entries(STATE_NAMESPACES).map(([slice, ns]) => [ns, slice as FSlice])
)

export function namespaceOf(slice: FSlice): string {
  return STATE_NAMESPACES[slice]
}

export function ownerOf(namespace: string): FSlice | undefined {
  return NAMESPACE_OWNER[namespace]
}
