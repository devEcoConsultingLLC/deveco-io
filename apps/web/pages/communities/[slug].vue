<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

useHead({ title: `Community — devEco.io` });
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <p class="text-muted-foreground">Community hub for "{{ slug }}" — content will be loaded from tRPC.</p>
  </div>
</template>
