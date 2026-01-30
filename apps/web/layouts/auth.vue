<template>
  <div class="flex min-h-screen items-center justify-center bg-muted text-foreground">
    <div class="w-full max-w-md px-4">
      <div class="mb-8 text-center">
        <NuxtLink to="/">
          <DevEcoLogo variant="light-bg" size="md" class="mx-auto" />
        </NuxtLink>
      </div>
      <slot />
    </div>
  </div>
</template>
