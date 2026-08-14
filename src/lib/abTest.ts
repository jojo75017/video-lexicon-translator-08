/**
 * Test A/B léger pour les éléments d'acquisition (popup + bandeau sticky).
 *
 * - Chaque visiteur est assigné une seule fois à une variante ('A' ou 'B'),
 *   mémorisée en localStorage pour rester cohérent entre le popup et le sticky
 *   et entre les visites.
 * - Chaque variante définit une offre + un message différents afin de mesurer
 *   laquelle convertit le mieux (la variante est enregistrée sur chaque inscrit
 *   via le champ ab_variant de funnel_leads).
 */

export type AbVariant = 'A' | 'B';
const STORAGE_KEY = 'ebs_ab_variant';

export interface AbCopy {
  /** Popup */
  popupTitle: string;
  popupSubtitle: string;
  popupCta: string;
  /** Bandeau sticky */
  stickyMessage: string;
  stickyCta: string;
}

/** Contenu par variante, séparé entre audience générale et expatriés. */
const COPY: Record<'general' | 'expat', Record<AbVariant, AbCopy>> = {
  general: {
    // Variante A — promesse "guide niches" (contrôle historique)
    A: {
      popupTitle: 'Avant de partir… 🎁',
      popupSubtitle:
        'Recevez gratuitement les 10 niches d\'ebooks les plus rentables en 2026 (données Amazon réelles) + un plan d\'ebook prêt à l\'emploi.',
      popupCta: 'Recevoir mon guide gratuit',
      stickyMessage: 'Le sommaire complet de votre livre, généré en 2 minutes — gratuit',
      stickyCta: 'Voir mon sommaire',
    },
    // Variante B — promesse "résultat immédiat" : le sommaire de SON livre, gratuit
    B: {
      popupTitle: 'Le sommaire complet de votre livre, en 2 minutes',
      popupSubtitle:
        'Donnez votre sujet, l\'IA construit le sommaire chapitre par chapitre sous vos yeux. Gratuit, sans carte bancaire.',
      popupCta: 'Voir mon sommaire gratuitement',
      stickyMessage: 'Testez : l\'IA construit le sommaire de votre livre, gratuitement',
      stickyCta: 'Voir mon sommaire',
    },
  },
  expat: {
    // Variante A — contrôle : "depuis l'étranger"
    A: {
      popupTitle: 'Avant de partir… 🌍',
      popupSubtitle:
        'Recevez gratuitement le guide « Publier sur Amazon KDP depuis l\'étranger » (Suisse, Belgique, Luxembourg, Allemagne, Canada) — 100% en français.',
      popupCta: 'Recevoir mon guide gratuit',
      stickyMessage: 'Guide gratuit : publier sur Amazon KDP depuis l\'étranger 🌍',
      stickyCta: 'Recevoir le guide',
    },
    // Variante B — angle "être payé sur votre compte local"
    B: {
      popupTitle: 'Vivez à l\'étranger ? Publiez et soyez payé en local 💸',
      popupSubtitle:
        'Recevez gratuitement le guide pour créer un ebook en français et être payé sur votre compte bancaire local (CHF, EUR, CAD) — tax interview expliquée simplement.',
      popupCta: 'Recevoir mon guide gratuit',
      stickyMessage: 'Publiez sur KDP et soyez payé sur votre compte local 💸',
      stickyCta: 'Recevoir le guide',
    },
  },
};

/** Récupère (ou assigne) la variante stable du visiteur. */
export function getAbVariant(): AbVariant {
  if (typeof window === 'undefined') return 'A';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'A' || stored === 'B') return stored;
    const variant: AbVariant = Math.random() < 0.5 ? 'A' : 'B';
    window.localStorage.setItem(STORAGE_KEY, variant);
    return variant;
  } catch {
    return 'A';
  }
}

/** Renvoie le contenu de la variante du visiteur pour l'audience donnée. */
export function getAbCopy(isExpat: boolean): { variant: AbVariant; copy: AbCopy } {
  const variant = getAbVariant();
  return { variant, copy: COPY[isExpat ? 'expat' : 'general'][variant] };
}
