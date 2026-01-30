<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

useHead({ title: `Project — devEco.io` });

// TODO: Fetch via tRPC
// const trpc = useTrpc();
// const { data: project } = await trpc.project.bySlug.useQuery({ slug });
</script>

<template>
  <div>
    <ProjectHero
      title="Project Title"
      summary="Project summary goes here."
      :author="{ username: 'alice', displayName: 'Alice Chen' }"
      difficulty="intermediate"
      :view-count="1247"
      :like-count="89"
      :comment-count="23"
    />

    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex gap-8">
        <!-- Main content -->
        <div class="flex-1 min-w-0">
          <ProjectTabs>
            <template #overview>
              <div class="prose-deveco">
                <p>Project content will be rendered here from TipTap JSON.</p>
              </div>
            </template>
            <template #code>
              <div class="prose-deveco">
                <p>Code sections and snippets.</p>
              </div>
            </template>
            <template #schematics>
              <p class="text-muted-foreground">Schematics viewer coming soon.</p>
            </template>
            <template #bom>
              <BOMTable :components="[
                { name: 'ESP32-S3-DevKitC-1', quantity: 1, priceUsd: '9.99' },
                { name: 'OV2640 Camera Module', quantity: 1, priceUsd: '4.50' },
                { name: 'Breadboard', quantity: 1, priceUsd: '3.00' },
              ]" />
            </template>
            <template #comments>
              <p class="text-muted-foreground">Comments section coming soon.</p>
            </template>
          </ProjectTabs>
        </div>

        <!-- Sidebar -->
        <AppSidebar class="hidden lg:block">
          <div class="rounded-lg border border-border bg-card p-6 space-y-4">
            <button class="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Like Project
            </button>
            <button class="w-full rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">
              Share
            </button>
          </div>

          <div class="rounded-lg border border-border bg-card p-6">
            <h3 class="text-sm font-semibold text-foreground mb-3">Tags</h3>
            <div class="flex flex-wrap gap-1.5">
              <AppTag label="ESP32" href="/projects?tag=esp32" />
              <AppTag label="TensorFlow Lite" href="/projects?tag=tensorflow-lite" />
              <AppTag label="Computer Vision" href="/projects?tag=computer-vision" />
            </div>
          </div>
        </AppSidebar>
      </div>
    </div>
  </div>
</template>
