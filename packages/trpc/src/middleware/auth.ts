import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';

export const requireRole = (role: 'admin' | 'moderator') =>
  middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const userRole = (ctx.session.user as { role?: string }).role;

    if (role === 'admin' && userRole !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    }

    if (role === 'moderator' && !['admin', 'moderator'].includes(userRole || '')) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Moderator access required' });
    }

    return next({ ctx });
  });
