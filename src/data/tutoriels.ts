import {
  KeyRound,
  Sparkles,
  Layers,
  Wand2,
  Search,
  FileUp,
  ImagePlus,
  Headphones,
  Globe,
  FileDown,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

export type TutorielCategory = 'demarrage' | 'creation' | 'audio' | 'export';

export interface Tutoriel {
  id: string;
  category: TutorielCategory;
  title: string;
  description: string;
  durationMin: number;
  icon: LucideIcon;
  steps: string[];
  targetRoute: string;
  ctaLabel?: string;
  videoRoute?: string;
}

export const CATEGORIES: { id: TutorielCategory; label: string }[] = [
  { id: 'demarrage', label: 'Démarrage' },
  { id: 'creation', label: 'Création contenu' },
  { id: 'audio', label: 'Audio & Audiobook' },
  { id: 'export', label: 'Export & Publication' },
];

// Toutes les routes ci-dessous existent dans src/App.tsx et sont accessibles aux abonnés.
// Plusieurs fonctionnalités (config API, Document Transformer, Cover Studio, Audio Express,
// Export KDP) sont des onglets/sections internes au /ebook-planner — donc on y renvoie.

export const TUTORIELS: Tutoriel[] = [
  // --- Démarrage ---
  {
    id: 'config-gemini',
    category: 'demarrage',
    title: 'Configurer ma clé Gemini (BYOK)',
    description: "Indispensable : sans clé Gemini, aucune génération IA ne fonctionne.",
    durationMin: 3,
    icon: KeyRound,
    steps: [
      "Créez gratuitement votre clé sur aistudio.google.com (bouton 'Get API key').",
      "Copiez la clé qui commence par AIza...",
      "Ouvrez le Dashboard et cliquez sur l'icône clé / Paramètres API en haut.",
      "Collez la clé et cliquez sur Enregistrer.",
      "Un message de confirmation s'affiche : vous êtes prêt à générer.",
    ],
    targetRoute: '/ebook-planner',
    ctaLabel: 'Ouvrir le dashboard',
    videoRoute: '/formation-videos',
  },
  {
    id: 'premier-ebook',
    category: 'demarrage',
    title: 'Créer mon premier ebook (mode Simple)',
    description: "Le chemin le plus rapide pour produire un ebook complet.",
    durationMin: 10,
    icon: Sparkles,
    steps: [
      "Allez sur le Dashboard et restez en mode 'Simple'.",
      "Saisissez le titre et le sujet de votre ebook.",
      "Choisissez le nombre de chapitres (10 à 20 recommandé, 40 max).",
      "Cliquez sur 'Générer le plan' puis validez les chapitres.",
      "Lancez la génération automatique du manuscrit.",
    ],
    targetRoute: '/ebook-planner',
    ctaLabel: 'Lancer la création',
    videoRoute: '/formation-videos',
  },
  {
    id: 'workflow-15-agents',
    category: 'demarrage',
    title: 'Comprendre le workflow 15 agents (P1→P15)',
    description: "Le mode professionnel : 15 agents IA spécialisés enchaînés.",
    durationMin: 5,
    icon: Layers,
    steps: [
      "Sur le Dashboard, basculez sur le mode 'Workflow'.",
      "Chaque colonne = un agent (recherche, plan, rédaction, relecture...).",
      "Les agents s'enchaînent automatiquement, du P1 au P15.",
      "Vous pouvez relancer un agent isolé en cas de besoin.",
      "Le résultat final est un manuscrit complet, structuré et relu.",
    ],
    targetRoute: '/guide-outils',
    ctaLabel: 'Voir le guide complet',
  },

  // --- Création contenu ---
  {
    id: 'pipeline-p1-p15',
    category: 'creation',
    title: 'Lancer le pipeline P1→P15 (génération complète)',
    description: "La génération automatique de bout en bout, sans intervention.",
    durationMin: 20,
    icon: Wand2,
    steps: [
      "Préparez votre titre, sujet et public cible.",
      "Mode Workflow : cliquez sur 'Lancer le pipeline complet'.",
      "Patientez, chaque agent met 1 à 3 minutes.",
      "Suivez l'avancement en temps réel sur le Kanban.",
      "Récupérez le manuscrit prêt à exporter à la fin.",
    ],
    targetRoute: '/ebook-planner',
    ctaLabel: 'Démarrer le pipeline',
  },
  {
    id: 'mots-cles-kdp',
    category: 'creation',
    title: 'Recherche mots-clés Amazon KDP',
    description: "Trouvez les 7 mots-clés backend qui boostent votre référencement.",
    durationMin: 5,
    icon: Search,
    steps: [
      "Ouvrez l'outil Mots-clés KDP.",
      "Entrez votre titre ou votre niche.",
      "Choisissez un mode : auto, niche, longue traîne ou backend 7 mots.",
      "Lancez la recherche et copiez les mots-clés proposés.",
      "Collez-les dans votre fiche KDP (champs Mots-clés).",
    ],
    targetRoute: '/kdp-keywords',
    ctaLabel: 'Ouvrir l\'outil',
  },
  {
    id: 'import-word',
    category: 'creation',
    title: 'Importer un manuscrit Word existant',
    description: "Reprenez un .docx déjà écrit et continuez le travail dans EbookStudio.",
    durationMin: 5,
    icon: FileUp,
    steps: [
      "Ouvrez le Dashboard puis l'onglet 'Document Transformer'.",
      "Glissez-déposez votre fichier .docx.",
      "L'outil détecte automatiquement les chapitres.",
      "Vérifiez la structure proposée et corrigez si besoin.",
      "Importez : votre ebook est prêt à être exporté ou augmenté.",
    ],
    targetRoute: '/ebook-planner',
    ctaLabel: 'Ouvrir le dashboard',
  },
  {
    id: 'cover-ai',
    category: 'creation',
    title: 'Générer une couverture KDP avec IA',
    description: "Couverture professionnelle conforme aux dimensions Amazon KDP.",
    durationMin: 8,
    icon: ImagePlus,
    steps: [
      "Depuis le Dashboard, ouvrez l'onglet 'Cover Studio'.",
      "Saisissez titre, auteur, format et nombre de pages.",
      "Décrivez l'ambiance visuelle souhaitée.",
      "Lancez la génération IA (photo-réaliste).",
      "Téléchargez la couverture aux bonnes dimensions KDP.",
    ],
    targetRoute: '/ebook-planner',
    ctaLabel: 'Ouvrir le dashboard',
  },

  // --- Audio ---
  {
    id: 'audio-express',
    category: 'audio',
    title: 'Lancer l\'Audio Express (TTS automatique)',
    description: "Convertissez tout votre ebook en audiobook en un clic.",
    durationMin: 15,
    icon: Headphones,
    steps: [
      "Depuis le Dashboard, ouvrez l'onglet 'Audio Express'.",
      "Sélectionnez votre ebook source.",
      "Choisissez la voix (homme/femme) et la langue.",
      "Lancez la génération : chaque chapitre est traité puis fusionné.",
      "Téléchargez le fichier audio final prêt pour publication.",
    ],
    targetRoute: '/ebook-planner',
    ctaLabel: 'Ouvrir le dashboard',
  },
  {
    id: 'publier-audiobook',
    category: 'audio',
    title: 'Publier mon audiobook (page publique + checkout)',
    description: "Mettez votre audiobook en vente avec une page dédiée.",
    durationMin: 10,
    icon: Globe,
    steps: [
      "Voyez la démo d'audiobook publié pour comprendre le résultat.",
      "Depuis votre projet, cliquez sur 'Publier l\'audiobook'.",
      "Renseignez prix, description et image de couverture.",
      "Activez le checkout PayPal et la livraison automatique par email.",
      "Récupérez le lien public (slug) à partager.",
    ],
    targetRoute: '/audiobook-demo',
    ctaLabel: 'Voir la démo',
  },

  // --- Export ---
  {
    id: 'export-kdp',
    category: 'export',
    title: 'Exporter au format KDP (PDF intérieur + epub)',
    description: "Obtenez un PDF intérieur et un epub conformes aux exigences Amazon.",
    durationMin: 5,
    icon: FileDown,
    steps: [
      "Depuis votre ebook, ouvrez l'onglet Export.",
      "Choisissez le format de page (6x9 recommandé).",
      "Vérifiez la pagination (multiple de 10 conseillé).",
      "Lancez l'export PDF intérieur puis epub.",
      "Téléchargez les deux fichiers prêts à uploader sur KDP.",
    ],
    targetRoute: '/ebook-planner',
    ctaLabel: 'Ouvrir le dashboard',
  },
  {
    id: 'checklist-kdp',
    category: 'export',
    title: 'Publier sur Amazon KDP (checklist conformité)',
    description: "La checklist complète pour éviter un refus de publication.",
    durationMin: 10,
    icon: CheckCircle2,
    steps: [
      "Vérifiez titre, sous-titre et description (pas de promesse interdite).",
      "Renseignez les 7 mots-clés backend (outil Mots-clés KDP).",
      "Choisissez 2 catégories pertinentes.",
      "Uploadez le PDF intérieur, l'epub et la couverture.",
      "Validez l'aperçu KDP, puis publiez votre livre.",
    ],
    targetRoute: '/kdp-ads-guide',
    ctaLabel: 'Voir le guide KDP Ads',
  },
];
