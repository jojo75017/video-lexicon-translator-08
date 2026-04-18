import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'sidebar_favorites_v1';
const DEFAULT_FAVORITES = [
  'complete-workflow',
  'cover-design-editor',
  'export',
  'kdp-ads-guide',
  'projects',
];
const MAX_FAVORITES = 8;

export const useSidebarFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_FAVORITES;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_FAVORITES;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
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
