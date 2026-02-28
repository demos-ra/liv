// [app/page.tsx]
// Next.js root page — thin shell. No business logic, no UI components.
// Auth gate + delegates to F-chat/contract/chat-ui.

'use client'

import { useAuth } from '@/features/F-identity/contract/auth-hooks'
import { AuthPage } from '@/features/F-identity/contract/auth-pages'
import { ChatUI } from '@/features/F-chat/contract/chat-ui'

export default function Home() {
  const { state, signOut } = useAuth()

  if (state.status === 'loading')       return null
  if (state.status !== 'authenticated') return <AuthPage />

  return <ChatUI email={state.user?.email ?? ''} signOut={signOut} />
}
