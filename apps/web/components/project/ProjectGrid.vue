<script setup lang="ts">
defineProps<{
  projects: Array<{
    slug: string;
    title: string;
    summary?: string;
    coverImageUrl?: string;
    author: { username: string; displayName?: string; avatarUrl?: string };
    difficulty?: string;
    likeCount?: number;
    viewCount?: number;
    commentCount?: number;
  }>;
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <ProjectCard
      v-for="project in projects"
      :key="project.slug"
      v-bind="project"
    />
  </div>
</template>
