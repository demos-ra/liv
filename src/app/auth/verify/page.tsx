// @liv-standard v1.3
// [core/app/auth/verify/page.tsx]
// Built with LIV · livai.dev

// src/app/auth/verify/page.tsx
// Next.js route: /auth/verify?token=...&email=...
// Handles magic link verification after user clicks email link.
// Suspense boundary required for useSearchParams() in Next.js App Router.

import { Suspense } from 'react'
import { AuthVerifyPage } from '@/features/F-identity/contract/auth-pages'

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(18,17,14,0.25)', /* exception: pre-engine fallback, matches --text-dis light */
        fontFamily: 'system-ui, sans-serif',
      }}>
        Signing you in…
      </div>
    }>
      <AuthVerifyPage />
    </Suspense>
  )
}
