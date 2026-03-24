<script setup lang="ts">
import type { Component } from 'vue';
definePageMeta({ layout: false, middleware: 'auth' });

const route = useRoute();
const contentType = computed(() => route.params.type as string);
const slug = computed(() => route.params.slug as string);
/** Track whether this is a new content creation (starts true for /new, becomes false after first save) */
const isNew = ref(slug.value === 'new');
/** Show starter form for new content — collects title, description, cover before entering editor */
const showStarterForm = ref(isNew.value);
const starterSaving = ref(false);

useSeoMeta({
  title: () => isNew.value ? `New ${contentType.value} -- devEco.io` : `Edit -- devEco.io`,
});

const title = ref('');
const metadata = ref<Record<string, unknown>>({
  description: '',
  slug: '',
  tags: [],
  visibility: 'public',
  coverImageUrl: '',
});
const saving = ref(false);
const error = ref('');
const isDirty = ref(false);
const { extract: extractError } = useApiError();
const mode = ref<'write' | 'preview' | 'code'>('write');
const contentId = ref<string | null>(null);

// --- Publish validation ---
const publishErrors = ref<string[]>([]);
const showPublishErrors = ref(false);

function validateForPublish(): string[] {
  const errs: string[] = [];
  if (!title.value.trim()) errs.push('Title is required');
  if (!(metadata.value.description as string)?.trim()) errs.push('Description is required');
  if (!(metadata.value.coverImageUrl as string)?.trim()) errs.push('Cover image is required');
  const tags = metadata.value.tags as string[];
  if (!tags || tags.length === 0) errs.push('At least one tag is required');
  if (blockEditor.blocks.value.length === 0) errs.push('Content is empty — add at least one block');
  return errs;
}

// --- Starter form submit ---
async function handleStarterSubmit(): Promise<void> {
  if (!title.value.trim()) {
    error.value = 'Title is required';
    return;
  }
  starterSaving.value = true;
  error.value = '';
  try {
    const body = buildSaveBody();
    let result: { id: string; slug: string };
    try {
      result = await $fetch<{ id: string; slug: string }>('/api/content', { method: 'POST', body });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? '';
      if (msg.toLowerCase().includes('slug') || msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
        body.slug = `${body.slug || slugify(title.value)}-${Date.now().toString(36).slice(-4)}`;
        result = await $fetch<{ id: string; slug: string }>('/api/content', { method: 'POST', body });
      } else {
        throw err;
      }
    }
    contentId.value = result.id;
    isNew.value = false;
    isDirty.value = false;
    showStarterForm.value = false;
    history.replaceState({}, '', `/${contentType.value}/${result.slug}/edit`);
  } catch (err: unknown) {
    error.value = extractError(err);
  } finally {
    starterSaving.value = false;
  }
}

// --- Block editor composable ---
const blockEditor = useBlockEditor();

// Specialized editor component map
const editorMap: Record<string, Component> = {
  article: resolveComponent('EditorsArticleEditor') as Component,
  blog: resolveComponent('EditorsBlogEditor') as Component,
  explainer: resolveComponent('EditorsExplainerEditor') as Component,
  project: resolveComponent('EditorsProjectEditor') as Component,
};

const editorComponent = computed<Component | null>(() => editorMap[contentType.value] ?? null);
const hasSpecializedEditor = computed(() => editorComponent.value !== null);

// Load existing content for editing — pass cookies so SSR can auth the user (drafts are author-only)
const requestHeaders = import.meta.server ? useRequestHeaders(['cookie']) : {};
if (!isNew.value) {
  const { data } = await useFetch(() => `/api/content/${slug.value}`, { headers: requestHeaders });
  if (data.value) {
    const d = data.value as Record<string, unknown>;
    contentId.value = d.id as string;
    title.value = d.title as string;
    if (Array.isArray(d.content)) {
      blockEditor.fromBlockTuples(d.content as [string, Record<string, unknown>][]);
    }
    metadata.value = {
      description: (d.description as string) || '',
      slug: (d.slug as string) || '',
      tags: d.tags ? (d.tags as { name: string }[]).map((t) => t.name) : [],
      visibility: (d.visibility as string) || 'public',
      coverImageUrl: (d.coverImageUrl as string) || '',
      seoDescription: (d.seoDescription as string) || '',
      difficulty: (d.difficulty as string) || '',
      buildTime: (d.buildTime as string) || '',
      estimatedCost: (d.estimatedCost as string) || '',
      estimatedMinutes: (d.estimatedMinutes as number) || undefined,
      licenseType: (d.licenseType as string) || '',
      series: (d.series as string) || '',
      category: (d.category as string) || '',
      subtitle: (d.subtitle as string) || '',
    };
  }
}

// Auto-generate slug from title (only when slug hasn't been manually edited)
const slugManuallyEdited = ref(false);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 128);
}

watch(title, (newTitle) => {
  if (!slugManuallyEdited.value && isNew.value) {
    metadata.value = { ...metadata.value, slug: slugify(newTitle) };
  }
});

// Track dirty state from block changes
watch(() => blockEditor.blocks.value, () => {
  isDirty.value = true;
}, { deep: true });

function handleMetadataUpdate(newMetadata: Record<string, unknown>): void {
  // Blog editor manages title in canvas — sync it back to topbar
  if (newMetadata.title !== undefined && typeof newMetadata.title === 'string') {
    title.value = newMetadata.title;
    delete newMetadata.title;
  }
  metadata.value = newMetadata;
  isDirty.value = true;
}

// --- BOM sync (content-products join table) ---
/** Extract productIds from block data and sync with the content-products table */
async function syncBOM(id: string): Promise<void> {
  const blocks = blockEditor.toBlockTuples();
  const productItems: Array<{ productId: string; quantity: number; notes?: string }> = [];

  for (const [type, content] of blocks) {
    if (type === 'partsList' && Array.isArray(content.parts)) {
      for (const part of content.parts as Array<{ productId?: string; qty?: number; notes?: string }>) {
        if (part.productId) {
          productItems.push({
            productId: part.productId,
            quantity: part.qty ?? 1,
            notes: part.notes,
          });
        }
      }
    }
  }

  // Only sync if there are product links (avoid clearing on non-project types)
  if (productItems.length > 0 || contentType.value === 'project') {
    await $fetch(`/api/content/${id}/products-sync`, {
      method: 'POST',
      body: { items: productItems },
    }).catch(() => {
      // Non-critical — don't fail the save
    });
  }
}

// --- Auto-save ---
const autoSaveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle');
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
const AUTO_SAVE_DELAY = 30_000; // 30 seconds

function scheduleAutoSave(): void {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(async () => {
    if (!isDirty.value || saving.value || isNew.value || !contentId.value || !title.value) return;
    await silentSave();
  }, AUTO_SAVE_DELAY);
}

// Watch for changes and schedule auto-save
watch([() => blockEditor.blocks.value, title, metadata], () => {
  if (!isNew.value && contentId.value) {
    scheduleAutoSave();
  }
}, { deep: true });

/** Build a clean save body from editor state, stripping empty strings and unknown fields */
function buildSaveBody(): Record<string, unknown> {
  const body: Record<string, unknown> = {
    type: contentType.value,
    title: title.value,
    content: blockEditor.toBlockTuples(),
    ...metadata.value,
  };

  // Send slug only if user explicitly set one (otherwise server auto-generates from title)
  if (!body.slug) delete body.slug;

  // Strip empty strings — Zod URL validators reject ''
  for (const key of Object.keys(body)) {
    if (body[key] === '') body[key] = undefined;
  }

  return body;
}

/** Save without navigating away — used by Save Draft button, auto-save, and Ctrl+S */
async function silentSave(): Promise<void> {
  if (saving.value) return;
  if (!title.value) {
    error.value = 'Please enter a title before saving.';
    return;
  }
  // Guard: if not new but no contentId, we can't PUT — treat as new creation
  if (!isNew.value && !contentId.value) {
    isNew.value = true;
  }
  saving.value = true;
  autoSaveStatus.value = 'saving';
  error.value = '';

  try {
    const body = buildSaveBody();

    if (isNew.value) {
      let result: { id: string; slug: string };
      try {
        result = await $fetch<{ id: string; slug: string }>('/api/content', { method: 'POST', body });
      } catch (err: unknown) {
        // Slug conflict: retry with a numeric suffix
        const msg = (err as { data?: { message?: string } })?.data?.message ?? '';
        if (msg.toLowerCase().includes('slug') || msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
          body.slug = `${body.slug || slugify(title.value)}-${Date.now().toString(36).slice(-4)}`;
          result = await $fetch<{ id: string; slug: string }>('/api/content', { method: 'POST', body });
        } else {
          throw err;
        }
      }
      contentId.value = result.id;
      isNew.value = false;
      isDirty.value = false;
      autoSaveStatus.value = 'saved';
      await syncBOM(result.id);
      history.replaceState({}, '', `/${contentType.value}/${result.slug}/edit`);
    } else {
      const updated = await $fetch<{ slug: string }>(`/api/content/${contentId.value}`, { method: 'PUT', body });
      isDirty.value = false;
      autoSaveStatus.value = 'saved';
      await syncBOM(contentId.value!);
      // Update URL if slug changed (title change triggers slug regeneration)
      if (updated?.slug) {
        history.replaceState({}, '', `/${contentType.value}/${updated.slug}/edit`);
      }
    }

    // Reset status after a few seconds
    setTimeout(() => {
      if (autoSaveStatus.value === 'saved') autoSaveStatus.value = 'idle';
    }, 3000);
  } catch (err: unknown) {
    error.value = extractError(err);
    autoSaveStatus.value = 'error';
  } finally {
    saving.value = false;
  }
}

async function handleSave(): Promise<void> {
  if (saving.value || !title.value) return;
  // Cancel any pending auto-save to prevent overlap
  if (autoSaveTimer) { clearTimeout(autoSaveTimer); autoSaveTimer = null; }
  // Guard: if not new but no contentId, treat as new creation
  if (!isNew.value && !contentId.value) {
    isNew.value = true;
  }
  saving.value = true;
  error.value = '';

  try {
    const body = buildSaveBody();

    if (isNew.value) {
      const result = await $fetch<{ id: string; slug: string }>('/api/content', { method: 'POST', body });
      contentId.value = result.id;
      isNew.value = false;
      isDirty.value = false;
      await syncBOM(result.id);
      await navigateTo(`/${contentType.value}/${result.slug}`);
    } else {
      await $fetch(`/api/content/${contentId.value}`, { method: 'PUT', body });
      isDirty.value = false;
      await syncBOM(contentId.value!);
      await navigateTo(`/${contentType.value}/${slug.value}`);
    }
  } catch (err: unknown) {
    error.value = extractError(err);
  } finally {
    saving.value = false;
  }
}

// --- Enter preview (save in background, show immediately) ---
function enterPreview(): void {
  mode.value = 'preview';
  // Fire-and-forget save so the draft is persisted as a checkpoint
  if (isDirty.value && title.value && !saving.value && !isNew.value && contentId.value) {
    if (autoSaveTimer) { clearTimeout(autoSaveTimer); autoSaveTimer = null; }
    silentSave();
  }
}

// --- Ctrl+S keyboard shortcut ---
function onKeydown(event: KeyboardEvent): void {
  if ((event.metaKey || event.ctrlKey) && event.key === 's') {
    event.preventDefault();
    // Cancel pending auto-save so Ctrl+S doesn't race with it
    if (autoSaveTimer) { clearTimeout(autoSaveTimer); autoSaveTimer = null; }
    silentSave();
  }
  // Escape closes explainer preview overlay
  if (event.key === 'Escape' && mode.value === 'preview' && contentType.value === 'explainer') {
    mode.value = 'write';
  }
}

onMounted(() => { document.addEventListener('keydown', onKeydown); });
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
});

// --- Warn before unload if dirty ---
function onBeforeUnload(event: BeforeUnloadEvent): void {
  if (isDirty.value) {
    event.preventDefault();
  }
}

if (import.meta.client) {
  onMounted(() => { window.addEventListener('beforeunload', onBeforeUnload); });
  onUnmounted(() => { window.removeEventListener('beforeunload', onBeforeUnload); });
}

async function handlePublish(): Promise<void> {
  if (saving.value || !title.value) return;
  // Validate required fields
  const errs = validateForPublish();
  if (errs.length > 0) {
    publishErrors.value = errs;
    showPublishErrors.value = true;
    return;
  }
  showPublishErrors.value = false;
  // Cancel any pending auto-save to prevent overlap
  if (autoSaveTimer) { clearTimeout(autoSaveTimer); autoSaveTimer = null; }
  saving.value = true;
  error.value = '';

  try {
    const body = buildSaveBody();
    let resultSlug = slug.value;

    if (isNew.value || !contentId.value) {
      const result = await $fetch<{ id: string; slug: string }>('/api/content', { method: 'POST', body });
      contentId.value = result.id;
      isNew.value = false;
      resultSlug = result.slug;
      await syncBOM(result.id);
    } else {
      const updated = await $fetch<{ slug: string }>(`/api/content/${contentId.value}`, { method: 'PUT', body });
      if (updated?.slug) resultSlug = updated.slug;
      await syncBOM(contentId.value);
    }

    // Now publish — content is saved, we have a valid contentId
    await $fetch(`/api/content/${contentId.value}/publish`, { method: 'POST' });
    isDirty.value = false;

    // Navigate to the published content view
    await navigateTo(`/${contentType.value}/${resultSlug}`);
  } catch (err: unknown) {
    error.value = extractError(err);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <!-- Starter form for new content -->
  <div v-if="showStarterForm" class="de-starter-overlay">
    <div class="de-starter-card">
      <div class="de-starter-header">
        <NuxtLink to="/create" class="de-starter-back">
          <i class="fa-solid fa-arrow-left"></i> Back
        </NuxtLink>
        <h1 class="de-starter-title">New {{ contentType }}</h1>
        <p class="de-starter-subtitle">Fill in the basics to get started. You can change these later.</p>
      </div>

      <div v-if="error" class="de-starter-error">{{ error }}</div>

      <form class="de-starter-form" @submit.prevent="handleStarterSubmit">
        <div class="de-field">
          <label for="starter-title" class="de-field-label">Title <span class="de-required">*</span></label>
          <input
            id="starter-title"
            v-model="title"
            type="text"
            class="de-field-input"
            :placeholder="`My awesome ${contentType}...`"
            required
            autofocus
          />
        </div>

        <div class="de-field">
          <label for="starter-desc" class="de-field-label">Description</label>
          <textarea
            id="starter-desc"
            :value="metadata.description as string"
            @input="metadata = { ...metadata, description: ($event.target as HTMLTextAreaElement).value }"
            class="de-field-input de-field-textarea"
            rows="3"
            placeholder="A brief summary of what this is about..."
          />
        </div>

        <div class="de-field">
          <label class="de-field-label">Cover Image</label>
          <ImageUpload
            :model-value="(metadata.coverImageUrl as string) || ''"
            @update:model-value="metadata = { ...metadata, coverImageUrl: $event }"
            purpose="cover"
            hint="Recommended: 1200×630px or wider"
          />
        </div>

        <div class="de-starter-actions">
          <button type="submit" class="de-btn-submit" :disabled="starterSaving || !title.trim()">
            {{ starterSaving ? 'Creating...' : 'Start Writing' }}
          </button>
          <NuxtLink to="/create" class="de-btn-cancel">Cancel</NuxtLink>
        </div>
      </form>
    </div>
  </div>

  <!-- Main editor -->
  <div v-else class="cpub-editor-layout">
    <!-- Publish validation errors -->
    <Teleport to="body">
      <div v-if="showPublishErrors" class="de-publish-errors-overlay" @click.self="showPublishErrors = false">
        <div class="de-publish-errors-card">
          <h3 class="de-publish-errors-title"><i class="fa-solid fa-circle-exclamation"></i> Not ready to publish</h3>
          <p class="de-publish-errors-subtitle">Please fix the following before publishing:</p>
          <ul class="de-publish-errors-list">
            <li v-for="(err, i) in publishErrors" :key="i">{{ err }}</li>
          </ul>
          <button class="de-btn-submit" @click="showPublishErrors = false">Got it</button>
        </div>
      </div>
    </Teleport>

    <!-- Top bar -->
    <header class="cpub-editor-topbar">
      <NuxtLink to="/" class="cpub-editor-logo" aria-label="Home">
        <DevEcoLogo variant="light-bg" size="sm" :show-text="false" />
      </NuxtLink>
      <button class="cpub-editor-back" aria-label="Go back" @click="$router.back()">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div class="cpub-topbar-divider" aria-hidden="true" />
      <div class="cpub-topbar-title-wrap">
        <input
          v-model="title"
          type="text"
          class="cpub-topbar-title-input"
          :placeholder="`Untitled ${contentType}...`"
          aria-label="Content title"
        />
        <span v-if="isDirty" class="cpub-unsaved-dot" title="Unsaved changes" />
        <span v-if="autoSaveStatus === 'saving'" class="cpub-autosave-status">
          <i class="fa-solid fa-circle-notch fa-spin"></i> Saving...
        </span>
        <span v-else-if="autoSaveStatus === 'saved'" class="cpub-autosave-status cpub-autosave-status--saved">
          <i class="fa-solid fa-check"></i> Saved
        </span>
        <span v-else-if="autoSaveStatus === 'error'" class="cpub-autosave-status cpub-autosave-status--error">
          <i class="fa-solid fa-exclamation-triangle"></i> Save failed
        </span>
      </div>
      <div class="cpub-mode-tabs">
        <button :class="['cpub-mode-tab', { active: mode === 'write' }]" @click="mode = 'write'">Write</button>
        <button :class="['cpub-mode-tab', { active: mode === 'preview' }]" @click="enterPreview">Preview</button>
        <button :class="['cpub-mode-tab', { active: mode === 'code' }]" @click="mode = 'code'">Code</button>
      </div>
      <div class="cpub-topbar-spacer" />
      <div class="cpub-topbar-actions">
        <button class="cpub-topbar-btn" :disabled="saving || !title" @click="silentSave">
          {{ saving ? 'Saving...' : 'Save Draft' }}
        </button>
        <button class="cpub-topbar-btn cpub-topbar-btn-primary" :disabled="saving || !title" @click="handlePublish">
          Publish
        </button>
      </div>
    </header>

    <div v-if="error" class="cpub-editor-error" role="alert">{{ error }}</div>

    <!-- Write mode with specialized editor -->
    <template v-if="mode === 'write' && hasSpecializedEditor">
      <component
        :is="editorComponent"
        :block-editor="blockEditor"
        :metadata="contentType === 'blog' ? { ...metadata, title: title } : metadata"
        @update:metadata="handleMetadataUpdate"
      />
    </template>

    <!-- Write mode — fallback generic editor -->
    <div v-else-if="mode === 'write'" class="cpub-editor-shell">
      <div class="cpub-editor-canvas">
        <EditorsBlockCanvas :block-editor="blockEditor" :block-types="[]" />
      </div>
    </div>

    <!-- Preview mode: Generic (explainer also matches here as a hidden placeholder; actual preview is in the Teleport overlay below) -->
    <div v-else-if="mode === 'preview'" class="cpub-editor-shell" :class="{ 'cpub-hidden': contentType === 'explainer' }">
      <div class="cpub-preview-canvas">
        <h1 class="cpub-preview-title">{{ title || 'Untitled' }}</h1>
        <p v-if="metadata.description" class="cpub-preview-desc">{{ metadata.description }}</p>
        <div class="cpub-preview-blocks">
          <BlocksBlockContentRenderer :blocks="blockEditor.toBlockTuples()" />
        </div>
      </div>
    </div>

    <!-- Code mode -->
    <div v-else class="cpub-editor-shell">
      <div class="cpub-code-canvas">
        <pre class="cpub-code-view">{{ JSON.stringify(blockEditor.toBlockTuples(), null, 2) }}</pre>
      </div>
    </div>

    <!-- Explainer preview: full-screen overlay (outside v-if chain, uses Teleport) -->
    <Teleport to="body">
      <div v-if="mode === 'preview' && contentType === 'explainer'" class="cpub-explainer-preview-overlay">
        <button class="cpub-preview-close-btn" @click="mode = 'write'" aria-label="Close preview">
          <i class="fa-solid fa-xmark"></i>
          <span>Back to Editor</span>
        </button>
        <ViewsExplainerView
          :content="{
            id: contentId || 'preview',
            type: 'explainer',
            title: title || 'Untitled',
            slug: (metadata.slug as string) || 'preview',
            subtitle: null,
            description: (metadata.description as string) || null,
            content: blockEditor.toBlockTuples(),
            coverImageUrl: (metadata.coverImageUrl as string) || null,
            category: null,
            difficulty: (metadata.difficulty as string) || null,
            buildTime: null,
            estimatedCost: null,
            status: 'draft',
            visibility: (metadata.visibility as string) || 'public',
            isFeatured: false,
            seoDescription: null,
            previewToken: null,
            parts: null,
            sections: null,
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            forkCount: 0,
            publishedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            licenseType: null,
            series: null,
            estimatedMinutes: null,
            tags: [],
            author: { id: '', username: '', displayName: null, avatarUrl: null },
          }"
        />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* --- Starter form --- */
.de-starter-overlay {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 24px 64px;
}

.de-starter-card {
  width: 100%;
  max-width: 560px;
}

.de-starter-header { margin-bottom: 28px; }

.de-starter-back {
  font-size: 0.8125rem;
  color: var(--text-dim);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}
.de-starter-back:hover { color: var(--text); }

.de-starter-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 6px;
  text-transform: capitalize;
}

.de-starter-subtitle {
  font-size: 0.9375rem;
  color: var(--text-dim);
}

.de-starter-error {
  padding: 10px 14px;
  background: var(--red-bg);
  color: var(--red);
  border: 1px solid var(--red-border);
  border-radius: 8px;
  font-size: 0.8125rem;
  margin-bottom: 16px;
}

.de-starter-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.de-field { display: flex; flex-direction: column; gap: 6px; }
.de-field-label { font-size: 0.75rem; font-weight: 600; color: var(--text-dim); }
.de-required { color: var(--red); }
.de-field-input {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.875rem;
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.de-field-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(0, 231, 173, 0.12);
}
.de-field-input::placeholder { color: var(--text-faint); }
.de-field-textarea { resize: vertical; min-height: 60px; line-height: 1.5; }

.de-starter-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.de-btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: var(--deveco-dark-green);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.de-btn-submit:hover { background: var(--color-primary-hover); }
.de-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.de-btn-cancel {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-dim);
  font-size: 0.875rem;
  text-decoration: none;
  transition: background 0.15s;
}
.de-btn-cancel:hover { background: var(--surface2); }

/* --- Publish validation errors --- */
.de-publish-errors-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.de-publish-errors-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 28px;
  max-width: 420px;
  width: 100%;
  box-shadow: var(--shadow-md);
}

.de-publish-errors-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--red);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.de-publish-errors-subtitle {
  font-size: 0.875rem;
  color: var(--text-dim);
  margin-bottom: 16px;
}

.de-publish-errors-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.de-publish-errors-list li {
  font-size: 0.8125rem;
  color: var(--text);
  padding: 8px 12px;
  background: var(--red-bg);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.de-publish-errors-list li::before {
  content: '•';
  color: var(--red);
  font-weight: 700;
}

.cpub-editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
}

.cpub-editor-topbar {
  height: 48px;
  background: var(--surface);
  border-bottom: var(--border-width-default, 2px) solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 0;
  flex-shrink: 0;
  z-index: 100;
}

.cpub-editor-logo {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-dim);
  letter-spacing: 0.06em;
  text-decoration: none;
  flex-shrink: 0;
}
.cpub-logo-accent { color: var(--accent); }

.cpub-editor-back {
  width: 30px; height: 30px;
  background: none;
  border: 2px solid transparent;
  color: var(--text-dim);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
  margin-left: 6px;
  flex-shrink: 0;
}
.cpub-editor-back:hover { background: var(--surface2); border-color: var(--border2); color: var(--text); }

.cpub-topbar-divider {
  width: 2px; height: 22px;
  background: var(--border);
  margin: 0 12px;
  flex-shrink: 0;
}

.cpub-topbar-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.cpub-topbar-title-input {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  background: none;
  border: 2px solid transparent;
  padding: 4px 8px;
  cursor: text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 380px;
  outline: none;
  font-family: var(--font-sans, system-ui);
}
.cpub-topbar-title-input:hover { border-color: var(--border2); background: var(--surface2); }
.cpub-topbar-title-input:focus { border-color: var(--accent); background: var(--surface2); }

.cpub-unsaved-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--yellow);
  flex-shrink: 0;
}

.cpub-autosave-status {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-faint);
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.cpub-autosave-status--saved {
  color: var(--green);
}

.cpub-autosave-status--error {
  color: var(--red);
}

.cpub-mode-tabs {
  display: flex;
  background: var(--surface2);
  border: 2px solid var(--border);
  padding: 2px;
  flex-shrink: 0;
  margin: 0 10px;
}
.cpub-mode-tab {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 14px;
  border: none;
  background: none;
  color: var(--text-dim);
  cursor: pointer;
}
.cpub-mode-tab.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: 2px 2px 0 var(--border);
}
.cpub-mode-tab:hover:not(.active) { color: var(--text); }

.cpub-topbar-spacer { flex: 1; }

.cpub-topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.cpub-topbar-btn {
  font-family: var(--font-sans, system-ui);
  font-size: 12px;
  padding: 6px 14px;
  border: 2px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
}
.cpub-topbar-btn:hover { background: var(--surface2); }
.cpub-topbar-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.cpub-topbar-btn-primary {
  background: var(--accent);
  color: var(--color-text-inverse);
  font-weight: 600;
  box-shadow: 4px 4px 0 var(--border);
}
.cpub-topbar-btn-primary:hover { box-shadow: 2px 2px 0 var(--border); }

.cpub-editor-error {
  padding: 10px 16px;
  background: var(--red-bg);
  color: var(--red);
  border-bottom: 2px solid var(--red);
  font-size: 12px;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 99;
}

.cpub-editor-shell {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.cpub-editor-canvas {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: var(--bg);
}

.cpub-preview-canvas {
  flex: 1;
  overflow-y: auto;
  padding: 48px;
  max-width: 740px;
  margin: 0 auto;
}
.cpub-preview-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.25;
}
.cpub-preview-desc {
  font-size: 15px;
  color: var(--text-dim);
  margin-bottom: 32px;
}
.cpub-preview-blocks {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cpub-preview-block {
  font-size: 15px;
  line-height: 1.75;
}
.cpub-preview-code {
  background: var(--text);
  color: var(--surface);
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 13px;
  overflow-x: auto;
  margin: 0;
}

.cpub-code-canvas {
  flex: 1;
  overflow: auto;
  background: var(--text);
  padding: 16px;
}
.cpub-code-view {
  color: var(--border2);
  font-family: var(--font-mono);
  font-size: 12px;
  white-space: pre-wrap;
  margin: 0;
}

.cpub-hidden {
  display: none;
}
</style>

<style>
/* Unscoped so Teleport overlay works */
.cpub-explainer-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--bg);
  overflow: hidden;
}

.cpub-preview-close-btn {
  position: fixed;
  top: 10px;
  right: 16px;
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--surface);
  border: 2px solid var(--border);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--border);
  transition: box-shadow 0.1s, transform 0.1s;
}

.cpub-preview-close-btn:hover {
  box-shadow: 2px 2px 0 var(--border);
  transform: translate(1px, 1px);
  background: var(--surface2);
}

.cpub-preview-close-btn i {
  font-size: 12px;
}
</style>
