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
    name: 'Zyro',
    description: 'Vision stratégique et analyse du projet',
    icon: Target,
    agentTitle: '🤖 Zyro',
    agentSubtitle: 'Vision & Niche',
    agentMission: 'Trouve la niche parfaite, clarifie la promesse et le positionnement de ton livre.',
  },
  {
    id: 'P2',
    name: 'Jano',
    description: 'Analyse marché & concurrence Amazon KDP',
    icon: TrendingUp,
    agentTitle: '🤖 Jano',
    agentSubtitle: 'Analyse Marché',
    agentMission: 'Scanne le marché Amazon, détecte les opportunités et valide ta niche.',
  },
  {
    id: 'P3',
    name: 'Kiro',
    description: 'Structure détaillée des chapitres',
    icon: Layers,
    agentTitle: '🤖 Kiro',
    agentSubtitle: 'Structure & Plan',
    agentMission: 'Construit un plan solide chapitre par chapitre, prêt pour la rédaction.',
  },
  {
    id: 'P4',
    name: 'Alia',
    description: 'Rédaction complète du manuscrit',
    icon: FileText,
    agentTitle: '🤖 Alia',
    agentSubtitle: 'Rédaction',
    agentMission: 'Écrit ton ebook complet, chapitre par chapitre, avec style et profondeur.',
  },
  {
    id: 'P5',
    name: 'Lexo',
    description: 'Réécriture et amélioration du style',
    icon: Sparkles,
    agentTitle: '🤖 Lexo',
    agentSubtitle: 'Réécriture',
    agentMission: 'Réécrit et améliore le style pour un rendu professionnel et fluide.',
  },
  {
    id: 'P6',
    name: 'Vero',
    description: 'Contrôle qualité approfondi',
    icon: CheckCircle2,
    agentTitle: '🤖 Vero',
    agentSubtitle: 'Contrôle Qualité',
    agentMission: 'Vérifie la grammaire, la cohérence et la tenue éditoriale globale.',
  },
  {
    id: 'P7',
    name: 'Kado',
    description: 'Packaging et métadonnées KDP',
    icon: BookOpen,
    agentTitle: '🤖 Kado',
    agentSubtitle: 'Packaging KDP',
    agentMission: 'Prépare ton livre pour Amazon : description, sous-titre, catégories.',
  },
  {
    id: 'P8',
    name: 'Conso',
    description: 'Diagnostic de cohérence globale',
    icon: AlertCircle,
    agentTitle: '🤖 Conso',
    agentSubtitle: 'Diagnostic',
    agentMission: 'Passe ton projet au scanner et détecte les failles avant publication.',
  },
  {
    id: 'P9',
    name: 'Emio',
    description: 'Mémoire éditoriale et voix d\'auteur',
    icon: Brain,
    agentTitle: '🤖 Emio',
    agentSubtitle: 'Mémoire Éditoriale',
    agentMission: 'Capture ta voix unique d\'auteur pour garder une cohérence sur tous tes livres.',
  },
  {
    id: 'P10',
    name: 'Mira',
    description: 'Transitions fluides entre chapitres',
    icon: Link2,
    agentTitle: '🤖 Mira',
    agentSubtitle: 'Transitions',
    agentMission: 'Vérifie les raccords entre chapitres et fluidifie la lecture.',
  },
  {
    id: 'P11',
    name: 'Beto',
    description: 'Simule un lecteur critique',
    icon: ScanSearch,
    agentTitle: '🤖 Beto',
    agentSubtitle: 'Lecteur Critique',
    agentMission: 'Lit ton livre comme un vrai lecteur et pointe les faiblesses sans flatterie.',
  },
  {
    id: 'P12',
    name: 'Nexa',
    description: 'Améliorations automatiques',
    icon: Wand2,
    agentTitle: '🤖 Nexa',
    agentSubtitle: 'Améliorations',
    agentMission: 'Transforme les critiques en corrections concrètes et améliore le manuscrit.',
  },
  {
    id: 'P13',
    name: 'Huma',
    description: 'Style unifié et reconnaissable',
    icon: Award,
    agentTitle: '🤖 Huma',
    agentSubtitle: 'Signature Style',
    agentMission: 'Harmonise le ton final pour donner une identité forte et mémorable.',
  },
  {
    id: 'P14',
    name: 'Tila',
    description: 'Validation finale avant publication',
    icon: BadgeCheck,
    agentTitle: '🤖 Tila',
    agentSubtitle: 'Verdict Final',
    agentMission: 'Décide si ton livre est prêt à être publié ou s\'il faut encore bosser.',
  },
  {
    id: 'P15',
    name: 'Orin',
    description: '🎁 BONUS — Rend le texte indétectable par l\'IA',
    icon: Shield,
    agentTitle: '🤖 Orin',
    agentSubtitle: 'Anti-Détection IA',
    agentMission: 'Ajoute les variations et textures humaines qui rendent ton texte indétectable.',
  },
];

export const WORKFLOW_STEP_COUNT = WORKFLOW_STEPS.length;
