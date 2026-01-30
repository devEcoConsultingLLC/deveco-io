<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

useHead({ title: `Contest — devEco.io` });
</script>

<template>
  <div>
    <div class="bg-gradient-to-r from-brand-pink to-brand-purple py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
        <AppBadge variant="live" class="mb-4">LIVE</AppBadge>
        <h1 class="font-display text-3xl font-extrabold">Contest Title</h1>
        <p class="mt-2 text-white/70">Contest details coming soon.</p>
      </div>
    </div>
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p class="text-muted-foreground">Contest detail page for "{{ slug }}" — content will be loaded from tRPC.</p>
    </div>
  </div>
</template>
