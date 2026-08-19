import { useCallback, useEffect, useState } from 'react';
import {
  AMBIANCE_EVENT,
  WRITING_AMBIANCES,
  applyAmbiance,
  getAmbianceById,
  getStoredAmbianceId,
  setStoredAmbianceId,
  type WritingAmbiance,
} from '@/data/writingAmbiances';
import { readBookBrief, writeBookBrief } from '@/lib/v3/bookBrief';

/**
 * Ambiance d'écriture réellement appliquée : un seul choix partagé par la page
 * « Ambiances », le sélectueur du Génie et le brief du livre.
 */
export function useAmbiance() {
  const [id, setId] = useState<string>(() => getStoredAmbianceId());

  // Applique l'ambiance dès l'affichage, puis à chaque changement externe.
  useEffect(() => {
    applyAmbiance(getStoredAmbianceId());
    const sync = () => setId(getStoredAmbianceId());
    window.addEventListener(AMBIANCE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AMBIANCE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setAmbiance = useCallback((next: string) => {
    setId(next);
    setStoredAmbianceId(next);
    try {
      writeBookBrief({ ...(readBookBrief() || {}), ambianceId: next });
    } catch {
      /* brief indisponible */
    }
  }, []);

  const ambiance: WritingAmbiance = getAmbianceById(id) || WRITING_AMBIANCES[0];

  return { ambianceId: ambiance.id, ambiance, setAmbiance, ambiances: WRITING_AMBIANCES };
}

export default useAmbiance;
