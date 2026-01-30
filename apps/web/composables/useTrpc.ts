import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';
import superjson from 'superjson';
import type { AppRouter } from '@deveco/trpc';

export function useTrpc() {
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        transformer: superjson,
      }),
    ],
  });

  return client;
}
