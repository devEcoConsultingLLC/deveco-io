<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' });
useSeoMeta({ title: 'Federation -- Admin -- devEco.io' });

const activeTab = ref<'activity' | 'followers' | 'instances'>('activity');

const { data: activityData, refresh: refreshActivity } = await useFetch('/api/admin/federation/activity', {
  query: { limit: 50 },
  default: () => ({ items: [], total: 0 }),
});

const { data: statsData } = await useFetch('/api/admin/federation/stats', {
  default: () => ({ inbound: 0, outbound: 0, pending: 0, failed: 0, followers: 0, following: 0 }),
});
</script>

<template>
  <div>
    <h1 class="fed-title">Federation</h1>

    <!-- Stats -->
    <div class="fed-stats">
      <div class="fed-stat">
        <span class="fed-stat-val">{{ statsData?.inbound ?? 0 }}</span>
        <span class="fed-stat-label">Inbound</span>
      </div>
      <div class="fed-stat">
        <span class="fed-stat-val">{{ statsData?.outbound ?? 0 }}</span>
        <span class="fed-stat-label">Outbound</span>
      </div>
      <div class="fed-stat">
        <span class="fed-stat-val">{{ statsData?.pending ?? 0 }}</span>
        <span class="fed-stat-label">Pending</span>
      </div>
      <div class="fed-stat">
        <span class="fed-stat-val">{{ statsData?.failed ?? 0 }}</span>
        <span class="fed-stat-label">Failed</span>
      </div>
      <div class="fed-stat">
        <span class="fed-stat-val">{{ statsData?.followers ?? 0 }}</span>
        <span class="fed-stat-label">Followers</span>
      </div>
      <div class="fed-stat">
        <span class="fed-stat-val">{{ statsData?.following ?? 0 }}</span>
        <span class="fed-stat-label">Following</span>
      </div>
    </div>

    <div class="fed-info">
      <p><strong>Instance:</strong> deveco.io</p>
      <p><strong>Protocol:</strong> ActivityPub (HTTP Signatures, draft-cavage-12)</p>
      <p><strong>WebFinger:</strong> <code>/.well-known/webfinger</code></p>
      <p><strong>NodeInfo:</strong> <code>/nodeinfo/2.1</code></p>
    </div>

    <!-- Activity Log -->
    <h2 class="fed-section-title">Activity Log</h2>
    <div class="fed-activity-list">
      <div v-if="!activityData?.items?.length" class="fed-empty">No federation activity yet.</div>
      <div v-for="act in activityData?.items" :key="act.id" class="fed-activity-row">
        <span class="fed-dir" :class="act.direction">{{ act.direction === 'inbound' ? 'IN' : 'OUT' }}</span>
        <span class="fed-type">{{ act.type }}</span>
        <span class="fed-actor">{{ act.actorUri }}</span>
        <span class="fed-status" :class="act.status">{{ act.status }}</span>
        <time class="fed-time">{{ new Date(act.createdAt).toLocaleString() }}</time>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fed-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 20px; }
.fed-stats {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; margin-bottom: 24px;
}
.fed-stat {
  padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: var(--shadow-sm);
}
.fed-stat-val { font-size: 1.5rem; font-weight: 700; font-family: var(--font-mono); }
.fed-stat-label { font-size: 0.625rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-dim); }

.fed-info {
  padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  margin-bottom: 24px; font-size: 0.8125rem; color: var(--text-dim);
}
.fed-info p { margin-bottom: 4px; }
.fed-info code { font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent); background: var(--surface2); padding: 1px 4px; border-radius: 4px; }

.fed-section-title { font-size: 1rem; font-weight: 700; margin-bottom: 12px; }

.fed-activity-list {
  border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
}
.fed-empty { padding: 24px; text-align: center; color: var(--text-faint); font-size: 0.8125rem; }
.fed-activity-row {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  border-bottom: 1px solid var(--border); font-size: 0.75rem;
}
.fed-activity-row:last-child { border-bottom: none; }
.fed-dir {
  font-size: 0.625rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;
  text-transform: uppercase; letter-spacing: 0.06em;
}
.fed-dir.inbound { background: var(--teal-bg); color: var(--teal); border: 1px solid var(--teal); }
.fed-dir.outbound { background: var(--purple-bg); color: var(--purple); border: 1px solid var(--purple); }
.fed-type { font-weight: 600; color: var(--text); min-width: 60px; }
.fed-actor { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-dim); font-family: var(--font-mono); }
.fed-status { font-size: 0.625rem; font-weight: 600; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
.fed-status.delivered { color: var(--green); background: var(--green-bg); }
.fed-status.processed { color: var(--accent); background: var(--accent-bg); }
.fed-status.pending { color: var(--yellow); background: var(--yellow-bg); }
.fed-status.failed { color: var(--red); background: var(--red-bg); }
.fed-time { font-family: var(--font-mono); font-size: 0.625rem; color: var(--text-faint); white-space: nowrap; }

@media (max-width: 768px) {
  .fed-activity-row { flex-wrap: wrap; font-size: 0.6875rem; }
  .fed-actor { font-size: 0.6rem; }
  .fed-info { font-size: 0.75rem; }
  .fed-info code { font-size: 0.625rem; }
}
</style>
