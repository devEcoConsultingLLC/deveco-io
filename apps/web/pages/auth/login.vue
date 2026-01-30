<script setup lang="ts">
definePageMeta({ layout: 'auth' });
useHead({ title: 'Log in — devEco.io' });

const email = ref('');
const password = ref('');
const error = ref('');

async function handleLogin() {
  error.value = '';
  try {
    const { signIn } = useAuth();
    await signIn.email({ email: email.value, password: password.value });
    navigateTo('/');
  } catch {
    error.value = 'Invalid email or password.';
  }
}
</script>

<template>
  <div class="rounded-lg border border-border bg-card p-8 shadow-sm">
    <h1 class="text-center font-display text-2xl font-extrabold text-foreground mb-6">Log in</h1>

    <div v-if="error" class="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{{ error }}</div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">Email</label>
        <input v-model="email" type="email" required class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">Password</label>
        <input v-model="password" type="password" required class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <button type="submit" class="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
        Log in
      </button>
    </form>

    <div class="mt-6 text-center text-sm text-muted-foreground">
      Don't have an account?
      <NuxtLink to="/auth/register" class="text-primary font-medium hover:underline">Sign up</NuxtLink>
    </div>

    <div class="mt-6 border-t border-border pt-6">
      <button class="w-full rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
        Continue with GitHub
      </button>
    </div>
  </div>
</template>
