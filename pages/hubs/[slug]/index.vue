<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

import type { Serialized, HubDetail, HubPostItem, HubMemberItem, PaginatedResponse, ContentListItem } from '@commonpub/server';

const { data: hub, pending: hubPending, error: hubError, refresh: refreshHub } = useLazyFetch<Serialized<HubDetail>>(() => `/api/hubs/${slug.value}`);
const { data: posts, refresh: refreshPosts } = useLazyFetch<Serialized<PaginatedResponse<HubPostItem>>>(() => `/api/hubs/${slug.value}/posts`, { default: () => ({ items: [], total: 0 }) });
const { data: membersData } = useLazyFetch<{ items: Serialized<HubMemberItem>[]; total: number }>(() => `/api/hubs/${slug.value}/members`);
const members = computed(() => membersData.value?.items ?? []);

const { data: gallery, refresh: refreshGallery } = useLazyFetch<PaginatedResponse<Serialized<ContentListItem>>>(() => `/api/hubs/${slug.value}/gallery`, { default: () => ({ items: [], total: 0 }) });

// Hub type
const hubType = computed(() => hub.value?.hubType ?? 'community');
const isProductHub = computed(() => hubType.value === 'product');
const isCompanyHub = computed(() => hubType.value === 'company');

const { data: products } = useLazyFetch<{ items: Array<{ id: string; name: string; description: string | null; imageUrl: string | null; category: string | null; status: string }>; total: number }>(
  () => `/api/hubs/${slug.value}/products`,
  { default: () => ({ items: [], total: 0 }), immediate: isCompanyHub.value },
);

useSeoMeta({
  title: () => hub.value ? `${hub.value.name} -- devEco.io` : 'Hub -- devEco.io',
  description: () => hub.value?.description || '',
  ogImage: '/og-default.png',
});

const { isAuthenticated, user: authUser } = useAuth();
const hubTypeVal = hub.value?.hubType as string | undefined;
const initialTab = hubTypeVal === 'community' || !hubTypeVal ? 'feed' : 'overview';
const activeTab = ref(initialTab);

const tabDefs = computed(() => {
  if (isProductHub.value) {
    return [
      { value: 'overview', label: 'Overview', icon: 'fa-solid fa-info-circle' },
      { value: 'projects', label: 'Projects Using This', icon: 'fa-solid fa-folder-open', count: gallery.value?.total },
      { value: 'discussions', label: 'Discussions', icon: 'fa-solid fa-comments' },
    ];
  }
  if (isCompanyHub.value) {
    return [
      { value: 'overview', label: 'Overview', icon: 'fa-solid fa-building' },
      { value: 'products', label: 'Products', icon: 'fa-solid fa-microchip', count: products.value?.total },
      { value: 'projects', label: 'Projects', icon: 'fa-solid fa-folder-open', count: gallery.value?.total },
      { value: 'discussions', label: 'Discussions', icon: 'fa-solid fa-comments' },
    ];
  }
  return [
    { value: 'feed', label: 'Feed', icon: 'fa-solid fa-rss', count: hub.value?.postCount },
    { value: 'projects', label: 'Projects', icon: 'fa-solid fa-folder-open', count: gallery.value?.total },
    { value: 'discussions', label: 'Discussions', icon: 'fa-solid fa-comments' },
    { value: 'members', label: 'Members', icon: 'fa-solid fa-users', count: hub.value?.memberCount },
  ];
});

const toast = useToast();

async function handleJoin(): Promise<void> {
  if (!isAuthenticated.value) {
    await navigateTo(`/auth/login?redirect=/hubs/${slug.value}`);
    return;
  }
  try {
    await $fetch(`/api/hubs/${slug.value}/join`, { method: 'POST' });
    toast.success('Joined hub!');
    await refreshHub();
  } catch {
    toast.error('Failed to join hub');
  }
}

async function handleShare(): Promise<void> {
  const url = `${window.location.origin}/hubs/${slug.value}`;
  if (navigator.share) {
    await navigator.share({ title: hub.value?.name || 'Hub', url }).catch(() => {});
  } else {
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  }
}

async function onPostCreated(): Promise<void> {
  await Promise.all([refreshHub(), refreshPosts()]);
}

async function onRefreshGallery(): Promise<void> {
  await Promise.all([refreshGallery(), refreshPosts(), refreshHub()]);
}
</script>

<template>
  <div v-if="hubPending" class="cpub-loading">Loading hub...</div>
  <div v-else-if="hubError" class="cpub-fetch-error">
    <div class="cpub-fetch-error-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
    <div class="cpub-fetch-error-msg">Failed to load hub.</div>
    <button class="cpub-btn cpub-btn-sm" @click="refreshHub()">Retry</button>
  </div>
  <div v-else-if="hub" class="cpub-hub-page">
    <!-- Hero -->
    <HubHero
      :hub="hub"
      :gallery-total="gallery?.total"
      :is-authenticated="isAuthenticated"
      @join="handleJoin"
      @share="handleShare"
    />

    <!-- Tabs -->
    <div class="cpub-hub-tabs">
      <div class="cpub-tabs-inner">
        <button
          v-for="tab in tabDefs"
          :key="tab.value"
          class="cpub-tab-btn"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          <i :class="tab.icon" style="font-size: 10px"></i>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="cpub-hub-main">
      <div class="cpub-hub-layout">
        <main>
          <!-- Feed tab -->
          <HubFeed
            v-if="activeTab === 'feed'"
            :slug="slug"
            :posts="posts?.items ?? []"
            :is-authenticated="isAuthenticated"
            @post-created="onPostCreated"
          />

          <!-- Discussions tab -->
          <HubDiscussions
            v-else-if="activeTab === 'discussions'"
            :slug="slug"
            :posts="posts?.items ?? []"
            :is-authenticated="isAuthenticated"
            @post-created="onPostCreated"
          />

          <!-- Members tab -->
          <HubMembers
            v-else-if="activeTab === 'members'"
            :members="members"
          />

          <!-- Overview tab -->
          <template v-else-if="activeTab === 'overview'">
            <div class="cpub-product-overview">
              <h3 class="cpub-section-title">{{ isProductHub ? 'About This Product' : 'About' }}</h3>
              <p class="cpub-prose-p">{{ hub.description || 'No description available.' }}</p>
              <div v-if="hub.website" class="cpub-meta-link">
                <i class="fa-solid fa-link"></i>
                <a :href="hub.website" target="_blank" rel="noopener">{{ hub.website }}</a>
              </div>
            </div>
          </template>

          <!-- Projects tab -->
          <HubProjects
            v-else-if="activeTab === 'projects'"
            :slug="slug"
            :gallery="gallery"
            :is-authenticated="isAuthenticated"
            :current-user-role="hub.currentUserRole ?? null"
            :is-product-hub="isProductHub"
            :auth-user-id="authUser?.id"
            @refresh-gallery="onRefreshGallery"
          />

          <!-- Products tab -->
          <HubProducts
            v-else-if="activeTab === 'products'"
            :products="products"
          />

          <!-- Generic empty -->
          <template v-else>
            <div class="cpub-empty-state">
              <div class="cpub-empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
              <p class="cpub-empty-state-title">Coming soon</p>
            </div>
          </template>
        </main>

        <!-- Sidebar -->
        <HubSidebar :hub="hub" :members="members" />
      </div>
    </div>
  </div>
  <div v-else class="cpub-empty-state" style="padding: 64px 24px">
    <p class="cpub-empty-state-title">Hub not found</p>
  </div>
</template>

<style scoped>
/* Tabs */
.cpub-hub-tabs {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 48px;
  z-index: 90;
}

.cpub-tabs-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  gap: 4px;
}

.cpub-tab-btn {
  font-size: 0.8125rem;
  color: var(--text-dim);
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  top: 1px;
  transition: color 0.15s;
}

.cpub-tab-btn:hover { color: var(--text); }
.cpub-tab-btn.active { color: var(--deveco-dark-green); border-bottom-color: var(--deveco-light-green); font-weight: 600; }

/* Layout */
.cpub-hub-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 32px;
}

.cpub-hub-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  align-items: start;
}

/* Overview */
.cpub-product-overview { max-width: 720px; }

.cpub-section-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-dim);
}

.cpub-prose-p {
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.7;
  margin-bottom: 16px;
}

.cpub-meta-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-faint);
}
.cpub-meta-link a { color: var(--accent); text-decoration: none; }
.cpub-meta-link a:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 1024px) {
  .cpub-hub-layout { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .cpub-hub-main { padding: 16px; }
  .cpub-tabs-inner { padding: 0 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .cpub-tab-btn { white-space: nowrap; flex-shrink: 0; }
}
</style>
