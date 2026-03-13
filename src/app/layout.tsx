// @liv-standard v1.3
// [core/app/layout.tsx]
// Built with LIV · livai.dev
// Root layout — thin shell. No business logic. No fonts. No inline styles.
// globals.css owns all tokens, fonts, reset, animations.
//
// Step 4: Providers import updated F-workspace → F-dashboard (A1).

import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/features/F-dashboard/contract/providers'

export const metadata: Metadata = {
  title: 'LIV',
  description: 'AI-human software collaboration with Living Architecture.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
