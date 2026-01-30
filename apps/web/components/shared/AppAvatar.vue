<script setup lang="ts">
defineProps<{
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
}>();
</script>

<template>
  <span
    class="relative flex shrink-0 overflow-hidden rounded-full bg-muted"
    :class="{
      'h-8 w-8 text-xs': size === 'sm' || !size,
      'h-10 w-10 text-sm': size === 'md',
      'h-16 w-16 text-lg': size === 'lg',
    }"
  >
    <img v-if="src" :src="src" :alt="alt || ''" class="aspect-square h-full w-full object-cover" />
    <span v-else class="flex h-full w-full items-center justify-center font-medium text-muted-foreground">
      {{ initials || '?' }}
    </span>
  </span>
</template>
