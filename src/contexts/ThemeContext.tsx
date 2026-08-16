import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'ebookstudio_theme';

interface ThemeContextValue {
  /** Choix de l'abonné (clair / sombre / automatique). */
  choice: ThemeChoice;
  /** Thème réellement appliqué. */
  resolved: 'light' | 'dark';
  setChoice: (c: ThemeChoice) => void;
  /** Fait tourner clair → sombre → automatique. */
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): ThemeChoice {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'auto') return raw;
  } catch {
    /* stockage indisponible */
  }
  return 'light';
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme(choice: ThemeChoice): 'light' | 'dark' {
  const resolved = choice === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : choice;
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(() => readStored());
  const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
    choice === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : choice,
  );

  useEffect(() => {
    setResolved(applyTheme(choice));
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
  }, [choice]);

  // Suit le système lorsque le mode automatique est actif.
  useEffect(() => {
    if (choice !== 'auto' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolved(applyTheme('auto'));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [choice]);

  const setChoice = useCallback((c: ThemeChoice) => setChoiceState(c), []);
  const cycle = useCallback(() => {
    setChoiceState((c) => (c === 'light' ? 'dark' : c === 'dark' ? 'auto' : 'light'));
  }, []);

  const value = useMemo(() => ({ choice, resolved, setChoice, cycle }), [choice, resolved, setChoice, cycle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx) return ctx;
  // Sécurité : hors provider, on retombe sur un thème clair non persistant.
  return {
    choice: 'light',
    resolved: 'light',
    setChoice: () => {},
    cycle: () => {},
  };
}

export default ThemeProvider;
