import type { inferAsyncReturnType } from '@trpc/server';
import type { H3Event } from 'h3';
import { db } from '@deveco/db';
import { auth } from '@deveco/auth';

export async function createContext(event: H3Event) {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  return {
    db,
    session,
    event,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
