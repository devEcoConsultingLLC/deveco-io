<script setup lang="ts">
import type { Serialized, ContentListItem, PaginatedResponse } from '@commonpub/server';

useSeoMeta({
  title: 'devEco.io | Edge AI Projects & Hardware Community',
  description: 'The open platform for Edge AI projects, hardware, and communities. Share your builds, discover optimized models, and connect with developers pushing intelligence to the edge.',
});

const { user: authUser } = useAuth();
const { hubs: hubsEnabled, contests: contestsEnabled } = useFeatures();
const { enabledTypeMeta } = useContentTypes();

const activeTab = ref(authUser.value ? 'foryou' : 'latest');
const tabs = computed(() => [
  { value: 'foryou', label: 'For You', icon: 'fa-solid fa-sparkles' },
  { value: 'latest', label: 'Latest', icon: 'fa-solid fa-clock' },
  { value: 'following', label: 'Following', icon: 'fa-solid fa-user-group' },
  ...enabledTypeMeta.value.map(ct => ({ value: ct.type, label: ct.plural, icon: ct.icon })),
]);

const user = authUser;

const contentQuery = computed(() => ({
  status: 'published',
  type: ['foryou', 'latest', 'following'].includes(activeTab.value) ? undefined : activeTab.value,
  sort: activeTab.value === 'latest' ? 'recent' : activeTab.value === 'following' ? 'recent' : 'popular',
  ...(activeTab.value === 'following' && user.value?.id ? { followedBy: user.value.id } : {}),
  limit: 12,
}));

const { data: feed } = await useFetch<PaginatedResponse<Serialized<ContentListItem>>>('/api/content', {
  query: contentQuery,
  watch: [contentQuery],
});

const { data: featured } = await useFetch<PaginatedResponse<Serialized<ContentListItem>>>('/api/content', {
  query: { status: 'published', sort: 'popular', limit: 1 },
});

const { data: stats } = await useFetch('/api/stats');

const { data: communities } = await useFetch('/api/hubs', {
  query: { limit: 4 },
});

const { data: contests } = await useFetch('/api/contests', {
  query: { limit: 3 },
});

const heroDismissed = ref(false);
const joinedHubs = ref(new Set<string>());

const activeContest = computed(() => {
  const items = contests.value?.items;
  return items?.find((c) => c.status === 'active') ?? null;
});

const isAuthenticated = computed(() => !!user.value);
const toast = useToast();

const feedOffset = ref(0);
const loadingMore = ref(false);
const allLoaded = ref(false);

async function loadMore(): Promise<void> {
  loadingMore.value = true;
  try {
    const nextOffset = (feed.value?.items?.length ?? 0);
    const more = await $fetch<{ items: Array<Record<string, unknown>> }>('/api/content', {
      query: {
        ...contentQuery.value,
        offset: nextOffset,
      },
    });
    if (more.items?.length) {
      if (feed.value?.items) {
        feed.value.items.push(...(more.items as typeof feed.value.items));
      }
    }
    if (!more.items?.length || more.items.length < 12) {
      allLoaded.value = true;
    }
  } catch {
    toast.error('Failed to load more');
  } finally {
    loadingMore.value = false;
  }
}

watch(activeTab, () => { allLoaded.value = false; });

async function handleHubJoin(hubSlug: string): Promise<void> {
  if (!isAuthenticated.value) {
    await navigateTo(`/auth/login?redirect=/`);
    return;
  }
  try {
    await $fetch(`/api/hubs/${hubSlug}/join`, { method: 'POST' });
    joinedHubs.value.add(hubSlug);
    toast.success('Joined community!');
  } catch {
    toast.error('Failed to join community');
  }
}
</script>

<template>
  <div>
    <!-- Hero Banner -->
    <section v-if="!heroDismissed" class="de-hero">
      <div class="de-hero-bg" />
      <button class="de-hero-dismiss" title="Dismiss" @click="heroDismissed = true">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="de-hero-inner">
        <div class="de-hero-content">
          <template v-if="contestsEnabled && activeContest">
            <div class="de-hero-eyebrow">
              <span class="de-badge de-badge-live"><span class="de-live-dot" /> Live Contest</span>
              <span class="de-badge">{{ activeContest.entryCount ?? 0 }} entries</span>
            </div>
            <h1 class="de-hero-title">{{ activeContest.title }}</h1>
            <p v-if="activeContest.description" class="de-hero-excerpt">{{ activeContest.description }}</p>
            <div class="de-hero-actions">
              <NuxtLink :to="`/contests/${activeContest.slug}`" class="de-btn de-btn-accent"><i class="fa-solid fa-trophy"></i> Enter Contest</NuxtLink>
              <NuxtLink :to="`/contests/${activeContest.slug}`" class="de-btn de-btn-outline"><i class="fa-solid fa-circle-info"></i> View Details</NuxtLink>
            </div>
            <div class="de-hero-meta">
              <span class="de-hero-stat"><i class="fa-solid fa-users"></i> <strong>{{ activeContest.entryCount ?? 0 }}</strong> entries</span>
              <span v-if="activeContest.endDate" class="de-hero-stat"><i class="fa-solid fa-calendar"></i> Ends <strong>{{ new Date(activeContest.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</strong></span>
            </div>
          </template>
          <template v-else>
            <div class="de-hero-eyebrow"><span class="de-eyebrow-line" /> Open Platform for Edge AI</div>
            <h1 class="de-hero-title">
              Build <span>Edge AI</span> Projects That Matter
            </h1>
            <p class="de-hero-excerpt">
              The open platform for Edge AI projects, hardware, and communities. Share your builds, discover optimized models, and connect with developers pushing intelligence to the edge.
            </p>
            <div class="de-hero-actions">
              <NuxtLink to="/explore" class="de-btn de-btn-accent">
                <i class="fa-solid fa-magnifying-glass"></i> Explore Projects
              </NuxtLink>
              <NuxtLink to="/create" class="de-btn de-btn-outline">
                <i class="fa-solid fa-plus"></i> Start Building
              </NuxtLink>
            </div>
            <div class="de-hero-stats">
              <div class="de-hero-stat-block">
                <span class="de-hero-stat-value">{{ stats?.content?.byType?.project ?? 0 }}</span>
                <span class="de-hero-stat-label">Projects</span>
              </div>
              <div class="de-hero-stat-block">
                <span class="de-hero-stat-value">{{ stats?.users?.total ?? 0 }}</span>
                <span class="de-hero-stat-label">Members</span>
              </div>
              <div class="de-hero-stat-block">
                <span class="de-hero-stat-value">{{ stats?.hubs?.total ?? 0 }}</span>
                <span class="de-hero-stat-label">Communities</span>
              </div>
            </div>
          </template>
        </div>
        <div class="de-hero-visual">
          <DevEcoLogo variant="dark-bg" size="lg" :show-text="false" />
        </div>
      </div>
    </section>

    <!-- Tabs Bar -->
    <div class="de-tabs-bar">
      <div class="de-tabs-inner">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="de-tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="de-main-layout">
      <main class="de-feed-col">
        <!-- Featured card -->
        <article v-if="featured?.items?.length && activeTab === 'foryou'" class="de-featured-card">
          <div class="de-featured-thumb">
            <i class="de-thumb-icon fa-solid fa-microchip" />
            <div class="de-thumb-overlay">
              <div class="de-thumb-badges">
                <span class="de-badge de-badge-featured">Featured</span>
                <ContentTypeBadge :type="featured.items[0].type" />
              </div>
            </div>
          </div>
          <div class="de-featured-body">
            <h2 class="de-featured-title">
              <NuxtLink :to="`/${featured.items[0].type}/${featured.items[0].slug}`">
                {{ featured.items[0].title }}
              </NuxtLink>
            </h2>
            <p v-if="featured.items[0].description" class="de-featured-excerpt">
              {{ featured.items[0].description }}
            </p>
            <div class="de-card-author-row">
              <AuthorRow :author="featured.items[0].author" :date="featured.items[0].publishedAt || featured.items[0].createdAt" />
              <div class="de-card-stats">
                <span class="de-stat-item"><i class="fa-solid fa-heart"></i> {{ featured.items[0].likeCount ?? 0 }}</span>
                <span class="de-stat-item"><i class="fa-solid fa-comment"></i> {{ featured.items[0].commentCount ?? 0 }}</span>
              </div>
            </div>
          </div>
        </article>

        <!-- Content grid -->
        <div v-if="feed?.items?.length" class="de-content-grid">
          <ContentCard v-for="item in feed.items" :key="item.id" :item="item" />
        </div>
        <div v-else class="de-empty-state">
          <div class="de-empty-state-icon"><i :class="activeTab === 'following' ? 'fa-solid fa-user-group' : 'fa-solid fa-inbox'"></i></div>
          <template v-if="activeTab === 'following' && !isAuthenticated">
            <p class="de-empty-title">Sign in to see your feed</p>
            <p class="de-empty-desc">Follow creators to see their content here.</p>
            <NuxtLink to="/auth/login" class="de-btn de-btn-accent" style="margin-top: 12px;">Sign In</NuxtLink>
          </template>
          <template v-else-if="activeTab === 'following'">
            <p class="de-empty-title">No posts from people you follow</p>
            <p class="de-empty-desc">Follow some creators to fill up your feed.</p>
            <NuxtLink to="/explore" class="de-btn de-btn-outline" style="margin-top: 12px;"><i class="fa-solid fa-compass"></i> Explore</NuxtLink>
          </template>
          <template v-else>
            <p class="de-empty-title">No content yet</p>
            <p class="de-empty-desc">Be the first to create something.</p>
          </template>
        </div>

        <div v-if="!allLoaded && feed?.items?.length" class="de-load-more-row">
          <button class="de-btn-load-more" :disabled="loadingMore" @click="loadMore">
            <i :class="loadingMore ? 'fa-solid fa-circle-notch fa-spin' : 'fa-solid fa-rotate'"></i>
            {{ loadingMore ? 'Loading...' : 'Load more' }}
          </button>
        </div>
      </main>

      <!-- Sidebar -->
      <aside class="de-sidebar">
        <!-- Platform Stats -->
        <!-- Active Contests -->
        <div v-if="contestsEnabled && contests?.items?.length" class="de-sb-card">
          <div class="de-sb-head">Active Contests <NuxtLink to="/contests">View all</NuxtLink></div>
          <div v-for="c in contests.items" :key="c.id" class="de-contest-item">
            <NuxtLink :to="`/contests/${c.slug}`" class="de-contest-name">{{ c.title }}</NuxtLink>
            <div class="de-contest-row">
              <span class="de-contest-entries">{{ c.entryCount ?? 0 }} entries</span>
              <span v-if="c.endDate" class="de-contest-deadline">
                <i class="fa-regular fa-clock"></i> {{ Math.max(0, Math.ceil((new Date(c.endDate).getTime() - Date.now()) / 86400000)) }}d left
              </span>
            </div>
            <NuxtLink :to="`/contests/${c.slug}`" class="de-btn-enter">Enter Contest</NuxtLink>
          </div>
        </div>

        <!-- Trending Communities -->
        <div v-if="hubsEnabled && communities?.items?.length" class="de-sb-card">
          <div class="de-sb-head">Trending Communities <NuxtLink to="/hubs">Browse</NuxtLink></div>
          <div v-for="hub in communities.items" :key="hub.id" class="de-hub-item">
            <div class="de-hub-icon">
              <i class="fa-solid fa-users"></i>
            </div>
            <div class="de-hub-info">
              <NuxtLink :to="`/hubs/${hub.slug}`" class="de-hub-name">{{ hub.name }}</NuxtLink>
              <div class="de-hub-members">{{ hub.memberCount ?? 0 }} members</div>
            </div>
            <button v-if="joinedHubs.has(hub.slug)" class="de-btn-joined" disabled><i class="fa-solid fa-check"></i> Joined</button>
            <button v-else class="de-btn-join" @click.prevent="handleHubJoin(hub.slug)">Join</button>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="de-sb-card">
          <div class="de-sb-head">Explore</div>
          <div class="de-tag-cloud">
            <NuxtLink v-for="ct in enabledTypeMeta" :key="ct.type" :to="ct.route" class="de-trending-tag">{{ ct.plural }}</NuxtLink>
          </div>
        </div>

        <!-- Powered badge -->
        <div class="de-powered-badge">
          <span class="de-cpub-mark"><span class="de-cpub-bracket">[</span>C<span class="de-cpub-bracket">]</span></span>
          <span class="de-powered-text">Powered by <a href="https://github.com/commonpub/commonpub" target="_blank" rel="noopener">CommonPub</a></span>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* ---- HERO ---- */
.de-hero {
  position: relative;
  background: linear-gradient(135deg, var(--deveco-dark-green), var(--deveco-dark-blue, #1b357d));
  overflow: hidden;
  min-height: 240px;
  display: flex;
  align-items: stretch;
}

.de-hero-bg {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(0, 231, 173, 0.15), transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(91, 197, 232, 0.1), transparent 50%);
}

.de-hero-dismiss {
  position: absolute; top: 16px; right: 20px;
  background: rgba(255, 255, 255, 0.1); border: none; border-radius: 8px;
  color: rgba(255, 255, 255, 0.5); font-size: 14px; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 2; transition: background 0.15s;
}
.de-hero-dismiss:hover { background: rgba(255, 255, 255, 0.2); color: #fff; }

.de-hero-content { flex: 1; min-width: 0; }

.de-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px;
  font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--accent);
}
.de-eyebrow-line { width: 20px; height: 2px; background: var(--accent); }

.de-badge {
  font-size: 0.6875rem; font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase;
  padding: 4px 12px; border-radius: 20px;
  background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

.de-badge-live {
  background: rgba(0, 231, 173, 0.15); border-color: rgba(0, 231, 173, 0.3);
  color: var(--accent); display: flex; align-items: center; gap: 6px;
}

.de-badge-featured {
  background: rgba(244, 200, 75, 0.1); border: 1px solid rgba(244, 200, 75, 0.3);
  color: var(--yellow); font-size: 0.6875rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em;
  padding: 4px 10px; border-radius: 6px;
}

.de-live-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
  animation: de-pulse 2s ease-in-out infinite;
}

@keyframes de-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.de-hero-title {
  font-family: var(--font-display); font-size: 2.75rem; font-weight: 800;
  line-height: 1.1; margin-bottom: 16px; color: #fff;
}
.de-hero-title span {
  background: linear-gradient(90deg, var(--accent), #42fffe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.de-hero-excerpt {
  font-size: 1rem; color: rgba(255, 255, 255, 0.7);
  line-height: 1.6; margin-bottom: 24px; max-width: 560px;
}

.de-hero-actions { display: flex; gap: 12px; margin-bottom: 32px; }

.de-hero-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 24px; padding-top: 24px;
  border-top: 1px solid rgba(0, 231, 173, 0.1);
}
.de-hero-stat-value {
  font-family: var(--font-display); font-size: 1.5rem;
  font-weight: 800; color: #fff; display: block;
}
.de-hero-stat-label {
  font-size: 0.6875rem; font-weight: 600;
  color: rgba(255, 255, 255, 0.4); text-transform: uppercase;
  letter-spacing: 0.05em;
}

.de-hero-visual {
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
}
.de-hero-visual :deep(svg) {
  height: 280px !important; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.3));
}

.de-hero-inner {
  position: relative; z-index: 1;
  max-width: 1280px; margin: 0 auto; padding: 56px 32px;
  width: 100%; display: grid; grid-template-columns: 1fr 320px;
  gap: 48px; align-items: center;
}

.de-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; font-size: 0.875rem; font-weight: 600;
  border-radius: 8px; border: none; cursor: pointer;
  text-decoration: none; transition: all 0.15s;
}

.de-btn-accent {
  background: var(--accent); color: var(--deveco-dark-green);
}
.de-btn-accent:hover { background: #00d49f; box-shadow: 0 4px 14px rgba(0, 231, 173, 0.35); }

.de-btn-outline {
  background: rgba(255, 255, 255, 0.1); color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.de-btn-outline:hover { background: rgba(255, 255, 255, 0.2); }

.de-hero-meta {
  display: flex; align-items: center; gap: 24px; margin-top: 20px;
}

.de-hero-stat {
  font-size: 0.8125rem; color: rgba(255, 255, 255, 0.5);
  display: flex; align-items: center; gap: 6px;
}
.de-hero-stat strong { color: rgba(255, 255, 255, 0.8); }

.de-hero-aside { flex-shrink: 0; }

/* ---- TABS ---- */
.de-tabs-bar {
  position: sticky; top: 60px;
  background: var(--surface); border-bottom: 1px solid var(--border);
  z-index: 90; padding: 0 32px;
}

.de-tabs-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: flex-end; gap: 0;
  overflow-x: auto; scrollbar-width: none;
}
.de-tabs-inner::-webkit-scrollbar { display: none; }

.de-tab {
  font-size: 0.8125rem; font-weight: 500;
  color: var(--text-faint); padding: 12px 18px;
  border-bottom: 2px solid transparent; white-space: nowrap;
  background: none; border-top: none; border-left: none; border-right: none;
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.de-tab:hover { color: var(--text-dim); }
.de-tab.active { color: var(--deveco-dark-green); border-bottom-color: var(--deveco-dark-green); font-weight: 600; }

/* ---- MAIN LAYOUT ---- */
.de-main-layout {
  max-width: 1280px; margin: 0 auto; padding: 28px 32px 48px;
  display: grid; grid-template-columns: 1fr 320px; gap: 36px;
  align-items: start;
}

.de-feed-col { min-width: 0; }

/* ---- FEATURED CARD ---- */
.de-featured-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden; margin-bottom: 24px;
  box-shadow: var(--shadow-md); transition: box-shadow 0.2s;
}
.de-featured-card:hover { box-shadow: var(--shadow-lg); }

.de-featured-thumb {
  height: 220px; background: linear-gradient(135deg, var(--deveco-dark-green), var(--deveco-dark-blue, #1b357d));
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.de-featured-thumb::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.3) 100%);
}

.de-thumb-icon {
  position: relative; z-index: 1; font-size: 48px;
  opacity: 0.15; color: var(--accent);
}

.de-thumb-overlay {
  position: absolute; bottom: 14px; left: 16px; right: 16px;
  z-index: 2; display: flex; align-items: flex-end; justify-content: space-between;
}
.de-thumb-badges { display: flex; gap: 6px; }

.de-featured-body { padding: 20px 24px 18px; }
.de-featured-title { font-size: 1.125rem; font-weight: 700; line-height: 1.3; margin-bottom: 8px; }
.de-featured-title a { color: var(--text); text-decoration: none; }
.de-featured-title a:hover { color: var(--deveco-dark-green); }
.de-featured-excerpt { font-size: 0.8125rem; color: var(--text-dim); line-height: 1.6; margin-bottom: 14px; }

.de-card-author-row { display: flex; align-items: center; gap: 8px; }
.de-card-stats { display: flex; align-items: center; gap: 14px; margin-left: auto; }
.de-stat-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.75rem; color: var(--text-faint);
}
.de-stat-item i { font-size: 11px; }

/* ---- CONTENT GRID ---- */
.de-content-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px; margin-bottom: 24px;
}

/* ---- EMPTY STATE ---- */
.de-empty-state {
  text-align: center; padding: 48px 24px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px;
}
.de-empty-state-icon { font-size: 32px; color: var(--text-faint); margin-bottom: 16px; }
.de-empty-title { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.de-empty-desc { font-size: 0.8125rem; color: var(--text-dim); }

/* ---- LOAD MORE ---- */
.de-load-more-row { display: flex; justify-content: center; padding: 12px 0; }
.de-btn-load-more {
  padding: 10px 28px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text-dim); font-size: 0.8125rem; font-weight: 500;
  display: flex; align-items: center; gap: 8px; transition: all 0.15s; cursor: pointer;
}
.de-btn-load-more:hover { background: var(--surface2); color: var(--text); box-shadow: var(--shadow-sm); }

/* ---- SIDEBAR ---- */
.de-sidebar { min-width: 0; display: flex; flex-direction: column; gap: 20px; }

.de-sb-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px;
}

.de-sb-head {
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--text-faint);
  padding-bottom: 12px; border-bottom: 1px solid var(--border);
  margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;
}
.de-sb-head a {
  font-size: 0.75rem; color: var(--deveco-dark-green); font-weight: 500;
  text-transform: none; letter-spacing: 0; text-decoration: none;
}
.de-sb-head a:hover { text-decoration: underline; }

/* Contest items */
.de-contest-item { padding: 12px 0; border-bottom: 1px solid var(--border); }
.de-contest-item:last-child { border-bottom: none; padding-bottom: 0; }
.de-contest-item:first-child { padding-top: 0; }
.de-contest-name { font-size: 0.8125rem; font-weight: 600; color: var(--text); margin-bottom: 6px; line-height: 1.35; display: block; text-decoration: none; }
.de-contest-name:hover { color: var(--deveco-dark-green); }
.de-contest-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.de-contest-entries { font-size: 0.6875rem; color: var(--text-faint); }
.de-contest-deadline { font-size: 0.6875rem; color: var(--text-faint); display: flex; align-items: center; gap: 4px; margin-left: auto; }
.de-btn-enter {
  width: 100%; padding: 8px; background: rgba(0, 78, 83, 0.06);
  border: 1px solid var(--deveco-dark-green); border-radius: 8px;
  color: var(--deveco-dark-green); font-size: 0.75rem; font-weight: 600;
  text-align: center; text-decoration: none; display: block;
  transition: all 0.15s; cursor: pointer;
}
.de-btn-enter:hover { background: var(--deveco-dark-green); color: #fff; }

/* Hub items */
.de-hub-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.de-hub-item:last-child { border-bottom: none; padding-bottom: 0; }
.de-hub-item:first-child { padding-top: 0; }
.de-hub-icon {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0; border-radius: 10px;
  border: 1px solid var(--teal); background: var(--teal-bg); color: var(--teal);
}
.de-hub-info { flex: 1; min-width: 0; }
.de-hub-name { font-size: 0.8125rem; font-weight: 600; color: var(--text); margin-bottom: 2px; display: block; text-decoration: none; }
.de-hub-name:hover { color: var(--deveco-dark-green); }
.de-hub-members { font-size: 0.6875rem; color: var(--text-faint); }

.de-btn-join {
  padding: 5px 14px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 6px; color: var(--text-dim); font-size: 0.75rem; font-weight: 500;
  flex-shrink: 0; transition: all 0.15s; cursor: pointer;
}
.de-btn-join:hover { border-color: var(--deveco-dark-green); color: var(--deveco-dark-green); }

.de-btn-joined {
  padding: 5px 14px; background: var(--green-bg); border: 1px solid var(--green-border);
  border-radius: 6px; color: var(--green); font-size: 0.75rem; font-weight: 500;
  flex-shrink: 0; display: flex; align-items: center; gap: 4px; cursor: default;
}

/* Powered badge */
.de-powered-badge {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px;
}
.de-cpub-mark {
  font-family: var(--font-mono); font-size: 0.875rem; font-weight: 700;
  color: var(--text-dim);
}
.de-cpub-bracket { color: var(--accent); }
.de-powered-text { font-size: 0.75rem; color: var(--text-faint); }
.de-powered-text a { color: var(--deveco-dark-green); text-decoration: none; }
.de-powered-text a:hover { text-decoration: underline; }

/* ---- TRENDING TAGS ---- */
.de-tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
.de-trending-tag {
  font-size: 0.75rem; font-weight: 500; padding: 5px 14px;
  border: 1px solid var(--border); border-radius: 20px;
  background: var(--surface2); color: var(--text-dim);
  text-decoration: none; transition: all 0.12s;
}
.de-trending-tag:hover { border-color: var(--deveco-dark-green); color: var(--deveco-dark-green); background: rgba(0, 78, 83, 0.04); }

/* ---- RESPONSIVE ---- */
@media (max-width: 1024px) {
  .de-main-layout { grid-template-columns: 1fr; }
  .de-hero-inner { grid-template-columns: 1fr; }
  .de-hero-visual { display: none; }
}

@media (max-width: 640px) {
  .de-content-grid { grid-template-columns: 1fr; }
  .de-hero-inner { padding: 32px 16px; }
  .de-main-layout { padding: 16px; }
  .de-hero-title { font-size: 1.5rem; }
}
</style>
