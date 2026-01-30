<script setup lang="ts">
defineProps<{
  title: string;
  summary?: string;
  author: { username: string; displayName?: string; avatarUrl?: string };
  difficulty?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  publishedAt?: string;
}>();
</script>

<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-brand-teal to-brand-blue py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <AppBadge v-if="difficulty" variant="secondary" class="mb-4">{{ difficulty }}</AppBadge>
        <h1 class="font-display text-3xl font-extrabold text-white sm:text-4xl">
          {{ title }}
        </h1>
        <p v-if="summary" class="mt-4 text-lg text-white/80">
          {{ summary }}
        </p>

        <!-- Author & Stats -->
        <div class="mt-6 flex items-center gap-6">
          <NuxtLink :to="`/profile/${author.username}`" class="flex items-center gap-3">
            <AppAvatar :src="author.avatarUrl" :initials="(author.displayName || author.username)?.charAt(0)" size="md" />
            <div>
              <div class="text-sm font-semibold text-white">{{ author.displayName || author.username }}</div>
              <div v-if="publishedAt" class="text-xs text-white/60">{{ new Date(publishedAt).toLocaleDateString() }}</div>
            </div>
          </NuxtLink>

          <div class="flex items-center gap-4 text-sm text-white/70">
            <span>{{ viewCount?.toLocaleString() || 0 }} views</span>
            <span>{{ likeCount || 0 }} likes</span>
            <span>{{ commentCount || 0 }} comments</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
