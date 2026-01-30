<script setup lang="ts">
import { ref, provide } from 'vue';
import { cn } from '../utils';

const props = defineProps<{
  defaultValue?: string;
  class?: string;
}>();

const activeTab = ref(props.defaultValue || '');

provide('tabs-active', activeTab);
</script>

<template>
  <div :class="cn('', $props.class)">
    <slot :active="activeTab" />
  </div>
</template>
