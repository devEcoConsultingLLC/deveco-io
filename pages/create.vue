<script setup lang="ts">
import type { ContentType } from '@commonpub/server';

useSeoMeta({ title: 'Create -- devEco.io' });
definePageMeta({ middleware: 'auth' });

const { isTypeEnabled } = useContentTypes();

const allTypes = [
  {
    type: 'project',
    icon: 'fa-solid fa-microchip',
    color: '#004e53',
    bg: 'rgba(0, 78, 83, 0.06)',
    border: 'rgba(0, 78, 83, 0.15)',
    name: 'Project',
    desc: 'Document a hardware or software build with step-by-step instructions, parts list, and build photos.',
    badge: '',
  },
  {
    type: 'article',
    icon: 'fa-solid fa-file-lines',
    color: '#5bc5e8',
    bg: 'rgba(91, 197, 232, 0.06)',
    border: 'rgba(91, 197, 232, 0.2)',
    name: 'Article',
    desc: 'Write a long-form technical article with code examples, diagrams, and rich formatting.',
  },
  {
    type: 'explainer',
    icon: 'fa-solid fa-lightbulb',
    color: '#f4c84b',
    bg: 'rgba(244, 200, 75, 0.06)',
    border: 'rgba(244, 200, 75, 0.2)',
    name: 'Explainer',
    desc: 'Create an interactive explorable explanation with sliders, quizzes, and section-by-section progression.',
  },
  {
    type: 'blog',
    icon: 'fa-solid fa-pen-nib',
    color: '#e85a85',
    bg: 'rgba(232, 90, 133, 0.06)',
    border: 'rgba(232, 90, 133, 0.15)',
    name: 'Blog Post',
    desc: 'Share thoughts, tutorials, or updates with a clean writing experience and inline media.',
  },
];

const types = computed(() => allTypes.filter(t => isTypeEnabled(t.type as ContentType)));
</script>

<template>
  <div class="de-create-page">
    <div class="de-create-header">
      <div class="de-create-eyebrow"><i class="fa-solid fa-plus"></i> New Content</div>
      <h1 class="de-create-title">What would you like to create?</h1>
      <p class="de-create-subtitle">Choose a content type to get started. You can change the format later.</p>
    </div>

    <div class="de-create-grid">
      <NuxtLink
        v-for="t in types"
        :key="t.type"
        :to="`/${t.type}/new/edit`"
        class="de-create-card"
      >
        <div class="de-create-card-icon" :style="{ color: t.color, background: t.bg, borderColor: t.border }">
          <i :class="t.icon"></i>
          <span v-if="t.badge" class="de-create-badge">{{ t.badge }}</span>
        </div>
        <div class="de-create-card-body">
          <h3 class="de-create-card-name">{{ t.name }}</h3>
          <p class="de-create-card-desc">{{ t.desc }}</p>
        </div>
        <div class="de-create-card-arrow">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.de-create-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.de-create-header {
  margin-bottom: 36px;
}

.de-create-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--deveco-dark-green);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.de-create-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--text);
}

.de-create-subtitle {
  font-size: 0.9375rem;
  color: var(--text-dim);
  line-height: 1.6;
}

.de-create-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.de-create-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.de-create-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--deveco-dark-green);
}

.de-create-card-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  border: 1px solid;
  border-radius: 14px;
  position: relative;
}

.de-create-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 2px 8px;
  background: var(--deveco-dark-green);
  color: #fff;
  border-radius: 10px;
}

.de-create-card-body {
  flex: 1;
  min-width: 0;
}

.de-create-card-name {
  font-size: 1.0625rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--text);
}

.de-create-card-desc {
  font-size: 0.8125rem;
  color: var(--text-dim);
  line-height: 1.55;
}

.de-create-card-arrow {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-faint);
  font-size: 14px;
  flex-shrink: 0;
  transition: all 0.15s;
}

.de-create-card:hover .de-create-card-arrow {
  background: var(--deveco-dark-green);
  color: #fff;
  border-color: var(--deveco-dark-green);
}

@media (max-width: 640px) {
  .de-create-page { padding: 24px 16px 48px; }
  .de-create-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .de-create-card-arrow {
    align-self: flex-end;
  }
}
</style>
