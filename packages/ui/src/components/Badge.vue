<script setup lang="ts">
import { computed } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-border text-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        pink: 'bg-brand-pink text-white',
        yellow: 'bg-brand-yellow text-foreground',
        blue: 'bg-brand-blue text-white',
        teal: 'bg-brand-teal text-white',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

const props = withDefaults(
  defineProps<{ variant?: NonNullable<BadgeVariants['variant']> }>(),
  { variant: 'default' },
);

const classes = computed(() => cn(badgeVariants({ variant: props.variant })));
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
