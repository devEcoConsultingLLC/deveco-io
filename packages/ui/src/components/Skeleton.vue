<script setup lang="ts">
import { cn } from '../utils';

defineProps<{ class?: string }>();
</script>

<template>
  <div :class="cn('animate-pulse rounded-md bg-muted', $props.class)" />
</template>
