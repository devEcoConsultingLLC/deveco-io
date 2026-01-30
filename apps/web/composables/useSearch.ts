import { ref } from 'vue';
import { MeiliSearch } from 'meilisearch';

let client: MeiliSearch | null = null;

function getClient() {
  if (!client) {
    const config = useRuntimeConfig();
    client = new MeiliSearch({
      host: config.public.siteUrl + '/api/search',
      apiKey: '', // Public search key — set via Meilisearch tenant tokens
    });
  }
  return client;
}

export function useSearch() {
  const results = ref<any[]>([]);
  const loading = ref(false);

  async function search(query: string, index = 'projects', options?: Record<string, unknown>) {
    loading.value = true;
    try {
      const meili = getClient();
      const res = await meili.index(index).search(query, {
        limit: 10,
        ...options,
      });
      results.value = res.hits;
      return res;
    } catch {
      results.value = [];
    } finally {
      loading.value = false;
    }
  }

  return { search, results, loading };
}
