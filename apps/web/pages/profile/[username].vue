<script setup lang="ts">
const route = useRoute();
const username = route.params.username as string;

useHead({ title: `@${username} — devEco.io` });

// TODO: Fetch via tRPC
</script>

<template>
  <div>
    <ProfileHero
      :username="username"
      :display-name="username"
      bio="Edge AI enthusiast and maker."
      :project-count="5"
      :follower-count="42"
      :following-count="18"
    />

    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6 flex gap-4 border-b border-border">
        <button class="border-b-2 border-primary px-4 py-3 text-sm font-medium text-primary">Projects</button>
        <button class="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Followers</button>
        <button class="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Following</button>
      </div>

      <div class="text-center py-12 text-muted-foreground">
        <p>User's projects will appear here.</p>
      </div>
    </div>
  </div>
</template>
