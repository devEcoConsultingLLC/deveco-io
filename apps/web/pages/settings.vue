<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
useHead({ title: 'Settings — devEco.io' });
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
    <h1 class="font-display text-2xl font-extrabold text-foreground mb-8">Settings</h1>

    <div class="space-y-8">
      <div class="rounded-lg border border-border bg-card p-6">
        <h2 class="text-lg font-semibold text-foreground mb-4">Profile</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Display Name</label>
            <input class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Bio</label>
            <textarea class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows="3" placeholder="Tell us about yourself" />
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-border bg-card p-6">
        <h2 class="text-lg font-semibold text-foreground mb-4">Theme</h2>
        <div class="flex gap-3">
          <button class="rounded-md border border-border px-4 py-2 text-sm">Light</button>
          <button class="rounded-md border border-border px-4 py-2 text-sm">Dark</button>
          <button class="rounded-md border border-border px-4 py-2 text-sm">System</button>
        </div>
      </div>
    </div>
  </div>
</template>
