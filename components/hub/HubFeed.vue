<script setup lang="ts">
import type { Serialized, HubPostItem } from '@commonpub/server';

const props = defineProps<{
  slug: string;
  posts: Serialized<HubPostItem>[];
  isAuthenticated: boolean;
}>();

const emit = defineEmits<{
  postCreated: [];
}>();

const newPostContent = ref('');
const newPostType = ref<'text' | 'question' | 'discussion' | 'showcase'>('text');
const posting = ref(false);
const postError = ref('');
const feedFilter = ref('all');
const imageInput = ref<HTMLInputElement | null>(null);
const toast = useToast();

const postTypeOptions = [
  { value: 'text', label: 'Post', icon: 'fa-solid fa-pen' },
  { value: 'question', label: 'Question', icon: 'fa-solid fa-circle-question' },
  { value: 'discussion', label: 'Discussion', icon: 'fa-solid fa-comments' },
  { value: 'showcase', label: 'Showcase', icon: 'fa-solid fa-image' },
];

const feedFilters = [
  { value: 'all', label: 'All Posts' },
  { value: 'question', label: 'Questions' },
  { value: 'discussion', label: 'Discussions' },
  { value: 'showcase', label: 'Showcase' },
  { value: 'announcement', label: 'Announcements' },
];

const filteredPosts = computed(() => {
  if (feedFilter.value === 'all') return props.posts;
  return props.posts.filter((p) => p.type === feedFilter.value);
});

async function handlePost(): Promise<void> {
  if (!newPostContent.value.trim()) return;
  posting.value = true;
  try {
    await $fetch(`/api/hubs/${props.slug}/posts`, {
      method: 'POST',
      body: { content: newPostContent.value, type: newPostType.value },
    });
    newPostContent.value = '';
    newPostType.value = 'text';
    postError.value = '';
    emit('postCreated');
  } catch (e) {
    const fetchErr = e as { data?: { statusMessage?: string }; message?: string };
    postError.value = fetchErr?.data?.statusMessage || fetchErr?.message || 'Failed to create post';
  } finally {
    posting.value = false;
  }
}

function openImagePicker(): void {
  imageInput.value?.click();
}

async function handleImageUpload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const result = await $fetch<{ url: string }>('/api/files/upload', { method: 'POST', body: formData });
    newPostContent.value += (newPostContent.value ? ' ' : '') + result.url;
    toast.success('Image uploaded');
  } catch {
    toast.error('Upload failed');
  }
  input.value = '';
}

function handleLinkInsert(): void {
  const url = prompt('Enter a URL:');
  if (url) {
    newPostContent.value += (newPostContent.value ? ' ' : '') + url;
  }
}
</script>

<template>
  <!-- Pinned announcements -->
  <AnnouncementBand
    v-for="post in filteredPosts.filter(p => p.isPinned && p.type === ('announcement' as string))"
    :key="`ann-${post.id}`"
    :title="post.content?.slice(0, 80) || 'Announcement'"
    :body="post.content || ''"
    :author="post.author?.displayName || post.author?.username || 'Unknown'"
    :created-at="new Date(post.createdAt)"
    :pinned="true"
    style="margin-bottom: 12px"
  />

  <!-- Compose bar -->
  <div v-if="isAuthenticated" class="cpub-compose-bar">
    <div class="cpub-compose-types">
      <button
        v-for="opt in postTypeOptions"
        :key="opt.value"
        class="cpub-compose-type-btn"
        :class="{ active: newPostType === opt.value }"
        @click="newPostType = opt.value as typeof newPostType"
      >
        <i :class="opt.icon"></i> {{ opt.label }}
      </button>
    </div>
    <div class="cpub-compose-row">
      <input
        v-model="newPostContent"
        class="cpub-compose-input"
        type="text"
        :placeholder="newPostType === 'question' ? 'Ask the community a question...' : newPostType === 'discussion' ? 'Start a discussion...' : newPostType === 'showcase' ? 'Share what you built...' : 'Write a post...'"
        @keydown.enter="handlePost"
      />
      <input ref="imageInput" type="file" accept="image/*" style="display: none" @change="handleImageUpload" />
      <button class="cpub-btn cpub-btn-sm" aria-label="Upload image" @click="openImagePicker"><i class="fa-solid fa-image"></i></button>
      <button class="cpub-btn cpub-btn-sm" aria-label="Insert link" @click="handleLinkInsert"><i class="fa-solid fa-link"></i></button>
      <button class="cpub-btn cpub-btn-sm cpub-btn-primary" :disabled="posting" @click="handlePost">
        <i class="fa-solid fa-paper-plane"></i> Post
      </button>
    </div>
  </div>

  <!-- Feed filter -->
  <div class="cpub-tag-row" style="margin-bottom: 14px">
    <FilterChip
      v-for="f in feedFilters"
      :key="f.value"
      :label="f.label"
      :active="feedFilter === f.value"
      @toggle="feedFilter = f.value"
    />
  </div>

  <!-- Feed posts -->
  <div v-if="postError" class="cpub-post-error">{{ postError }}</div>
  <div v-if="filteredPosts.length" class="cpub-feed-list">
    <template v-for="post in filteredPosts" :key="post.id">
      <!-- Share posts: render as content card with thumbnail -->
      <NuxtLink v-if="post.type === 'share' && (post.sharedContent as Record<string, unknown>)?.slug" :to="`/${(post.sharedContent as Record<string, unknown>).type}/${(post.sharedContent as Record<string, unknown>).slug}`" class="cpub-share-card">
        <div class="cpub-share-card-context">
          <i class="fa-solid fa-share-nodes"></i>
          {{ post.author?.displayName || post.author?.username }} shared a {{ (post.sharedContent as Record<string, unknown>).type }}
          &middot; {{ new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
        </div>
        <div class="cpub-share-card-embed">
          <div v-if="(post.sharedContent as Record<string, unknown>).coverImageUrl" class="cpub-share-card-thumb">
            <img :src="String((post.sharedContent as Record<string, unknown>).coverImageUrl)" :alt="String((post.sharedContent as Record<string, unknown>).title)" />
          </div>
          <div v-else class="cpub-share-card-thumb cpub-share-card-thumb-fallback">
            <i :class="(post.sharedContent as Record<string, unknown>).type === 'project' ? 'fa-solid fa-microchip' : 'fa-solid fa-file-lines'"></i>
          </div>
          <div class="cpub-share-card-body">
            <span class="cpub-share-card-type">{{ (post.sharedContent as Record<string, unknown>).type }}</span>
            <h3 class="cpub-share-card-title">{{ (post.sharedContent as Record<string, unknown>).title }}</h3>
            <p v-if="(post.sharedContent as Record<string, unknown>).description" class="cpub-share-card-desc">{{ (post.sharedContent as Record<string, unknown>).description }}</p>
          </div>
        </div>
      </NuxtLink>
      <!-- Regular posts -->
      <NuxtLink v-else :to="`/hubs/${slug}/posts/${post.id}`" class="cpub-feed-link">
        <FeedItem
          :type="(post.type as 'discussion' | 'question' | 'showcase' | 'announcement') || 'discussion'"
          :title="post.content?.slice(0, 80) || ''"
          :author="post.author?.displayName || post.author?.username || 'Unknown'"
          :body="post.content || ''"
          :created-at="new Date(post.createdAt)"
          :reply-count="post.replyCount ?? 0"
          :vote-count="post.likeCount ?? 0"
          :pinned="post.isPinned"
          :locked="post.isLocked"
        />
      </NuxtLink>
    </template>
  </div>
  <div v-else class="cpub-empty-state">
    <div class="cpub-empty-state-icon"><i class="fa-solid fa-message"></i></div>
    <p class="cpub-empty-state-title">No posts yet</p>
    <p class="cpub-empty-state-desc">Be the first to start a discussion!</p>
  </div>
</template>

<style scoped>
.cpub-compose-bar {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cpub-compose-types { display: flex; gap: 4px; }

.cpub-compose-type-btn {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 10px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-faint);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: border-color 0.1s, color 0.1s;
}
.cpub-compose-type-btn:hover { color: var(--text); border-color: var(--text-dim); }
.cpub-compose-type-btn.active { color: var(--accent); border-color: var(--accent); background: var(--accent-bg); }

.cpub-compose-row { display: flex; gap: 10px; align-items: center; }

.cpub-compose-input {
  flex: 1;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.8125rem;
  color: var(--text-faint);
  cursor: pointer;
}

.cpub-feed-list { display: flex; flex-direction: column; gap: 12px; }
.cpub-feed-link { text-decoration: none; color: inherit; display: block; }
.cpub-post-error { font-size: 0.75rem; color: var(--red); background: var(--red-bg); border: 1px solid var(--red-border); border-radius: 8px; padding: 8px 12px; margin-bottom: 12px; }

/* Share card */
.cpub-share-card { display: block; text-decoration: none; color: inherit; }
.cpub-share-card-context {
  font-size: 11px; color: var(--text-faint); padding: 0 0 6px;
  display: flex; align-items: center; gap: 5px;
}
.cpub-share-card-context i { font-size: 10px; }
.cpub-share-card-embed {
  display: flex; gap: 0;
  background: var(--surface); border: 2px solid var(--border);
  overflow: hidden; transition: border-color 0.15s;
}
.cpub-share-card:hover .cpub-share-card-embed { border-color: var(--accent-border); }
.cpub-share-card-thumb {
  width: 120px; min-height: 80px; flex-shrink: 0; overflow: hidden;
  background: var(--surface2);
}
.cpub-share-card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cpub-share-card-thumb-fallback {
  display: flex; align-items: center; justify-content: center;
  color: var(--text-faint); font-size: 24px;
}
.cpub-share-card-body { flex: 1; min-width: 0; padding: 10px 14px; }
.cpub-share-card-type {
  font-family: var(--font-mono); font-size: 9px; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--accent); font-weight: 600;
}
.cpub-share-card-title {
  font-size: 14px; font-weight: 600; color: var(--text); margin-top: 2px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.cpub-share-card-desc {
  font-size: 12px; color: var(--text-dim); margin-top: 4px;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}

@media (max-width: 640px) {
  .cpub-compose-bar { flex-wrap: wrap; }
  .cpub-compose-input { min-width: 0; }
}
</style>
