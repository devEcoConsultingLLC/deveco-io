<script setup lang="ts">
definePageMeta({ layout: 'editor' });

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;

const content = ref<any>(null);

function onSave() {
  // TODO: Save via tRPC
  console.log('Saving...', content.value);
}

function onPublish() {
  // TODO: Publish via tRPC
  console.log('Publishing...');
}
</script>

<template>
  <EditorLayout
    :project-title="slug"
    :is-draft="true"
    @save="onSave"
    @publish="onPublish"
    @back="router.push(`/projects/${slug}`)"
  >
    <template #sidebar>
      <EditorSidebar />
    </template>
    <template #editor>
      <EditorMain v-model:content="content" />
    </template>
    <template #settings>
      <EditorSettings />
    </template>
  </EditorLayout>
</template>
