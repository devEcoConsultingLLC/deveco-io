<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  purpose: 'avatar' | 'banner' | 'cover';
  label?: string;
  hint?: string;
  aspectClass?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [url: string];
}>();

const uploading = ref(false);
const error = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

function triggerPicker(): void {
  fileInput.value?.click();
}

async function handleFileChange(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file.';
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    error.value = 'Image must be under 10MB.';
    return;
  }

  error.value = '';
  uploading.value = true;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', props.purpose);

    const result = await $fetch<{ url: string }>('/api/files/upload', {
      method: 'POST',
      body: formData,
    });

    emit('update:modelValue', result.url);
  } catch (err: unknown) {
    error.value = (err as { data?: { statusMessage?: string } })?.data?.statusMessage || 'Upload failed.';
  } finally {
    uploading.value = false;
    if (target) target.value = '';
  }
}

function clearImage(): void {
  emit('update:modelValue', '');
}
</script>

<template>
  <div class="de-img-upload">
    <label v-if="label" class="de-img-upload-label">{{ label }}</label>

    <!-- Preview / upload area -->
    <div
      class="de-img-upload-zone"
      :class="[aspectClass || (purpose === 'banner' ? 'de-img-banner' : purpose === 'cover' ? 'de-img-cover' : 'de-img-square'), { 'de-img-has-preview': modelValue }]"
      @click="triggerPicker"
    >
      <img v-if="modelValue" :src="modelValue" alt="Preview" class="de-img-preview" />
      <div v-else class="de-img-placeholder">
        <i v-if="uploading" class="fa-solid fa-circle-notch fa-spin"></i>
        <i v-else class="fa-solid fa-cloud-arrow-up"></i>
        <span>{{ uploading ? 'Uploading...' : 'Click to upload' }}</span>
      </div>
      <div v-if="modelValue && !uploading" class="de-img-overlay">
        <span>Change</span>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="de-img-file-input"
      @change="handleFileChange"
    />

    <div v-if="modelValue" class="de-img-actions">
      <button type="button" class="de-img-remove" @click.stop="clearImage">
        <i class="fa-solid fa-trash-can"></i> Remove
      </button>
    </div>

    <span v-if="hint && !error" class="de-img-hint">{{ hint }}</span>
    <span v-if="error" class="de-img-error">{{ error }}</span>
  </div>
</template>

<style scoped>
.de-img-upload {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.de-img-upload-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-dim);
}

.de-img-upload-zone {
  position: relative;
  border: 1px dashed var(--border);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  background: var(--bg);
}

.de-img-upload-zone:hover {
  border-color: var(--accent);
  background: var(--accent-bg);
}

.de-img-upload-zone.de-img-has-preview {
  border-style: solid;
}

.de-img-square {
  width: 120px;
  height: 120px;
}

.de-img-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 120px;
}

.de-img-banner {
  width: 100%;
  aspect-ratio: 4 / 1;
  min-height: 100px;
}

.de-img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.de-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--text-faint);
  font-size: 0.75rem;
}

.de-img-placeholder i {
  font-size: 20px;
}

.de-img-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.15s;
}

.de-img-upload-zone:hover .de-img-overlay {
  opacity: 1;
}

.de-img-file-input {
  display: none;
}

.de-img-actions {
  display: flex;
  gap: 8px;
}

.de-img-remove {
  font-size: 0.6875rem;
  color: var(--red);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
}
.de-img-remove:hover { text-decoration: underline; }

.de-img-hint {
  font-size: 0.6875rem;
  color: var(--text-faint);
}

.de-img-error {
  font-size: 0.6875rem;
  color: var(--red);
}
</style>
