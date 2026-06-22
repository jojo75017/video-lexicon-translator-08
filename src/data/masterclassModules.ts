export interface MasterclassResource {
  label: string;
  /** Lien interne (commence par /) ou externe (https://) */
  href: string;
}

export interface MasterclassFaq {
  q: string;
  a: string;
}

export interface MasterclassModule {
  id: number;
  titre: string;
  duration: string;
  youtubeId: string;
  /** Module librement accessible sans inscription */
  isFree: boolean;
  summary: string;
  keyPoints: string[];
  resources: MasterclassResource[];
  faq: MasterclassFaq[];
}

/** URL de l'offre commerciale (CTA) */
export const MASTERCLASS_CTA_URL = 'https://ebookstudio.fr/offres';

/** Clé du lead magnet envoyée à l'edge function funnel-capture-lead */
export const MASTERCLASS_LEAD_MAGNET = 'masterclass-ebookstudio';

export const MASTERCLASS_MODULES: MasterclassModule[] = [
  {
    id: 1,
    titre: 'Fondations & Vision',
    duration: '1h00',
    youtubeId: 'NF7H9wUyi9o',
    isFree: true,
    summary:
      "On pose les bases : comprendre l'écosystème Amazon KDP, choisir un positionnement rentable et adopter l'état d'esprit d'un éditeur qui publie pour vendre, pas seulement pour écrire.",
    keyPoints: [
      "Comprendre le fonctionnement d'Amazon KDP en 2026",
      'Choisir une niche rentable et non saturée',
      "Définir la vision et la promesse de votre livre",
      "Préparer votre espace de travail EbookStudio Pro",
    ],
    resources: [
      { label: '🔎 Trouver un créneau rentable', href: '/niches-600' },
      { label: '📘 Guide gratuit : 5 niches 2026', href: '/cadeau' },
    ],
    faq: [
      {
        q: "Faut-il déjà avoir une idée de livre ?",
        a: "Non. Ce module vous aide justement à trouver et valider une idée rentable avant d'écrire la première ligne.",
      },
      {
        q: "Combien de temps pour publier un premier livre ?",
        a: "Avec EbookStudio Pro et la méthode de cette masterclass, un premier livre peut être prêt en quelques jours.",
      },
    ],
  },
  {
    id: 2,
    titre: 'Génération de Contenu',
    duration: '1h00',
    youtubeId: '4h_ex9Amdus',
    isFree: false,
    summary:
      "Le cœur du réacteur : générer un manuscrit complet, structuré et de qualité professionnelle grâce au pipeline d'agents IA d'EbookStudio Pro.",
    keyPoints: [
      "Utiliser le pipeline éditorial IA (15 agents)",
      'Structurer chapitres et plan automatiquement',
      'Garder une cohérence et un style professionnel',
      'Relire et corriger sans dénaturer le texte',
    ],
    resources: [
      { label: '✍️ Ouvrir l\'écrivain IA', href: '/ebook-planner' },
      { label: '🔑 Recherche de mots-clés KDP', href: '/recherche-mots-cles-kdp' },
    ],
    faq: [
      {
        q: "Le texte généré est-il vraiment publiable ?",
        a: "Oui, avec les bonnes consignes et la relecture intégrée. La masterclass montre tout le processus de bout en bout.",
      },
    ],
  },
  {
    id: 3,
    titre: 'Design & Mise en Page',
    duration: '1h00',
    youtubeId: 'jV-40dkxQvw',
    isFree: false,
    summary:
      "Une couverture qui vend et une mise en page conforme aux normes KDP. On crée une couverture professionnelle par IA et on formate l'intérieur sans stress.",
    keyPoints: [
      'Créer une couverture pro avec le Cover Studio IA',
      'Respecter les dimensions et marges KDP',
      "Soigner la mise en page intérieure",
      'Exporter un fichier prêt à publier',
    ],
    resources: [
      { label: '🎨 Cover Studio IA', href: '/couverture-kdp' },
    ],
    faq: [
      {
        q: "Faut-il savoir utiliser Photoshop ?",
        a: "Non. Le Cover Studio génère et ajuste votre couverture par IA, sans logiciel de design externe.",
      },
    ],
  },
  {
    id: 4,
    titre: 'Métadonnées & SEO Amazon KDP',
    duration: '1h00',
    youtubeId: 'gtJPR_w3r7c',
    isFree: false,
    summary:
      "Là où se jouent les ventes : catégories secrètes, mots-clés à fort volume et description optimisée pour que votre livre soit trouvé et acheté.",
    keyPoints: [
      'Choisir les catégories (et catégories secrètes)',
      'Trouver les mots-clés à fort volume',
      'Rédiger une description qui convertit',
      'Optimiser le référencement Amazon (SEO)',
    ],
    resources: [
      { label: '🔑 Recherche de mots-clés KDP', href: '/recherche-mots-cles-kdp' },
    ],
    faq: [
      {
        q: "C'est quoi une catégorie secrète ?",
        a: "Une catégorie plus précise et moins concurrentielle qui permet d'apparaître plus facilement en tête de classement.",
      },
    ],
  },
  {
    id: 5,
    titre: 'Automatisation & Stratégie Marketing',
    duration: '1h00',
    youtubeId: 'k91fCwp2XZc',
    isFree: false,
    summary:
      "On transforme un livre en machine à ventes : tunnels, distribution et lancement. C'est le moment de passer à l'action avec l'offre complète EbookStudio Pro.",
    keyPoints: [
      'Construire un tunnel de vente simple',
      'Distribuer et lancer votre livre',
      'Automatiser la promotion',
      "Passer à l'échelle avec plusieurs titres",
    ],
    resources: [
      { label: '💛 Découvrir l\'offre complète', href: MASTERCLASS_CTA_URL },
    ],
    faq: [
      {
        q: "Que se passe-t-il après la masterclass ?",
        a: "Vous pouvez accéder à l'offre complète EbookStudio Pro pour appliquer la méthode avec tous les outils inclus.",
      },
    ],
  },
];
