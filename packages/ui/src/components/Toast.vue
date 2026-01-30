<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils';

const props = defineProps<{
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  open?: boolean;
}>();

defineEmits<{
  close: [];
}>();

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'destructive':
      return 'border-destructive bg-destructive text-destructive-foreground';
    case 'success':
      return 'border-brand-teal bg-brand-teal text-white';
    default:
      return 'border-border bg-background text-foreground';
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="translate-x-full opacity-0"
    leave-active-class="transition-all duration-200"
    leave-to-class="translate-x-full opacity-0"
  >
    <div
      v-if="open"
      :class="cn('pointer-events-auto fixed bottom-4 right-4 z-[100] w-full max-w-sm rounded-lg border p-4 shadow-lg', variantClasses)"
    >
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <p v-if="title" class="text-sm font-semibold">{{ title }}</p>
          <p v-if="description" class="text-sm opacity-90">{{ description }}</p>
        </div>
        <button class="shrink-0 opacity-70 hover:opacity-100" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  </Transition>
</template>
