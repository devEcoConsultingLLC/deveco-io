<script setup lang="ts">
defineProps<{
  label: string;
  href?: string;
}>();
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    class="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
  >
    {{ label }}
  </NuxtLink>
  <span
    v-else
    class="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
  >
    {{ label }}
  </span>
</template>
