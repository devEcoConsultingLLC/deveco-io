<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);
const query = ref('');
const results = ref<{ projects: any[]; hardware: any[] }>({ projects: [], hardware: [] });

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    isOpen.value = !isOpen.value;
  }
  if (e.key === 'Escape') {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));

async function onSearch(q: string) {
  query.value = q;
  if (!q.trim()) {
    results.value = { projects: [], hardware: [] };
    return;
  }
  // TODO: integrate with Meilisearch via useSearch composable
}
</script>

<template>
  <div>
    <!-- Trigger button -->
    <button
      class="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors"
      @click="isOpen = true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <span>Search...</span>
      <kbd class="pointer-events-none hidden select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
        <span class="text-xs">&#8984;</span>K
      </kbd>
    </button>

    <!-- Search Modal -->
    <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-50">
        <div class="fixed inset-0 bg-black/50" @click="isOpen = false" />
        <div class="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
          <div class="flex items-center border-b border-border px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 shrink-0 opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              v-model="query"
              placeholder="Search projects, hardware, users..."
              class="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              autofocus
              @input="onSearch(query)"
            />
            <kbd class="pointer-events-none ml-2 hidden select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
              ESC
            </kbd>
          </div>
          <div class="max-h-[300px] overflow-y-auto p-2">
            <div v-if="!query" class="p-8 text-center text-sm text-muted-foreground">
              Start typing to search projects, hardware, and more...
            </div>
            <div v-else-if="results.projects.length === 0 && results.hardware.length === 0" class="p-8 text-center text-sm text-muted-foreground">
              No results found for "{{ query }}"
            </div>
            <template v-else>
              <div v-if="results.projects.length" class="mb-2">
                <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Projects</div>
                <NuxtLink
                  v-for="project in results.projects"
                  :key="project.id"
                  :to="`/projects/${project.slug}`"
                  class="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent"
                  @click="isOpen = false"
                >
                  {{ project.title }}
                </NuxtLink>
              </div>
              <div v-if="results.hardware.length">
                <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Hardware</div>
                <NuxtLink
                  v-for="item in results.hardware"
                  :key="item.id"
                  :to="`/hardware/${item.slug}`"
                  class="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent"
                  @click="isOpen = false"
                >
                  {{ item.name }}
                </NuxtLink>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
