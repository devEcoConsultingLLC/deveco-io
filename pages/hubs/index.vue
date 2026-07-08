<script setup lang="ts">
useSeoMeta({
  title: 'Communities -- devEco.io',
  description: 'Browse and join edge AI communities.',
});

const { data } = await useFetch('/api/hubs');
const { data: featuredData } = await useFetch('/api/hubs/featured');
const { isAuthenticated } = useAuth();
const { featuredHub: featuredEnabled } = useFeatures();

// Operator-chosen featured hub, rendered as a full-width hero above the grid and
// excluded from the grid so it isn't shown twice. Endpoint returns null when the
// featuredHub feature is off.
const featured = computed(() => (featuredEnabled.value ? featuredData.value?.featured ?? null : null));
const hubs = computed(() =>
  (data.value?.items ?? []).filter((h: { id: string }) => h.id !== featured.value?.id),
);

function isFederated(hub: Record<string, unknown>): boolean {
  return (hub as { source?: string }).source === 'federated';
}

function hubLink(hub: Record<string, unknown>): string {
  if (isFederated(hub)) {
    return `/federated-hubs/${hub.id}`;
  }
  return `/hubs/${hub.slug}`;
}
</script>

<template>
  <div class="de-hubs-page">
    <div class="de-hubs-header">
      <div>
        <h1 class="de-hubs-title">Communities</h1>
        <p class="de-hubs-desc">Groups, products, and organizations on devEco.io</p>
      </div>
      <NuxtLink v-if="isAuthenticated" to="/hubs/create" class="de-btn-create">
        <i class="fa-solid fa-plus"></i> Create Hub
      </NuxtLink>
    </div>

    <NuxtLink
      v-if="featured"
      :to="`/hubs/${featured.slug}`"
      class="de-hub-featured"
      :aria-label="`Featured community: ${featured.name}`"
    >
      <div class="de-hub-featured-banner" :class="{ 'has-banner': featured.bannerUrl }" :style="featured.bannerUrl ? { '--banner-img': `url(${featured.bannerUrl})` } : {}">
        <span class="de-hub-featured-badge"><i class="fa-solid fa-star"></i> Featured</span>
      </div>
      <div class="de-hub-featured-body">
        <div class="de-hub-featured-icon">
          <img v-if="featured.iconUrl" :src="featured.iconUrl" :alt="featured.name" />
          <i v-else class="fa-solid fa-users"></i>
        </div>
        <div class="de-hub-featured-info">
          <div class="de-hub-featured-top">
            <h2 class="de-hub-featured-name">{{ featured.name }}</h2>
            <span class="de-hub-card-type">{{ featured.hubType ?? 'community' }}</span>
          </div>
          <p v-if="featured.description" class="de-hub-featured-desc">{{ featured.description }}</p>
          <div class="de-hub-featured-meta">
            <span class="de-hub-card-stat"><i class="fa-solid fa-users"></i> {{ featured.memberCount ?? 0 }} members</span>
            <span class="de-hub-card-stat"><i class="fa-solid fa-message"></i> {{ featured.postCount ?? 0 }} posts</span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <div v-if="hubs.length" class="de-hubs-grid">
      <NuxtLink
        v-for="hub in hubs"
        :key="hub.id"
        :to="hubLink(hub as Record<string, unknown>)"
        class="de-hub-card"
      >
        <div class="de-hub-card-banner" :style="hub.bannerUrl ? { backgroundImage: `url(${hub.bannerUrl})` } : {}">
          <div class="de-hub-card-icon">
            <img v-if="hub.iconUrl" :src="hub.iconUrl" :alt="hub.name" class="de-hub-card-avatar" />
            <i v-else :class="hub.hubType === 'company' ? 'fa-solid fa-building' : hub.hubType === 'product' ? 'fa-solid fa-microchip' : 'fa-solid fa-users'"></i>
          </div>
        </div>
        <div class="de-hub-card-body">
          <div class="de-hub-card-top">
            <h2 class="de-hub-card-name">{{ hub.name }}</h2>
            <span class="de-hub-card-type">{{ hub.hubType ?? 'community' }}</span>
          </div>
          <p v-if="hub.description" class="de-hub-card-desc">{{ hub.description }}</p>
          <div class="de-hub-card-meta">
            <span class="de-hub-card-stat"><i class="fa-solid fa-users"></i> {{ hub.memberCount ?? 0 }} members</span>
            <span class="de-hub-card-stat"><i class="fa-solid fa-message"></i> {{ hub.postCount ?? 0 }} posts</span>
            <span v-if="isFederated(hub as Record<string, unknown>)" class="de-hub-card-federated-badge">
              <i class="fa-solid fa-globe"></i> {{ (hub as Record<string, unknown>).originDomain }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
    <div v-else-if="!featured" class="de-empty-state">
      <div class="de-empty-icon"><i class="fa-solid fa-users"></i></div>
      <p class="de-empty-title">No communities yet</p>
      <p class="de-empty-desc">Be the first to create one.</p>
      <NuxtLink v-if="isAuthenticated" to="/hubs/create" class="de-btn-create" style="margin-top: 16px">
        <i class="fa-solid fa-plus"></i> Create Hub
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.de-hubs-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.de-hubs-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;
}

.de-hubs-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text);
}

.de-hubs-desc {
  font-size: 0.9375rem;
  color: var(--text-dim);
  margin-top: 4px;
}

.de-btn-create {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--deveco-dark-green);
  color: #fff;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
  flex-shrink: 0;
}
.de-btn-create:hover { background: var(--color-primary-hover); }

/* Featured community hero — full-width, spans the row above the grid */
.de-hub-featured {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  margin-bottom: 28px;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.de-hub-featured:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--deveco-dark-green);
}
.de-hub-featured-banner {
  height: 160px;
  position: relative;
  overflow: hidden;
  background-color: var(--color-surface-alt, var(--surface));
  border-bottom: 1px solid var(--border);
}
/* Blurred, scaled cover copy fills the whole banner (no gaps, no visible box) —
   works whether the banner is a logo or a photo. */
.de-hub-featured-banner.has-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: var(--banner-img);
  background-size: cover;
  background-position: center;
  filter: blur(28px) saturate(1.15);
  transform: scale(1.25);
  opacity: 0.92;
}
/* The actual image, sharp and fully visible (contain, never cropped) on top. */
.de-hub-featured-banner.has-banner::after {
  content: '';
  position: absolute;
  inset: 14px 24px;
  z-index: 1;
  background-image: var(--banner-img);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.de-hub-featured-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  background: var(--deveco-dark-green);
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  box-shadow: var(--shadow-sm);
}
.de-hub-featured-body {
  display: flex;
  gap: 16px;
  padding: 0 24px 20px;
}
.de-hub-featured-icon {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  margin-top: -32px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 4px solid var(--surface);
  border-radius: 16px;
  font-size: 24px;
  color: var(--deveco-dark-green);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
.de-hub-featured-icon img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
.de-hub-featured-info { flex: 1; min-width: 0; padding-top: 12px; }
.de-hub-featured-top { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.de-hub-featured-name {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text);
}
.de-hub-featured-desc {
  font-size: 0.9375rem;
  color: var(--text-dim);
  line-height: 1.55;
  margin-bottom: 14px;
  max-width: 640px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.de-hub-featured-meta { display: flex; align-items: center; gap: 20px; }

.de-hubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.de-hub-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.de-hub-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--deveco-dark-green);
}

.de-hub-card-banner {
  height: 80px;
  background: linear-gradient(135deg, var(--deveco-dark-green), #1b357d);
  background-size: cover;
  background-position: center;
  position: relative;
}

.de-hub-card-icon {
  position: absolute;
  bottom: -20px;
  left: 20px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 2px solid var(--surface);
  border-radius: 12px;
  font-size: 20px;
  color: var(--deveco-dark-green);
  box-shadow: var(--shadow-sm);
}

.de-hub-card-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.de-hub-card-body {
  padding: 28px 20px 20px;
}

.de-hub-card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.de-hub-card-name {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text);
}

.de-hub-card-type {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--deveco-dark-green);
  background: rgba(0, 78, 83, 0.06);
  border: 1px solid rgba(0, 78, 83, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
}

.de-hub-card-desc {
  font-size: 0.8125rem;
  color: var(--text-dim);
  line-height: 1.5;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.de-hub-card-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.de-hub-card-stat {
  font-size: 0.75rem;
  color: var(--text-faint);
  display: flex;
  align-items: center;
  gap: 5px;
}
.de-hub-card-stat i { font-size: 11px; }

/* Federated hub origin label */
.de-hub-card-federated-badge {
  font-size: 0.6875rem;
  color: var(--text-faint);
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: auto;
}
.de-hub-card-federated-badge i { font-size: 9px; color: var(--accent); }

/* Empty state */
.de-empty-state {
  text-align: center;
  padding: 56px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.de-empty-icon { font-size: 36px; color: var(--text-faint); margin-bottom: 16px; }
.de-empty-title { font-size: 1.0625rem; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.de-empty-desc { font-size: 0.875rem; color: var(--text-dim); }

@media (max-width: 640px) {
  .de-hubs-page { padding: 24px 16px 48px; }
  .de-hubs-grid { grid-template-columns: 1fr; }
  .de-hubs-header { flex-direction: column; }
  .de-hub-featured-banner { height: 120px; }
  .de-hub-featured-banner.has-banner::after { inset: 12px 16px; }
  .de-hub-featured-body { flex-direction: column; gap: 8px; padding: 0 16px 18px; }
  .de-hub-featured-icon { width: 56px; height: 56px; margin-top: -30px; font-size: 20px; }
  .de-hub-featured-info { padding-top: 0; }
  .de-hub-featured-name { font-size: 1.25rem; }
  .de-hub-featured-meta { flex-wrap: wrap; gap: 10px 16px; }
}
</style>
