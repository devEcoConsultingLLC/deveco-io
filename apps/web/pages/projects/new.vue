<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

// Redirect to editor with a new draft
const router = useRouter();

onMounted(async () => {
  // TODO: Create draft via tRPC, redirect to editor
  // const trpc = useTrpc();
  // const project = await trpc.project.create.mutate({ title: 'Untitled Project', slug: `draft-${Date.now()}` });
  // router.push(`/projects/${project.slug}/edit`);
});
</script>

<template>
  <div class="flex h-[50vh] items-center justify-center">
    <div class="text-center">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      <p class="mt-4 text-sm text-muted-foreground">Creating your project...</p>
    </div>
  </div>
</template>
