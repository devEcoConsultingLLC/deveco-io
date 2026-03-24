<script setup lang="ts">
const props = defineProps<{
  contentType: string;
  metadata: Record<string, unknown>;
  selectedBlock: { type: string; attrs: Record<string, unknown> } | null;
}>();

const emit = defineEmits<{
  'update:metadata': [metadata: Record<string, unknown>];
  'slug-edited': [];
}>();

function updateField(key: string, value: unknown): void {
  emit('update:metadata', { ...props.metadata, [key]: value });
}

const visibilityOptions = ['public', 'members', 'private'];
const difficultyOptions = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Advanced' },
];
</script>

<template>
  <aside class="de-properties" aria-label="Document properties">
    <div class="de-properties-header">
      <i class="fa-solid fa-sliders"></i>
      <span class="de-properties-title">Properties</span>
    </div>

    <div class="de-properties-body">
      <!-- Document properties -->
      <section class="de-prop-section">
        <span class="de-prop-section-label"><i class="fa-solid fa-file-lines"></i> Document</span>

        <div class="de-prop-field">
          <label for="prop-slug" class="de-prop-label">Slug</label>
          <input
            id="prop-slug"
            type="text"
            class="de-prop-input"
            :value="metadata.slug"
            placeholder="auto-generated from title"
            @input="updateField('slug', ($event.target as HTMLInputElement).value); emit('slug-edited')"
          />
        </div>

        <div class="de-prop-field">
          <label for="prop-description" class="de-prop-label">Description</label>
          <textarea
            id="prop-description"
            class="de-prop-textarea"
            rows="3"
            :value="metadata.description as string"
            placeholder="Brief description..."
            @input="updateField('description', ($event.target as HTMLTextAreaElement).value)"
          />
        </div>

        <div class="de-prop-field">
          <label for="prop-tags" class="de-prop-label">Tags</label>
          <input
            id="prop-tags"
            type="text"
            class="de-prop-input"
            :value="(metadata.tags as string[] || []).join(', ')"
            placeholder="tag1, tag2, tag3"
            @input="updateField('tags', ($event.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean))"
          />
        </div>

        <div class="de-prop-field">
          <label for="prop-visibility" class="de-prop-label">Visibility</label>
          <select
            id="prop-visibility"
            class="de-prop-select"
            :value="metadata.visibility || 'public'"
            @change="updateField('visibility', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="opt in visibilityOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>

        <div class="de-prop-field">
          <label for="prop-cover" class="de-prop-label">Cover Image</label>
          <input
            id="prop-cover"
            type="text"
            class="de-prop-input"
            :value="metadata.coverImage"
            placeholder="URL or upload..."
            @input="updateField('coverImage', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </section>

      <!-- Type-specific metadata -->
      <section v-if="contentType === 'article' || contentType === 'blog'" class="de-prop-section">
        <span class="de-prop-section-label"><i :class="contentType === 'article' ? 'fa-solid fa-newspaper' : 'fa-solid fa-pen-nib'"></i> {{ contentType === 'article' ? 'Article' : 'Blog' }}</span>

        <div class="de-prop-field">
          <label for="prop-category" class="de-prop-label">Category</label>
          <input
            id="prop-category"
            type="text"
            class="de-prop-input"
            :value="metadata.category"
            placeholder="Category..."
            @input="updateField('category', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div v-if="contentType === 'blog'" class="de-prop-field">
          <label for="prop-series" class="de-prop-label">Series</label>
          <input
            id="prop-series"
            type="text"
            class="de-prop-input"
            :value="metadata.series"
            placeholder="Series name..."
            @input="updateField('series', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="de-prop-field">
          <label for="prop-seo" class="de-prop-label">SEO Description</label>
          <textarea
            id="prop-seo"
            class="de-prop-textarea"
            rows="2"
            :value="metadata.seoDescription as string"
            placeholder="SEO description..."
            @input="updateField('seoDescription', ($event.target as HTMLTextAreaElement).value)"
          />
        </div>
      </section>

      <section v-if="contentType === 'project'" class="de-prop-section">
        <span class="de-prop-section-label"><i class="fa-solid fa-microchip"></i> Project</span>

        <div class="de-prop-field">
          <label for="prop-difficulty" class="de-prop-label">Difficulty</label>
          <select
            id="prop-difficulty"
            class="de-prop-select"
            :value="metadata.difficulty || 1"
            @change="updateField('difficulty', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="opt in difficultyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <div class="de-prop-field">
          <label for="prop-buildtime" class="de-prop-label">Build Time</label>
          <input
            id="prop-buildtime"
            type="text"
            class="de-prop-input"
            :value="metadata.buildTime"
            placeholder="e.g., 2 hours"
            @input="updateField('buildTime', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="de-prop-field">
          <label for="prop-cost" class="de-prop-label">Estimated Cost</label>
          <input
            id="prop-cost"
            type="text"
            class="de-prop-input"
            :value="metadata.estimatedCost"
            placeholder="e.g., $50"
            @input="updateField('estimatedCost', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </section>

      <section v-if="contentType === 'explainer'" class="de-prop-section">
        <span class="de-prop-section-label"><i class="fa-solid fa-lightbulb"></i> Explainer</span>

        <div class="de-prop-field">
          <label for="prop-exp-difficulty" class="de-prop-label">Difficulty</label>
          <select
            id="prop-exp-difficulty"
            class="de-prop-select"
            :value="metadata.difficulty || 1"
            @change="updateField('difficulty', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="opt in difficultyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <div class="de-prop-field">
          <label for="prop-minutes" class="de-prop-label">Est. Minutes</label>
          <input
            id="prop-minutes"
            type="number"
            class="de-prop-input"
            :value="metadata.estimatedMinutes"
            placeholder="10"
            @input="updateField('estimatedMinutes', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div class="de-prop-field">
          <label for="prop-objectives" class="de-prop-label">Learning Objectives</label>
          <textarea
            id="prop-objectives"
            class="de-prop-textarea"
            rows="3"
            :value="metadata.learningObjectives as string"
            placeholder="One per line..."
            @input="updateField('learningObjectives', ($event.target as HTMLTextAreaElement).value)"
          />
        </div>
      </section>

      <!-- Selected block properties -->
      <section v-if="selectedBlock" class="de-prop-section de-prop-section--block">
        <span class="de-prop-section-label"><i class="fa-solid fa-cube"></i> Block: {{ selectedBlock.type }}</span>

        <template v-if="selectedBlock.type === 'image'">
          <div class="de-prop-field">
            <label class="de-prop-label">Alt Text</label>
            <input type="text" class="de-prop-input" :value="selectedBlock.attrs.alt" readonly />
          </div>
          <div class="de-prop-field">
            <label class="de-prop-label">Caption</label>
            <input type="text" class="de-prop-input" :value="selectedBlock.attrs.caption" readonly />
          </div>
        </template>

        <template v-if="selectedBlock.type === 'code_block'">
          <div class="de-prop-field">
            <label class="de-prop-label">Language</label>
            <input type="text" class="de-prop-input" :value="selectedBlock.attrs.language" readonly />
          </div>
          <div class="de-prop-field">
            <label class="de-prop-label">Filename</label>
            <input type="text" class="de-prop-input" :value="selectedBlock.attrs.filename" readonly />
          </div>
        </template>

        <template v-if="selectedBlock.type === 'callout'">
          <div class="de-prop-field">
            <label class="de-prop-label">Variant</label>
            <span class="de-prop-value">{{ selectedBlock.attrs.variant }}</span>
          </div>
        </template>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.de-properties {
  width: 300px;
  border-left: 1px solid var(--border);
  background: var(--surface);
  overflow-y: auto;
  flex-shrink: 0;
}

.de-properties-header {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
}

.de-properties-header i {
  font-size: 14px;
}

.de-properties-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text);
}

.de-properties-body {
  padding: 16px;
}

.de-prop-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.de-prop-section:last-child {
  border-bottom: none;
}

.de-prop-section--block {
  background: var(--surface2);
  margin: -16px;
  margin-top: 0;
  padding: 16px;
  border-bottom: none;
  border-radius: 0;
}

.de-prop-section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-faint);
  margin-bottom: 14px;
}

.de-prop-section-label i {
  font-size: 12px;
  color: var(--deveco-dark-green);
}

.de-prop-field {
  margin-bottom: 14px;
}

.de-prop-field:last-child {
  margin-bottom: 0;
}

.de-prop-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-dim);
  margin-bottom: 6px;
}

.de-prop-input,
.de-prop-select,
.de-prop-textarea {
  width: 100%;
  padding: 8px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.de-prop-input:focus,
.de-prop-select:focus,
.de-prop-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(0, 231, 173, 0.12);
}

.de-prop-textarea {
  resize: vertical;
  line-height: 1.5;
}

.de-prop-select {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}

.de-prop-value {
  font-size: 0.8125rem;
  color: var(--text);
  text-transform: capitalize;
}
</style>
