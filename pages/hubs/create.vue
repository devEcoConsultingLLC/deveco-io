<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

useSeoMeta({
  title: 'Create Community -- devEco.io',
  description: 'Create a new community on devEco.io.',
});

const toast = useToast();
const { extract: extractError } = useApiError();
const name = ref('');
const description = ref('');
const hubType = ref<'community' | 'product' | 'company'>('community');
const joinPolicy = ref<'open' | 'approval' | 'invite'>('open');
const iconUrl = ref('');
const bannerUrl = ref('');
const saving = ref(false);

async function handleCreate(): Promise<void> {
  saving.value = true;
  try {
    const result = await $fetch('/api/hubs', {
      method: 'POST',
      body: {
        name: name.value,
        description: description.value || undefined,
        hubType: hubType.value,
        joinPolicy: joinPolicy.value,
        iconUrl: iconUrl.value || undefined,
        bannerUrl: bannerUrl.value || undefined,
      },
    });
    await navigateTo(`/hubs/${(result as { slug: string }).slug}`);
  } catch (err: unknown) {
    toast.error(extractError(err));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="de-create-hub">
    <div class="de-create-header">
      <NuxtLink to="/hubs" class="de-back-link">
        <i class="fa-solid fa-arrow-left"></i> Back to Communities
      </NuxtLink>
      <h1 class="de-create-title">Create Community</h1>
      <p class="de-create-subtitle">Start a new community, product page, or organization hub.</p>
    </div>

    <form class="de-create-form" @submit.prevent="handleCreate" aria-label="Create hub form">
      <div class="de-field">
        <label for="hub-name" class="de-field-label">Name</label>
        <input id="hub-name" v-model="name" type="text" class="de-field-input" required placeholder="Community name" />
      </div>

      <div class="de-field">
        <label for="hub-desc" class="de-field-label">Description</label>
        <textarea id="hub-desc" v-model="description" class="de-field-input de-field-textarea" rows="3" placeholder="What is this community about?" />
      </div>

      <div class="de-field-row">
        <div class="de-field">
          <label for="hub-type" class="de-field-label">Type</label>
          <select id="hub-type" v-model="hubType" class="de-field-input">
            <option value="community">Community</option>
            <option value="product">Product</option>
            <option value="company">Company</option>
          </select>
        </div>

        <div class="de-field">
          <label for="hub-join" class="de-field-label">Join Policy</label>
          <select id="hub-join" v-model="joinPolicy" class="de-field-input">
            <option value="open">Open</option>
            <option value="approval">Approval Required</option>
            <option value="invite">Invite Only</option>
          </select>
        </div>
      </div>

      <ImageUpload v-model="iconUrl" purpose="avatar" label="Icon / Avatar" hint="Square image, at least 256×256px" />

      <ImageUpload v-model="bannerUrl" purpose="banner" label="Banner Image" hint="Wide image, at least 1200×300px" />

      <div class="de-form-actions">
        <button type="submit" class="de-btn-submit" :disabled="saving || !name">
          {{ saving ? 'Creating...' : 'Create Community' }}
        </button>
        <NuxtLink to="/hubs" class="de-btn-cancel">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.de-create-hub {
  max-width: 640px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.de-create-header { margin-bottom: 32px; }

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

.de-create-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.de-create-subtitle {
  font-size: 0.9375rem;
  color: var(--text-dim);
}

.de-create-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

select.de-field-input { cursor: pointer; }

@media (max-width: 640px) {
  .de-create-hub { padding: 24px 16px; }
  .de-field-row { grid-template-columns: 1fr; }
}
</style>
