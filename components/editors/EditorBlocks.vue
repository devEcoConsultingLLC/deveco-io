<script setup lang="ts">
import type { BlockEditor } from '~/composables/useBlockEditor';

/**
 * Reusable block library sidebar for editors.
 * Renders a searchable list of insertable blocks grouped by category.
 * Clicking a block adds it to the end of the document via the block editor composable.
 */
export interface BlockDef {
  type: string;
  label: string;
  icon: string;
  description?: string;
  attrs?: Record<string, unknown>;
}

export interface BlockGroup {
  name: string;
  variant?: string;
  blocks: BlockDef[];
}

const props = defineProps<{
  groups: BlockGroup[];
  blockEditor: BlockEditor;
}>();

const blockSearch = ref('');

const filteredGroups = computed(() => {
  const q = blockSearch.value.toLowerCase();
  if (!q) return props.groups;
  return props.groups
    .map((g) => ({ ...g, blocks: g.blocks.filter((b) => b.label.toLowerCase().includes(q)) }))
    .filter((g) => g.blocks.length > 0);
});

function insertBlock(block: BlockDef): void {
  props.blockEditor.addBlock(block.type, block.attrs);
}
</script>

<template>
  <div class="cpub-block-library">
    <div class="cpub-bl-search">
      <i class="fa-solid fa-magnifying-glass cpub-bl-search-icon"></i>
      <input
        v-model="blockSearch"
        type="text"
        placeholder="Search blocks..."
        class="cpub-bl-search-input"
        aria-label="Search blocks"
      />
    </div>
    <div class="cpub-bl-groups">
      <div v-for="group in filteredGroups" :key="group.name" class="cpub-bl-group">
        <div class="cpub-bl-group-label">{{ group.name }}</div>
        <div class="cpub-bl-blocks">
          <button
            v-for="block in group.blocks"
            :key="block.type + (block.attrs?.variant ?? '')"
            class="cpub-bl-block"
            :class="[group.variant, `cpub-bl-type-${block.type}`]"
            :title="block.label"
            @click="insertBlock(block)"
          >
            <span class="cpub-bl-block-icon"><i :class="['fa-solid', block.icon]"></i></span>
            <span class="cpub-bl-block-label">{{ block.label }}</span>
            <span class="cpub-bl-block-drag"><i class="fa-solid fa-grip-dots-vertical"></i></span>
          </button>
        </div>
      </div>
      <div v-if="filteredGroups.length === 0" class="cpub-bl-empty">
        No blocks match "{{ blockSearch }}"
      </div>
    </div>
  </div>
</template>

<style scoped>
.cpub-block-library {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cpub-bl-search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  margin: 12px 12px 6px;
}

.cpub-bl-search-icon {
  font-size: 13px;
  color: var(--text-faint);
  flex-shrink: 0;
}

.cpub-bl-search-input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.8125rem;
  color: var(--text);
  width: 100%;
  font-family: var(--font-sans);
}

.cpub-bl-search-input::placeholder {
  color: var(--text-faint);
}

.cpub-bl-groups {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
}

.cpub-bl-group {
  padding: 4px 0;
}

.cpub-bl-group-label {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
  padding: 8px 16px 6px;
}

.cpub-bl-blocks {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 6px;
}

.cpub-bl-block {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-dim);
  font-size: 0.8125rem;
  user-select: none;
  transition: background 0.1s;
  text-align: left;
  width: 100%;
}

.cpub-bl-block:hover {
  background: var(--surface2);
  color: var(--text);
}

.cpub-bl-block-icon {
  width: 28px;
  height: 28px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--text-faint);
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;
}

/* Color-coded block icons */
.cpub-bl-type-text .cpub-bl-block-icon,
.cpub-bl-type-paragraph .cpub-bl-block-icon { color: var(--text-dim); }
.cpub-bl-type-heading .cpub-bl-block-icon { color: #004e53; background: rgba(0, 78, 83, 0.06); border-color: rgba(0, 78, 83, 0.15); }
.cpub-bl-type-image .cpub-bl-block-icon,
.cpub-bl-type-gallery .cpub-bl-block-icon { color: #5bc5e8; background: rgba(91, 197, 232, 0.06); border-color: rgba(91, 197, 232, 0.2); }
.cpub-bl-type-code .cpub-bl-block-icon,
.cpub-bl-type-code_block .cpub-bl-block-icon { color: #5f2bef; background: rgba(95, 43, 239, 0.06); border-color: rgba(95, 43, 239, 0.15); }
.cpub-bl-type-quote .cpub-bl-block-icon,
.cpub-bl-type-blockquote .cpub-bl-block-icon { color: #4db3a8; background: rgba(77, 179, 168, 0.06); border-color: rgba(77, 179, 168, 0.2); }
.cpub-bl-type-callout .cpub-bl-block-icon { color: #f4c84b; background: rgba(244, 200, 75, 0.06); border-color: rgba(244, 200, 75, 0.2); }
.cpub-bl-type-divider .cpub-bl-block-icon { color: var(--text-faint); }
.cpub-bl-type-embed .cpub-bl-block-icon,
.cpub-bl-type-video .cpub-bl-block-icon { color: #e85a85; background: rgba(232, 90, 133, 0.06); border-color: rgba(232, 90, 133, 0.15); }
.cpub-bl-type-quiz .cpub-bl-block-icon,
.cpub-bl-type-checkpoint .cpub-bl-block-icon { color: #00e7ad; background: rgba(0, 231, 173, 0.06); border-color: rgba(0, 231, 173, 0.2); }
.cpub-bl-type-parts-list .cpub-bl-block-icon,
.cpub-bl-type-tool-list .cpub-bl-block-icon,
.cpub-bl-type-build-step .cpub-bl-block-icon { color: #004e53; background: rgba(0, 78, 83, 0.06); border-color: rgba(0, 78, 83, 0.15); }
.cpub-bl-type-downloads .cpub-bl-block-icon { color: #5f2bef; background: rgba(95, 43, 239, 0.06); border-color: rgba(95, 43, 239, 0.15); }
.cpub-bl-type-math .cpub-bl-block-icon { color: #1b357d; background: rgba(27, 53, 125, 0.06); border-color: rgba(27, 53, 125, 0.15); }
.cpub-bl-type-slider .cpub-bl-block-icon { color: #f4c84b; background: rgba(244, 200, 75, 0.06); border-color: rgba(244, 200, 75, 0.2); }
.cpub-bl-type-section-header .cpub-bl-block-icon { color: #004e53; background: rgba(0, 78, 83, 0.06); border-color: rgba(0, 78, 83, 0.15); }

.cpub-bl-block-label {
  font-size: 0.75rem;
  font-weight: 500;
  flex: 1;
}

.cpub-bl-block-drag {
  font-size: 10px;
  color: var(--text-faint);
  opacity: 0;
  transition: opacity 0.1s;
}

.cpub-bl-block:hover .cpub-bl-block-drag {
  opacity: 1;
}

.cpub-bl-empty {
  font-size: 0.8125rem;
  color: var(--text-faint);
  padding: 20px 12px;
  text-align: center;
}

@media (hover: none) {
  .cpub-bl-block-drag { opacity: 1; }
}
</style>
