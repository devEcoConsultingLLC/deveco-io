<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'secondary' | 'outline' | 'live' | 'upcoming' | 'ended';
}>();

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-border text-foreground',
  live: 'bg-brand-pink text-white',
  upcoming: 'bg-brand-yellow text-foreground',
  ended: 'bg-muted text-muted-foreground',
};
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    :class="variantClasses[variant || 'default']"
  >
    <slot />
  </span>
</template>
