<script setup lang="ts">
import { cn } from '../utils';

defineProps<{
  name: string;
  size?: number;
  class?: string;
}>();
</script>

<template>
  <component
    :is="name"
    :size="size || 20"
    :class="cn('shrink-0', $props.class)"
  />
</template>
