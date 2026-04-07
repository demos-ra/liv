// @liv-standard v1.3
// [core/app/auth/verify/page.tsx]
// Built with LIV · livai.dev

// src/app/auth/verify/page.tsx
// Next.js route: /auth/verify?token=...&email=...
// Handles magic link verification after user clicks email link.
// Suspense owned by AuthVerifyPage — no page-level boundary needed.

import { AuthVerifyPage } from '@/features/F-identity/contract/auth-pages'

export default function VerifyPage() {
  return <AuthVerifyPage />
}
