<script setup lang="ts">
import type { Serialized, HubMemberItem, HubDetail } from '@commonpub/server';

const props = defineProps<{
  hub: Serialized<HubDetail>;
  members: Serialized<HubMemberItem>[];
}>();

const hubRules = computed<string[]>(() => {
  const raw = props.hub.rules;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
  } catch {
    // Not JSON — split by newlines
  }
  return raw.split('\n').map((r: string) => r.trim()).filter(Boolean);
});

const moderators = computed(() => {
  if (!props.members) return [];
  return props.members.filter(
    (m: Serialized<HubMemberItem>) => m.role === 'owner' || m.role === 'moderator'
  );
});
</script>

<template>
  <aside class="cpub-hub-sidebar">
    <!-- Moderators -->
    <div class="cpub-sb-card">
      <div class="cpub-sb-title">Moderators</div>
      <div v-for="mod in moderators" :key="mod.userId" class="cpub-mod-item">
        <div class="cpub-mod-avatar">{{ (mod.user.displayName || mod.user.username || 'U').charAt(0).toUpperCase() }}</div>
        <div class="cpub-mod-info">
          <NuxtLink :to="`/u/${mod.user.username}`" class="cpub-mod-name">{{ mod.user.displayName || mod.user.username }}</NuxtLink>
          <div class="cpub-mod-role">{{ mod.role }}</div>
        </div>
      </div>
      <p v-if="!moderators.length" class="cpub-sidebar-empty">No moderators listed.</p>
    </div>

    <!-- Rules -->
    <div v-if="hubRules.length" class="cpub-sb-card">
      <div class="cpub-sb-title">Hub Rules</div>
      <div v-for="(rule, i) in hubRules" :key="i" class="cpub-rule-item">
        <span class="cpub-rule-num">{{ i + 1 }}</span>
        <span>{{ rule }}</span>
      </div>
    </div>

    <!-- Website -->
    <div v-if="hub.website" class="cpub-sb-card">
      <div class="cpub-sb-title">Links</div>
      <div class="cpub-resource-item">
        <i class="fa-solid fa-link"></i>
        <a :href="hub.website" target="_blank" rel="noopener">{{ hub.website }}</a>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.cpub-hub-sidebar { min-width: 0; }

.cpub-sb-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 18px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
}
.cpub-sb-card:last-child { margin-bottom: 0; }

.cpub-sb-title {
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.cpub-mod-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.cpub-mod-item:last-child { margin-bottom: 0; }

.cpub-mod-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--deveco-dark-green);
  flex-shrink: 0;
}

.cpub-mod-info { flex: 1; }
.cpub-mod-name { font-size: 11px; font-weight: 500; }
.cpub-mod-role { font-size: 0.6875rem; color: var(--text-faint); }

.cpub-rule-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 11px;
  color: var(--text-dim);
}

.cpub-rule-num {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-faint);
  width: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.cpub-sidebar-empty { font-size: 11px; color: var(--text-faint); }

.cpub-resource-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-dim);
}
.cpub-resource-item i { font-size: 10px; color: var(--text-faint); width: 12px; }
.cpub-resource-item a { color: var(--accent); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpub-resource-item a:hover { text-decoration: underline; }
</style>
