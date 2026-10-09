import { SPECIAL_BOOK_TABS } from './specialBookTabs';
import { KDP_TAB_PAGES } from './kdpTabPages';

export type MenuLink = { label: string; to: string; badge?: string; desc?: string };
export type MenuCategory = {
  key: string;
  label: string;
  emoji: string;
  color: string; // accent (kept for backward compat, mega-menu uses gold rule)
  tagline?: string;
  links: MenuLink[];
};

/**
 * Menu principal V3 — palette Émeraude Prestige.
 * Chaque catégorie regroupe TOUS les outils V2/V3 correspondants pour
 * garantir qu'aucun outil du registre ne soit orphelin.
 */
export const V3_HEADER_MENU: MenuCategory[] = [
  {
    key: 'creer',
    label: 'Créer',
    emoji: '📘',
    color: '#064e3b',
    tagline: 'De l’idée au plan',
    links: [
      { label: 'Ebookstudio-Génie — créer mon livre', to: '/v3/create', badge: 'Dernière nouveauté IA', desc: 'Dialoguez avec le Génie : il remplit la fiche, construit le sommaire, rédige, exporte et crée la couverture' },
      { label: 'Sommaire IA — dialogue avec l’IA', to: '/v3/create?sommaire=ia', badge: 'Dernière nouveauté IA', desc: 'On construit le sommaire ensemble, puis l’IA rédige le livre jusqu’à l’export et la couverture' },
      { label: 'Studio Pro — Gemini + ChatGPT', to: '/v3/studio', badge: 'Nouveau', desc: 'Gemini construit la Bible du livre (synopsis, structure, personnages, chronologie), vous validez, ChatGPT rédige ensuite' },
      { label: 'Sommaire Ultime', to: '/v3/outils/sommaire-ultime', badge: 'Nouveau', desc: 'Table des matières pro, éditable et exportable' },
      { label: 'Personnages', to: '/v3/create?step=3', desc: 'Créez et développez vos protagonistes' },
      { label: 'Importer un manuscrit', to: '/v3/create?import=1', desc: 'Reprenez un projet existant (DOCX, TXT)' },
      { label: "Générateur d'idées", to: '/ebook-ideas', desc: 'Trouvez des concepts rentables en un clic' },
      { label: 'Quiz Auteur', to: '/quiz', desc: 'Identifiez votre profil d’auteur en 2 minutes' },
      { label: "Ambiances d'écriture", to: '/ambiances', desc: 'Décors sonores et visuels pour rédiger' },
      { label: 'Fiches pratiques', to: '/fiches-pratiques', desc: 'Modèles et méthodes prêts à l’emploi' },
    ],
  },
  {
    key: 'ecrire',
    label: 'Écrire',
    emoji: '✍️',
    color: '#0d7a5f',
    tagline: 'Le moteur d’écriture',
    links: [
      { label: 'Écrire un livre', to: '/v3/lancer', badge: 'Direct', desc: 'Ouvrez tout de suite la fiche du livre et lancez la rédaction' },
      { label: 'Ebook Planner V2 — 22 agents', to: '/ebook-planner', badge: 'Populaire', desc: 'Le pipeline P1–P15 éprouvé, en production' },
      { label: 'Corriger mon livre', to: '/v3/corriger', badge: 'Nouveau', desc: 'Importez un manuscrit terminé : correction intégrale chapitre par chapitre, relecture et export KDP' },
      { label: 'BookPerfect AI', to: '/bookperfect', desc: 'Correction et polissage IA de votre manuscrit' },

      { label: 'Ebookbot — Chat IA', to: '/ebookbot', desc: 'Assistant conversationnel pour brainstormer' },
      { label: "Assistant Ebookstudio", to: '/v3/assistant', badge: 'Nouveau', desc: 'Posez votre question : réponse claire + bouton vers le bon outil' },
      { label: 'Traduction 10 langues', to: '/v3/outils/traduction', badge: 'Nouveau', desc: 'EN, ES, DE, IT, PT, NL, PL, JA, ZH, AR — IA + relecture' },
    ],
  },
  {
    key: 'habiller',
    label: 'Habiller',
    emoji: '🎨',
    color: '#c9a84c',
    tagline: 'Le livre-objet',
    links: [
      { label: 'Studio de couverture', to: '/v3/studio-v4', badge: 'V4', desc: 'Le studio professionnel visible dans votre maison d’édition : titres, styles, images et variantes' },
      { label: 'BD Studio', to: '/bd-studio', desc: 'Bandes dessinées et albums illustrés' },
      { label: 'Illustrations intérieures', to: '/v3/create/illustre', desc: 'Images cohérentes pour chapitres et sections' },
      { label: 'Documentation Studio', to: '/v3/outils', desc: 'Docs, annexes, glossaires' },
      { label: 'Signature auteur', to: '/signature', desc: 'Blocs signature et biographies prêts à coller' },
    ],
  },
  {
    key: 'kdp',
    label: 'KDP',
    emoji: '📦',
    color: '#064e3b',
    tagline: 'Votre fiche Amazon',
    links: [
      { label: 'Espace KDP', to: '/v3/kdp', desc: 'Toutes les pages KDP réunies au même endroit' },
      ...KDP_TAB_PAGES.map((p) => ({ label: p.label, to: p.to, badge: p.badge, desc: p.desc })),
    ],
  },
  {
    key: 'publier',
    label: 'Publier',
    emoji: '🚀',
    color: '#0d7a5f',
    tagline: 'Le lancement Amazon',
    links: [
      { label: 'KDP Pilot / Audit', to: '/audit-pilot', badge: 'Pro', desc: 'Audit complet avant publication Kindle/poche' },
      { label: 'KDP Pilot — aller plus loin', to: '/v3/kdp-pilot', badge: '-15 %', desc: 'Suivi des ventes réelles et de la niche sur Amazon — outil partenaire payant, code abonné inclus' },
      { label: 'Mots-clés Amazon (KDSpy)', to: '/kdp-keywords', badge: 'Offert', desc: 'Recherche de mots-clés KDP à fort volume — 7 mots-clés rentables en quelques minutes' },
      { label: '600 Niches', to: '/niches-600', badge: 'Nouveau', desc: 'Base élargie de 600 niches Amazon analysées' },
      { label: 'Analyser les catégories KDP', to: '/v3/outils/categories', badge: 'Offert', desc: '📂 Explorez 19 000+ catégories Amazon — doublez vos chances de best-seller' },
      { label: 'Niches Amazon', to: '/niches', desc: 'Explorez les niches KDP qui vendent' },
      { label: 'Amazon Spy', to: '/v3/outils/espion-concurrents', desc: 'Analyse concurrentielle en temps réel' },
      { label: 'Séries & Tomes', to: '/series-tomes', desc: 'Planifiez vos séries multi-tomes' },
      { label: 'Compteur de mots KDP', to: '/word-count', desc: 'Objectifs pages/mots par format Amazon' },
      { label: 'Exporter le livre', to: '/v3/library', desc: 'DOCX, PDF, ePub, KDP-ready' },
    ],
  },
  {
    key: 'vendre',
    label: 'Vendre',
    emoji: '💛',
    color: '#c9a84c',
    tagline: 'La visibilité & les ventes',
    links: [
      { label: 'UPSELLS — packs & compléments', to: '/v3/upsells', badge: '18 tarifs', desc: '✨ Tous les packs et compléments avec leur prix d’achat à l’unité' },
      { label: 'Mots-clés Amazon Ads', to: '/v3/outils/ams-keywords', badge: 'Offert', desc: '🚀 Générez des centaines de mots-clés AMS ultra-ciblés' },
      { label: 'Espionner les concurrents', to: '/v3/outils/espion-concurrents', badge: 'Offert', desc: '🕵️ Stratégies, prix, catégories et tactiques des best-sellers' },
      { label: 'Mon parrainage — mon lien', to: '/mon-parrainage', badge: '15 %', desc: '🤝 Votre lien personnel : 15 % de commission sur le premier paiement de chaque abonnement parrainé' },
      { label: 'Programme partenaires', to: '/partenaires', badge: 'Nouveau', desc: 'Textes prêts à copier, suivi des clics et des ventes, règles du programme' },
      { label: 'Galerie communauté', to: '/v3/gallery', desc: 'Livres publiés par les auteurs Ebookstudio' },
      { label: 'Ma page auteur', to: '/v3/auteur', desc: 'Configurez votre profil public' },
      { label: 'Marketing & Emails', to: '/v3/outils', desc: 'Séquences email, tunnels, relance' },
      { label: 'Formation Audio', to: '/formation-audio', desc: 'Podcasts et cours audio' },
      { label: 'Séries Audio', to: '/formation-series-audio', desc: 'Formations en séries structurées' },
    ],
  },
  {
    key: 'livres',
    label: 'Livres spéciaux',
    emoji: '📚',
    color: '#064e3b',
    tagline: 'Les formats dédiés',
    links: SPECIAL_BOOK_TABS.map((t) => ({
      label: t.label,
      to: `/v3/livres/${t.slug}`,
      desc: `Modèle et workflow ${t.label.toLowerCase()}`,
    })),
  },
  {
    key: 'plans',
    label: 'Nos offres',
    emoji: '👑',
    color: '#c9a84c',
    tagline: 'Auteur par an ou Édition à vie',
    links: [
      { label: 'EbookStudio Auteur — 97 €/an', to: '/v3/forfaits', badge: '3 × 32,33 € possible', desc: 'Tous les parcours, correction, couverture incluse et outils KDP de base' },
      { label: 'EbookStudio Édition à vie — 497 €', to: '/v3/forfaits', badge: '3 × ou 6 × possible', desc: 'Tout Auteur + Cover Studio Pro, KDP avancé, BD Studio et BookPerfect, sans renouvellement' },
      { label: 'Compléments & options', to: '/v3/upsells', desc: 'Des studios et services à ajouter uniquement si vous en avez besoin' },
      { label: 'Ancien client V2', to: '/v3/migration', badge: 'Droits conservés', desc: 'Vos achats et avantages acquis restent inchangés' },
      { label: 'Calendrier des ouvertures', to: '/v3/calendrier', badge: 'Dates exactes', desc: 'Ce qui est déjà libre et la date d’ouverture de chaque module' },
      { label: 'Prestation KDP clé en main', to: '/prestation-kdp', badge: 'À partir de 149 €', desc: 'Vous voulez que tout soit fait pour vous : correction, mise en page, couverture et accompagnement KDP' },
    ],
  },

];
