/**
 * Base de connaissances de l'Assistant Ebookstudio.
 * — ASSISTANT_JOURNEY : les onglets illustrés du parcours livre (Plan → Vendre).
 * — ASSISTANT_FAQ : questions récurrentes des abonnés, avec la route qui répond.
 * Toutes les routes citées ici doivent exister dans l'application.
 */
import { V2_TOOLS } from './v2ToolsRegistry';

export interface AssistantAction {
  label: string;
  route: string;
}

export interface AssistantFaqEntry {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  actions: AssistantAction[];
}

export interface JourneyTab {
  id: string;
  emoji: string;
  label: string;
  tagline: string;
  route: string;
  image: string;
}

const IMG = {
  plan: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=70&auto=format&fit=crop',
  ecrire: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=70&auto=format&fit=crop',
  habiller: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=70&auto=format&fit=crop',
  publier: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=70&auto=format&fit=crop',
  vendre: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=70&auto=format&fit=crop',
  outils: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=70&auto=format&fit=crop',
};

export const ASSISTANT_JOURNEY: JourneyTab[] = [
  { id: 'plan',     emoji: '📘', label: 'Plan',      tagline: "De l'idée au sommaire validé",            route: '/v3/create',                 image: IMG.plan },
  { id: 'ecrire',   emoji: '✍️', label: 'Écrire',    tagline: 'Rédaction chapitre par chapitre',          route: '/ebook-planner',             image: IMG.ecrire },
  { id: 'habiller', emoji: '🎨', label: 'Habiller',  tagline: 'Couverture, illustrations, mise en forme', route: '/couverture-kdp',            image: IMG.habiller },
  { id: 'publier',  emoji: '🚀', label: 'Publier',   tagline: 'Export Word/PDF et dépôt Amazon KDP',      route: '/audit-pilot',               image: IMG.publier },
  { id: 'vendre',   emoji: '💛', label: 'Vendre',    tagline: 'Mots-clés, description, lancement',        route: '/kdp-keywords',              image: IMG.vendre },
  { id: 'outils',   emoji: '🧰', label: 'Tous les outils', tagline: `${V2_TOOLS.length} outils classés par catégorie`, route: '/v3/outils',      image: IMG.outils },
];

export const ASSISTANT_FAQ: AssistantFaqEntry[] = [
  {
    id: 'creer-livre',
    question: 'Comment créer mon premier livre ?',
    keywords: ['créer', 'commencer', 'premier livre', 'debuter', 'génie', 'genie', 'nouveau livre'],
    answer:
      "Ouvrez **Ebookstudio-Génie** : vous décrivez votre livre en une phrase, il construit la fiche, le sommaire, puis rédige chapitre par chapitre jusqu'à l'export.",
    actions: [
      { label: 'Créer mon livre', route: '/v3/create' },
      { label: 'Sommaire IA guidé', route: '/v3/create?sommaire=ia' },
    ],
  },
  {
    id: 'corriger',
    question: 'Je veux corriger un livre déjà écrit',
    keywords: ['corriger', 'correction', 'relecture', 'fautes', 'orthographe', 'polissage'],
    answer:
      "Utilisez **Corriger mon livre** : importez votre manuscrit (Word, PDF, lien ou copier-coller), choisissez Correction stricte ou Correction + polissage, validez chaque chapitre puis exportez en Word et PDF prêts pour KDP.",
    actions: [
      { label: 'Corriger mon livre', route: '/v3/corriger' },
      { label: 'BookPerfect AI', route: '/bookperfect' },
    ],
  },
  {
    id: 'importer',
    question: 'Comment importer un manuscrit existant ?',
    keywords: ['importer', 'import', 'docx', 'word', 'pdf', 'manuscrit existant', 'reprendre'],
    answer:
      "L'import accepte DOCX, TXT, PDF et une URL. Le manuscrit est découpé en chapitres, que vous pouvez ensuite corriger ou enrichir.",
    actions: [
      { label: 'Importer un manuscrit', route: '/v3/create?import=1' },
      { label: 'Corriger après import', route: '/v3/corriger' },
    ],
  },
  {
    id: 'workflow-auth',
    question: "Le workflow affiche « Non authentifié » ou me demande de repartir de zéro",
    keywords: ['non authentifié', 'authentifié', 'erreur p1', 'repartir de zéro', 'session', 'déconnecté'],
    answer:
      "C'est une session expirée. Rechargez la page (la session se rafraîchit automatiquement), puis relancez le workflow à l'étape où il s'est arrêté — les étapes déjà terminées sont conservées.",
    actions: [
      { label: 'Relancer le workflow', route: '/ebook-planner' },
      { label: 'Contacter le support', route: '/contact-support' },
    ],
  },
  {
    id: 'limite-requetes',
    question: "« Limite de requêtes atteinte » pendant la génération",
    keywords: ['limite de requêtes', 'rate limit', '429', 'quota', 'trop de requêtes'],
    answer:
      "Votre clé Gemini a atteint son quota. La plateforme bascule automatiquement sur l'IA incluse : attendez une minute et relancez l'étape. Vous pouvez aussi renseigner une clé OpenRouter en secours.",
    actions: [
      { label: 'Reprendre le workflow', route: '/ebook-planner' },
      { label: 'Mes clés API', route: '/v3/compte' },
    ],
  },
  {
    id: 'cle-api',
    question: 'Où mettre ma clé Gemini ou OpenRouter ?',
    keywords: ['clé', 'cle api', 'gemini', 'openrouter', 'api key', 'aiza'],
    answer:
      "Dans votre compte : collez votre clé Gemini (commence par `AIza`) ou OpenRouter (`sk-or-`). Elle reste sur votre appareil et sert uniquement à vos générations.",
    actions: [
      { label: 'Renseigner ma clé', route: '/v3/compte' },
      { label: 'Guide vidéo clé API', route: '/formation' },
    ],
  },
  {
    id: 'chapitres',
    question: 'Combien de chapitres puis-je générer ?',
    keywords: ['chapitres', 'nombre de chapitres', '40 chapitres', 'longueur', 'limite'],
    answer:
      "Jusqu'à **40 chapitres** par projet. Au-delà de 30, générez par lots pour garder une qualité constante et un export fluide.",
    actions: [{ label: 'Ouvrir le générateur de sommaire', route: '/v3/outils/sommaire-ultime' }],
  },
  {
    id: 'export',
    question: 'Comment exporter en Word et PDF ?',
    keywords: ['export', 'exporter', 'word', 'docx', 'pdf', 'sommaire', 'table des matières'],
    answer:
      "Depuis votre projet, l'export génère un Word et un PDF avec sommaire paginé, styles de titres et pages de garde — au format Amazon KDP.",
    actions: [
      { label: 'Mes projets', route: '/v3/library' },
      { label: 'Audit avant publication', route: '/audit-pilot' },
    ],
  },
  {
    id: 'couverture',
    question: 'Comment faire une couverture professionnelle ?',
    keywords: ['couverture', 'cover', 'dos', 'tranche', 'kdp cover', 'illustration'],
    answer:
      "**Cover Studio KDP** pour une couverture Kindle ou poche prête à publier, et **Cover Studio Pro V3** pour une direction artistique premium avec variations et dos calculé.",
    actions: [
      { label: 'Cover Studio KDP', route: '/couverture-kdp' },
      { label: 'Cover Studio Pro V3', route: '/v3/cover-studio-pro' },
    ],
  },
  {
    id: 'audio',
    question: 'Puis-je faire un livre audio ?',
    keywords: ['audio', 'audiobook', 'voix', 'livre audio', 'mp3'],
    answer:
      "Oui : **Audiobook Studio** transforme vos chapitres en fichiers audio téléchargeables, prêts pour vos pages de vente.",
    actions: [{ label: 'Audiobook Studio', route: '/v3/outils/audiobook' }],
  },
  {
    id: 'motscles',
    question: 'Comment trouver mes mots-clés et ma niche Amazon ?',
    keywords: ['mots-clés', 'mots cles', 'niche', 'kdspy', 'bsr', 'catégorie', 'concurrence'],
    answer:
      "Commencez par les mots-clés Amazon (7 mots-clés backend), puis vérifiez la niche et la concurrence avant d'écrire.",
    actions: [
      { label: 'Mots-clés Amazon', route: '/kdp-keywords' },
      { label: '600 niches analysées', route: '/niches-600' },
      { label: 'Espion concurrents', route: '/v3/outils/espion-concurrents' },
    ],
  },
  {
    id: 'traduction',
    question: 'Puis-je traduire mon livre ?',
    keywords: ['traduction', 'traduire', 'langues', 'anglais', 'espagnol'],
    answer:
      "Oui, en 10 langues (EN, ES, DE, IT, PT, NL, PL, JA, ZH, AR) avec relecture IA chapitre par chapitre.",
    actions: [{ label: 'Traduire mon livre', route: '/v3/outils/traduction' }],
  },
  {
    id: 'forfaits',
    question: 'Quels sont les forfaits et les prix ?',
    keywords: ['prix', 'tarif', 'forfait', 'abonnement', 'plume', 'édition', 'combien'],
    answer:
      "Deux formules seulement : **Plume 27 €/mois** (270 €/an) et **Édition 47 €/mois** (470 €/an, tous les compléments inclus) — 2 mois offerts en annuel. Les 10 langues et le Sommaire IA sont dans les deux. Les anciens clients V2 gardent -20 % à vie.",
    actions: [
      { label: 'Voir les forfaits', route: '/v3/forfaits' },
      { label: 'Migration ancien client V2', route: '/v3/migration' },
    ],
  },
  {
    id: 'paiement',
    question: 'Je veux payer avec PayPal',
    keywords: ['paypal', 'paiement', 'payer', 'carte', 'stripe', 'facture'],
    answer:
      "PayPal et carte bancaire sont disponibles sur la page de commande, en paiement unique. Si un paiement bloque, dites-le-moi et je vous oriente vers le support.",
    actions: [
      { label: 'Page de commande', route: '/commander' },
      { label: 'Contacter le support', route: '/contact-support' },
    ],
  },
  {
    id: 'formation',
    question: 'Où sont les formations et les guides ?',
    keywords: ['formation', 'guide', 'tuto', 'vidéo', 'apprendre', 'masterclass'],
    answer:
      "La formation vidéo couvre toute la méthode, la Masterclass va plus loin (5 modules avancés), et le blog publie les guides détaillés.",
    actions: [
      { label: 'Formation vidéo', route: '/formation' },
      { label: 'Masterclass', route: '/masterclass' },
      { label: 'Guides & blog', route: '/blog' },
    ],
  },
  {
    id: 'outils',
    question: 'Où sont tous les outils ?',
    keywords: ['outils', 'tous les outils', 'onglets', 'trouver', 'catalogue', 'perdu'],
    answer:
      "Tout est réuni dans l'atelier : cartes illustrées par catégorie (Écriture, Visuel, Audio, KDP, Analyse, Marketing, Business, Formation), avec recherche.",
    actions: [
      { label: 'Tous les outils', route: '/v3/outils' },
      { label: 'Mon tableau de bord', route: '/v3/hub' },
    ],
  },
  {
    id: 'projets',
    question: 'Où sont mes livres enregistrés ?',
    keywords: ['mes projets', 'mes livres', 'sauvegarde', 'retrouver mon livre', 'bibliothèque'],
    answer:
      "Dans **Mes projets** : tous vos livres sont sauvegardés, reprenables et exportables à tout moment.",
    actions: [
      { label: 'Mes projets', route: '/v3/library' },
      { label: 'Gestion des livres', route: '/v3/mes-livres' },
    ],
  },
];

/** Routes autorisées pour les boutons d'action (aucun lien mort possible). */
export const ASSISTANT_ALLOWED_ROUTES: string[] = Array.from(
  new Set([
    ...V2_TOOLS.map((t) => t.route),
    ...ASSISTANT_JOURNEY.map((j) => j.route),
    ...ASSISTANT_FAQ.flatMap((f) => f.actions.map((a) => a.route)),
    '/v3/hub',
    '/v3/create',
    '/v3/corriger',
    '/v3/outils',
    '/v3/library',
    '/v3/compte',
    '/v3/forfaits',
    '/v3/migration',
    '/v3/studio',
    '/commander',
    '/contact-support',
    '/formation',
    '/blog',
    '/faq',
  ]),
);

export const isAllowedAssistantRoute = (route: string) =>
  ASSISTANT_ALLOWED_ROUTES.includes(route.split('#')[0]);

/** Catalogue compact envoyé à l'IA pour qu'elle propose la bonne destination. */
export const buildAssistantCatalog = () =>
  [
    ...ASSISTANT_JOURNEY.map((j) => ({ label: `${j.label} — ${j.tagline}`, route: j.route })),
    ...V2_TOOLS.map((t) => ({ label: `${t.label} — ${t.description}`, route: t.route })),
  ].slice(0, 90);

/** Réponse locale de secours quand l'IA est indisponible. */
export const findFaqAnswer = (question: string): AssistantFaqEntry | null => {
  const q = question.toLowerCase();
  let best: { entry: AssistantFaqEntry; score: number } | null = null;
  for (const entry of ASSISTANT_FAQ) {
    let score = 0;
    for (const k of entry.keywords) if (q.includes(k)) score += k.length;
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  return best?.entry ?? null;
};

export const ASSISTANT_QUICK_QUESTIONS = ASSISTANT_FAQ.slice(0, 8).map((f) => f.question);
