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
        color: '#e5e5e5',
        fontFamily: 'system-ui, sans-serif',
      }}>
        Signing you in…
      </div>
    }>
      <AuthVerifyPage />
    </Suspense>
  )
}
