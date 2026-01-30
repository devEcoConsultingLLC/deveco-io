<script setup lang="ts">
defineProps<{
  slug: string;
  title: string;
  summary?: string;
  coverImageUrl?: string;
  author: { username: string; displayName?: string; avatarUrl?: string };
  difficulty?: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
  tags?: string[];
}>();
</script>

<template>
  <NuxtLink :to="`/projects/${slug}`" class="group block">
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <!-- Cover Image -->
      <div class="aspect-video bg-muted overflow-hidden">
        <img
          v-if="coverImageUrl"
          :src="coverImageUrl"
          :alt="title"
          class="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-brand-dark to-brand-dark-blue">
          <DevEcoLogoAnimated animation="breathe" size="sm" />
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <h3 class="text-sm font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {{ title }}
        </h3>
        <p v-if="summary" class="mt-1 text-xs text-muted-foreground line-clamp-2">
          {{ summary }}
        </p>

        <!-- Author -->
        <div class="mt-3 flex items-center gap-2">
          <AppAvatar :src="author.avatarUrl" :initials="(author.displayName || author.username)?.charAt(0)" size="sm" />
          <span class="text-xs text-muted-foreground">{{ author.displayName || author.username }}</span>
        </div>

        <!-- Stats -->
        <div class="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            {{ likeCount || 0 }}
          </span>
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            {{ viewCount || 0 }}
          </span>
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            {{ commentCount || 0 }}
          </span>
        </div>

        <!-- Tags -->
        <div v-if="tags?.length" class="mt-3 flex flex-wrap gap-1">
          <AppTag v-for="tag in tags.slice(0, 3)" :key="tag" :label="tag" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
