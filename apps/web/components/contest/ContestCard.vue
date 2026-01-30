<script setup lang="ts">
defineProps<{
  slug: string;
  title: string;
  description?: string;
  status: string;
  sponsorName?: string;
  prizeDescription?: string;
  startsAt?: string;
  endsAt?: string;
}>();

const statusVariant: Record<string, string> = {
  active: 'live',
  upcoming: 'upcoming',
  judging: 'default',
  ended: 'ended',
};
</script>

<template>
  <NuxtLink :to="`/contests/${slug}`" class="group block">
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md">
      <div class="bg-gradient-to-r from-brand-pink to-brand-purple p-6">
        <AppBadge :variant="(statusVariant[status] || 'default') as any" class="mb-3">
          {{ status === 'active' ? 'LIVE' : status.toUpperCase() }}
        </AppBadge>
        <h3 class="text-lg font-bold text-white">{{ title }}</h3>
        <p v-if="sponsorName" class="mt-1 text-sm text-white/70">Sponsored by {{ sponsorName }}</p>
      </div>
      <div class="p-4">
        <p v-if="description" class="text-sm text-muted-foreground line-clamp-2">{{ description }}</p>
        <div v-if="prizeDescription" class="mt-3 text-sm font-medium text-foreground">
          {{ prizeDescription }}
        </div>
        <div v-if="endsAt" class="mt-2 text-xs text-muted-foreground">
          {{ status === 'active' ? 'Ends' : status === 'upcoming' ? 'Starts' : 'Ended' }}
          {{ new Date(status === 'upcoming' ? startsAt! : endsAt).toLocaleDateString() }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
