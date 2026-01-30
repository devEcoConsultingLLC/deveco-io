<script setup lang="ts">
defineProps<{
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  projectCount?: number;
  followerCount?: number;
  followingCount?: number;
}>();
</script>

<template>
  <div class="border-b border-border bg-muted/50 py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-start gap-6">
        <AppAvatar :src="avatarUrl" :initials="(displayName || username)?.charAt(0)" size="lg" />
        <div class="flex-1">
          <h1 class="font-display text-2xl font-extrabold text-foreground">
            {{ displayName || username }}
          </h1>
          <p class="text-sm text-muted-foreground">@{{ username }}</p>
          <p v-if="bio" class="mt-2 text-sm text-muted-foreground max-w-xl">{{ bio }}</p>

          <div class="mt-4 flex items-center gap-6 text-sm">
            <span><strong class="text-foreground">{{ projectCount || 0 }}</strong> <span class="text-muted-foreground">projects</span></span>
            <span><strong class="text-foreground">{{ followerCount || 0 }}</strong> <span class="text-muted-foreground">followers</span></span>
            <span><strong class="text-foreground">{{ followingCount || 0 }}</strong> <span class="text-muted-foreground">following</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
