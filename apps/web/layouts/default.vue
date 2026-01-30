<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <TopBanner />
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
