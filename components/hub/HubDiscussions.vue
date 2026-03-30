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
const newPostType = ref<'discussion' | 'question'>('discussion');
const posting = ref(false);
const toast = useToast();

const discussionPosts = computed(() => {
  return props.posts.filter((p) => p.type === 'text' || p.type === 'link' || p.type === 'discussion' || p.type === 'question');
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
    newPostType.value = 'discussion';
    emit('postCreated');
  } catch {
    toast.error('Failed to create post');
  } finally {
    posting.value = false;
  }
}
</script>

<template>
  <div v-if="isAuthenticated" class="cpub-compose-bar" style="margin-bottom: 16px">
    <div class="cpub-compose-row">
      <input
        v-model="newPostContent"
        class="cpub-compose-input"
        type="text"
        placeholder="Start a discussion or ask a question..."
        @keydown.enter="newPostType = 'discussion'; handlePost()"
      />
      <button class="cpub-btn cpub-btn-sm" :class="{ 'cpub-btn-primary': newPostType === 'question' }" @click="newPostType = 'question'" title="Ask a question">
        <i class="fa-solid fa-circle-question"></i>
      </button>
      <button class="cpub-btn cpub-btn-sm cpub-btn-primary" :disabled="posting" @click="newPostType = 'discussion'; handlePost()">
        <i class="fa-solid fa-paper-plane"></i> Post
      </button>
    </div>
  </div>
  <div v-if="discussionPosts.length" class="cpub-disc-list">
    <NuxtLink
      v-for="post in discussionPosts"
      :key="post.id"
      :to="`/hubs/${slug}/posts/${post.id}`"
      class="cpub-feed-link"
    >
      <DiscussionItem
        :title="post.content?.slice(0, 80) || 'Untitled'"
        :author="post.author?.displayName || post.author?.username || 'Unknown'"
        :reply-count="post.replyCount ?? 0"
        :vote-count="post.likeCount ?? 0"
      />
    </NuxtLink>
  </div>
  <div v-else class="cpub-empty-state">
    <div class="cpub-empty-state-icon"><i class="fa-solid fa-comments"></i></div>
    <p class="cpub-empty-state-title">No discussions yet</p>
    <p class="cpub-empty-state-desc">Be the first to start a conversation.</p>
  </div>
</template>

<style scoped>
.cpub-compose-bar {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cpub-compose-row { display: flex; gap: 10px; align-items: center; }
.cpub-compose-input {
  flex: 1;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.8125rem;
  color: var(--text-faint);
}
.cpub-disc-list { display: flex; flex-direction: column; gap: 8px; }
.cpub-feed-link { text-decoration: none; color: inherit; display: block; }
</style>
