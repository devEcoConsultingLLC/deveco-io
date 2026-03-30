<script setup lang="ts">
import type { FederatedHubListItem, FederatedHubPostItem } from '@commonpub/server';

const route = useRoute();
const id = route.params.id as string;

const { data: hub, pending, error } = await useFetch<FederatedHubListItem>(`/api/federated-hubs/${id}`);
const { data: posts } = useLazyFetch<{ items: FederatedHubPostItem[]; total: number }>(`/api/federated-hubs/${id}/posts`, {
  default: () => ({ items: [], total: 0 }),
});

useSeoMeta({
  title: () => hub.value ? `${hub.value.name} (${hub.value.originDomain}) -- devEco.io` : 'Federated Hub -- devEco.io',
  description: () => hub.value?.description || '',
});
</script>

<template>
  <div v-if="pending" class="cpub-loading" style="padding: 64px 24px; text-align: center">Loading hub...</div>
  <div v-else-if="error" class="cpub-not-found">
    <h1>Federated hub not found</h1>
    <p>This hub may have been removed or the mirror may be paused.</p>
    <NuxtLink to="/hubs">Back to Hubs</NuxtLink>
  </div>

  <div v-else-if="hub" class="cpub-fed-hub-page">
    <!-- Federation banner -->
    <div class="cpub-fed-banner">
      <div class="cpub-fed-banner-inner">
        <i class="fa-solid fa-globe"></i>
        <span>
          Federated hub from <strong>{{ hub.originDomain }}</strong>
        </span>
        <a v-if="hub.url" :href="hub.url" target="_blank" rel="noopener noreferrer" class="cpub-fed-banner-link">
          View Original <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    </div>

    <!-- Hub header -->
    <div class="cpub-fed-hub-header">
      <div class="cpub-fed-hub-header-inner">
        <div class="cpub-fed-hub-icon">
          <img v-if="hub.iconUrl" :src="hub.iconUrl" :alt="hub.name" />
          <i v-else class="fa-solid fa-users"></i>
        </div>
        <div class="cpub-fed-hub-info">
          <h1 class="cpub-fed-hub-name">{{ hub.name }}</h1>
          <p v-if="hub.description" class="cpub-fed-hub-desc">{{ hub.description }}</p>
          <div class="cpub-fed-hub-stats">
            <span class="cpub-fed-hub-stat"><i class="fa-solid fa-users"></i> {{ hub.memberCount }} members</span>
            <span class="cpub-fed-hub-stat"><i class="fa-solid fa-message"></i> {{ hub.postCount }} posts</span>
            <span class="cpub-fed-hub-stat"><i class="fa-solid fa-globe"></i> {{ hub.originDomain }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Posts feed -->
    <div class="cpub-fed-hub-main">
      <h2 class="cpub-fed-hub-section-title">Posts</h2>
      <div v-if="posts?.items?.length" class="cpub-fed-hub-feed">
        <div v-for="post in posts.items" :key="post.id" class="cpub-fed-hub-post">
          <div class="cpub-fed-hub-post-author">
            <div class="cpub-fed-hub-post-avatar">
              <img v-if="post.author.avatarUrl" :src="post.author.avatarUrl" :alt="post.author.displayName ?? ''" />
              <span v-else>{{ (post.author.displayName || post.author.preferredUsername || 'U').charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <span class="cpub-fed-hub-post-name">{{ post.author.displayName || post.author.preferredUsername }}</span>
              <span class="cpub-fed-hub-post-handle">@{{ post.author.preferredUsername }}@{{ post.author.instanceDomain }}</span>
            </div>
            <span class="cpub-fed-hub-post-time">{{ post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '' }}</span>
          </div>
          <div class="cpub-fed-hub-post-content">{{ post.content }}</div>
          <div class="cpub-fed-hub-post-stats">
            <span><i class="fa-solid fa-heart"></i> {{ post.localLikeCount + post.remoteLikeCount }}</span>
            <span><i class="fa-solid fa-comment"></i> {{ post.localReplyCount + post.remoteReplyCount }}</span>
            <span v-if="post.postType !== 'text'" class="cpub-fed-hub-post-type">{{ post.postType }}</span>
          </div>
        </div>
      </div>
      <div v-else class="cpub-empty-state">
        <div class="cpub-empty-state-icon"><i class="fa-solid fa-message"></i></div>
        <p class="cpub-empty-state-title">No posts mirrored yet</p>
        <p class="cpub-empty-state-desc">Posts from this hub will appear here as they are received.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cpub-fed-hub-page { min-height: 60vh; }

.cpub-fed-banner {
  background: var(--accent-bg); border-bottom: 1px solid var(--accent-border);
}
.cpub-fed-banner-inner {
  max-width: 1200px; margin: 0 auto; padding: 8px 24px;
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--text-dim);
}
.cpub-fed-banner-inner > i { color: var(--accent); flex-shrink: 0; }
.cpub-fed-banner-link {
  margin-left: auto; color: var(--accent); font-weight: 600;
  text-decoration: none; white-space: nowrap;
  display: flex; align-items: center; gap: 4px; font-size: 11px;
}
.cpub-fed-banner-link:hover { text-decoration: underline; }

.cpub-fed-hub-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 24px 0;
}

.cpub-fed-hub-header-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  display: flex; align-items: flex-start; gap: 16px;
}

.cpub-fed-hub-icon {
  width: 64px; height: 64px;
  background: var(--surface2); border: 2px solid var(--border); border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: var(--text-faint); overflow: hidden; flex-shrink: 0;
}
.cpub-fed-hub-icon img { width: 100%; height: 100%; object-fit: cover; }

.cpub-fed-hub-info { flex: 1; }
.cpub-fed-hub-name { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; margin-bottom: 4px; }
.cpub-fed-hub-desc { font-size: 0.8125rem; color: var(--text-dim); line-height: 1.5; margin-bottom: 10px; max-width: 600px; }

.cpub-fed-hub-stats { display: flex; gap: 16px; font-size: 0.8125rem; color: var(--text-dim); }
.cpub-fed-hub-stat { display: flex; align-items: center; gap: 5px; }
.cpub-fed-hub-stat i { font-size: 11px; }

.cpub-fed-hub-main {
  max-width: 800px; margin: 0 auto; padding: 24px;
}

.cpub-fed-hub-section-title {
  font-size: 0.875rem; font-weight: 700; color: var(--text-dim);
  margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.04em;
  font-family: var(--font-mono);
}

.cpub-fed-hub-feed { display: flex; flex-direction: column; gap: 12px; }

.cpub-fed-hub-post {
  background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
  padding: 14px 16px;
}

.cpub-fed-hub-post-author {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
}

.cpub-fed-hub-post-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--accent-bg); border: 1px solid var(--accent-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: var(--deveco-dark-green);
  overflow: hidden; flex-shrink: 0;
}
.cpub-fed-hub-post-avatar img { width: 100%; height: 100%; object-fit: cover; }

.cpub-fed-hub-post-name { font-size: 0.8125rem; font-weight: 600; }
.cpub-fed-hub-post-handle { font-size: 0.6875rem; color: var(--text-faint); margin-left: 4px; }
.cpub-fed-hub-post-time { font-size: 0.6875rem; color: var(--text-faint); margin-left: auto; }

.cpub-fed-hub-post-content {
  font-size: 0.875rem; line-height: 1.6; color: var(--text); margin-bottom: 8px;
}

.cpub-fed-hub-post-stats {
  display: flex; gap: 12px; font-size: 0.75rem; color: var(--text-faint);
}
.cpub-fed-hub-post-stats i { margin-right: 3px; font-size: 10px; }

.cpub-fed-hub-post-type {
  font-family: var(--font-mono); font-size: 0.625rem; text-transform: uppercase;
  letter-spacing: 0.04em; color: var(--accent); font-weight: 600;
  padding: 1px 6px; background: var(--accent-bg); border: 1px solid var(--accent-border);
  border-radius: 4px; margin-left: auto;
}

.cpub-not-found { text-align: center; padding: 60px 20px; color: var(--text-dim); }
.cpub-not-found h1 { font-size: 1.5rem; color: var(--text); margin-bottom: 8px; }

@media (max-width: 640px) {
  .cpub-fed-hub-header-inner { flex-direction: column; }
  .cpub-fed-hub-main { padding: 16px; }
  .cpub-fed-hub-stats { flex-wrap: wrap; gap: 8px 16px; }
}
</style>
