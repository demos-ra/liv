// [F-integration/R3/C2] Root React context providers
// commit: fix tRPC v11 transformer — superjson goes in link not initTRPC

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
