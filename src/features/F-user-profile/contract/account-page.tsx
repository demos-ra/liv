// @liv-standard v1.3
// [F-user-profile/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase4-page-transitions, phase5-remediation
// slice:      F-user-profile
// layer:      R3
// wires-in:
//   W-ATOM  InputContainer  @/features/F-design-system/contract/primitives
//   W-ATOM  ButtonText      @/features/F-design-system/contract/primitives
//   W-ATOM  Label           @/features/F-design-system/contract/primitives
//   W-ATOM  StatusDot       @/features/F-design-system/contract/primitives
//   W-ATOM  ProviderId      @/features/F-user-profile/config/provider-keys-config
//   W-ATOM  PROVIDERS       @/features/F-user-profile/config/provider-keys-config
//   W-ATOM  PROVIDER_ORDER  @/features/F-user-profile/config/provider-keys-config
// wires-out:
//   W-ATOM  AccountPage     → src/app/page.tsx (composition root)
// deps:
//   R3  @/features/F-design-system/contract/primitives
//   R3  @/features/F-user-profile/config/provider-keys-config
//   R5  react
// validated: pending
//
// phase2-account-extraction (A1, A3):
//   Extracted AccountPanel from F-chat/contract/chat-ui.tsx into its own
//   component under F-user-profile. Account settings is user-profile domain,
//   not chat domain (A1 — single ownership).
//   Outer wrapper: .page with .visible/.hidden toggled by composition root.
//   Inner DOM: .account-main → .col .account-content → N × .account-section.
//   Matches mockup v26 #page-account structure exactly.
//   Props received via typed boundary from page.tsx (A3).
//
// phase4-page-transitions (A3):
//   visible:boolean prop replaced with pageClass:string.
//   Transition classes (dissolving, forming) now managed by usePageTransition
//   hook in page.tsx — AccountPage receives the computed class string.
//   Internal visible derived from pageClass for effect guards.
//
// phase5-remediation (A3, A7):
//   Toggle: inline style={{ background }} removed, .toggle-track.active CSS class
//   used via className. Toggle-thumb left values moved to CSS classes.
//   marginTop inline style removed — .page-main handles header offset.
//   Divider import removed (zero consumers, A7).

'use client'

import { useState, useEffect } from 'react'
import { PROVIDER_ORDER, PROVIDERS } from '@/features/F-user-profile/config/provider-keys-config'
import type { ProviderId } from '@/features/F-user-profile/config/provider-keys-config'
import {
  InputContainer,
  ButtonText,
  Label,
  StatusDot,
} from '@/features/F-design-system/contract/primitives'

// ── AccountPage ──────────────────────────────────────────────────────────────

interface AccountPageProps {
  pageClass: string
  email: string
  onClose: () => void
  onSignOut: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function AccountPage({
  pageClass,
  email,
  onClose,
  onSignOut,
  theme,
  onToggleTheme,
}: AccountPageProps) {
  // Derive visibility for effect guards (hidden class = not visible)
  const visible = !pageClass.includes('hidden')
  const defaultName = email.includes('@') ? email.split('@')[0] : email
  const [displayName, setDisplayName] = useState(defaultName)
  const [nameSaving, setNameSaving]   = useState(false)

  const [keyInputs, setKeyInputs] = useState<Record<ProviderId, string>>(() =>
    Object.fromEntries(PROVIDER_ORDER.map(p => [p, ''])) as Record<ProviderId, string>
  )
  const [keySet, setKeySet] = useState<Record<ProviderId, boolean>>(() =>
    Object.fromEntries(PROVIDER_ORDER.map(p => [p, false])) as Record<ProviderId, boolean>
  )
  const [keySaving, setKeySaving] = useState<Record<ProviderId, boolean>>(() =>
    Object.fromEntries(PROVIDER_ORDER.map(p => [p, false])) as Record<ProviderId, boolean>
  )
  const [activeProvider, setActiveProvider] = useState<ProviderId | null>(null)

  // ── Fetch key status when page becomes visible ──────────────────────────
  useEffect(() => {
    if (!visible) return
    PROVIDER_ORDER.forEach(async (provider) => {
      try {
        const check = await fetch(`/api/profile/api-key?provider=${provider}`, { method: 'GET' })
        if (check.ok) {
          const data = await check.json()
          setKeySet(prev => ({ ...prev, [provider]: data.hasKey ?? false }))
        }
      } catch {}
    })
  }, [visible])

  // ── Auto-select first active provider ───────────────────────────────────
  useEffect(() => {
    if (activeProvider && keySet[activeProvider]) return
    const first = PROVIDER_ORDER.find(p => keySet[p]) ?? null
    setActiveProvider(first)
  }, [keySet, activeProvider])

  // ── Escape key → close ─────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [visible, onClose])

  // ── Actions ─────────────────────────────────────────────────────────────

  const saveDisplayName = async () => {
    if (!displayName.trim()) return
    setNameSaving(true)
    try {
      await fetch('/api/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ displayName: displayName.trim() }),
      })
    } catch {} finally {
      setNameSaving(false)
    }
  }

  const saveKey = async (provider: ProviderId) => {
    const key = keyInputs[provider].trim()
    if (!key) return
    setKeySaving(prev => ({ ...prev, [provider]: true }))
    try {
      const res = await fetch('/api/profile/api-key', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ provider, key }),
      })
      if (res.ok) {
        setKeySet(prev => ({ ...prev, [provider]: true }))
        setKeyInputs(prev => ({ ...prev, [provider]: '' }))
      }
    } catch {} finally {
      setKeySaving(prev => ({ ...prev, [provider]: false }))
    }
  }

  const removeKey = async (provider: ProviderId) => {
    try {
      await fetch('/api/profile/api-key', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ provider }),
      })
      setKeySet(prev => ({ ...prev, [provider]: false }))
      if (activeProvider === provider) {
        const next = PROVIDER_ORDER.find(p => p !== provider && keySet[p]) ?? null
        setActiveProvider(next)
      }
    } catch {}
  }

  // ── Render ──────────────────────────────────────────────────────────────
  // DOM matches mockup v26 #page-account exactly:
  //   .page → .account-main.form → .col.account-content → N × .account-section

  return (
    <div className={pageClass} data-page="account">
      <main className="account-main form">
        <div className="col account-content">

          {/* Identity */}
          <div className="account-section">
            <span className="account-name">{defaultName}</span>
            <span className="account-email">{email}</span>
          </div>

          {/* Display name */}
          <div className="account-section">
            <Label>Display name</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)' }}>
              <div style={{ flex: 1 }}>
                <InputContainer
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveDisplayName() }}
                  placeholder={defaultName}
                  disabled={nameSaving}
                />
              </div>
              <ButtonText variant="accent" onClick={saveDisplayName} disabled={nameSaving}>
                {nameSaving ? '···' : 'SAVE'}
              </ButtonText>
            </div>
          </div>

          {/* API Keys */}
          {PROVIDER_ORDER.map(provider => (
            <div key={provider} className="account-section">
              <Label>{PROVIDERS[provider].label} API key</Label>
              {keySet[provider] ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="key-dots">••••••••••••••••</span>
                  <ButtonText variant="danger" onClick={() => removeKey(provider)}>REMOVE</ButtonText>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)' }}>
                  <div style={{ flex: 1 }}>
                    <InputContainer
                      type="password"
                      value={keyInputs[provider]}
                      onChange={e => setKeyInputs(prev => ({ ...prev, [provider]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') saveKey(provider) }}
                      placeholder={PROVIDERS[provider].placeholder}
                      disabled={keySaving[provider]}
                    />
                  </div>
                  <ButtonText
                    variant="accent"
                    onClick={() => saveKey(provider)}
                    disabled={keySaving[provider] || !keyInputs[provider].trim()}
                  >
                    {keySaving[provider] ? '···' : 'SAVE'}
                  </ButtonText>
                </div>
              )}
            </div>
          ))}

          {/* Active provider indicator */}
          {PROVIDER_ORDER.some(p => keySet[p]) && (
            <div className="account-section">
              <Label>Active provider</Label>
              <fieldset className="fieldset-bare">
                <legend className="sr-only">Active provider</legend>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u15)' }}>
                  {PROVIDER_ORDER.filter(p => keySet[p]).map(provider => (
                    <label
                      key={provider}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)', cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name="active-provider"
                        value={provider}
                        checked={activeProvider === provider}
                        onChange={() => setActiveProvider(provider)}
                        className="sr-only"
                      />
                      <StatusDot status={activeProvider === provider ? 'accent' : 'dis'} />
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize:   'var(--type-sm)',
                        color:      activeProvider === provider ? 'var(--text)' : 'var(--text-sec)',
                      }}>
                        {PROVIDERS[provider].label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {/* Theme */}
          <div className="account-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Label>{theme === 'dark' ? 'DARK' : 'LIGHT'}</Label>
              <button
                type="button"
                className={`toggle-track${theme === 'dark' ? ' active' : ''}`}
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <div className={`toggle-thumb${theme === 'dark' ? ' active' : ''}`} />
              </button>
            </div>
          </div>

          {/* Sign out */}
          <div className="account-section">
            <ButtonText variant="signout" onClick={onSignOut}>SIGN OUT</ButtonText>
          </div>

        </div>
      </main>
    </div>
  )
}
