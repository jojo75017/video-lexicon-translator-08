import { useCallback, useEffect, useRef, useState } from 'react';
import { readAutosaveAsync, writeAutosaveAsync, deleteAutosaveAsync } from '@/lib/ebookProjectStorage';

/**
 * Sauvegarde automatique des fiches générées (recettes / voyages).
 * Les fiches sont écrites dans IndexedDB (+ miroir localStorage) et
 * restaurées automatiquement au retour sur la page.
 */
export function useSheetsAutosave<T extends Record<string, unknown>>(
  scope: string,
  data: T,
  restore: (saved: T) => void,
  hasContent: boolean,
) {
  const [restored, setRestored] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const loadedRef = useRef(false);
  const dataRef = useRef(data);
  const lastSerializedRef = useRef<string>('');
  dataRef.current = data;

  // Restauration au montage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await readAutosaveAsync<T>(scope);
        if (!cancelled && saved) {
          restore(saved);
          setRestored(true);
        }
      } catch {
        /* noop */
      } finally {
        loadedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  // Sauvegarde automatique (toutes les 5 s si changement)
  useEffect(() => {
    const save = async () => {
      if (!loadedRef.current || !hasContent) return;
      let serialized = '';
      try {
        serialized = JSON.stringify(dataRef.current);
      } catch {
        return;
      }
      if (serialized === lastSerializedRef.current) return;
      setIsSaving(true);
      try {
        await writeAutosaveAsync(scope, dataRef.current);
        lastSerializedRef.current = serialized;
        setLastSavedAt(new Date());
      } catch {
        /* noop */
      } finally {
        setIsSaving(false);
      }
    };
    const interval = setInterval(save, 5000);
    void save();
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, hasContent, data]);

  const saveNow = useCallback(async () => {
    try {
      await writeAutosaveAsync(scope, dataRef.current);
      lastSerializedRef.current = JSON.stringify(dataRef.current);
      setLastSavedAt(new Date());
    } catch {
      /* noop */
    }
  }, [scope]);

  const clearSaved = useCallback(async () => {
    await deleteAutosaveAsync(scope);
    lastSerializedRef.current = '';
    setLastSavedAt(null);
    setRestored(false);
  }, [scope]);

  return { restored, lastSavedAt, isSaving, saveNow, clearSaved };
}
