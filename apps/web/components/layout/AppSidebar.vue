<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>

<template>
  <aside :class="['w-full lg:w-80 shrink-0 space-y-6', $props.class]">
    <slot />
  </aside>
</template>
