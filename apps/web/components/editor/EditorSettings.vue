<script setup lang="ts">
import { ref } from 'vue';

const coverImage = ref<string | null>(null);
const category = ref('');
const difficulty = ref('');
const tags = ref<string[]>([]);
const tagInput = ref('');
const visibility = ref('private');

function addTag() {
  if (tagInput.value.trim() && !tags.value.includes(tagInput.value.trim())) {
    tags.value.push(tagInput.value.trim());
    tagInput.value = '';
  }
}

function removeTag(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag);
}
</script>

<template>
  <aside class="w-72 shrink-0 border-l border-border bg-muted/50 overflow-y-auto p-4 space-y-6">
    <!-- Cover Image -->
    <div>
      <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cover Image</h3>
      <div
        class="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-background cursor-pointer hover:border-primary transition-colors"
      >
        <div class="text-center text-sm text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          Click to upload
        </div>
      </div>
    </div>

    <!-- Category -->
    <div>
      <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</h3>
      <select v-model="category" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
        <option value="">Select category</option>
        <option value="computer-vision">Computer Vision</option>
        <option value="voice-recognition">Voice Recognition</option>
        <option value="sensor-fusion">Sensor Fusion</option>
        <option value="robotics">Robotics</option>
        <option value="environmental">Environmental</option>
        <option value="wearable">Wearable</option>
      </select>
    </div>

    <!-- Difficulty -->
    <div>
      <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difficulty</h3>
      <select v-model="difficulty" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
        <option value="">Select difficulty</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
    </div>

    <!-- Tags -->
    <div>
      <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</h3>
      <div class="flex flex-wrap gap-1.5 mb-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
        >
          {{ tag }}
          <button class="hover:text-destructive" @click="removeTag(tag)">&times;</button>
        </span>
      </div>
      <input
        v-model="tagInput"
        placeholder="Add tag..."
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        @keydown.enter.prevent="addTag"
      />
    </div>

    <!-- Visibility -->
    <div>
      <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visibility</h3>
      <div class="space-y-2">
        <label class="flex items-center gap-2 text-sm">
          <input v-model="visibility" type="radio" value="private" class="text-primary" />
          Private (Draft)
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="visibility" type="radio" value="public" class="text-primary" />
          Public
        </label>
      </div>
    </div>

    <!-- Publishing Checklist -->
    <div>
      <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Checklist</h3>
      <ul class="space-y-2 text-sm text-muted-foreground">
        <li class="flex items-center gap-2">
          <span class="h-4 w-4 rounded-full border border-border" :class="{ 'bg-brand-teal border-brand-teal': coverImage }" />
          Cover image
        </li>
        <li class="flex items-center gap-2">
          <span class="h-4 w-4 rounded-full border border-border" :class="{ 'bg-brand-teal border-brand-teal': category }" />
          Category selected
        </li>
        <li class="flex items-center gap-2">
          <span class="h-4 w-4 rounded-full border border-border" :class="{ 'bg-brand-teal border-brand-teal': tags.length > 0 }" />
          At least one tag
        </li>
      </ul>
    </div>
  </aside>
</template>
