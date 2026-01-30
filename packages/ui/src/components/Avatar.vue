<script setup lang="ts">
import { cn } from '../utils';

defineProps<{
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}>();

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
};
</script>

<template>
  <span :class="cn('relative flex shrink-0 overflow-hidden rounded-full', sizeClasses[size || 'md'], $props.class)">
    <img v-if="src" :src="src" :alt="alt || ''" class="aspect-square h-full w-full object-cover" />
    <span v-else class="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium">
      {{ fallback || '?' }}
    </span>
  </span>
</template>
