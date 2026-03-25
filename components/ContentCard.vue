<script setup lang="ts">
import type { Serialized, ContentListItem } from '@commonpub/server';

const props = defineProps<{
  item: Serialized<ContentListItem> & { isFeatured?: boolean };
}>();

const cover = computed(() => props.item.coverImageUrl);

const thumbIcons: Record<string, { icon: string; color: string }> = {
  project: { icon: 'fa-solid fa-microchip', color: 'var(--accent)' },
  article: { icon: 'fa-solid fa-file-lines', color: 'var(--teal)' },
  blog: { icon: 'fa-solid fa-pen-nib', color: 'var(--pink)' },
  explainer: { icon: 'fa-solid fa-lightbulb', color: 'var(--yellow)' },
};

const diffLabel = computed(() => {
  const d = props.item.difficulty;
  if (!d) return null;
  if (d === 'beginner') return 'Beginner';
  if (d === 'intermediate') return 'Intermediate';
  return 'Advanced';
});

const authorInitial = computed(() => {
  const name = props.item.author?.displayName || props.item.author?.username || '?';
  return name.charAt(0).toUpperCase();
});

const dateStr = computed(() => {
  const d = props.item.publishedAt || props.item.createdAt;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

function formatCount(n: number | undefined): string {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
</script>

<template>
  <article class="pcard">
    <NuxtLink :to="`/${item.type}/${item.slug}`" class="pcard__link">
      <!-- Image -->
      <div class="pcard__img" :style="cover ? {} : { background: 'var(--deveco-dark-green)' }">
        <img v-if="cover" :src="cover" :alt="item.title" class="pcard__cover" loading="lazy" />
        <template v-else>
          <div class="pcard__placeholder">
            <i :class="[thumbIcons[item.type]?.icon || 'fa-solid fa-file']" class="pcard__ph-icon" :style="{ color: thumbIcons[item.type]?.color || 'var(--accent)' }" />
          </div>
        </template>

        <!-- Badges (top-left) -->
        <div class="pcard__badges">
          <span v-if="item.isFeatured" class="pcard__badge pcard__badge--featured">Featured</span>
          <ContentTypeBadge :type="item.type" />
        </div>

        <!-- Level (top-right) -->
        <span v-if="diffLabel" class="pcard__level">{{ diffLabel }}</span>
      </div>

      <!-- Body -->
      <div class="pcard__body">
        <h3 class="pcard__title">{{ item.title }}</h3>
        <p v-if="item.description" class="pcard__excerpt">{{ item.description }}</p>

        <!-- Footer -->
        <div class="pcard__footer">
          <div v-if="item.author" class="pcard__author">
            <img v-if="item.author.avatarUrl" :src="item.author.avatarUrl" :alt="item.author.displayName || item.author.username" class="pcard__author-av" />
            <span v-else class="pcard__author-av pcard__author-av--fallback">{{ authorInitial }}</span>
            <div class="pcard__author-info">
              <span class="pcard__author-name">{{ item.author.displayName || item.author.username }}</span>
            </div>
          </div>
          <div class="pcard__stats">
            <span class="pcard__stat"><i class="fa-solid fa-eye"></i> {{ formatCount(item.viewCount) }}</span>
            <span class="pcard__stat"><i class="fa-solid fa-heart"></i> {{ formatCount(item.likeCount) }}</span>
          </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.pcard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.pcard:hover {
  border-color: var(--deveco-teal, var(--accent));
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.pcard__link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* Image */
.pcard__img {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--deveco-dark-green);
  overflow: hidden;
}

.pcard__cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pcard__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pcard__ph-icon {
  font-size: 48px;
  opacity: 0.2;
}

/* Badges */
.pcard__badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  z-index: 2;
}

.pcard__badge {
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  padding: 3px 7px;
  border-radius: 3px;
}

.pcard__badge--featured {
  background: var(--deveco-yellow, #f4c84b);
  color: var(--gray-900, #111827);
}

/* Level (difficulty) */
.pcard__level {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.5625rem;
  font-weight: 600;
  padding: 3px 7px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 3px;
  backdrop-filter: blur(4px);
  z-index: 2;
}

/* Body */
.pcard__body {
  padding: 14px;
}

.pcard__title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.35;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pcard:hover .pcard__title {
  color: var(--deveco-dark-green);
}

.pcard__excerpt {
  font-size: 0.8125rem;
  color: var(--text-dim);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

/* Footer */
.pcard__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--border2, var(--border));
}

.pcard__author {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.pcard__author-av {
  width: 26px;
  height: 26px;
  border-radius: 5px;
  object-fit: cover;
  flex-shrink: 0;
}

.pcard__author-av--fallback {
  background: linear-gradient(135deg, var(--deveco-pink, #e85a85), var(--deveco-teal, #4db3a8));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5625rem;
  font-weight: 700;
  color: #fff;
}

.pcard__author-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pcard__stats {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.pcard__stat {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.75rem;
  color: var(--text-faint);
}

.pcard__stat i {
  font-size: 11px;
}
</style>
