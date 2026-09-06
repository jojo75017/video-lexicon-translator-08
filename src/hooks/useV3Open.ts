import { useEffect, useState } from 'react';
import { fetchV3Open, type V3OpenState } from '@/lib/v3OpenState';

/**
 * Ouverture de la V3 lue en base (interrupteur admin « Studio V3 ouvert »).
 * `null` = encore inconnu : dans cet état on ne verrouille et on ne redirige
 * jamais, pour ne pas éjecter un abonné ni un admin.
 */
export function useV3Open() {
  const [open, setOpen] = useState<V3OpenState>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchV3Open().then((value) => {
      if (!cancelled) setOpen(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { open, loading: open === null };
}

export default useV3Open;
