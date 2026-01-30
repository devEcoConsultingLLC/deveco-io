<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  tabs?: string[];
}>();

const defaultTabs = ['Overview', 'Code', 'Schematics', 'BOM', 'Comments'];
const tabList = props.tabs || defaultTabs;
const activeTab = ref(tabList[0]);
</script>

<template>
  <div>
    <div class="border-b border-border">
      <nav class="-mb-px flex gap-4">
        <button
          v-for="tab in tabList"
          :key="tab"
          class="border-b-2 px-1 py-3 text-sm font-medium transition-colors"
          :class="
            activeTab === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
          "
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </nav>
    </div>
    <div class="py-6">
      <slot :name="activeTab?.toLowerCase()" :active="activeTab" />
    </div>
  </div>
</template>
