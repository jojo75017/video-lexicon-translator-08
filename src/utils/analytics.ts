// Google Analytics 4 - Suivi des conversions EbookStudio

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Track a custom GA4 event
 */
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// ═══════════════════════════════════════
// CTA & Navigation
// ═══════════════════════════════════════

/** Clic sur un bouton CTA stratégique */
export const trackCTAClick = (ctaName: string, destination: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    destination,
    page_path: window.location.pathname,
  });
};

/** Clic bouton "Voir la démonstration" */
export const trackDemoClick = (buttonText: string) => {
  trackEvent('demo_click', {
    page_path: window.location.pathname,
    button_text: buttonText,
  });
};

/** Scroll vers la section pricing */
export const trackPricingView = () => {
  trackEvent('pricing_section_view', {
    page_path: window.location.pathname,
  });
};

// ═══════════════════════════════════════
// Lead Generation & Newsletter
// ═══════════════════════════════════════

/** Inscription newsletter (footer, inline) */
export const trackNewsletterSignup = (source: string) => {
  trackEvent('newsletter_signup', {
    source,
    page_path: window.location.pathname,
  });
};

/** Téléchargement lead magnet (/cadeau) */
export const trackLeadMagnetDownload = (leadMagnetName: string) => {
  trackEvent('lead_magnet_download', {
    lead_magnet: leadMagnetName,
    page_path: window.location.pathname,
  });
};

// ═══════════════════════════════════════
// Checkout & Achat
// ═══════════════════════════════════════

/** Clic sur un plan (Fondateur / Pro) */
export const trackPlanSelect = (planName: string, price: number) => {
  trackEvent('select_plan', {
    plan_name: planName,
    price,
    page_path: window.location.pathname,
  });
};

/** Début du checkout (email saisi + clic "Passer au paiement") */
export const trackBeginCheckout = (plan: string, price: number) => {
  trackEvent('begin_checkout', {
    plan,
    value: price,
    currency: 'EUR',
  });
};

/** Achat confirmé (page de succès) */
export const trackPurchase = (plan: string, price: number) => {
  trackEvent('purchase', {
    plan,
    value: price,
    currency: 'EUR',
  });
};

// ═══════════════════════════════════════
// Engagement
// ═══════════════════════════════════════

/** Réservation démo Zoom (Calendly) */
export const trackZoomBooking = () => {
  trackEvent('zoom_booking_click', {
    page_path: window.location.pathname,
  });
};

/** Clic lien affiliation / parrainage */
export const trackAffiliateClick = () => {
  trackEvent('affiliate_click', {
    page_path: window.location.pathname,
  });
};

/** Ouverture FAQ */
export const trackFAQOpen = (question: string) => {
  trackEvent('faq_open', {
    question,
    page_path: window.location.pathname,
  });
};

/** Exit intent popup affiché */
export const trackExitIntent = (action: 'shown' | 'converted' | 'dismissed') => {
  trackEvent('exit_intent', {
    action,
    page_path: window.location.pathname,
  });
};

/** Page vue (SPA navigation) */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  trackEvent('page_view', {
    page_path: pagePath,
    ...(pageTitle && { page_title: pageTitle }),
  });
};
