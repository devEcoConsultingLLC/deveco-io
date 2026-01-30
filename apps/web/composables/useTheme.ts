import { ref, watch, onMounted } from 'vue';

type Theme = 'light' | 'dark' | 'system';

const theme = ref<Theme>('system');

export function useTheme() {
  function applyTheme(t: Theme) {
    const isDark =
      t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', isDark);
  }

  function setTheme(t: Theme) {
    theme.value = t;
    localStorage.setItem('deveco-theme', t);
    applyTheme(t);
  }

  onMounted(() => {
    const stored = localStorage.getItem('deveco-theme') as Theme | null;
    if (stored) {
      theme.value = stored;
    }
    applyTheme(theme.value);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') applyTheme('system');
    });
  });

  const isDark = computed(
    () =>
      theme.value === 'dark' ||
      (theme.value === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  );

  return { theme, setTheme, isDark };
}
