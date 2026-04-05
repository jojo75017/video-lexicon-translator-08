import type { LucideIcon } from 'lucide-react';
import {
  Target,
  TrendingUp,
  Layers,
  FileText,
  Sparkles,
  CheckCircle2,
  BookOpen,
  AlertCircle,
  Brain,
  Link2,
  ScanSearch,
  Wand2,
  Award,
  BadgeCheck,
  Shield,
} from 'lucide-react';

export interface WorkflowStepDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  agentTitle: string;
  agentSubtitle: string;
  agentMission: string;
}

export const WORKFLOW_STEPS: WorkflowStepDefinition[] = [
  {
    id: 'P1',
    name: 'Directeur Éditorial',
    description: 'Vision stratégique et analyse du projet',
    icon: Target,
    agentTitle: "L'Éditeur",
    agentSubtitle: 'Cadrer le manuscrit',
    agentMission: 'Clarifie la promesse, le ton et l’angle commercial du livre avant toute production.',
  },
  {
    id: 'P2',
    name: 'Analyse de Marché',
    description: 'Positionnement Amazon KDP + 7 mots-clés stratégiques',
    icon: TrendingUp,
    agentTitle: 'Le Marché',
    agentSubtitle: 'Valider la niche',
    agentMission: 'Détecte le positionnement, les catégories et les mots-clés à potentiel.',
  },
  {
    id: 'P3',
    name: 'Architecte de Contenu',
    description: 'Structure détaillée (400+ pages)',
    icon: Layers,
    agentTitle: "L'Architecte",
    agentSubtitle: 'Dessiner la structure',
    agentMission: 'Construit un plan exploitable, solide, cohérent et prêt pour la rédaction.',
  },
  {
    id: 'P4',
    name: 'Rédaction Experte',
    description: 'Écriture professionnelle chapitre par chapitre',
    icon: FileText,
    agentTitle: 'Le Romancier',
    agentSubtitle: 'Rédiger les chapitres',
    agentMission: 'Produit le manuscrit chapitre par chapitre avec continuité narrative et densité utile.',
  },
  {
    id: 'P5',
    name: 'Réécriture Naturelle',
    description: 'Humanisation du texte (votre voix, pas un robot)',
    icon: Sparkles,
    agentTitle: 'Le Styliste',
    agentSubtitle: 'Humaniser le ton',
    agentMission: 'Supprime les tournures mécaniques et rend la prose plus naturelle et crédible.',
  },
  {
    id: 'P6',
    name: 'Qualité Éditoriale',
    description: 'Contrôle qualité approfondi',
    icon: CheckCircle2,
    agentTitle: 'Le Correcteur',
    agentSubtitle: 'Sécuriser la qualité',
    agentMission: 'Contrôle cohérence, clarté, style, structure et tenue éditoriale globale.',
  },
  {
    id: 'P7',
    name: 'Packaging Éditorial',
    description: 'Métadonnées et mots-clés KDP optimisés',
    icon: BookOpen,
    agentTitle: 'Le Packager',
    agentSubtitle: 'Préparer la vente',
    agentMission: 'Transforme le manuscrit en offre publiable avec accroche, sous-titre et KDP pro.',
  },
  {
    id: 'P8',
    name: 'Diagnostic Final',
    description: 'Vérification cohérence globale',
    icon: AlertCircle,
    agentTitle: "L'Auditeur",
    agentSubtitle: 'Tester la cohérence',
    agentMission: 'Passe le projet au scanner et détecte les failles avant validation.',
  },
  {
    id: 'P9',
    name: 'Mémoire Éditoriale',
    description: 'Capture de VOTRE voix unique d\'auteur',
    icon: Brain,
    agentTitle: 'La Mémoire',
    agentSubtitle: 'Capturer votre voix',
    agentMission: 'Formalise votre signature d’auteur pour conserver une vraie cohérence de voix.',
  },
  {
    id: 'P10',
    name: 'Cohérence Chapitres',
    description: 'Transitions fluides entre chapitres',
    icon: Link2,
    agentTitle: 'Le Relieur',
    agentSubtitle: 'Fluidifier les transitions',
    agentMission: 'Vérifie les raccords, le fil rouge et la montée en puissance du livre.',
  },
  {
    id: 'P11',
    name: 'Auto-Critique',
    description: 'Détection des faiblesses (sans flatterie)',
    icon: ScanSearch,
    agentTitle: 'Le Critique',
    agentSubtitle: 'Pointer les faiblesses',
    agentMission: 'Formule une critique franche pour identifier ce qui nuit au niveau pro.',
  },
  {
    id: 'P12',
    name: 'Boucle Itérative',
    description: 'Améliorations automatiques',
    icon: Wand2,
    agentTitle: 'Le Stratège',
    agentSubtitle: 'Corriger avec impact',
    agentMission: 'Priorise les corrections et transforme la critique en actions concrètes.',
  },
  {
    id: 'P13',
    name: 'Signature de Style',
    description: 'Voix d\'auteur unifiée et reconnaissable',
    icon: Award,
    agentTitle: 'La Signature',
    agentSubtitle: 'Unifier le style',
    agentMission: 'Harmonise le ton final pour donner une identité forte et mémorable au manuscrit.',
  },
  {
    id: 'P14',
    name: 'Verdict Ultime',
    description: 'Validation finale par l\'éditeur professionnel',
    icon: BadgeCheck,
    agentTitle: 'Le Jury',
    agentSubtitle: 'Valider la publication',
    agentMission: 'Décide si le livre est publiable ou s’il faut retravailler avant mise en vente.',
  },
  {
    id: 'P15',
    name: 'Humanisation Anti-IA',
    description: 'BONUS — Rend le texte indétectable par les outils anti-IA',
    icon: Shield,
    agentTitle: "L'Humanisateur",
    agentSubtitle: 'Rendre le texte plus humain',
    agentMission: 'Ajoute les variations, ruptures et textures de langage qui évitent l’effet robotique.',
  },
];

export const WORKFLOW_STEP_COUNT = WORKFLOW_STEPS.length;