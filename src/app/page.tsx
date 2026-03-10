// @liv-standard v1.0
// [core/app/page.tsx]
// Built with LIV · livai.dev
// Root page — auth gate. Thin shell, no business logic.

'use client'

import { useAuth } from '@/features/F-identity/contract/auth-hooks'
import { AuthPage } from '@/features/F-identity/contract/auth-pages'
import { ChatUI } from '@/features/F-chat/contract/chat-ui'
import { DEMO_MODE } from '@/features/F-chat/config/chat-config'

// Demo mode bypasses auth entirely — uses DEMO_SESSION in API routes.
if (DEMO_MODE) {
  console.info('[LIV] DEMO_MODE — auth bypassed')
}

export default function Home() {
  const { state, signOut } = useAuth()

  // Demo shortcut — skip auth gate
  if (DEMO_MODE) return <ChatUI email="demo" signOut={() => {}} />

  if (state.status === 'loading')       return null
  if (state.status !== 'authenticated') return <AuthPage />

  return <ChatUI email={state.user?.email ?? ''} signOut={signOut} />
}
