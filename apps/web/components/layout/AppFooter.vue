<script setup lang="ts">
const footerLinks = {
  platform: [
    { label: 'Projects', href: '/projects' },
    { label: 'Hardware Catalog', href: '/hardware' },
    { label: 'Contests', href: '/contests' },
    { label: 'Communities', href: '/communities' },
  ],
  resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API', href: '/docs/api' },
    { label: 'Contributing', href: '/docs/contributing' },
    { label: 'Design System', href: '/docs/design-system' },
  ],
  community: [
    { label: 'Edge AI Foundation', href: '#' },
    { label: 'portalNetwork', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'Discord', href: '#' },
  ],
};
</script>

<template>
  <footer class="border-t border-border bg-background">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <DevEcoLogo variant="light-bg" size="sm" />
          <p class="mt-4 text-sm text-muted-foreground">
            Open-source Edge AI project sharing and community platform.
          </p>
          <p class="mt-2 text-xs text-muted-foreground">
            Backed by Edge AI Foundation
          </p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-sm font-semibold text-foreground">Platform</h3>
          <ul class="mt-4 space-y-2">
            <li v-for="link in footerLinks.platform" :key="link.href">
              <NuxtLink :to="link.href" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-foreground">Resources</h3>
          <ul class="mt-4 space-y-2">
            <li v-for="link in footerLinks.resources" :key="link.href">
              <NuxtLink :to="link.href" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-foreground">Community</h3>
          <ul class="mt-4 space-y-2">
            <li v-for="link in footerLinks.community" :key="link.href">
              <NuxtLink :to="link.href" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 border-t border-border pt-8 text-center">
        <p class="text-xs text-muted-foreground">
          &copy; {{ new Date().getFullYear() }} Edge AI Foundation. Licensed under AGPL-3.0.
        </p>
      </div>
    </div>
  </footer>
</template>
