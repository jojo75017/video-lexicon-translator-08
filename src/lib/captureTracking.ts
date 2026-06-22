import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';

export type CaptureSurface = 'popup' | 'sticky' | 'demo' | 'inline' | 'cadeau';
export type CaptureEventType = 'view' | 'click';

/**
 * Enregistre un évènement d'acquisition (affichage ou clic) sur un élément de
 * capture email. Insertion non bloquante : toute erreur est silencieuse pour ne
 * jamais perturber l'expérience visiteur.
 */
export async function trackCaptureEvent(
  surface: CaptureSurface,
  eventType: CaptureEventType,
  opts?: { abVariant?: 'A' | 'B' | null; leadMagnet?: string | null },
): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    const utm = getStoredUtm();
    await supabase.from('capture_events').insert({
      event_type: eventType,
      surface,
      ab_variant: opts?.abVariant ?? null,
      lead_magnet: opts?.leadMagnet ?? null,
      utm_source: utm.utm_source || null,
      utm_medium: utm.utm_medium || null,
      utm_campaign: utm.utm_campaign || null,
      page_path: window.location.pathname,
    });
  } catch {
    // silencieux — le tracking ne doit jamais casser l'UI
  }
}
