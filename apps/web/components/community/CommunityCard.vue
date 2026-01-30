<script setup lang="ts">
defineProps<{
  slug: string;
  name: string;
  description?: string;
  iconUrl?: string;
  memberCount?: number;
  projectCount?: number;
  isOfficial?: boolean;
  portalNetworkId?: string;
}>();
</script>

<template>
  <NuxtLink :to="`/communities/${slug}`" class="group block">
    <div class="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div class="flex items-start gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
          <img v-if="iconUrl" :src="iconUrl" :alt="name" class="h-8 w-8 rounded" />
          <span v-else class="text-lg font-bold text-muted-foreground">{{ name.charAt(0) }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-semibold text-card-foreground group-hover:text-primary truncate transition-colors">
              {{ name }}
            </h3>
            <AppBadge v-if="isOfficial" variant="secondary">Official</AppBadge>
            <AppBadge v-if="portalNetworkId" variant="outline" class="!border-portal-purple !text-portal-purple">
              portalNetwork
            </AppBadge>
          </div>
          <p v-if="description" class="mt-1 text-xs text-muted-foreground line-clamp-2">{{ description }}</p>
        </div>
      </div>
      <div class="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span>{{ memberCount?.toLocaleString() || 0 }} members</span>
        <span>{{ projectCount || 0 }} projects</span>
      </div>
    </div>
  </NuxtLink>
</template>
