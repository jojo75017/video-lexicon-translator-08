/**
 * SOURCE UNIQUE DE VÉRITÉ des nouveautés V3.
 *
 * Toute nouveauté ajoutée ici :
 *  - apparaît automatiquement sur /v3/nouveautes (groupée par mois, la plus récente en haut) ;
 *  - déclenche le badge « NOUVEAU » dans le menu et la sidebar pendant 30 jours ;
 *  - alimente le compteur de nouveautés non vues (remis à zéro à la visite de la page).
 *
 * Il n'y a plus aucun badge « NEW » écrit à la main : on ajoute une ligne ici, c'est tout.
 */

import { getV3Plan } from './v3Pricing';

/** Palier requis pour utiliser la nouveauté. */
export type V3NouveauteTier = 'offert' | 'plume' | 'edition';

/** Statut de mise en service. */
export type V3NouveauteStatus = 'live' | 'bientot';

export interface V3Nouveaute {
  id: string;
  title: string;
  desc: string;
  /** Route interne à ouvrir (absente = pas encore disponible). */
  to?: string;
  /** Date de mise en ligne, format ISO `YYYY-MM-DD`. */
  date: string;
  tier: V3NouveauteTier;
  status?: V3NouveauteStatus;
}

const plume = getV3Plan('plume');
const edition = getV3Plan('edition');

/** Libellés de palier dérivés des tarifs réels (jamais écrits en dur). */
export const V3_TIER_LABEL: Record<V3NouveauteTier, string> = {
  offert: '🎁 Offert à tous',
  plume: `Plume ${plume?.monthlyPrice ?? 27} €/mois`,
  edition: `Édition ${edition?.monthlyPrice ?? 47} €/mois`,
};

export const V3_TIER_COLOR: Record<V3NouveauteTier, string> = {
  offert: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  plume: 'bg-slate-50 text-slate-700 border-slate-200',
  edition: 'bg-amber-50 text-amber-800 border-amber-200',
};

/** Liste des nouveautés, ordre libre : l'affichage trie par date décroissante. */
export const V3_NOUVEAUTES: V3Nouveaute[] = [
  // --- Septembre 2026 ---
  {
    id: 'bd-comic',
    title: 'Grande nouveauté V4 — Studio BD & Jeunesse',
    desc: 'Personnages, planches de bande dessinée et histoires illustrées, prêtes pour Amazon KDP.',
    to: '/bd-offre',
    date: '2026-09-02',
    tier: 'edition',
  },
  // --- Août 2026 ---
  {
    id: 'contentstudio',
    title: 'ContentStudio Engine — votre livre devient une formation vidéo',
    desc: 'Script, voix off, diapositives et montage MP4 générés depuis vos chapitres.',
    to: '/v3/contentstudio',
    date: '2026-08-28',
    tier: 'edition',
  },
  {
    id: 'biographie',
    title: 'Biographie — le récit de votre vie',
    desc: 'Un parcours guidé pour transformer vos souvenirs en livre publiable.',
    to: '/v3/biographie',
    date: '2026-08-24',
    tier: 'plume',
  },
  {
    id: 'acquisition',
    title: 'Plan 14 jours — trouver vos premiers lecteurs',
    desc: 'Le calendrier jour par jour pour lancer votre livre et récolter des avis.',
    to: '/v3/acquisition',
    date: '2026-08-20',
    tier: 'plume',
  },
  {
    id: 'kit-demarrage',
    title: 'Kit de démarrage (PDF)',
    desc: 'Le guide de prise en main : de l’idée au livre publié sur KDP.',
    to: '/v3/kit-demarrage',
    date: '2026-08-18',
    tier: 'offert',
  },
  {
    id: 'corriger',
    title: 'Correction professionnelle du livre',
    desc: 'Passe éditoriale complète : orthographe, style, fins de chapitre, mots parasites.',
    to: '/v3/corriger',
    date: '2026-08-14',
    tier: 'plume',
  },
  {
    id: 'cover-studio-pro',
    title: 'Cover Studio Pro',
    desc: 'Couverture complète 300 DPI : recto, tranche calculée et 4e de couverture.',
    to: '/v3/cover-studio-pro',
    date: '2026-08-10',
    tier: 'edition',
  },
  {
    id: 'donnees-kdp',
    title: 'Données KDP du livre',
    desc: 'Titre, description, mots-clés et catégories prêts à coller dans KDP.',
    to: '/v3/donnees-kdp',
    date: '2026-08-06',
    tier: 'plume',
  },

  // --- Juillet 2026 ---
  {
    id: 'commence-ici',
    title: 'Commence ici — 25 agents par univers de livre',
    desc: 'Choisissez votre type de livre, l’agent adapté prend le relais.',
    to: '/v3/commence-ici',
    date: '2026-07-28',
    tier: 'offert',
  },
  {
    id: 'workflow',
    title: 'Workflow 15 agents — écrire mon livre',
    desc: 'Le pipeline complet, étape par étape, de la niche à l’export.',
    to: '/v3/workflow',
    date: '2026-07-24',
    tier: 'plume',
  },
  {
    id: 'humanizer',
    title: 'Humaniseur IA + détecteur',
    desc: 'Textes naturels et score de détection vérifié avant publication.',
    to: '/v3/outils/humanizer',
    date: '2026-07-20',
    tier: 'edition',
  },
  {
    id: 'audiobook',
    title: 'Audiolivre — export MP3 chapitré',
    desc: 'Voix française naturelle, chapitrage automatique, prêt à distribuer.',
    to: '/v3/outils/audiobook',
    date: '2026-07-16',
    tier: 'plume',
  },
  {
    id: 'traduction',
    title: '10 langues incluses',
    desc: 'Traduisez votre livre dès l’étape 1 et publiez sur les autres marchés Amazon.',
    to: '/v3/outils/traduction',
    date: '2026-07-12',
    tier: 'plume',
  },
  {
    id: 'espion-concurrents',
    title: 'Espion Amazon & audit ASIN',
    desc: 'Niches, concurrence et mots-clés réels pour viser juste.',
    to: '/v3/outils/espion-concurrents',
    date: '2026-07-08',
    tier: 'edition',
  },
  {
    id: 'royalties',
    title: 'Calculateur de royalties KDP',
    desc: 'Vos gains ebook, broché et KU estimés en 10 secondes.',
    to: '/v3/outils/royalties',
    date: '2026-07-04',
    tier: 'offert',
  },
  {
    id: 'mockup-3d',
    title: 'Mockups 3D',
    desc: 'Votre couverture en main, sur étagère ou sur tablette.',
    to: '/v3/outils/mockup-3d',
    date: '2026-07-02',
    tier: 'offert',
  },

  // --- À venir ---
  {
    id: 'print-ready',
    title: 'Export KDP Print-Ready',
    desc: 'PDF avec fonds perdus et gabarit calculé selon le nombre de pages.',
    date: '2026-09-15',
    tier: 'edition',
    status: 'bientot',
  },
  {
    id: 'suivi-ventes',
    title: 'Suivi des ventes KDP',
    desc: 'Importez le rapport Amazon et suivez vos royalties réelles.',
    date: '2026-09-20',
    tier: 'edition',
    status: 'bientot',
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Une nouveauté est « récente » si sa date de mise en ligne est passée et < `days` jours. */
export function isRecent(date: string, days = 30): boolean {
  const t = new Date(`${date}T00:00:00Z`).getTime();
  if (Number.isNaN(t)) return false;
  const now = Date.now();
  return t <= now && now - t < days * DAY_MS;
}

/** Nouveautés déjà en ligne, triées de la plus récente à la plus ancienne. */
export function getLiveNouveautes(): V3Nouveaute[] {
  const now = Date.now();
  return V3_NOUVEAUTES.filter(
    (n) => n.status !== 'bientot' && new Date(`${n.date}T00:00:00Z`).getTime() <= now,
  ).sort((a, b) => b.date.localeCompare(a.date));
}

/** Nouveautés annoncées mais pas encore disponibles. */
export function getUpcomingNouveautes(): V3Nouveaute[] {
  return V3_NOUVEAUTES.filter((n) => n.status === 'bientot').sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/** `true` si la route porte une nouveauté de moins de 30 jours. */
export function isRouteNouveau(to: string, days = 30): boolean {
  const path = to.split('?')[0].replace(/\/+$/, '');
  return V3_NOUVEAUTES.some(
    (n) => n.to && n.to.split('?')[0].replace(/\/+$/, '') === path && isRecent(n.date, days),
  );
}

const SEEN_KEY = 'v3_nouveautes_seen_at';

/** Nombre de nouveautés apparues depuis la dernière visite de /v3/nouveautes. */
export function countUnseenNouveautes(): number {
  const live = getLiveNouveautes().filter((n) => isRecent(n.date));
  if (typeof window === 'undefined') return live.length;
  let seenAt = 0;
  try {
    seenAt = Number(window.localStorage.getItem(SEEN_KEY) ?? 0);
  } catch {
    seenAt = 0;
  }
  if (!seenAt) return live.length;
  return live.filter((n) => new Date(`${n.date}T00:00:00Z`).getTime() > seenAt).length;
}

/** Marque toutes les nouveautés comme vues (appelé à l'ouverture de la page). */
export function markNouveautesSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SEEN_KEY, String(Date.now()));
  } catch {
    /* stockage indisponible : sans effet */
  }
}

/** Libellé de mois en français, ex. « Août 2026 ». */
export function formatMonthLabel(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  const label = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Regroupe les nouveautés en ligne par mois, du plus récent au plus ancien. */
export function groupNouveautesByMonth(): { key: string; label: string; items: V3Nouveaute[] }[] {
  const groups = new Map<string, V3Nouveaute[]>();
  for (const n of getLiveNouveautes()) {
    const key = n.date.slice(0, 7);
    const list = groups.get(key) ?? [];
    list.push(n);
    groups.set(key, list);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => ({ key, label: formatMonthLabel(`${key}-01`), items }));
}
