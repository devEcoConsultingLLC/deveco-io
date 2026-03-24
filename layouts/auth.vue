<script setup lang="ts">
// Auth layout -- minimal centered layout for login/register
</script>

<template>
  <div class="auth-layout">
    <main class="auth-content">
      <NuxtLink to="/" class="auth-brand" aria-label="Return to homepage">
        <DevEcoLogo variant="light-bg" size="md" :show-text="true" />
      </NuxtLink>
      <div class="auth-card">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg); color: var(--text);
  font-family: var(--font-sans); padding: 16px;
}

.auth-content {
  width: 100%; max-width: 420px;
  display: flex; flex-direction: column; align-items: center;
  gap: 28px;
}

.auth-brand { text-decoration: none; }

.auth-card {
  width: 100%; background: var(--surface);
  border: 1px solid var(--border); border-radius: 16px;
  box-shadow: var(--shadow-lg); padding: 32px;
}
</style>
