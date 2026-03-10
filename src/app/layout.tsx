// @liv-standard v1.0
// [core/app/layout.tsx]
// Built with LIV · livai.dev
// Next.js root layout — thin shell. No business logic.

import type { Metadata } from 'next'
import { Providers } from '@/features/F-workspace/contract/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'LIV',
  description: 'AI-human software collaboration with Living Architecture.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
