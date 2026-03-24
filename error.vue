<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage?: string;
    message?: string;
  };
}>();

useSeoMeta({ title: `${props.error.statusCode} -- devEco.io` });

const isNotFound = computed(() => props.error.statusCode === 404);

function handleBack(): void {
  clearError({ redirect: '/' });
}
</script>

<template>
  <div class="de-error-page">
    <div class="de-error-bg" />
    <div class="de-error-inner">
      <DevEcoLogo variant="light-bg" size="md" :show-text="true" />
      <div class="de-error-code">{{ error.statusCode }}</div>
      <h1 class="de-error-title">
        {{ isNotFound ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <p class="de-error-desc">
        {{ isNotFound ? "The page you're looking for doesn't exist or has been moved." : (error.statusMessage || error.message || 'An unexpected error occurred.') }}
      </p>
      <div class="de-error-actions">
        <button class="de-error-btn de-error-btn-primary" @click="handleBack">
          <i class="fa-solid fa-house"></i> Go Home
        </button>
        <NuxtLink to="/search" class="de-error-btn">
          <i class="fa-solid fa-magnifying-glass"></i> Search
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.de-error-page {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg, #f9fafb);
  position: relative; overflow: hidden;
}

.de-error-bg {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle at 30% 70%, rgba(0, 231, 173, 0.06), transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(91, 197, 232, 0.04), transparent 50%);
}

.de-error-inner {
  position: relative; z-index: 1;
  text-align: center; padding: 32px; max-width: 480px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}

.de-error-code {
  font-family: var(--font-display, 'Nunito', sans-serif);
  font-size: 5rem; font-weight: 800;
  color: var(--deveco-dark-green, #004e53);
  line-height: 1; margin: 16px 0 8px;
}

.de-error-title {
  font-size: 1.25rem; font-weight: 700;
  color: var(--text, #111827); margin-bottom: 8px;
}

.de-error-desc {
  font-size: 0.9375rem; color: var(--text-dim, #4b5563);
  line-height: 1.6; margin-bottom: 24px;
}

.de-error-actions { display: flex; justify-content: center; gap: 12px; }

.de-error-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; font-size: 0.875rem; font-weight: 600;
  border: 1px solid var(--border, #d1d5db); border-radius: 8px;
  background: var(--surface, #fff); color: var(--text, #111827);
  text-decoration: none; cursor: pointer; transition: all 0.15s;
  font-family: inherit;
}
.de-error-btn:hover { box-shadow: var(--shadow-sm); }

.de-error-btn-primary {
  background: var(--deveco-dark-green, #004e53); border-color: var(--deveco-dark-green, #004e53);
  color: #fff;
}
.de-error-btn-primary:hover { background: #003b3f; box-shadow: var(--shadow-md); }
</style>
