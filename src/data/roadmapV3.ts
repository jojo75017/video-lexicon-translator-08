// Roadmap V3 — Ebookstudio Pro V2 "Publication Assistée Pro"
// Prix cible : 197€ à vie (vs 67€ pour V2 actuelle)
// La liste reste éditable : on peut ajouter/retirer des modules.

export type V3Pillar = 'publier' | 'monetiser' | 'marketing' | 'ia' | 'edition' | 'distribution' | 'promotion';
export type V3Status = 'todo' | 'in_progress' | 'done';
export type V3Tier = 'core' | 'upsell';
export type V3PackId = 'cover' | 'marketing' | 'social' | 'monetisation' | 'editorial' | 'distribution' | 'promotion' | 'transcription';

export interface V3Module {
  id: string;
  title: string;
  pillar: V3Pillar;
  status: V3Status;
  description: string;
  /** 'core' = inclus dans la base 197€, 'upsell' = vendu en pack optionnel. Dérivé si absent. */
  tier?: V3Tier;
  /** Pack upsell auquel le module appartient (si tier = 'upsell'). Dérivé si absent. */
  pack?: V3PackId;
}

export const V3_PRICE = 197;
export const V2_PRICE = 67;

// ============= Carte cadeau Noël =============
// La Base 197€ offerte sous forme de carte cadeau avec -20% (158€).
// Ne débloque QUE la Base — les packs premium restent payants (upsell intact).
export const V3_GIFT_DISCOUNT = 0.20;
export const V3_GIFT_PRICE = Math.round(V3_PRICE * (1 - V3_GIFT_DISCOUNT)); // 158€

// ============= Grille tarifaire V3 =============
// Base 197€ + 7 packs upsell (total 661€) → 858€ à la pièce.
// Pack Tout Complet 497€ → débloque tout, économie de 361€.

export interface V3UpsellPack {
  id: V3PackId;
  title: string;
  desc: string;
  price: number;
  /** IDs des modules inclus dans ce pack. */
  modules: string[];
  /** Facilités de paiement affichées (optionnel). */
  installments?: string[];
  /** Badge marketing affiché (ex. « Opportunité »). */
  badge?: string;
  /** true = option spécialiste vendue uniquement à la carte (hors Pack Pro 497€). */
  alacarte?: boolean;
}

export const V3_UPSELL_PACKS: V3UpsellPack[] = [
  {
    id: 'monetisation',
    title: 'Pack Revenus & Scaling',
    desc: 'Maximise tes gains sur chaque vente : auto-pricing intelligent, royalties live, simulateur multi-prix, bundles, KDP Select, lead magnet, tunnel back-catalogue, détecteur KU et redevances print.',
    price: 99,
    modules: [
      'auto-pricing', 'royalties-dashboard', 'royalties-simulator', 'bundles-boxsets',
      'kdp-select-planner', 'lead-magnet', 'back-catalog-funnel', 'ku-niche-detector',
      'print-royalties-calc',
    ],
  },
  {
    id: 'distribution',
    title: 'Pack Distribution Large (Wide)',
    desc: 'Sors de l\'exclusivité Amazon et diffuse comme un éditeur : assistant multi-plateformes (Kobo, Apple Books, Google Play, Fnac), dépôt légal & ISBN, export EPUB normé et tableau de bord catalogue.',
    price: 97,
    modules: [
      'wide-distribution', 'legal-deposit-isbn', 'epub-normalizer', 'catalog-dashboard',
    ],
  },
  {
    id: 'social',
    title: 'Pack Trafic Social & Viralité',
    desc: 'Une machine à trafic gratuit : Pinterest auto-pins, hooks viraux TikTok/Reels, calendrier éditorial 30 jours, visuels citations, book trailer IA et kit influenceurs pour recycler ton livre partout.',
    price: 87,
    modules: [
      'pinterest-pins', 'tiktok-hooks', 'social-calendar-30', 'quote-visuals',
      'book-trailer', 'influencer-kit',
    ],
  },
  {
    id: 'editorial',
    title: 'Pack Qualité Éditoriale Pro',
    desc: 'Le travail d\'une vraie maison d\'édition AVANT publication : comité de lecture IA, édition structurelle, copy-editing & ligne éditoriale, charte de collection et label qualité certifiant.',
    price: 67,
    modules: [
      'reading-committee', 'developmental-edit', 'copy-editing-line',
      'collection-charter', 'quality-label',
    ],
  },
  // ===== Options spécialistes — vendues uniquement à la carte (hors Pack Pro 497€) =====
  {
    id: 'promotion',
    title: 'Pack Promotion Éditeur',
    desc: 'Les leviers promo réservés aux éditeurs : service de presse (SP), argumentaire libraires & salons, cession de droits étrangers et stratégie de précommandes.',
    price: 97,
    alacarte: true,
    modules: [
      'press-service', 'booksellers-fairs', 'foreign-rights', 'preorders-strategy',
    ],
  },
  {
    id: 'transcription',
    title: 'Transcription Audio / Vidéo → Texte',
    desc: 'Transforme n\'importe quel podcast, vidéo YouTube, interview ou note vocale en texte éditable, prêt à devenir un chapitre ou un livre entier. Transcription IA ultra-précise dans 99 langues, directement dans l\'interface.',
    price: 67,
    badge: 'Opportunité',
    alacarte: true,
    modules: ['audio-video-transcription'],
  },
];

/** Packs inclus dans le Pack Pro 497€ (hors options à la carte). */
export const V3_ESSENTIAL_PACKS = V3_UPSELL_PACKS.filter((p) => !p.alacarte);

/** Options spécialistes vendues uniquement à la carte. */
export const V3_ALACARTE_PACKS = V3_UPSELL_PACKS.filter((p) => p.alacarte);

/** Somme des packs essentiels (inclus dans le Pack Pro). */
export const V3_UPSELLS_TOTAL = V3_ESSENTIAL_PACKS.reduce((sum, p) => sum + p.price, 0);

/** Facilités de paiement de la base 197€. */
export const V3_BASE_INSTALLMENTS = ['1×197€', '3×69€'];

/** Pack Pro : la base 197€ + les 4 packs essentiels d'un coup. */
export const V3_FULL_PACK = {
  title: 'Pack Pro Vendeur',
  price: 347,
  /** Prix si on prend la base + les packs essentiels séparément. */
  compareAt: V3_PRICE + V3_UPSELLS_TOTAL, // 547
  saves: V3_PRICE + V3_UPSELLS_TOTAL - 347, // 200
  installments: ['1×347€', '3×119€', '4×89€'],
};

/** Map id de module → pack upsell (dérivé de V3_UPSELL_PACKS). */
const MODULE_TO_PACK: Record<string, V3PackId> = Object.fromEntries(
  V3_UPSELL_PACKS.flatMap((p) => p.modules.map((m) => [m, p.id])),
) as Record<string, V3PackId>;

/** Renvoie le pack d'un module (ou undefined s'il est dans la base). */
export function getModulePack(moduleId: string): V3PackId | undefined {
  return MODULE_TO_PACK[moduleId];
}

/** Renvoie le tier d'un module : 'upsell' s'il appartient à un pack, sinon 'core'. */
export function getModuleTier(moduleId: string): V3Tier {
  return MODULE_TO_PACK[moduleId] ? 'upsell' : 'core';
}

/** Niveau d'accès commercial d'un module. */
export type V3Access = 'included' | 'pack';

/**
 * Liste blanche des modules COMPRIS dans la base 197€.
 * Frontière : de l'idée jusqu'à publier proprement sur KDP.
 * Tout ce qui relève du marketing, de la vente, de la monétisation et de
 * l'IA avancée passe en pack premium (débloqué via le Pack Tout Complet 497€).
 * Source de vérité de l'inclusion : un module absent de ce set est premium par défaut.
 */
export const V3_BASE_MODULE_IDS = new Set<string>([
  // PUBLIER — essentiels de publication
  'library',
  'kdp-pack-zip',
  'cockpit-audit-pilot',
  'prepub-checklist',
  'kindle-previewer',
  'cover-pdf-exact',
  'multi-format-express',
  'isbn-metadata',
  'manuscript-converter',
  'content-compliance',
  'copyright-page',
  'back-matter-builder',
  'print-proof-checker',
  'categories-manager-10',
  'low-content-books',
  'onboarding-guides',
  // COUVERTURE — désormais incluse dans la base 197€
  'cover-studio-pro',
  'cover-variants-thumbnail',
  // LANCEMENT & VISIBILITÉ — ex-pack 147€, désormais inclus dans la base 197€
  'listing-optimizer',
  'launch-sequence-j7',
  'amazon-ads',
  'launch-pricing',
  'media-kit',
  'look-inside-optimizer',
  'editorial-reviews',
  'bookbub-ad-builder',
  'author-page-optimizer',
  // IA — création + recherche de niche essentielles
  'book-creation-studio',
  'niche-intelligence',
  'p16-competitive',
  // Infra (admin, non commerciale)
  'pricing-ladder-497',
  'installment-payments',
]);

/**
 * Droit d'accès d'un module :
 *   - 'included' = compris dans la base 197€ (liste blanche `V3_BASE_MODULE_IDS`)
 *   - 'pack'     = nécessite un pack premium / le Pack Tout Complet
 */
export function getModuleAccess(moduleId: string): V3Access {
  return V3_BASE_MODULE_IDS.has(moduleId) ? 'included' : 'pack';
}

export const V3_PILLAR_META: Record<V3Pillar, { label: string; color: string; emoji: string }> = {
  publier:      { label: 'Publier',         color: '#008296', emoji: '📦' },
  monetiser:    { label: 'Monétiser',       color: '#FF9E2D', emoji: '💰' },
  marketing:    { label: 'Marketing',       color: '#7C3AED', emoji: '📣' },
  ia:           { label: 'IA avancée',      color: '#10B981', emoji: '🧠' },
  edition:      { label: 'Édition Pro',     color: '#9B2335', emoji: '📕' },
  distribution: { label: 'Distribution',    color: '#1D4ED8', emoji: '🌍' },
  promotion:    { label: 'Promotion',       color: '#B8860B', emoji: '📰' },
};

// Variante "Midnight Indigo" — utilisée uniquement en mode V3 (cockpit admin).
export const V3_PILLAR_COLORS: Record<V3Pillar, string> = {
  publier:      '#6366f1',
  monetiser:    '#818cf8',
  marketing:    '#a5b4fc',
  ia:           '#38bdf8',
  edition:      '#f87171',
  distribution: '#60a5fa',
  promotion:    '#fbbf24',
};

export const V3_MODULES: V3Module[] = [
  // PUBLIER
  { id: 'library',             pillar: 'publier',   status: 'done', title: 'BIBLIOTHÈQUE — Mes Créations',
    description: 'Toutes vos créations au même endroit : livres numériques et audio avec actions Modifier, Publier, Exporter, Supprimer.' },
  { id: 'kdp-pack-zip',        pillar: 'publier',   status: 'done', title: 'Pack KDP ZIP',
    description: 'Export bundle PDF intérieur + couverture + métadonnées prêt upload Amazon.' },
  { id: 'cockpit-audit-pilot', pillar: 'publier',   status: 'done', title: 'Cockpit Audit Pilot',
    description: 'Score de conformité KDP (marges, polices, ISBN, bleed, Modulo 10).' },
  { id: 'prepub-checklist',    pillar: 'publier',   status: 'done', title: 'Checklist Prépublication',
    description: '25 points cochables avant clic "Publier" sur KDP.' },
  { id: 'kindle-previewer',    pillar: 'publier',   status: 'done', title: 'Kindle Previewer Simulé',
    description: 'Aperçu visuel Kindle / tablette / phone avec rendu typographique fidèle.' },
  { id: 'cover-pdf-exact',     pillar: 'publier',   status: 'done', title: 'Couverture KDP Exacte (PDF)',
    description: 'Génère le PDF wrap complet (4e + dos + 1re) aux dimensions exactes KDP, bleed + zone ISBN, prêt à uploader.' },
  { id: 'cover-studio-pro',    pillar: 'publier',   status: 'done', title: 'Cover Studio Pro — Couvertures Premium IA',
    description: 'Génère des couvertures photoréalistes haut de gamme (qualité maison d’édition) avec direction artistique automatique, presets bestseller par niche, variations multiples et test de lisibilité miniature Amazon.' },

  // MONÉTISER
  { id: 'sales-tracker',       pillar: 'monetiser', status: 'done', title: 'Tracker Ventes KDP',
    description: 'Import CSV royalties Amazon + graphes revenus mensuels / par titre.' },
  { id: 'aplus-generator',     pillar: 'monetiser', status: 'done', title: 'Générateur Page A+',
    description: 'Génère le HTML Amazon A+ Content avec visuels et blocs prêts à coller.' },
  { id: 'auto-pricing',        pillar: 'monetiser', status: 'done', title: 'Auto-Pricing IA',
    description: 'Suggère le prix optimal selon niche, concurrence et longueur.' },

  // MARKETING
  { id: 'listing-optimizer',     pillar: 'marketing', status: 'done', title: "Optimiseur d'annonces KDP",
    description: 'Optimise titre, sous-titre, mots-clés KDP, catégories, description, contenu A+ et tarification du livre.' },
  { id: 'launch-sequence-j7',  pillar: 'marketing', status: 'done', title: 'Séquence Lancement J-7',
    description: 'Emails + posts sociaux pré-programmés sur 7 jours avant publication.' },
  { id: 'amazon-ads',          pillar: 'marketing', status: 'done', title: 'Amazon Ads Generator',
    description: 'Campagnes Sponsored Products / Brands avec mots-clés ciblés.' },
  { id: 'pinterest-pins',      pillar: 'marketing', status: 'done', title: 'Pinterest Auto-Pins',
    description: '20 pins générés automatiquement depuis la couverture du livre.' },

  // IA AVANCÉE
  { id: 'book-creation-studio', pillar: 'ia',        status: 'done', title: 'STUDIO — Création de Livres',
    description: 'Assistant 6 étapes (Taper, Détails, Générer, Aperçu, Exporter, Publier) avec choix du type de livre, titre, sous-titre et mots-clés.' },
  { id: 'p16-competitive',     pillar: 'ia',        status: 'done', title: 'SCOUT — Analyse Concurrentielle (P16)',
    description: 'Scan top 10 Amazon de la niche pour positionnement et angles.' },
  { id: 'niche-intelligence',    pillar: 'ia',        status: 'done', title: 'INTEL — Intelligence de Niche',
    description: '4 onglets : découverte IA (SCOUT), niches cachées, prédicteur de tendances (VIGIE) et 600+ idées par catégorie.' },
  { id: 'p17-series',          pillar: 'ia',        status: 'done', title: 'SAGA — Architecte de Série (P17)',
    description: 'Plan cohérent des tomes 2 / 3 / 4 (arcs, persos, cliffhangers).' },

  // ===== AJOUTS — lancement progressif juillet / août =====

  // PUBLIER
  { id: 'multi-format-express', pillar: 'publier',  status: 'done', title: 'Multi-format Express',
    description: 'Export simultané Kindle (.epub/.mobi), broché PDF KDP et grand format relié en un clic.' },
  { id: 'audiobook-express',    pillar: 'publier',  status: 'done', title: 'Audiobook Express', tier: 'upsell',
    description: 'Prépare la version audio du livre : script de narration, découpage par chapitre et plan TTS prêt à produire.' },
  { id: 'isbn-metadata',        pillar: 'publier',  status: 'done', title: 'ISBN & Métadonnées Manager',
    description: 'Centralise ISBN, BISAC, catégories, mots-clés, langue et droits par titre.' },
  { id: 'translation-markets',  pillar: 'publier',  status: 'done', title: 'Traduction Multi-Marchés',
    description: 'Traduit et adapte le livre pour Amazon US/UK/DE/ES via IA, avec ajustement culturel.' },

  // MONÉTISER
  { id: 'royalties-dashboard',  pillar: 'monetiser', status: 'done', title: 'Royalties Dashboard Live',
    description: 'Import KDP avec prévisions de revenus et alertes seuils.' },
  { id: 'bundles-boxsets',      pillar: 'monetiser', status: 'done', title: 'Bundles & Box Sets',
    description: 'Génère des offres groupées (séries) avec pricing optimisé et page de vente.' },
  { id: 'lead-magnet',          pillar: 'monetiser', status: 'done', title: 'Lead Magnet Builder',
    description: 'Crée un chapitre offert + tunnel de capture email pour bâtir une liste lecteurs.' },

  // MARKETING
  { id: 'book-trailer',         pillar: 'marketing', status: 'done', title: 'Book Trailer IA',
    description: 'Génère une vidéo promo courte (script + visuels + voix) depuis la couverture.' },
  { id: 'reviews-booster',      pillar: 'marketing', status: 'done', title: 'Reviews Booster',
    description: "Séquence d'emails post-achat pour obtenir des avis Amazon légitimes." },
  { id: 'tiktok-hooks',         pillar: 'marketing', status: 'done', title: 'TikTok / Reels Hooks',
    description: '20 accroches vidéo + scripts BookTok adaptés à la niche.' },
  { id: 'author-newsletter',    pillar: 'marketing', status: 'done', title: 'Newsletter Auteur',
    description: "Templates et calendrier d'emails pour fidéliser les lecteurs." },

  // IA AVANCÉE
  { id: 'p18-readability',      pillar: 'ia',        status: 'done', title: 'LUMEN — Audit Lisibilité (P18)',
    description: 'Score de lisibilité, rythme, longueur de phrases et suggestions par chapitre.' },
  { id: 'p19-author-voice',     pillar: 'ia',        status: 'done', title: "ÉCHO — Voix d'Auteur Persistante (P19)",
    description: 'Mémorise et applique le style signature sur toute une série.' },
  { id: 'p20-chat-manuscript',  pillar: 'ia',        status: 'done', title: 'ORACLE — Chat Manuscrit (P20)',
    description: 'Pose des questions à ton propre livre (cohérence, résumé, fiches persos).' },
  { id: 'audio-video-transcription', pillar: 'ia', status: 'done', tier: 'upsell', title: 'Transcription Audio / Vidéo → Texte',
    description: 'Convertit tes fichiers audio et vidéo (podcasts, interviews, conférences, YouTube, notes vocales) en texte propre, ponctué et éditable directement dans l\'interface — jusqu\'à 99 langues. Idéal pour transformer du contenu parlé en chapitres de livre.' },

  // ===== AJOUTS — issus du guide publication KDP (modules 03 → 08) — en attente =====

  // PUBLIER
  { id: 'cover-variants-thumbnail', pillar: 'publier',  status: 'done', title: 'Cover Designer 6 Variantes + Test Miniature',
    description: 'Génère 6 variantes de couverture et les affiche en 200×300 px pour valider la lisibilité du titre dans les résultats Amazon.' },
  { id: 'categories-manager-10',    pillar: 'publier',  status: 'done', title: 'Gestionnaire de Catégories 10/livre',
    description: 'Sélectionne 2 catégories optimales (1 large + 1 spécifique) puis prépare la demande des 8 catégories supplémentaires via le support KDP.' },

  // MONÉTISER
  { id: 'sales-description',        pillar: 'monetiser', status: 'done', title: 'Description Vendeuse (5 parties)',
    description: 'Rédige une description style page de vente : accroche, agitation, promesse, 5–7 bénéfices, CTA, avec mots de conversion (1500–2500 caractères).' },

  // MARKETING
  { id: 'arc-team-builder',         pillar: 'marketing', status: 'done', title: "Constructeur d'Équipe ARC",
    description: 'Recrute 10–30 lecteurs ARC, gère l’envoi du manuscrit et suit les objectifs d’avis (10 à J14, 25 à J30, 50 à J60).' },

  // ===== AJOUTS — propositions pour enrichir la V3 — en attente =====

  // PUBLIER
  { id: 'back-matter-builder',  pillar: 'publier',   status: 'done', title: 'Pages de Fin Automatiques',
    description: 'Génère les pages de fin : appel à laisser un avis, « Du même auteur », bio + lien newsletter, à insérer en fin d’ebook.' },
  { id: 'print-proof-checker',  pillar: 'publier',   status: 'done', title: "Vérificateur d'Épreuve Broché",
    description: 'Contrôle bleed, marge de reliure (gutter), dos et code-barres avant de commander l’épreuve papier KDP.' },

  // MONÉTISER
  { id: 'kdp-select-planner',   pillar: 'monetiser', status: 'done', title: 'Planificateur KDP Select / KU',
    description: 'Calendrier des 5 jours promo gratuits + Countdown Deals optimisés sur la période de 90 jours.' },
  { id: 'back-catalog-funnel',  pillar: 'monetiser', status: 'done', title: 'Tunnel de Back-Catalogue',
    description: 'Liens croisés entre tomes et titres pour maximiser le read-through et les ventes en chaîne.' },

  // MARKETING
  { id: 'author-page-optimizer', pillar: 'marketing', status: 'done', title: 'Optimiseur Page Auteur Amazon',
    description: 'Optimise Author Central : bio, photo, mots-clés et mise en avant des titres pour convertir les visiteurs.' },
  { id: 'bookbub-ad-builder',    pillar: 'marketing', status: 'done', title: 'Générateur Annonces BookBub / Facebook',
    description: 'Crée visuels et accroches ciblés par niche pour les campagnes BookBub et Facebook Ads.' },

  // IA AVANCÉE
  { id: 'p21-blurb-ab-tester',   pillar: 'ia',        status: 'done', title: 'DUEL — A/B Test 4e de Couverture (P21)',
    description: 'Génère plusieurs variantes de 4e de couverture et les score pour identifier la plus vendeuse.' },
  { id: 'p22-trend-radar',       pillar: 'ia',        status: 'done', title: 'VIGIE — Radar de Tendances (P22)',
    description: 'Détecte sujets émergents et saisonnalité d’une niche pour choisir le prochain livre à écrire.' },

  // ===== AJOUTS V3 — enrichissement octobre (nouveaux modules) — à construire =====

  // PUBLIER
  { id: 'manuscript-converter',  pillar: 'publier',   status: 'done', title: 'Convertisseur Manuscrit Universel',
    description: 'Importe .docx/.pdf/Google Docs et nettoie automatiquement (styles, sauts de page, notes) vers un format KDP propre.' },
  { id: 'content-compliance',    pillar: 'publier',   status: 'done', title: 'Vérificateur de Conformité Contenu',
    description: 'Détecte le contenu interdit KDP (liens, mentions concurrents, langage promo) avant soumission pour éviter le blocage.' },
  { id: 'copyright-page',        pillar: 'publier',   status: 'done', title: 'Générateur Page Copyright / Mentions légales',
    description: 'Page légale + dédicace + table des matières cliquable, multi-langue, prête à insérer.' },
  { id: 'ebook-anti-plagiat',    pillar: 'publier',   status: 'done', title: 'Ebook Anti-Plagiat — Protection & Défense',
    description: 'Protège ton ebook avant publication (copyright renforcé, traçage), surveille le web (alertes + audit hebdo), réagis en cas de plagiat (email de retrait KDP, preuves) et télécharge le Pack Anti-Plagiat PDF.' },

  // MONÉTISER
  { id: 'royalties-simulator',   pillar: 'monetiser', status: 'done', title: 'Simulateur de Royalties Multi-Prix',
    description: 'Compare les gains nets 35% vs 70% selon prix et marché, avec point d’équilibre.' },
  { id: 'ku-niche-detector',     pillar: 'monetiser', status: 'done', title: 'Détecteur de Niches Rentables (KU)',
    description: 'Croise demande et concurrence pour estimer le potentiel de pages lues Kindle Unlimited.' },
  { id: 'launch-pricing',        pillar: 'monetiser', status: 'done', title: 'Stratégie de Prix de Lancement Dynamique',
    description: 'Calendrier de prix montant (0,99€ → prix cible) sur les premiers jours de lancement.' },

  // MARKETING
  { id: 'social-calendar-30',    pillar: 'marketing', status: 'done', title: 'Calendrier Éditorial Réseaux 30 jours',
    description: 'Planning de posts multi-plateformes généré automatiquement depuis le livre.' },
  { id: 'quote-visuals',         pillar: 'marketing', status: 'done', title: 'Générateur de Visuels Citations',
    description: 'Extrait des phrases fortes du manuscrit et les transforme en visuels partageables.' },
  { id: 'media-kit',             pillar: 'marketing', status: 'done', title: 'Kit Presse / Media Kit Auteur',
    description: 'Dossier de presse (bio, pitch, couverture HD, FAQ) prêt à envoyer aux médias.' },
  { id: 'goodreads-optimizer',   pillar: 'marketing', status: 'done', title: 'Optimiseur Goodreads',
    description: 'Fiche, description et plan d’animation lecteurs optimisés pour Goodreads.' },
  { id: 'influencer-kit',        pillar: 'marketing', status: 'done', title: 'Kit Influenceurs TikTok / Insta',
    description: 'Génère un lien + code de suivi unique par influenceur, message d’approche prêt à coller, mockup premium et PDF "Dossier Influenceur" (scripts vidéo inclus). Commission 30% : 20,10€/vente maintenant (67€) → 59,10€/vente dès le 1er octobre (197€ V3). Page publique partageable : /influenceurs.' },

  // IA AVANCÉE
  { id: 'p23-universe-bible',    pillar: 'ia',        status: 'done', title: 'BIBLE — Cohérence Univers (P23)',
    description: 'Vérifie la continuité des noms, lieux et timeline sur toute une série.' },
  { id: 'p24-cliche-detector',  pillar: 'ia',        status: 'done', title: 'NETTOYAGE — Clichés & Répétitions (P24)',
    description: 'Repère les tics d’écriture, répétitions et formules toutes faites.' },
  { id: 'p25-tone-adapter',     pillar: 'ia',        status: 'done', title: 'CAMÉLÉON — Adaptation de Ton (P25)',
    description: 'Réécrit un passage selon la cible (ados, professionnels, grand public).' },
  { id: 'p26-commercial-score', pillar: 'ia',        status: 'done', title: 'PRONOSTIC — Score Potentiel Commercial (P26)',
    description: 'Note hook, titre, couverture et niche pour estimer le potentiel commercial.' },

  // ===== AJOUTS V3 — compléments KDP oubliés — à construire =====

  // PUBLIER
  { id: 'low-content-books',     pillar: 'publier',   status: 'done', title: 'Studio Livres à Contenu Faible/Nul',
    description: 'Générateur de carnets, journaux, planners, agendas et cahiers (lignés, pointillés, vierges) : le marché KDP « low/no-content ». Intérieurs PDF prêts aux formats KDP.' },

  // MONÉTISER
  { id: 'print-royalties-calc',  pillar: 'monetiser', status: 'done', title: 'Calculateur de Redevances Print',
    description: 'Coût d’impression KDP exact (pages, couleur/N&B, format broché/relié) et marge nette réelle par marché (US/UK/DE/FR), au-delà du simulateur ebook 35%/70%.' },

  // MARKETING
  { id: 'look-inside-optimizer', pillar: 'marketing', status: 'done', title: 'Optimiseur « Look Inside »',
    description: 'Optimise les premières pages de l’aperçu Amazon (« Regard à l’intérieur ») pour convertir : ordre des pages, accroche d’ouverture et ce qui doit apparaître avant le seuil de prévisualisation.' },
  { id: 'editorial-reviews',     pillar: 'marketing', status: 'done', title: 'Avis Éditoriaux (Editorial Reviews)',
    description: 'Génère des citations d’avis professionnelles pour la section « Editorial Reviews » de la fiche Amazon, distincte des avis lecteurs.' },

  // ===== AJOUTS V3 — Communauté KDP Premium — à construire =====

  // MARKETING
  { id: 'community-kdp-hub',        pillar: 'marketing', status: 'done', title: 'Communauté KDP Premium — Hub de Solutions',
    description: 'Forum premium façon communauté officielle Amazon KDP : encarts combinés rubriques KDP (Marketing & Promotion, Page Amazon, Paiements & Ventes, Gestion du livre, Compte KDP, Mise en forme, Voix de l’auteur, Audiobooks Voix Virtuelle, Traduction Kindle) + encarts liés aux outils du générateur. Lecture publique (SEO), écriture réservée aux abonnés.' },
  { id: 'community-pinned-solutions', pillar: 'marketing', status: 'done', title: 'Solutions & FAQ Épinglées',
    description: 'Articles de solutions types épinglés en haut de chaque encart (compte suspendu, royalties retenues, blocage de contenu, conformité, mise en forme refusée…), éditables par l’admin.' },
  { id: 'community-tool-deeplinks',  pillar: 'marketing', status: 'done', title: 'Liens Directs vers l’Outil',
    description: 'Chaque encart/problème renvoie vers le module du générateur qui résout le blocage (conformité → Vérificateur de Conformité Contenu, couverture refusée → Couverture KDP Exacte, prix → Auto-Pricing, etc.).' },

  // IA AVANCÉE
  { id: 'community-ai-unblock',     pillar: 'ia',        status: 'done', title: 'Assistant IA Débloquage KDP',
    description: 'Bouton « Débloquer avec l’IA » : à partir de la question/blocage de l’abonné, génère une solution KDP concrète (étapes, modèle d’email au support KDP si besoin) et propose l’outil interne adapté.' },

  // ===== AJOUTS V3 — Tunnel de prix 497€ + paiement échelonné — à construire (AOÛT) =====

  // MONÉTISER
  { id: 'pricing-ladder-497',       pillar: 'monetiser', status: 'done', title: 'Échelle de Prix 347€ (Upsells + Pack Tout Inclus)',
    description: 'Parcours commercial menant à 347€ : V3 197€ + order bump guides avancés 47€ + OTO1 visuels 67€ + OTO2 communauté/coaching 36€ (= 347€), OU bouton unique « Pack Pro Vendeur » à 347€. Source unique de vérité dans un module pricing dédié.' },
  { id: 'installment-payments',     pillar: 'monetiser', status: 'done', title: 'Paiement Échelonné Sécurisé (3×119€ / 4×89€)',
    description: 'Pack payable en 1×347€, 3×119€ (357€) ou 4×89€ (356€). Géré par abonnement Stripe à durée limitée pour détecter les échecs. COUPURE AUTOMATIQUE de l’accès 3 JOURS après un paiement échoué (statut suspended → SubscriberGate bloque le lien) ; réactivation auto à la régularisation ; bascule en accès à vie une fois toutes les échéances payées. Relances email Resend à chaque échec + à la suspension.' },

  // PUBLIER — Guides nouveaux abonnés (mix : base offerte + avancés payants)
  { id: 'onboarding-guides',        pillar: 'publier',   status: 'done', title: 'Guides Nouveaux Abonnés (Onboarding 7 jours)',
    description: 'Mix : onboarding « Premiers pas KDP en 7 jours » + 2 guides de base OFFERTS pour activer les nouveaux abonnés ; guides avancés verrouillés avec CTA vers order bump / upsell. Mise en ligne prévue en août avec le tunnel 497€.' },

  // ===== AJOUTS V3 — Maison d'édition — packs upsell — à construire =====

  // ÉDITION PRO (Pack Qualité Éditoriale Pro 67€)
  { id: 'reading-committee',     pillar: 'edition',      status: 'done', title: 'Comité de Lecture IA',
    description: 'Fiche de lecture professionnelle comme en maison d\'édition : synopsis, points forts/faibles, public cible, potentiel commercial et verdict argumenté « accepté / à retravailler / refusé ».' },
  { id: 'developmental-edit',    pillar: 'edition',      status: 'done', title: 'Édition Structurelle (Developmental Edit)',
    description: 'Analyse de la structure narrative/argumentaire : rythme, cohérence des chapitres, promesses tenues, longueurs et suggestions concrètes de réorganisation.' },
  { id: 'copy-editing-line',     pillar: 'edition',      status: 'done', title: 'Copy-editing & Ligne Éditoriale',
    description: 'Passe d\'édition phrase à phrase (style, registre, fluidité, répétitions) au-delà de la simple correction, dans le strict respect du fond et de la voix de l\'auteur.' },
  { id: 'collection-charter',    pillar: 'edition',      status: 'done', title: 'Charte de Collection',
    description: 'Définit une collection éditoriale cohérente (ton, format, gabarit de couverture, mentions, promesse de lecture) réutilisable sur plusieurs titres pour bâtir un vrai catalogue.' },
  { id: 'quality-label',         pillar: 'edition',      status: 'done', title: 'Label Qualité Maison d\'Édition',
    description: 'Checklist certifiante « niveau édition pro » couvrant éditorial, mise en forme et métadonnées ; appose un badge qualité une fois tous les contrôles validés.' },

  // DISTRIBUTION (Pack Distribution Large 97€)
  { id: 'wide-distribution',     pillar: 'distribution', status: 'done', title: 'Assistant Distribution Multi-Plateformes',
    description: 'Guide pas-à-pas + métadonnées formatées pour diffuser au-delà d\'Amazon : Kobo, Apple Books, Google Play, Fnac/ePagine, via agrégateurs (Draft2Digital / StreetLib).' },
  { id: 'legal-deposit-isbn',    pillar: 'distribution', status: 'done', title: 'Dépôt Légal & ISBN',
    description: 'Accompagnement du dépôt légal BNF, gestion d\'un registre ISBN par titre et par collection, et ISSN pour les séries.' },
  { id: 'epub-normalizer',       pillar: 'distribution', status: 'done', title: 'Export EPUB Normé (EPUB 3)',
    description: 'Vérifie et corrige la conformité EPUB 3 (table des matières, métadonnées, structure) exigée par les plateformes wide, au-delà du flux KDP actuel.' },
  { id: 'catalog-dashboard',     pillar: 'distribution', status: 'done', title: 'Tableau de Bord Catalogue',
    description: 'Vue d\'ensemble du catalogue éditeur : titres, collections, statut de diffusion par canal, ISBN et dépôt légal en un coup d\'œil.' },

  // PROMOTION (Pack Promotion Éditeur 97€)
  { id: 'press-service',         pillar: 'promotion',    status: 'done', title: 'Service de Presse (SP)',
    description: 'Génère le dossier de presse, le communiqué, une liste-type de journalistes/blogueurs littéraires par genre et les e-mails d\'envoi de service de presse.' },
  { id: 'booksellers-fairs',     pillar: 'promotion',    status: 'done', title: 'Libraires & Salons',
    description: 'Argumentaire libraire, fiche office, et préparation des salons et séances de dédicaces (pitch, supports, logistique).' },
  { id: 'foreign-rights',        pillar: 'promotion',    status: 'done', title: 'Droits Étrangers',
    description: 'Pitch de cession des droits de traduction (rights guide) et repérage des marchés porteurs par genre pour vendre le livre à l\'international.' },
  { id: 'preorders-strategy',    pillar: 'promotion',    status: 'done', title: 'Stratégie de Précommandes',
    description: 'Stratégie et calendrier de précommande multi-plateformes pour concentrer les ventes au lancement et booster le classement.' },
];

/** Renvoie un module V3 par son id. */
export function getModuleById(id: string): V3Module | undefined {
  return V3_MODULES.find((m) => m.id === id);
}
