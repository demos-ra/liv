// @liv-standard v1.3
// [core/app/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase5-hydration-fix
// slice:      core/app
// layer:      R4
// wires-in:   none
// wires-out:  none (Next.js root layout — mount point)
// deps:
//   R4 ./globals.css (import side-effect)
//   R4 @/features/F-design-system/exec/design-system-provider
//   R3 @/features/F-dashboard/contract/providers
//   R5 next (Metadata type)
//   R5 react
// validated:  pending
//
// phase5-hydration-fix (A4):
//   Inline script in <body> sets data-theme before first paint.
//   Eliminates dark-mode light flash. prefers-color-scheme read is
//   synchronous DOM I/O — acceptable at layout root (R4).

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
        <script dangerouslySetInnerHTML={{ __html:
          `(function(){var d=document.documentElement;var t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';d.setAttribute('data-theme',t)})()`
        }} />
        <DesignSystemProvider>
          <Providers>{children}</Providers>
        </DesignSystemProvider>
      </body>
    </html>
  )
}
