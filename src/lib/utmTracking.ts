// Capture et persistance des paramètres UTM (utm_source / utm_medium / utm_campaign)
// pour attribuer correctement l'origine des leads, même plusieurs pages plus tard.
// GA4 capture déjà les UTM côté reporting ; ceci sert à les attacher aux leads en base.

const UTM_KEY = 'ebs_utm';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  landing_url?: string;
}

/** Lit les UTM depuis l'URL courante et les persiste (1re visite gagne). */
export const captureUtmParams = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source')?.slice(0, 64);
    const medium = params.get('utm_medium')?.slice(0, 64);
    const campaign = params.get('utm_campaign')?.slice(0, 64);
    if (!source && !medium && !campaign) return;
    // Ne pas écraser une attribution déjà connue
    if (localStorage.getItem(UTM_KEY)) return;
    const payload: UtmParams = {
      utm_source: source || undefined,
      utm_medium: medium || undefined,
      utm_campaign: campaign || undefined,
      landing_url: window.location.href.slice(0, 300),
    };
    localStorage.setItem(UTM_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
};

/** Retourne les UTM stockés (ou un objet vide). */
export const getStoredUtm = (): UtmParams => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(UTM_KEY);
    if (raw) return JSON.parse(raw) as UtmParams;
  } catch {
    /* ignore */
  }
  // Fallback : si pas stocké, prendre l'URL d'atterrissage au moins
  return { landing_url: typeof window !== 'undefined' ? window.location.href.slice(0, 300) : undefined };
};
