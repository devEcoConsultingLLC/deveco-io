import { createAuthClient } from 'better-auth/vue';

export const authClient = createAuthClient({
  baseURL: import.meta.env?.VITE_AUTH_URL || 'http://localhost:3000',
});

export const { signIn, signUp, signOut, useSession } = authClient;
