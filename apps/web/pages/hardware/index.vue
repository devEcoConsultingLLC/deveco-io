<script setup lang="ts">
useHead({ title: 'Hardware Catalog — devEco.io' });

// TODO: Fetch via tRPC
const items = ref<any[]>([]);
const category = ref('');
const vendor = ref('');
const search = ref('');
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="font-display text-3xl font-extrabold text-foreground">Hardware Catalog</h1>
      <p class="mt-2 text-muted-foreground">Find the right components for your Edge AI project</p>
    </div>

    <HardwareFilters
      :categories="['microcontroller', 'single-board-computer', 'accelerator', 'sensor', 'camera']"
      :vendors="['Espressif', 'Raspberry Pi Foundation', 'Arduino', 'Google', 'Various']"
      class="mb-8"
      @update:category="category = $event"
      @update:vendor="vendor = $event"
      @update:search="search = $event"
    />

    <HardwareGrid v-if="items.length" :items="items" />
    <div v-else class="text-center py-20 text-muted-foreground">
      <p class="text-lg">No hardware items yet.</p>
      <p class="mt-2 text-sm">The catalog is being populated.</p>
    </div>
  </div>
</template>
