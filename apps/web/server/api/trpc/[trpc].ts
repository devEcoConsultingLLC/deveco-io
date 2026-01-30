import { createTRPCNuxtHandler } from 'trpc-nuxt/server';
import { appRouter } from '@deveco/trpc';
import { createContext } from '@deveco/trpc/context';

export default createTRPCNuxtHandler({
  router: appRouter,
  createContext,
});
