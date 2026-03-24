<script setup lang="ts">
/**
 * Block type picker — appears when clicking an insert zone.
 * Shows available block types grouped by category, with search.
 */
export interface BlockTypeDef {
  type: string;
  label: string;
  icon: string;
  description?: string;
  attrs?: Record<string, unknown>;
}

export interface BlockTypeGroup {
  name: string;
  blocks: BlockTypeDef[];
}

const props = defineProps<{
  groups: BlockTypeGroup[];
  visible: boolean;
}>();

const emit = defineEmits<{
  select: [type: string, attrs?: Record<string, unknown>];
  close: [];
}>();

const search = ref('');
const selectedIndex = ref(0);
const pickerRef = ref<HTMLElement | null>(null);

const flatBlocks = computed(() => {
  return props.groups.flatMap((g) => g.blocks);
});

const filteredBlocks = computed(() => {
  const q = search.value.toLowerCase();
  if (!q) return flatBlocks.value;
  return flatBlocks.value.filter(
    (b) => b.label.toLowerCase().includes(q) || b.type.toLowerCase().includes(q),
  );
});

watch(() => props.visible, (v) => {
  if (v) {
    search.value = '';
    selectedIndex.value = 0;
    nextTick(() => {
      (pickerRef.value?.querySelector('.cpub-picker-search') as HTMLInputElement)?.focus();
    });
  }
});

watch(search, () => {
  selectedIndex.value = 0;
});

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    emit('close');
    return;
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredBlocks.value.length - 1);
    return;
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
    return;
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    const block = filteredBlocks.value[selectedIndex.value];
    if (block) {
      emit('select', block.type, block.attrs);
    }
    return;
  }
}

function selectBlock(block: BlockTypeDef): void {
  emit('select', block.type, block.attrs);
}

// Close on click outside
function handleClickOutside(event: MouseEvent): void {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
  <div v-if="visible" ref="pickerRef" class="cpub-picker" @keydown="handleKeydown">
    <div class="cpub-picker-header">
      <i class="fa-solid fa-magnifying-glass cpub-picker-search-icon"></i>
      <input
        v-model="search"
        type="text"
        class="cpub-picker-search"
        placeholder="Search blocks..."
        aria-label="Search block types"
      />
    </div>
    <div class="cpub-picker-body">
      <template v-if="filteredBlocks.length > 0">
        <button
          v-for="(block, i) in filteredBlocks"
          :key="block.type + (block.attrs?.variant ?? '')"
          class="cpub-picker-item"
          :class="[{ 'cpub-picker-item--active': i === selectedIndex }, `cpub-picker-block-${block.type}`]"
          :data-block="block.type"
          @mouseenter="selectedIndex = i"
          @click="selectBlock(block)"
        >
          <span class="cpub-picker-icon"><i :class="['fa-solid', block.icon]"></i></span>
          <span class="cpub-picker-text">
            <span class="cpub-picker-label">{{ block.label }}</span>
            <span v-if="block.description" class="cpub-picker-desc">{{ block.description }}</span>
          </span>
        </button>
      </template>
      <div v-else class="cpub-picker-empty">
        No blocks match "{{ search }}"
      </div>
    </div>
  </div>
</template>

<style scoped>
.cpub-picker {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  min-width: 320px;
  max-width: 400px;
  max-height: 420px;
  display: flex;
  flex-direction: column;
}

.cpub-picker-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 10px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.cpub-picker-search-icon {
  font-size: 14px;
  color: var(--text-faint);
  flex-shrink: 0;
}

.cpub-picker-search {
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: var(--text);
  width: 100%;
  font-family: var(--font-sans);
}

.cpub-picker-search::placeholder {
  color: var(--text-faint);
}

.cpub-picker-body {
  overflow-y: auto;
  flex: 1;
  padding: 6px;
}

.cpub-picker-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;
  color: var(--text);
  font-size: 0.875rem;
}

.cpub-picker-item:hover,
.cpub-picker-item--active {
  background: var(--surface2);
}

.cpub-picker-icon {
  width: 38px;
  height: 38px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--text-dim);
  flex-shrink: 0;
}

/* Color-coded block icons */
.cpub-picker-block-text .cpub-picker-icon,
.cpub-picker-block-paragraph .cpub-picker-icon { color: var(--text-dim); }
.cpub-picker-block-heading .cpub-picker-icon { color: #004e53; background: rgba(0, 78, 83, 0.06); border-color: rgba(0, 78, 83, 0.15); }
.cpub-picker-block-image .cpub-picker-icon,
.cpub-picker-block-gallery .cpub-picker-icon { color: #5bc5e8; background: rgba(91, 197, 232, 0.06); border-color: rgba(91, 197, 232, 0.2); }
.cpub-picker-block-code .cpub-picker-icon { color: #5f2bef; background: rgba(95, 43, 239, 0.06); border-color: rgba(95, 43, 239, 0.15); }
.cpub-picker-block-quote .cpub-picker-icon { color: #4db3a8; background: rgba(77, 179, 168, 0.06); border-color: rgba(77, 179, 168, 0.2); }
.cpub-picker-block-callout .cpub-picker-icon { color: #f4c84b; background: rgba(244, 200, 75, 0.06); border-color: rgba(244, 200, 75, 0.2); }
.cpub-picker-block-divider .cpub-picker-icon { color: var(--text-faint); }
.cpub-picker-block-embed .cpub-picker-icon,
.cpub-picker-block-video .cpub-picker-icon { color: #e85a85; background: rgba(232, 90, 133, 0.06); border-color: rgba(232, 90, 133, 0.15); }
.cpub-picker-block-quiz .cpub-picker-icon,
.cpub-picker-block-checkpoint .cpub-picker-icon { color: #00e7ad; background: rgba(0, 231, 173, 0.06); border-color: rgba(0, 231, 173, 0.2); }
.cpub-picker-block-parts-list .cpub-picker-icon,
.cpub-picker-block-tool-list .cpub-picker-icon,
.cpub-picker-block-build-step .cpub-picker-icon { color: #004e53; background: rgba(0, 78, 83, 0.06); border-color: rgba(0, 78, 83, 0.15); }
.cpub-picker-block-downloads .cpub-picker-icon { color: #5f2bef; background: rgba(95, 43, 239, 0.06); border-color: rgba(95, 43, 239, 0.15); }
.cpub-picker-block-math .cpub-picker-icon { color: #1b357d; background: rgba(27, 53, 125, 0.06); border-color: rgba(27, 53, 125, 0.15); }
.cpub-picker-block-slider .cpub-picker-icon { color: #f4c84b; background: rgba(244, 200, 75, 0.06); border-color: rgba(244, 200, 75, 0.2); }
.cpub-picker-block-section-header .cpub-picker-icon { color: #004e53; background: rgba(0, 78, 83, 0.06); border-color: rgba(0, 78, 83, 0.15); }

.cpub-picker-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 2px;
}

.cpub-picker-label {
  font-size: 0.875rem;
  font-weight: 600;
}

.cpub-picker-desc {
  font-size: 0.75rem;
  color: var(--text-faint);
  font-family: var(--font-sans);
  line-height: 1.3;
}

.cpub-picker-empty {
  padding: 24px;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--text-faint);
}
</style>
