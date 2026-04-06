// @liv-standard v1.3
// [app/layout]
// Built with LIV · livai.dev

import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/features/F-dashboard/contract/providers'
import { DesignSystemProvider } from '@/features/F-design-system/exec/design-system-provider'

export const metadata: Metadata = {
  title: 'LIV',
  description: 'AI-human software collaboration with Living Architecture.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DesignSystemProvider>
          <Providers>{children}</Providers>
        </DesignSystemProvider>
      </body>
    </html>
  )
}
