<script setup lang="ts">
import { ref } from 'vue';

const mobileMenuOpen = ref(false);

const navItems = [
  { label: 'Projects', href: '/projects' },
  { label: 'Hardware', href: '/hardware' },
  { label: 'Contests', href: '/contests' },
  { label: 'Communities', href: '/communities' },
];
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <DevEcoLogo variant="light-bg" size="sm" :show-text="true" />
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <SearchCommand />
        <NuxtLink
          to="/auth/login"
          class="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:inline-flex"
        >
          Log in
        </NuxtLink>
        <NuxtLink
          to="/auth/register"
          class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Sign up
        </NuxtLink>

        <!-- Mobile menu toggle -->
        <button
          class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent md:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="!mobileMenuOpen">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </template>
            <template v-else>
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </template>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="border-t border-border px-4 py-4 md:hidden">
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
