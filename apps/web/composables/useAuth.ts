import { authClient } from '@deveco/auth/client';

export function useAuth() {
  const session = authClient.useSession();

  return {
    session,
    signIn: authClient.signIn,
    signUp: authClient.signUp,
    signOut: authClient.signOut,
    isAuthenticated: computed(() => !!session.value?.data?.user),
    user: computed(() => session.value?.data?.user),
  };
}
