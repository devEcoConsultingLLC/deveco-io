<script setup lang="ts">
import { ref } from 'vue';
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent } from 'radix-vue';

defineProps<{
  open: boolean;
  placeholder?: string;
}>();

defineEmits<{
  'update:open': [value: boolean];
  search: [query: string];
  select: [value: string];
}>();

const query = ref('');
</script>

<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div class="flex items-center border-b border-border px-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 shrink-0 opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            v-model="query"
            :placeholder="placeholder || 'Search projects, hardware, users...'"
            class="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            @input="$emit('search', query)"
          />
          <kbd class="pointer-events-none ml-2 hidden select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
            ESC
          </kbd>
        </div>
        <div class="max-h-[300px] overflow-y-auto p-2">
          <slot :query="query" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
