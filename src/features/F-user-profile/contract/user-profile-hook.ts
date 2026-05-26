// @liv-standard v1.5.2
// [F-user-profile/R3]
// Built with LIV · livai.dev
// [F-user-profile/R3/C2] useUserProfile hook + useEngineSelection (sprint-beta-fixround F5)
// R3: client-side contract
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-beta-fixround (F5: useEngineSelection added — the single
//               shared engine-selection resolver, observed by both account-page
//               and chat-ui. usePreferredModel deleted — dead, redundant, and
//               carried a hard-coded model literal.)
// slice:      F-user-profile
// layer:      R3
// wires-out:
//   W-HOOK  useUserProfile      → F-user-profile/R3 consumers
//   W-HOOK  useEngineSelection  → F-user-profile/R3 (account-page), F-chat/R3 (chat-ui)
// validated:  pending

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNamespace } from '@/features/F-verify/contract/registry-hook'
import { USER_PROFILE_NAMESPACE, UserProfile } from '../config/user-profile-config'
import { getDisplayHandle } from '../domain/user-profile-logic'

export function useUserProfile(): UserProfile | null {
  return useNamespace<UserProfile>(USER_PROFILE_NAMESPACE) ?? null
}

export function useDisplayHandle(): string {
  const profile = useUserProfile()
  if (!profile) return ''
  return getDisplayHandle(profile)
}

// ── useEngineSelection — the single observed source of truth (F5) ─────────────
// sprint-beta-fixround (F5): the wearer's engine selection has exactly ONE
// resolution site — this hook. It observes the server-persisted selection
// (GET /api/profile/models → ModelPreferences { provider, model } | null) and
// nothing else. Both the settings surface (account-page.tsx) and the chat
// surface (chat-ui.tsx) derive their displayed engine state from this hook's
// return — they do not each fetch and resolve independently. Two surfaces, one
// observation of one source; they cannot diverge because there is structurally
// nothing left to diverge.
//
// No asserted state: there is no auto-select, no display-default, no optimistic
// copy living here. `selection` is the persisted truth or null. `null` means
// the wearer has saved no engine — both surfaces render their own honest
// not-resolved state (settings: nothing active; chat: key-prompt).
//
// `refresh()` lets a surface re-observe after it issues a PUT — the surface
// does not write the selection into local state; it writes to the server, then
// refreshes, and the new observation reflects the write (or doesn't, if the PUT
// failed — which the surface learns from the PUT response, not from this hook).
//
// Forward-modular: if product later wants a recommended engine, it is added
// here as an explicit named field on the return (e.g. `recommended`) — a real
// single-sourced value rendered as a suggestion, never written into
// `selection`. Additive, because the state model is single-source.

export interface EngineSelection {
  provider: string
  model:    string
}

export interface EngineSelectionState {
  selection: EngineSelection | null   // server-persisted truth, or null if none saved
  loading:   boolean                  // true until the first observation resolves
  refresh:   () => void               // re-observe (e.g. after a PUT)
}

export function useEngineSelection(active: boolean = true): EngineSelectionState {
  const [selection, setSelection] = useState<EngineSelection | null>(null)
  const [loading, setLoading]     = useState<boolean>(true)
  const [nonce, setNonce]         = useState(0)

  const refresh = useCallback(() => setNonce(n => n + 1), [])

  useEffect(() => {
    if (!active) return
    let cancelled = false
    setLoading(true)
    async function observe() {
      try {
        const res = await fetch('/api/profile/models')
        if (cancelled) return
        if (!res.ok) { setSelection(null); setLoading(false); return }
        const body  = await res.json()
        const saved = body?.data
        if (cancelled) return
        setSelection(
          saved && typeof saved.provider === 'string' && typeof saved.model === 'string'
            ? { provider: saved.provider, model: saved.model }
            : null,
        )
      } catch {
        if (!cancelled) setSelection(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    observe()
    return () => { cancelled = true }
  }, [active, nonce])

  return { selection, loading, refresh }
}
