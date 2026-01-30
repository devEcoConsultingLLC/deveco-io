<script setup lang="ts">
useHead({ title: 'Browse Projects — devEco.io' });
// TODO: Fetch via tRPC
const projects = ref<any[]>([]);
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="font-display text-3xl font-extrabold text-foreground">Projects</h1>
      <p class="mt-2 text-muted-foreground">Discover Edge AI projects from the community</p>
    </div>

    <div class="mb-8 flex flex-wrap items-center gap-3">
      <input placeholder="Search projects..." class="rounded-md border border-input bg-background px-3 py-2 text-sm w-64" />
      <select class="rounded-md border border-input bg-background px-3 py-2 text-sm">
        <option value="">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select class="rounded-md border border-input bg-background px-3 py-2 text-sm">
        <option value="">Sort: Latest</option>
        <option value="popular">Most Popular</option>
        <option value="likes">Most Liked</option>
      </select>
    </div>

    <ProjectGrid v-if="projects.length" :projects="projects" />
    <div v-else class="text-center py-20 text-muted-foreground">
      <p class="text-lg">No projects yet.</p>
      <NuxtLink to="/projects/new" class="mt-4 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
        Create the first project
      </NuxtLink>
    </div>
  </div>
</template>
