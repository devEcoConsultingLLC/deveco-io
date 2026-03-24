<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' });
useSeoMeta({ title: 'Admin Dashboard -- devEco.io' });

const { data: stats } = await useFetch('/api/admin/stats');
</script>

<template>
  <div class="cpub-admin-dashboard">
    <h1 class="cpub-admin-title">Platform Dashboard</h1>

    <div class="cpub-stats-grid" v-if="stats">
      <div class="cpub-stat-card" v-for="stat in [
        { label: 'Users', value: stats.users?.total ?? 0, icon: 'fa-solid fa-users' },
        { label: 'Content', value: stats.content?.total ?? 0, icon: 'fa-solid fa-file-lines' },
        { label: 'Communities', value: stats.hubs?.total ?? 0, icon: 'fa-solid fa-people-group' },
        { label: 'Reports', value: stats.reports?.pending ?? 0, icon: 'fa-solid fa-flag' },
      ]" :key="stat.label">
        <i :class="[stat.icon, 'cpub-stat-icon']"></i>
        <span class="cpub-stat-value">{{ stat.value }}</span>
        <span class="cpub-stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="cpub-admin-quick-links">
      <h2 class="cpub-admin-section-title">Quick Actions</h2>
      <div class="cpub-admin-actions-grid">
        <NuxtLink to="/admin/users" class="cpub-admin-action">
          <i class="fa-solid fa-user-gear cpub-admin-action-icon"></i>
          <span class="cpub-admin-action-label">Manage Users</span>
        </NuxtLink>
        <NuxtLink to="/admin/reports" class="cpub-admin-action">
          <i class="fa-solid fa-flag cpub-admin-action-icon"></i>
          <span class="cpub-admin-action-label">Review Reports</span>
        </NuxtLink>
        <NuxtLink to="/admin/content" class="cpub-admin-action">
          <i class="fa-solid fa-newspaper cpub-admin-action-icon"></i>
          <span class="cpub-admin-action-label">Manage Content</span>
        </NuxtLink>
        <NuxtLink to="/admin/settings" class="cpub-admin-action">
          <i class="fa-solid fa-gear cpub-admin-action-icon"></i>
          <span class="cpub-admin-action-label">Instance Settings</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cpub-admin-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 24px; }
.cpub-stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; margin-bottom: 32px; }
.cpub-stat-card {
  padding: 20px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.cpub-stat-icon { font-size: 1.25rem; color: var(--accent); margin-bottom: 4px; }
.cpub-stat-value { font-size: 1.75rem; font-weight: 700; font-family: var(--font-mono); }
.cpub-stat-label { font-size: 0.625rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-dim); }
.cpub-admin-section-title { font-size: 1rem; font-weight: 700; margin-bottom: 16px; }
.cpub-admin-actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.cpub-admin-action {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 20px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; text-decoration: none; color: var(--text);
  transition: all 0.15s;
}
.cpub-admin-action:hover { background: var(--surface2); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.cpub-admin-action-icon { font-size: 1.25rem; color: var(--text-dim); }
.cpub-admin-action-label { font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-dim); }
</style>
