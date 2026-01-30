<script setup lang="ts">
defineProps<{
  slug: string;
  name: string;
  vendor?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  priceUsd?: string;
  projectCount?: number;
}>();
</script>

<template>
  <NuxtLink :to="`/hardware/${slug}`" class="group block">
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md">
      <div class="aspect-square bg-muted p-6 flex items-center justify-center">
        <img v-if="imageUrl" :src="imageUrl" :alt="name" class="max-h-full max-w-full object-contain" />
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-muted-foreground/30"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      </div>
      <div class="p-4">
        <div v-if="vendor" class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{{ vendor }}</div>
        <h3 class="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">{{ name }}</h3>
        <p v-if="description" class="mt-1 text-xs text-muted-foreground line-clamp-2">{{ description }}</p>
        <div class="mt-3 flex items-center justify-between">
          <span v-if="priceUsd" class="text-sm font-bold text-foreground">${{ priceUsd }}</span>
          <span class="text-xs text-muted-foreground">{{ projectCount || 0 }} projects</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
