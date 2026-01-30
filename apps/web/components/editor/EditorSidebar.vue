<script setup lang="ts">
import { ref } from 'vue';

const sections = [
  { id: 'overview', label: 'Overview', icon: 'file-text' },
  { id: 'code', label: 'Code', icon: 'code' },
  { id: 'schematics', label: 'Schematics', icon: 'cpu' },
  { id: 'bom', label: 'BOM', icon: 'list' },
];

const media = [
  { id: 'images', label: 'Images', icon: 'image' },
  { id: 'videos', label: 'Videos', icon: 'video' },
  { id: 'files', label: 'Files', icon: 'paperclip' },
];

const activeSection = ref('overview');
</script>

<template>
  <aside class="w-56 shrink-0 border-r border-border bg-muted/50 p-4 overflow-y-auto">
    <div class="mb-6">
      <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</h3>
      <nav class="space-y-1">
        <button
          v-for="section in sections"
          :key="section.id"
          class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
          :class="activeSection === section.id ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'"
          @click="activeSection = section.id"
        >
          {{ section.label }}
        </button>
      </nav>
    </div>

    <div>
      <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Media</h3>
      <nav class="space-y-1">
        <button
          v-for="item in media"
          :key="item.id"
          class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>
  </aside>
</template>
