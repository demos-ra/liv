// [core/app/layout.tsx]
// Next.js root layout — thin shell. No business logic.

import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { Providers } from '@/features/F-workspace/contract/providers'
import { resolveSession } from '@/features/F-session/app/session-workflow'
import { SESSION_CONFIG } from '@/features/F-session/config/session-config'
import { color } from '@/features/F-design-system/config'

const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-header', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  title: 'LIV — Build with structure',
  description: 'AI-human software collaboration with Living Architecture.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialSession = null
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value
    if (token) {
      const session = await resolveSession(token)
      if (session) {
        initialSession = {
          userId:    session.userId,
          sessionId: session.sessionId,
          email:     session.email,
          expiresAt: session.expiresAt.toISOString(),
        }
      }
    }
  } catch {}

  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            background: ${color.surfaceBase};
            color: ${color.neutral200};
            font-family: var(--font-body), system-ui, sans-serif;
            font-size: 15px; line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            min-height: 100vh;
          }
          code, pre, .mono { font-family: 'Commit Mono', 'JetBrains Mono', monospace; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${color.neutral700}; border-radius: 3px; }
          @keyframes liv-spin { to { transform: rotate(360deg); } }
        `}</style>
      </head>
      <body>
        <Providers initialSession={initialSession}>{children}</Providers>
      </body>
    </html>
  )
}
