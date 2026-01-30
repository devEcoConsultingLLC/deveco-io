import type { BetterAuthOptions } from 'better-auth';

export function getAuthConfig(): BetterAuthOptions {
  return {
    database: {
      type: 'postgres',
      url: process.env.DATABASE_URL!,
    },
    secret: process.env.AUTH_SECRET!,
    baseURL: process.env.AUTH_URL || 'http://localhost:3000',
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    socialProviders: {
      ...(process.env.GITHUB_CLIENT_ID && {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
      }),
      ...(process.env.GOOGLE_CLIENT_ID && {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }),
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    advanced: {
      generateId: false, // use database-generated UUIDs
    },
  };
}
