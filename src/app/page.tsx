// @liv-standard v1.0
// [core/app/page.tsx]
// Built with LIV · livai.dev
// Root page — thin shell. Auth gate only. No UI.

'use client'

import { DEMO_MODE } from '@/features/F-chat/config/chat-config'
import { useAuth } from '@/features/F-identity/contract/auth-hooks'
import { AuthPage } from '@/features/F-identity/contract/auth-pages'
import { ChatUI } from '@/features/F-chat/contract/chat-ui'

export default function Home() {
  // Demo mode — bypass auth entirely
  if (DEMO_MODE) return <ChatUI email="demo" signOut={() => {}} />

  const { state, signOut } = useAuth()

  if (state.status === 'loading')       return null
  if (state.status !== 'authenticated') return <AuthPage />

  return <ChatUI email={state.user?.email ?? ''} signOut={signOut} />
}
