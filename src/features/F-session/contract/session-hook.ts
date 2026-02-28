// [F-session/R3/C2] useSession hook — reads from session:: namespace
// R3: contract layer, client-side

'use client'

import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { SESSION_NAMESPACE } from '../config/session-config'

export type SessionState = {
  userId: string | null
  sessionId: string | null
  status: 'active' | 'expired' | 'revoked' | 'unauthenticated'
  expiresAt: number | null
}

const INITIAL_STATE: SessionState = {
  userId: null,
  sessionId: null,
  status: 'unauthenticated',
  expiresAt: null,
}

export function useSession(): SessionState {
  const state = useNamespace<SessionState>(SESSION_NAMESPACE)
  return state ?? INITIAL_STATE
}

export function useIsAuthenticated(): boolean {
  const { status } = useSession()
  return status === 'active'
}

export function useCurrentUserId(): string | null {
  return useSession().userId
}
