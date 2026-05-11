import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const REF_COOKIE = 'ebs_ref';
const REF_KEY = 'ebs_ref_code';
const COOKIE_DAYS = 30;

const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return m ? decodeURIComponent(m[2]) : null;
};

export const getStoredRefCode = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REF_KEY) || getCookie(REF_COOKIE);
};

/**
 * Captures ?ref= from URL on any /promo/* page, persists to cookie + localStorage,
 * and logs an affiliate click (fire-and-forget).
 */
export const useReferralTracking = () => {
  const [params] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const refFromUrl = params.get('ref')?.trim();
    if (refFromUrl && refFromUrl.length <= 64) {
      setCookie(REF_COOKIE, refFromUrl, COOKIE_DAYS);
      try { localStorage.setItem(REF_KEY, refFromUrl); } catch { /* ignore */ }

      // Log click (fire-and-forget, don't block UI)
      supabase.functions.invoke('track-affiliate-click', {
        body: {
          ref_code: refFromUrl,
          landing_path: location.pathname + location.search,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        },
      }).catch(() => { /* ignore */ });
    }
  }, [params, location.pathname, location.search]);
};
