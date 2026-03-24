<script setup lang="ts">
const { isAdmin } = useAuth();
const { admin: adminEnabled } = useFeatures();
const sidebarOpen = ref(false);
</script>

<template>
  <div v-if="!adminEnabled" class="admin-denied">
    <h1>Not Available</h1>
    <p>The admin panel is not enabled on this instance.</p>
  </div>
  <div v-else class="admin-layout">
    <header class="admin-topbar">
      <div class="admin-topbar-inner">
        <button class="admin-menu-btn" aria-label="Toggle sidebar" @click="sidebarOpen = !sidebarOpen">
          <i :class="sidebarOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
        </button>
        <NuxtLink to="/" class="admin-brand">devEco.io</NuxtLink>
        <span class="admin-badge">Admin</span>
        <NuxtLink to="/" class="admin-back"><i class="fa-solid fa-arrow-left"></i> Back to site</NuxtLink>
      </div>
    </header>

    <div class="admin-body">
      <aside class="admin-sidebar" :class="{ open: sidebarOpen }" aria-label="Admin navigation">
        <nav class="admin-nav">
          <NuxtLink to="/admin" class="admin-nav-link" @click="sidebarOpen = false"><i class="fa-solid fa-gauge"></i> Dashboard</NuxtLink>
          <NuxtLink to="/admin/users" class="admin-nav-link" @click="sidebarOpen = false"><i class="fa-solid fa-users"></i> Users</NuxtLink>
          <NuxtLink to="/admin/content" class="admin-nav-link" @click="sidebarOpen = false"><i class="fa-solid fa-newspaper"></i> Content</NuxtLink>
          <NuxtLink to="/admin/reports" class="admin-nav-link" @click="sidebarOpen = false"><i class="fa-solid fa-flag"></i> Reports</NuxtLink>
          <NuxtLink to="/admin/audit" class="admin-nav-link" @click="sidebarOpen = false"><i class="fa-solid fa-clipboard-list"></i> Audit Log</NuxtLink>
          <NuxtLink to="/admin/settings" class="admin-nav-link" @click="sidebarOpen = false"><i class="fa-solid fa-gear"></i> Settings</NuxtLink>
        </nav>
      </aside>

      <main class="admin-main">
        <div v-if="isAdmin">
          <slot />
        </div>
        <div v-else class="admin-denied">
          <h1>Access Denied</h1>
          <p>You need admin privileges to access this area.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
}

.admin-topbar {
  height: 56px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.admin-topbar-inner {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.admin-menu-btn {
  display: none;
  width: 36px;
  height: 36px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-dim);
  font-size: 16px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.admin-brand {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
  text-decoration: none;
}

.admin-badge {
  padding: 3px 8px;
  background: var(--accent);
  color: var(--deveco-dark-green);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 4px;
}

.admin-back {
  margin-left: auto;
  color: var(--text-dim);
  text-decoration: none;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.admin-back:hover {
  color: var(--accent);
}

.admin-body {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  width: 200px;
  border-right: 1px solid var(--border);
  background: var(--surface);
  padding: 16px 8px;
  flex-shrink: 0;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.admin-nav-link {
  color: var(--text-dim);
  text-decoration: none;
  font-size: 0.8125rem;
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: color 0.12s, background 0.12s;
}

.admin-nav-link i {
  width: 16px;
  text-align: center;
  font-size: 12px;
}

.admin-nav-link:hover {
  color: var(--text);
  background: var(--surface2);
}

.admin-nav-link.router-link-exact-active {
  color: var(--deveco-dark-green);
  background: var(--accent-bg);
  font-weight: 600;
}

.admin-main {
  flex: 1;
  padding: 24px;
  min-width: 0;
}

.admin-denied {
  text-align: center;
  padding: 64px 24px;
  color: var(--text-dim);
}

.admin-denied h1 {
  font-size: 1.25rem;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .admin-menu-btn { display: flex; }
  .admin-sidebar {
    position: fixed;
    top: 56px;
    left: 0;
    bottom: 0;
    z-index: 40;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    box-shadow: none;
    width: 220px;
  }
  .admin-sidebar.open {
    transform: translateX(0);
    box-shadow: var(--shadow-lg);
  }
  .admin-main { padding: 16px; }
  .admin-back span { display: none; }
}
</style>
