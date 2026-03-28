<script setup lang="ts">
definePageMeta({ layout: 'default' });

const route = useRoute();
const id = route.params.id as string;

const { data: content, error } = await useFetch(`/api/federation/content/${id}`);

const authorName = computed(() =>
  content.value?.actor?.displayName
  || content.value?.actor?.preferredUsername
  || 'Unknown author'
);

const authorHandle = computed(() => {
  const actor = content.value?.actor;
  if (!actor) return '';
  return `@${actor.preferredUsername ?? 'unknown'}@${actor.instanceDomain ?? ''}`;
});

const dateStr = computed(() => {
  const d = content.value?.publishedAt || content.value?.receivedAt;
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

/**
 * Render content body — handles both proper HTML and legacy raw JSON block tuples.
 * Older federated content may have been stored as JSON.stringify'd BlockTuples
 * before the contentToArticle HTML renderer was added.
 */
const renderedContent = computed(() => {
  const raw = content.value?.content;
  if (!raw) return '';
  // If it starts with [[ it's likely raw BlockTuple JSON
  const trimmed = raw.trim();
  if (trimmed.startsWith('[[') || trimmed.startsWith('[["')) {
    try {
      const blocks = JSON.parse(trimmed) as [string, Record<string, unknown>][];
      if (!Array.isArray(blocks)) return raw;
      return blocks.map(([type, data]) => {
        switch (type) {
          case 'paragraph': case 'text':
            return data.html ? `<p>${data.html}</p>` : data.text ? `<p>${data.text}</p>` : '';
          case 'heading': {
            const lvl = Math.min(Math.max(Number(data.level) || 2, 1), 6);
            return `<h${lvl}>${data.html || data.text || ''}</h${lvl}>`;
          }
          case 'image':
            return data.url ? `<figure><img src="${data.url}" alt="${data.alt || ''}" />${data.caption ? `<figcaption>${data.caption}</figcaption>` : ''}</figure>` : '';
          case 'code_block': case 'code':
            return data.code ? `<pre><code>${String(data.code).replace(/</g, '&lt;')}</code></pre>` : '';
          case 'quote': case 'blockquote':
            return `<blockquote>${data.html || `<p>${data.text || ''}</p>`}</blockquote>`;
          case 'divider': return '<hr />';
          case 'build_step':
            return `<div><strong>${data.title || ''}</strong>${data.html || (data.text ? `<p>${data.text}</p>` : '')}</div>`;
          default:
            return data.html ? `<div>${data.html}</div>` : data.text ? `<p>${data.text}</p>` : '';
        }
      }).join('\n');
    } catch { return raw; }
  }
  return raw;
});

const typeLabel = computed(() => {
  const t = content.value?.cpubType || content.value?.apType?.toLowerCase() || 'article';
  return t.charAt(0).toUpperCase() + t.slice(1);
});

// Engagement
const liked = ref(false);
const localLikeCount = ref(content.value?.localLikeCount ?? 0);

async function handleLike() {
  if (liked.value) return; // Already liked
  liked.value = true;
  localLikeCount.value++;
  try {
    await $fetch('/api/federation/like', {
      method: 'POST',
      body: { federatedContentId: id },
    });
  } catch {
    liked.value = false;
    localLikeCount.value--;
  }
}

// SEO: noindex + canonical to origin
if (content.value?.url) {
  useHead({
    link: [{ rel: 'canonical', href: content.value.url }],
    meta: [{ name: 'robots', content: 'noindex, follow' }],
  });
}

useSeoMeta({
  title: content.value?.title ?? 'Mirrored Content',
  description: content.value?.summary ?? '',
});
</script>

<template>
  <div class="mirror-page">
    <div v-if="error" class="mirror-error">
      <h1>Content not found</h1>
      <p>This mirrored content may have been removed or is unavailable.</p>
      <NuxtLink to="/">Back to home</NuxtLink>
    </div>

    <template v-else-if="content">
      <!-- Origin banner -->
      <div class="mirror-banner">
        <i class="fa-solid fa-globe" />
        <span>
          Originally published on
          <strong>{{ content.originDomain }}</strong>
        </span>
        <a
          v-if="content.url"
          :href="content.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mirror-banner__link"
        >
          View Original <i class="fa-solid fa-arrow-up-right-from-square" />
        </a>
      </div>

      <!-- Content header -->
      <div class="mirror-header">
        <span class="mirror-type">{{ typeLabel }}</span>

        <h1 v-if="content.title" class="mirror-title">{{ content.title }}</h1>

        <!-- Cover image -->
        <img
          v-if="content.coverImageUrl"
          :src="content.coverImageUrl"
          :alt="content.title ?? ''"
          class="mirror-cover"
        />

        <!-- Author row -->
        <div class="mirror-author">
          <img
            v-if="content.actor?.avatarUrl"
            :src="content.actor.avatarUrl"
            :alt="authorName"
            class="mirror-author__av"
          />
          <span v-else class="mirror-author__av mirror-author__av--fallback">
            {{ authorName.charAt(0).toUpperCase() }}
          </span>
          <div>
            <strong class="mirror-author__name">{{ authorName }}</strong>
            <span class="mirror-author__handle">{{ authorHandle }}</span>
          </div>
          <time v-if="dateStr" class="mirror-author__date">{{ dateStr }}</time>
        </div>
      </div>

      <!-- Summary -->
      <p v-if="content.summary" class="mirror-summary">{{ content.summary }}</p>

      <!-- Content body (rendered HTML from remote instance) -->
      <div
        v-if="renderedContent"
        class="mirror-body prose"
        v-html="renderedContent"
      />

      <!-- Tags -->
      <div v-if="content.tags?.length" class="mirror-tags">
        <span v-for="tag in content.tags" :key="tag.name" class="mirror-tag">
          {{ tag.name }}
        </span>
      </div>

      <!-- Attachments -->
      <div v-if="content.attachments?.length" class="mirror-attachments">
        <h3>Attachments</h3>
        <div v-for="att in content.attachments" :key="att.url" class="mirror-attachment">
          <img v-if="att.type === 'Image'" :src="att.url" :alt="att.name ?? ''" class="mirror-attachment__img" />
          <a v-else :href="att.url" target="_blank" rel="noopener">{{ att.name || att.url }}</a>
        </div>
      </div>

      <!-- Engagement actions -->
      <div class="mirror-engagement">
        <button class="mirror-action" :class="{ 'mirror-action--active': liked }" @click="handleLike">
          <i class="fa-solid fa-heart" /> {{ localLikeCount }} likes
        </button>
        <span><i class="fa-solid fa-comment" /> {{ content.localCommentCount ?? 0 }} comments</span>
        <a
          v-if="content.url"
          :href="content.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mirror-action"
        >
          <i class="fa-solid fa-arrow-up-right-from-square" /> View Original
        </a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.mirror-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

.mirror-error {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
}

.mirror-error h1 {
  font-size: 1.5rem;
  color: var(--text);
  margin-bottom: 8px;
}

.mirror-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: 6px;
  font-size: 0.8125rem;
  color: var(--text-dim);
  margin-bottom: 24px;
}

.mirror-banner i {
  color: var(--accent);
  flex-shrink: 0;
}

.mirror-banner__link {
  margin-left: auto;
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.mirror-banner__link:hover {
  text-decoration: underline;
}

.mirror-type {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--accent);
  margin-bottom: 8px;
}

.mirror-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--text);
  margin-bottom: 16px;
}

.mirror-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.mirror-author {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border2);
}

.mirror-author__av {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
}

.mirror-author__av--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent), var(--teal));
  color: #fff;
  font-weight: 700;
  font-size: 0.75rem;
}

.mirror-author__name {
  display: block;
  font-size: 0.875rem;
  color: var(--text);
}

.mirror-author__handle {
  font-size: 0.75rem;
  color: var(--text-faint);
}

.mirror-author__date {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-faint);
}

.mirror-summary {
  font-size: 1.0625rem;
  color: var(--text-dim);
  line-height: 1.6;
  margin-bottom: 24px;
  font-style: italic;
}

.mirror-body {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--text);
  margin-bottom: 32px;
}

.mirror-body :deep(img) {
  max-width: 100%;
  border-radius: 6px;
}

.mirror-body :deep(a) {
  color: var(--accent);
}

.mirror-body :deep(pre) {
  background: var(--surface2);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
}

.mirror-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 24px;
}

.mirror-tag {
  font-size: 0.75rem;
  padding: 3px 8px;
  background: var(--surface2);
  color: var(--text-dim);
  border-radius: 4px;
}

.mirror-attachments {
  margin-bottom: 24px;
}

.mirror-attachments h3 {
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.mirror-attachment__img {
  max-width: 100%;
  border-radius: 6px;
  margin-bottom: 8px;
}

.mirror-engagement {
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border2);
  font-size: 0.8125rem;
  color: var(--text-dim);
}

.mirror-engagement i {
  margin-right: 4px;
}

.mirror-action {
  background: none;
  border: 1px solid var(--border2);
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.8125rem;
  color: var(--text-dim);
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
}

.mirror-action:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.mirror-action--active {
  color: var(--red);
  border-color: var(--red-border);
}
</style>
