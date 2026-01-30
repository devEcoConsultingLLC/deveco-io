<script setup lang="ts">
defineProps<{
  items: Array<{
    slug: string;
    name: string;
    vendor?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
    priceUsd?: string;
    projectCount?: number;
  }>;
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <HardwareCard v-for="item in items" :key="item.slug" v-bind="item" />
  </div>
</template>
