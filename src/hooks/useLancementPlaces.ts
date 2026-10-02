import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { LANCEMENT_PLACES, isLancementOuvert } from '@/data/lancementTunnel';

/** Places réellement restantes (15 − commandes payées « Édition à vie »). Aucune donnée client. */
export function useLancementPlaces() {
  const [places, setPlaces] = useState<number>(LANCEMENT_PLACES);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    (supabase.rpc as any)('lancement_places_restantes', { _env: getStripeEnvironment() })
      .then(({ data, error }: { data: unknown; error: unknown }) => {
        if (!alive) return;
        if (!error && typeof data === 'number') setPlaces(data);
        setLoaded(true);
      });
    return () => { alive = false; };
  }, []);
  const ouvert = isLancementOuvert() && places > 0;
  return { places, loaded, ouvert };
}

export const placesLabel = (n: number) => `${n} place${n > 1 ? 's' : ''} restante${n > 1 ? 's' : ''}`;
