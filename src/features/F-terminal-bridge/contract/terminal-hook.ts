// [F-terminal-bridge/R3/C2] useTerminal hook — reads terminal:: namespace — STUB
// R3: client-side contract

'use client'

import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { TERMINAL_NAMESPACE, TerminalConnectionStatus, TERMINAL_IS_STUB } from '../config/terminal-config'

export type TerminalState = {
  status: TerminalConnectionStatus
  projectId: string | null
  isStub: boolean
}

const INITIAL_STATE: TerminalState = {
  status: 'stub',
  projectId: null,
  isStub: TERMINAL_IS_STUB,
}

export function useTerminal(): TerminalState {
  return useNamespace<TerminalState>(TERMINAL_NAMESPACE) ?? INITIAL_STATE
}

export function useTerminalConnected(): boolean {
  const { status } = useTerminal()
  return status === 'connected'
}
