<script setup lang="ts">
useHead({ title: 'Contests — devEco.io' });

const activeTab = ref('active');
const tabs = ['active', 'upcoming', 'ended'];

// TODO: Fetch via tRPC
const contests = ref<any[]>([]);
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="font-display text-3xl font-extrabold text-foreground">Contests</h1>
      <p class="mt-2 text-muted-foreground">Compete, win prizes, and showcase your Edge AI skills</p>
    </div>

    <!-- Tabs -->
    <div class="mb-8 flex gap-2">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors"
        :class="activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div v-if="contests.length" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ContestCard v-for="contest in contests" :key="contest.slug" v-bind="contest" />
    </div>
    <div v-else class="text-center py-20 text-muted-foreground">
      <p class="text-lg">No {{ activeTab }} contests right now.</p>
      <p class="mt-2 text-sm">Check back soon for new challenges!</p>
    </div>
  </div>
</template>
