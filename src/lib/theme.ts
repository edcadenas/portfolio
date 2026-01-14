import { writable } from 'svelte/store';

const THEME_STORAGE_KEY = 'portfolio-theme';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  // Default to dark (original design)
  return 'dark';
}

function createThemeStore() {
  const initialTheme = getInitialTheme();
  const { subscribe, set, update } = writable<Theme>(initialTheme);

  // Apply initial theme immediately (no transition needed on load)
  applyTheme(initialTheme, false);

  return {
    subscribe,
    toggle: () => {
      update(current => {
        const newTheme = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        applyTheme(newTheme, true);
        return newTheme;
      });
    },
    set: (theme: Theme) => {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      applyTheme(theme, true);
      set(theme);
    }
  };
}

function applyTheme(theme: Theme, animate: boolean = true) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const currentTheme = root.classList.contains('light') ? 'light' : 'dark';
  
  if (animate && currentTheme !== theme) {
    // Use requestAnimationFrame to ensure transitions are visible
    // Remove old class and add new class in separate frames for smooth transition
    requestAnimationFrame(() => {
      root.classList.remove(currentTheme);
      requestAnimationFrame(() => {
        root.classList.add(theme);
      });
    });
  } else {
    // Apply immediately on initial load or if already correct (no animation)
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }
}

export const theme = createThemeStore();
