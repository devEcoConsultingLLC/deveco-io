<script setup lang="ts">
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'radix-vue';

defineProps<{
  open?: boolean;
}>();

defineEmits<{
  'update:open': [value: boolean];
}>();
</script>

<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <slot name="trigger">
      <DialogTrigger as-child>
        <slot name="trigger-content" />
      </DialogTrigger>
    </slot>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent class="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-6 shadow-lg">
        <slot />
        <DialogClose class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
          <span class="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
