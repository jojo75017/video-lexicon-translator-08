// Roadmap V3 — Ebookstudio Pro V2 "Publication Assistée Pro"
// Prix cible : 197€ à vie (vs 67€ pour V2 actuelle)
// La liste reste éditable : on peut ajouter/retirer des modules.

export type V3Pillar = 'publier' | 'monetiser' | 'marketing' | 'ia';
export type V3Status = 'todo' | 'in_progress' | 'done';

export interface V3Module {
  id: string;
  title: string;
  pillar: V3Pillar;
  status: V3Status;
  description: string;
}

export const V3_PRICE = 197;
export const V2_PRICE = 67;

export const V3_PILLAR_META: Record<V3Pillar, { label: string; color: string; emoji: string }> = {
  publier:    { label: 'Publier',    color: '#008296', emoji: '📦' },
  monetiser:  { label: 'Monétiser',  color: '#FF9E2D', emoji: '💰' },
  marketing:  { label: 'Marketing',  color: '#7C3AED', emoji: '📣' },
  ia:         { label: 'IA avancée', color: '#10B981', emoji: '🧠' },
};

// Variante "Midnight Indigo" — utilisée uniquement en mode V3 (cockpit admin).
export const V3_PILLAR_COLORS: Record<V3Pillar, string> = {
  publier:    '#6366f1',
  monetiser:  '#818cf8',
  marketing:  '#a5b4fc',
  ia:         '#38bdf8',
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

  // MONÉTISER
  { id: 'sales-tracker',       pillar: 'monetiser', status: 'todo', title: 'Tracker Ventes KDP',
    description: 'Import CSV royalties Amazon + graphes revenus mensuels / par titre.' },
  { id: 'aplus-generator',     pillar: 'monetiser', status: 'todo', title: 'Générateur Page A+',
    description: 'Génère le HTML Amazon A+ Content avec visuels et blocs prêts à coller.' },
  { id: 'auto-pricing',        pillar: 'monetiser', status: 'todo', title: 'Auto-Pricing IA',
    description: 'Suggère le prix optimal selon niche, concurrence et longueur.' },

  // MARKETING
  { id: 'listing-optimizer',     pillar: 'marketing', status: 'done', title: "Optimiseur d'annonces KDP",
    description: 'Optimise titre, sous-titre, mots-clés KDP, catégories, description, contenu A+ et tarification du livre.' },
  { id: 'launch-sequence-j7',  pillar: 'marketing', status: 'todo', title: 'Séquence Lancement J-7',
    description: 'Emails + posts sociaux pré-programmés sur 7 jours avant publication.' },
  { id: 'amazon-ads',          pillar: 'marketing', status: 'todo', title: 'Amazon Ads Generator',
    description: 'Campagnes Sponsored Products / Brands avec mots-clés ciblés.' },
  { id: 'pinterest-pins',      pillar: 'marketing', status: 'todo', title: 'Pinterest Auto-Pins',
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
  { id: 'isbn-metadata',        pillar: 'publier',  status: 'done', title: 'ISBN & Métadonnées Manager',
    description: 'Centralise ISBN, BISAC, catégories, mots-clés, langue et droits par titre.' },
  { id: 'translation-markets',  pillar: 'publier',  status: 'done', title: 'Traduction Multi-Marchés',
    description: 'Traduit et adapte le livre pour Amazon US/UK/DE/ES via IA, avec ajustement culturel.' },

  // MONÉTISER
  { id: 'royalties-dashboard',  pillar: 'monetiser', status: 'todo', title: 'Royalties Dashboard Live',
    description: 'Import KDP avec prévisions de revenus et alertes seuils.' },
  { id: 'bundles-boxsets',      pillar: 'monetiser', status: 'todo', title: 'Bundles & Box Sets',
    description: 'Génère des offres groupées (séries) avec pricing optimisé et page de vente.' },
  { id: 'lead-magnet',          pillar: 'monetiser', status: 'todo', title: 'Lead Magnet Builder',
    description: 'Crée un chapitre offert + tunnel de capture email pour bâtir une liste lecteurs.' },

  // MARKETING
  { id: 'book-trailer',         pillar: 'marketing', status: 'todo', title: 'Book Trailer IA',
    description: 'Génère une vidéo promo courte (script + visuels + voix) depuis la couverture.' },
  { id: 'reviews-booster',      pillar: 'marketing', status: 'todo', title: 'Reviews Booster',
    description: "Séquence d'emails post-achat pour obtenir des avis Amazon légitimes." },
  { id: 'tiktok-hooks',         pillar: 'marketing', status: 'todo', title: 'TikTok / Reels Hooks',
    description: '20 accroches vidéo + scripts BookTok adaptés à la niche.' },
  { id: 'author-newsletter',    pillar: 'marketing', status: 'todo', title: 'Newsletter Auteur',
    description: "Templates et calendrier d'emails pour fidéliser les lecteurs." },

  // IA AVANCÉE
  { id: 'p18-readability',      pillar: 'ia',        status: 'done', title: 'LUMEN — Audit Lisibilité (P18)',
    description: 'Score de lisibilité, rythme, longueur de phrases et suggestions par chapitre.' },
  { id: 'p19-author-voice',     pillar: 'ia',        status: 'done', title: "ÉCHO — Voix d'Auteur Persistante (P19)",
    description: 'Mémorise et applique le style signature sur toute une série.' },
  { id: 'p20-chat-manuscript',  pillar: 'ia',        status: 'done', title: 'ORACLE — Chat Manuscrit (P20)',
    description: 'Pose des questions à ton propre livre (cohérence, résumé, fiches persos).' },

  // ===== AJOUTS — issus du guide publication KDP (modules 03 → 08) — en attente =====

  // PUBLIER
  { id: 'cover-variants-thumbnail', pillar: 'publier',  status: 'done', title: 'Cover Designer 6 Variantes + Test Miniature',
    description: 'Génère 6 variantes de couverture et les affiche en 200×300 px pour valider la lisibilité du titre dans les résultats Amazon.' },
  { id: 'categories-manager-10',    pillar: 'publier',  status: 'done', title: 'Gestionnaire de Catégories 10/livre',
    description: 'Sélectionne 2 catégories optimales (1 large + 1 spécifique) puis prépare la demande des 8 catégories supplémentaires via le support KDP.' },

  // MONÉTISER
  { id: 'sales-description',        pillar: 'monetiser', status: 'todo', title: 'Description Vendeuse (5 parties)',
    description: 'Rédige une description style page de vente : accroche, agitation, promesse, 5–7 bénéfices, CTA, avec mots de conversion (1500–2500 caractères).' },

  // MARKETING
  { id: 'arc-team-builder',         pillar: 'marketing', status: 'todo', title: "Constructeur d'Équipe ARC",
    description: 'Recrute 10–30 lecteurs ARC, gère l’envoi du manuscrit et suit les objectifs d’avis (10 à J14, 25 à J30, 50 à J60).' },

  // ===== AJOUTS — propositions pour enrichir la V3 — en attente =====

  // PUBLIER
  { id: 'back-matter-builder',  pillar: 'publier',   status: 'done', title: 'Pages de Fin Automatiques',
    description: 'Génère les pages de fin : appel à laisser un avis, « Du même auteur », bio + lien newsletter, à insérer en fin d’ebook.' },
  { id: 'print-proof-checker',  pillar: 'publier',   status: 'done', title: "Vérificateur d'Épreuve Broché",
    description: 'Contrôle bleed, marge de reliure (gutter), dos et code-barres avant de commander l’épreuve papier KDP.' },

  // MONÉTISER
  { id: 'kdp-select-planner',   pillar: 'monetiser', status: 'todo', title: 'Planificateur KDP Select / KU',
    description: 'Calendrier des 5 jours promo gratuits + Countdown Deals optimisés sur la période de 90 jours.' },
  { id: 'back-catalog-funnel',  pillar: 'monetiser', status: 'todo', title: 'Tunnel de Back-Catalogue',
    description: 'Liens croisés entre tomes et titres pour maximiser le read-through et les ventes en chaîne.' },

  // MARKETING
  { id: 'author-page-optimizer', pillar: 'marketing', status: 'todo', title: 'Optimiseur Page Auteur Amazon',
    description: 'Optimise Author Central : bio, photo, mots-clés et mise en avant des titres pour convertir les visiteurs.' },
  { id: 'bookbub-ad-builder',    pillar: 'marketing', status: 'todo', title: 'Générateur Annonces BookBub / Facebook',
    description: 'Crée visuels et accroches ciblés par niche pour les campagnes BookBub et Facebook Ads.' },

  // IA AVANCÉE
  { id: 'p21-blurb-ab-tester',   pillar: 'ia',        status: 'done', title: 'DUEL — A/B Test 4e de Couverture (P21)',
    description: 'Génère plusieurs variantes de 4e de couverture et les score pour identifier la plus vendeuse.' },
  { id: 'p22-trend-radar',       pillar: 'ia',        status: 'done', title: 'VIGIE — Radar de Tendances (P22)',
    description: 'Détecte sujets émergents et saisonnalité d’une niche pour choisir le prochain livre à écrire.' },
];
