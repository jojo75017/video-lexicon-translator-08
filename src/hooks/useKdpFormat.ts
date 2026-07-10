import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_KDP_FORMAT,
  KDP_FORMAT_STORAGE_KEY,
  getWordsPerPage,
  type KdpFormatId,
} from '@/utils/kdpPageDensity';

const EVENT_NAME = 'kdp-format-change';

function readStored(): KdpFormatId {
  if (typeof window === 'undefined') return DEFAULT_KDP_FORMAT;
  try {
    const v = window.localStorage.getItem(KDP_FORMAT_STORAGE_KEY) as KdpFormatId | null;
    return v || DEFAULT_KDP_FORMAT;
  } catch {
    return DEFAULT_KDP_FORMAT;
  }
}

/**
 * Réglage partagé et persistant du format KDP utilisé pour estimer les pages.
 * Synchronise tous les composants montés via un event window custom.
 */
export function useKdpFormat() {
  const [formatId, setFormatIdState] = useState<KdpFormatId>(readStored);

  useEffect(() => {
    const sync = () => setFormatIdState(readStored());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setFormatId = useCallback((id: KdpFormatId) => {
    try {
      window.localStorage.setItem(KDP_FORMAT_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
    setFormatIdState(id);
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  return { formatId, setFormatId, wordsPerPage: getWordsPerPage(formatId) };
}
