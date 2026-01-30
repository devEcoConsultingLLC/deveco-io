<script setup lang="ts">
defineProps<{
  projectTitle?: string;
  isDraft?: boolean;
}>();

defineEmits<{
  save: [];
  publish: [];
  back: [];
}>();
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <!-- Editor Header -->
    <header class="flex items-center justify-between border-b border-border px-4 py-3">
      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors"
          @click="$emit('back')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back
        </button>
        <h1 class="text-sm font-semibold text-foreground">{{ projectTitle || 'Untitled Project' }}</h1>
        <AppBadge v-if="isDraft" variant="outline">Draft</AppBadge>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          @click="$emit('save')"
        >
          Save
        </button>
        <button
          class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          @click="$emit('publish')"
        >
          Publish
        </button>
      </div>
    </header>

    <!-- Three-column layout -->
    <div class="flex flex-1 overflow-hidden">
      <slot name="sidebar" />
      <slot name="editor" />
      <slot name="settings" />
    </div>
  </div>
</template>
