<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  label: string;
  items: Array<{ label: string; href: string; description?: string }>;
}>();

const isOpen = ref(false);
</script>

<template>
  <div
    class="relative"
    @mouseenter="isOpen = true"
    @mouseleave="isOpen = false"
  >
    <button
      class="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {{ label }}
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform" :class="{ 'rotate-180': isOpen }"><path d="m6 9 6 6 6-6"/></svg>
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-border bg-background p-2 shadow-lg"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.href"
          :to="item.href"
          class="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
          @click="isOpen = false"
        >
          <div class="font-medium text-foreground">{{ item.label }}</div>
          <div v-if="item.description" class="text-xs text-muted-foreground">{{ item.description }}</div>
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>
