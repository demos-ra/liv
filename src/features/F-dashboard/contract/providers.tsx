// @liv-standard v1.3
// [F-dashboard/contract/providers.tsx]
// Built with LIV · livai.dev
// Root React context providers — tRPC, QueryClient, StateRegistry, Auth,
// ProgramRegistry.
// A4: credentials: include ensures session cookie sent on all tRPC requests.
//
// Step 4: restamped. Moved from F-workspace/contract/providers.tsx → F-dashboard/contract/.
// No functional change. Axiom cite: A1 — F-dashboard owns the provider tree.
//
// step5d-phase1 (A1):
//   Added ProgramRegistryProvider — wraps children so programs registered via
//   useRegisterProgram() are visible to useRegisteredPrograms() in the same tree.
//   Must wrap the entire app tree so PlannerRegister (mounted in page.tsx) and
//   DashboardUI (also in page.tsx) share the same context instance.
//   Axiom cite: A1 — F-dashboard owns the program registry; provider is part of
//   F-dashboard's R3 surface.

'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { trpc } from '@/core/api/trpc-client'
import { StateRegistryProvider } from '@/features/F-la-config/contract/registry-hook'
import { AuthProvider }          from '@/features/F-identity/contract/auth-hooks'
import { ProgramRegistryProvider } from './dashboard-registry'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000, retry: 1 },
    },
  }))

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
          // A4: credentials: include ensures httpOnly session cookie is sent
          fetch: (url, options) => fetch(url, { ...options, credentials: 'include' }),
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <StateRegistryProvider>
          <AuthProvider>
            <ProgramRegistryProvider>
              {children}
            </ProgramRegistryProvider>
          </AuthProvider>
        </StateRegistryProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
