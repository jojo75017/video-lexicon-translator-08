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

export const V3_MODULES: V3Module[] = [
  // PUBLIER
  { id: 'kdp-pack-zip',        pillar: 'publier',   status: 'todo', title: 'Pack KDP ZIP',
    description: 'Export bundle PDF intérieur + couverture + métadonnées prêt upload Amazon.' },
  { id: 'cockpit-audit-pilot', pillar: 'publier',   status: 'todo', title: 'Cockpit Audit Pilot',
    description: 'Score de conformité KDP (marges, polices, ISBN, bleed, Modulo 10).' },
  { id: 'prepub-checklist',    pillar: 'publier',   status: 'todo', title: 'Checklist Prépublication',
    description: '25 points cochables avant clic "Publier" sur KDP.' },
  { id: 'kindle-previewer',    pillar: 'publier',   status: 'todo', title: 'Kindle Previewer Simulé',
    description: 'Aperçu visuel Kindle / tablette / phone avec rendu typographique fidèle.' },

  // MONÉTISER
  { id: 'sales-tracker',       pillar: 'monetiser', status: 'todo', title: 'Tracker Ventes KDP',
    description: 'Import CSV royalties Amazon + graphes revenus mensuels / par titre.' },
  { id: 'aplus-generator',     pillar: 'monetiser', status: 'todo', title: 'Générateur Page A+',
    description: 'Génère le HTML Amazon A+ Content avec visuels et blocs prêts à coller.' },
  { id: 'auto-pricing',        pillar: 'monetiser', status: 'todo', title: 'Auto-Pricing IA',
    description: 'Suggère le prix optimal selon niche, concurrence et longueur.' },

  // MARKETING
  { id: 'launch-sequence-j7',  pillar: 'marketing', status: 'todo', title: 'Séquence Lancement J-7',
    description: 'Emails + posts sociaux pré-programmés sur 7 jours avant publication.' },
  { id: 'amazon-ads',          pillar: 'marketing', status: 'todo', title: 'Amazon Ads Generator',
    description: 'Campagnes Sponsored Products / Brands avec mots-clés ciblés.' },
  { id: 'pinterest-pins',      pillar: 'marketing', status: 'todo', title: 'Pinterest Auto-Pins',
    description: '20 pins générés automatiquement depuis la couverture du livre.' },

  // IA AVANCÉE
  { id: 'p16-competitive',     pillar: 'ia',        status: 'todo', title: 'Agent P16 — Analyse Concurrentielle',
    description: 'Scan top 10 Amazon de la niche pour positionnement et angles.' },
  { id: 'p17-series',          pillar: 'ia',        status: 'todo', title: 'Agent P17 — Architecte de Série',
    description: 'Plan cohérent des tomes 2 / 3 / 4 (arcs, persos, cliffhangers).' },

  // ===== AJOUTS — lancement progressif juillet / août =====

  // PUBLIER
  { id: 'multi-format-express', pillar: 'publier',  status: 'todo', title: 'Multi-format Express',
    description: 'Export simultané Kindle (.epub/.mobi), broché PDF KDP et grand format relié en un clic.' },
  { id: 'isbn-metadata',        pillar: 'publier',  status: 'todo', title: 'ISBN & Métadonnées Manager',
    description: 'Centralise ISBN, BISAC, catégories, mots-clés, langue et droits par titre.' },
  { id: 'translation-markets',  pillar: 'publier',  status: 'todo', title: 'Traduction Multi-Marchés',
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
  { id: 'p18-readability',      pillar: 'ia',        status: 'todo', title: 'Agent P18 — Audit Lisibilité',
    description: 'Score de lisibilité, rythme, longueur de phrases et suggestions par chapitre.' },
  { id: 'p19-author-voice',     pillar: 'ia',        status: 'todo', title: "Agent P19 — Voix d'Auteur Persistante",
    description: 'Mémorise et applique le style signature sur toute une série.' },
  { id: 'p20-chat-manuscript',  pillar: 'ia',        status: 'todo', title: 'Agent P20 — Chat Manuscrit',
    description: 'Pose des questions à ton propre livre (cohérence, résumé, fiches persos).' },
];
