<script setup lang="ts">
import { computed } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        accent: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border-2 border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        pink: 'bg-brand-pink text-white hover:bg-brand-pink/90',
        yellow: 'bg-brand-yellow text-foreground hover:bg-brand-yellow/90',
        blue: 'bg-brand-blue text-white hover:bg-brand-blue/90',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

const props = withDefaults(
  defineProps<{
    variant?: NonNullable<ButtonVariants['variant']>;
    size?: NonNullable<ButtonVariants['size']>;
    as?: string;
    disabled?: boolean;
  }>(),
  {
    variant: 'default',
    size: 'default',
    as: 'button',
  },
);

const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size })));
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :disabled="disabled"
  >
    <slot />
  </component>
</template>
