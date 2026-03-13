// @liv-standard v1.3
// [F-workspace/contract/providers.tsx]
// Built with LIV · livai.dev
// Root React context providers — tRPC, QueryClient, StateRegistry, Auth.
// A4: credentials: include ensures session cookie sent on all tRPC requests.

'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { trpc } from '@/core/api/trpc-client'
import { StateRegistryProvider } from '@/features/F-la-config/contract/registry-hook'
import { AuthProvider } from '@/features/F-identity/contract/auth-hooks'

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
            {children}
          </AuthProvider>
        </StateRegistryProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
