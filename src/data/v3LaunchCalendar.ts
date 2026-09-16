/**
 * Calendrier d'ouverture des modules V3 (affichage seul).
 *
 * Source unique des dates affichées sur /v3/calendrier. Aucun impact sur les
 * verrous réels : l'accès reste piloté par `launch_settings.v3_open` et les
 * entitlements payants. Ici on explique simplement à l'abonné ce qui est déjà
 * libre et à quelle date exacte le reste s'ouvre.
 */

/** Date d'ouverture générale de la V3 pour les abonnés. */
export const V3_OPENING_ISO = '2026-10-01T08:00:00+02:00';

/** Fermeture annoncée de la V2, pour tout le monde, en attendant la V4. */
export { V2_ACCESS_UNTIL_ISO, V2_ACCESS_UNTIL_LABEL, V2_ACCESS_NOTE } from '@/data/v3Pricing';

export type V3CalendarStatus = 'libre' | 'ouverture' | 'complement';

export interface V3CalendarEntry {
  title: string;
  /** Chemin de l'outil, si la page existe déjà. */
  to?: string;
  status: V3CalendarStatus;
  /** Date d'ouverture (ISO) — absente pour les compléments à l'achat. */
  opensAt?: string;
  note: string;
}

export interface V3CalendarGroup {
  key: string;
  label: string;
  intro: string;
  entries: V3CalendarEntry[];
}

/** Modules déjà accessibles, avant même le 1er octobre. */
const LIBRES: V3CalendarEntry[] = [
  {
    title: 'Ebookstudio-Génie + Sommaire IA',
    to: '/v3/create',
    status: 'libre',
    opensAt: '2026-06-01T08:00:00+02:00',
    note: 'Déjà ouvert : offert à vie aux anciens clients V2.',
  },
  {
    title: 'Correcteur de livre',
    to: '/v3/corriger',
    status: 'libre',
    opensAt: '2026-06-01T08:00:00+02:00',
    note: 'Déjà ouvert : correction stricte du manuscrit, offerte à vie.',
  },
  {
    title: 'Export premium (sommaire stylé, pagination)',
    to: '/v3/create',
    status: 'libre',
    opensAt: '2026-06-01T08:00:00+02:00',
    note: 'Déjà ouvert : inclus avec le Génie.',
  },
  {
    title: 'Discuter avec l’IA (votre clé)',
    to: '/v3/discuter-ia',
    status: 'libre',
    note: 'Déjà ouvert : conversation libre dès que votre clé est enregistrée.',
  },
  {
    title: 'Kit de démarrage et niches',
    to: '/v3/kit-demarrage',
    status: 'libre',
    note: 'Déjà ouvert : idées, niches repérées et premiers pas.',
  },
];

/** Modules qui s'ouvrent le jour du lancement. */
const OUVERTURE: V3CalendarEntry[] = [
  { title: 'Écrire mon livre complet (30 agents)', to: '/v3/lancer', status: 'ouverture', opensAt: V3_OPENING_ISO, note: 'Rédaction chapitre par chapitre du début à l’export.' },
  { title: 'Biographie guidée', to: '/v3/biographie', status: 'ouverture', opensAt: V3_OPENING_ISO, note: 'Entretien et chronologie dédiés.' },
  { title: 'Livre illustré enfants', to: '/v3/create/illustre', status: 'ouverture', opensAt: V3_OPENING_ISO, note: 'Histoires illustrées par tranche d’âge.' },
  { title: 'Ma bibliothèque et mes livres', to: '/v3/library', status: 'ouverture', opensAt: V3_OPENING_ISO, note: 'Tous vos livres réunis au même endroit.' },
  { title: 'Version Longue', to: '/v3/version-longue', status: 'ouverture', opensAt: V3_OPENING_ISO, note: 'Plan, chapitres, couverture et exports.' },
  { title: 'ContentStudio Engine', to: '/v3/contentstudio', status: 'ouverture', opensAt: V3_OPENING_ISO, note: 'Contenus et déclinaisons autour du livre.' },
  { title: 'Mes couvertures', to: '/v3/mes-couvertures', status: 'ouverture', opensAt: V3_OPENING_ISO, note: 'Bibliothèque de couvertures et éditeur complet.' },
  { title: 'Ma couverture en 3 étapes', to: '/v3/couverture-express', status: 'ouverture', opensAt: V3_OPENING_ISO, note: 'Parcours guidé de la couverture.' },
  { title: 'Réglages auteur et profil public', to: '/v3/parametres', status: 'ouverture', opensAt: V3_OPENING_ISO, note: 'Votre page auteur et vos préférences.' },
];

/** Compléments payants : ouverts au moment de l'achat. */
const COMPLEMENTS: V3CalendarEntry[] = [
  { title: 'Maison d’édition de couvertures (V4 en avance)', to: '/v3/offre-couverture-v4', status: 'complement', note: 'Disponible dès l’achat, sans attendre le 1er octobre.' },
  { title: 'Studio BD & Jeunesse', to: '/bd-offre', status: 'complement', note: 'Disponible dès l’achat.' },
  { title: 'Audiolivre Premium', to: '/v3/outils/audiobook', status: 'complement', note: 'Disponible dès l’achat du complément.' },
  { title: 'Pack Traductions relues', to: '/v3/outils/traduction', status: 'complement', note: 'Disponible dès l’achat du complément.' },
  { title: 'Étude de marché et Amazon Spy', to: '/v3/outils/espion-concurrents', status: 'complement', note: 'Disponible dès l’achat du complément.' },
  { title: 'Autres compléments (revenus, distribution, social…)', to: '/v3/upsells', status: 'complement', note: 'Chaque complément s’ouvre au moment de l’achat.' },
];

export const V3_LAUNCH_CALENDAR: V3CalendarGroup[] = [
  {
    key: 'libre',
    label: 'Déjà libres — utilisables aujourd’hui',
    intro: 'Ces modules sont ouverts, sans attendre le 1er octobre.',
    entries: LIBRES,
  },
  {
    key: 'ouverture',
    label: 'Ouverture le 1er octobre 2026 à 8 h 00 (heure de Paris)',
    intro: 'Le jour du lancement, tous ces modules s’ouvrent en même temps pour les abonnés.',
    entries: OUVERTURE,
  },
  {
    key: 'complement',
    label: 'Compléments — ouverts dès l’achat',
    intro: 'Pas de date d’attente : l’accès est immédiat après le paiement.',
    entries: COMPLEMENTS,
  },
  {
    key: 'v2-fermeture',
    label: 'Fermeture de la V2 — 31 décembre 2026',
    intro:
      'La V2 reste utilisable par tout le monde — anciens abonnés, Plume et Édition — jusqu’à cette date, en attendant la V4.',
    entries: [
      {
        title: 'Accès V2 (ancien tableau de bord)',
        to: '/ebook-planner',
        status: 'libre',
        opensAt: '2026-12-31T23:59:00+01:00',
        note: 'Utilisable jusqu’au 31 décembre 2026 inclus. Rien n’est coupé avant cette date.',
      },
    ],
  },
];

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Paris',
});

/** Date lisible en français, fuseau de Paris. */
export function formatCalendarDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return DATE_FORMAT.format(d);
}

/** Nombre de jours entiers restants avant une date (0 si passée). */
export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = new Date(iso).getTime();
  const diff = target - from.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / 86_400_000);
}
