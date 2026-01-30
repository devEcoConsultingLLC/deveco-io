<script setup lang="ts">
import { cn } from '../utils';

defineProps<{ class?: string }>();
</script>

<template>
  <div :class="cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm', $props.class)">
    <slot />
  </div>
</template>
