<script setup lang="ts">
useHead({ title: 'Communities — devEco.io' });

// TODO: Fetch via tRPC
const communities = ref<any[]>([]);
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="font-display text-3xl font-extrabold text-foreground">Communities</h1>
      <p class="mt-2 text-muted-foreground">Join communities of Edge AI makers and researchers</p>
    </div>

    <PortalNetworkBanner class="mb-8" />

    <div v-if="communities.length" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <CommunityCard v-for="community in communities" :key="community.slug" v-bind="community" />
    </div>
    <div v-else class="text-center py-20 text-muted-foreground">
      <p class="text-lg">Communities are being set up.</p>
      <p class="mt-2 text-sm">Check back soon!</p>
    </div>
  </div>
</template>
