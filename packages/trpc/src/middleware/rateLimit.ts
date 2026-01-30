import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (maxRequests: number = 60, windowMs: number = 60_000) =>
  middleware(({ ctx, next }) => {
    const key = ctx.session?.user?.id || 'anonymous';
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (entry && entry.resetAt > now) {
      if (entry.count >= maxRequests) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Rate limit exceeded. Please try again later.',
        });
      }
      entry.count++;
    } else {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    }

    return next({ ctx });
  });
