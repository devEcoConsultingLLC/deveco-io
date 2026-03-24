<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const toast = useToast();

import type { Serialized, HubDetail } from '@commonpub/server';

const { data: hub } = useLazyFetch<Serialized<HubDetail>>(() => `/api/hubs/${slug.value}`);

useSeoMeta({
  title: () => `Settings -- ${hub.value?.name ?? 'Community'} -- devEco.io`,
});

const form = reactive({
  name: '',
  description: '',
  rules: '',
  joinPolicy: 'open',
  privacy: 'public',
  website: '',
  iconUrl: '',
  bannerUrl: '',
});

// Populate form when hub data loads
watch(hub, (h) => {
  if (!h) return;
  form.name = h.name ?? '';
  form.description = h.description ?? '';
  form.rules = Array.isArray(h.rules) ? (h.rules as string[]).join('\n') : (h.rules ?? '');
  form.joinPolicy = h.joinPolicy ?? 'open';
  form.privacy = h.privacy ?? 'public';
  form.website = h.website ?? '';
  form.iconUrl = (h as Record<string, unknown>).iconUrl as string ?? '';
  form.bannerUrl = (h as Record<string, unknown>).bannerUrl as string ?? '';
}, { immediate: true });

const saving = ref(false);
const { extract: extractError } = useApiError();

async function handleSave(): Promise<void> {
  saving.value = true;
  try {
    await $fetch(`/api/hubs/${slug.value}`, {
      method: 'PUT',
      body: {
        name: form.name,
        description: form.description || null,
        rules: form.rules.split('\n').map((r: string) => r.trim()).filter(Boolean),
        joinPolicy: form.joinPolicy,
        privacy: form.privacy,
        website: form.website || null,
        iconUrl: form.iconUrl || null,
        bannerUrl: form.bannerUrl || null,
      },
    });
    toast.success('Settings saved');
  } catch (err: unknown) {
    toast.error(extractError(err));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div v-if="hub" class="de-hub-settings">
    <div class="de-settings-header">
      <NuxtLink :to="`/hubs/${slug}`" class="de-back-link">
        <i class="fa-solid fa-arrow-left"></i> Back to community
      </NuxtLink>
      <h1 class="de-settings-title">Community Settings</h1>
      <p class="de-settings-subtitle">Manage {{ hub.name }}</p>
    </div>

    <form class="de-settings-form" @submit.prevent="handleSave">
      <!-- Branding section -->
      <section class="de-settings-section">
        <h2 class="de-section-label"><i class="fa-solid fa-palette"></i> Branding</h2>

        <ImageUpload v-model="form.iconUrl" purpose="avatar" label="Icon / Avatar" hint="Square image, at least 256×256px" />

        <ImageUpload v-model="form.bannerUrl" purpose="banner" label="Banner Image" hint="Wide image, at least 1200×300px" />
      </section>

      <!-- General section -->
      <section class="de-settings-section">
        <h2 class="de-section-label"><i class="fa-solid fa-gear"></i> General</h2>

        <div class="de-field">
          <label for="hub-name" class="de-field-label">Name</label>
          <input id="hub-name" v-model="form.name" type="text" class="de-field-input" required placeholder="Community name" />
        </div>

        <div class="de-field">
          <label for="hub-desc" class="de-field-label">Description</label>
          <textarea id="hub-desc" v-model="form.description" class="de-field-input de-field-textarea" rows="3" placeholder="What is this community about?" />
        </div>

        <div class="de-field">
          <label for="hub-website" class="de-field-label">Website</label>
          <input id="hub-website" v-model="form.website" type="url" class="de-field-input" placeholder="https://example.com" />
        </div>
      </section>

      <!-- Rules & Access section -->
      <section class="de-settings-section">
        <h2 class="de-section-label"><i class="fa-solid fa-shield-halved"></i> Rules & Access</h2>

        <div class="de-field">
          <label for="hub-rules" class="de-field-label">Rules (one per line)</label>
          <textarea id="hub-rules" v-model="form.rules" class="de-field-input de-field-textarea" rows="4" placeholder="Be respectful&#10;Stay on topic&#10;No spam" />
        </div>

        <div class="de-field-row">
          <div class="de-field">
            <label for="hub-join" class="de-field-label">Join Policy</label>
            <select id="hub-join" v-model="form.joinPolicy" class="de-field-input">
              <option value="open">Open</option>
              <option value="approval">Approval Required</option>
              <option value="invite">Invite Only</option>
            </select>
          </div>

          <div class="de-field">
            <label for="hub-privacy" class="de-field-label">Privacy</label>
            <select id="hub-privacy" v-model="form.privacy" class="de-field-input">
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </section>

      <div class="de-form-actions">
        <button type="submit" class="de-btn-submit" :disabled="saving || !form.name">
          {{ saving ? 'Saving...' : 'Save Settings' }}
        </button>
        <NuxtLink :to="`/hubs/${slug}`" class="de-btn-cancel">Cancel</NuxtLink>
      </div>
    </form>
  </div>

  <div v-else class="de-empty-state" style="padding: 64px 24px; text-align: center;">
    <p style="font-size: 1rem; font-weight: 600;">Community not found</p>
  </div>
</template>

<style scoped>
.de-hub-settings {
  max-width: 640px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.de-settings-header { margin-bottom: 32px; }

.de-back-link {
  font-size: 0.8125rem;
  color: var(--text-dim);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}
.de-back-link:hover { color: var(--text); }

.de-settings-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.de-settings-subtitle {
  font-size: 0.9375rem;
  color: var(--text-dim);
}

.de-settings-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.de-settings-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.de-section-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

.de-section-label i {
  font-size: 14px;
  color: var(--deveco-dark-green);
}

.de-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.de-field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-dim);
}

.de-field-input {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
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

.de-field-textarea {
  resize: vertical;
  min-height: 60px;
  line-height: 1.5;
}

.de-field-hint {
  font-size: 0.6875rem;
  color: var(--text-faint);
}

.de-field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.de-form-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
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

select.de-field-input { cursor: pointer; }

@media (max-width: 640px) {
  .de-hub-settings { padding: 24px 16px; }
  .de-field-row { grid-template-columns: 1fr; }
}
</style>
