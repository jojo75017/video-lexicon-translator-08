import { useEffect, useState, useCallback } from 'react';

// v2 — ajout des nouveaux outils KDP Pro & Audit Pilot pour qu'ils soient
// visibles immédiatement par tous les abonnés sans avoir à déplier le groupe.
const STORAGE_KEY = 'sidebar_favorites_v2';
const LEGACY_KEY = 'sidebar_favorites_v1';
const DEFAULT_FAVORITES = [
  'complete-workflow',
  'kdp-keywords-pro',
  'audit-pilot',
  'cover-design-editor',
  'export',
  'kdp-ads-guide',
  'projects',
];
const MAX_FAVORITES = 8;

const mergeWithDefaults = (existing: string[]): string[] => {
  // Garde les favoris existants + injecte les nouveaux outils s'ils manquent
  const merged = [...existing];
  for (const id of ['kdp-keywords-pro', 'audit-pilot']) {
    if (!merged.includes(id) && merged.length < MAX_FAVORITES) {
      merged.push(id);
    }
  }
  return merged;
};

export const useSidebarFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_FAVORITES;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
      }
      // Migration depuis v1 — on conserve les choix utilisateur et on
      // ajoute les nouveaux outils KDP automatiquement.
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) {
          const migrated = mergeWithDefaults(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      }
      return DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_FAVORITES) return prev;
      return [...prev, id];
    });
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  return { favorites, isFavorite, toggleFavorite, clearFavorites, max: MAX_FAVORITES };
};
