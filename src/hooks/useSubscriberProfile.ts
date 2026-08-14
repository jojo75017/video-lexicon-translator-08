import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriberProfile {
  first_name: string;
  last_name: string;
  pen_name: string;
  address_line: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  billing_email: string;
  website_url: string;
  facebook_url: string;
  instagram_url: string;
  x_url: string;
  tiktok_url: string;
  youtube_url: string;
  linkedin_url: string;
  pinterest_url: string;
  amazon_author_url: string;
  socials_public: boolean;
}

const EMPTY: SubscriberProfile = {
  first_name: '', last_name: '', pen_name: '', address_line: '', postal_code: '',
  city: '', country: '', phone: '', billing_email: '', website_url: '',
  facebook_url: '', instagram_url: '', x_url: '', tiktok_url: '', youtube_url: '',
  linkedin_url: '', pinterest_url: '', amazon_author_url: '', socials_public: false,
};

/**
 * Fiche privée de l'abonné (coordonnées + réseaux sociaux).
 * Lecture et écriture strictement limitées à l'utilisateur connecté (RLS).
 */
export function useSubscriberProfile() {
  const [profile, setProfile] = useState<SubscriberProfile>(EMPTY);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user ?? null;
      if (cancelled) return;
      setEmail(user?.email ?? null);
      setUserId(user?.id ?? null);

      if (user) {
        const { data: row } = await (supabase as any)
          .from('subscriber_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        if (!cancelled && row) {
          const next: SubscriberProfile = { ...EMPTY };
          (Object.keys(EMPTY) as (keyof SubscriberProfile)[]).forEach((k) => {
            const value = (row as any)[k];
            if (k === 'socials_public') next.socials_public = !!value;
            else (next as any)[k] = value ?? '';
          });
          setProfile(next);
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const update = useCallback(<K extends keyof SubscriberProfile>(key: K, value: SubscriberProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
  }, []);

  const save = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    if (!userId) return { ok: false, error: 'Vous devez être connecté pour enregistrer.' };
    setSaving(true);
    const { error } = await (supabase as any)
      .from('subscriber_profiles')
      .upsert({ user_id: userId, ...profile }, { onConflict: 'user_id' });
    setSaving(false);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, [profile, userId]);

  return { profile, email, userId, loading, saving, update, save };
}

export default useSubscriberProfile;
