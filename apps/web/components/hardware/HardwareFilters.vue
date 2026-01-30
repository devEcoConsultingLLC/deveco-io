<script setup lang="ts">
defineProps<{
  categories: string[];
  vendors: string[];
}>();

defineEmits<{
  'update:category': [value: string];
  'update:vendor': [value: string];
  'update:search': [value: string];
}>();
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <input
      placeholder="Search hardware..."
      class="rounded-md border border-input bg-background px-3 py-2 text-sm w-64"
      @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
    />
    <select
      class="rounded-md border border-input bg-background px-3 py-2 text-sm"
      @change="$emit('update:category', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">All Categories</option>
      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
    </select>
    <select
      class="rounded-md border border-input bg-background px-3 py-2 text-sm"
      @change="$emit('update:vendor', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">All Vendors</option>
      <option v-for="v in vendors" :key="v" :value="v">{{ v }}</option>
    </select>
  </div>
</template>
