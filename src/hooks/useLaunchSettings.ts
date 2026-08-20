import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type LaunchSettingKey = 'free_trial_open' | 'v3_open' | 'first_month_free_open';

export interface LaunchSettingValue {
  enabled: boolean;
  opens_at?: string;
  closes_at?: string;
}

export type LaunchSettings = Record<LaunchSettingKey, LaunchSettingValue>;

const DEFAULTS: LaunchSettings = {
  free_trial_open: { enabled: true },
  v3_open: { enabled: false, opens_at: '2026-10-01T08:00:00+02:00' },
  first_month_free_open: { enabled: true, closes_at: '2026-09-30T23:59:59+02:00' },
};

/**
 * Interrupteurs du lancement, lus en base : ils permettent d'ouvrir ou de
 * fermer l'essai gratuit, l'offre « premier mois offert » et la V3 sans
 * republier le site.
 */
export function useLaunchSettings() {
  const [settings, setSettings] = useState<LaunchSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from('launch_settings').select('key, value');
    if (data) {
      const next = { ...DEFAULTS };
      for (const row of data) {
        const key = row.key as LaunchSettingKey;
        if (key in next) next[key] = { ...next[key], ...(row.value as unknown as LaunchSettingValue) };
      }
      setSettings(next);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const update = useCallback(
    async (key: LaunchSettingKey, value: LaunchSettingValue) => {
      const { error } = await supabase
        .from('launch_settings')
        .upsert({ key, value: value as never }, { onConflict: 'key' });
      if (error) throw error;
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return { settings, loading, reload: load, update };
}

export default useLaunchSettings;
