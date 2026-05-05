import {
  Lightbulb, FileText, ListChecks,
  Bot, PenLine, BookOpen,
  Image as ImageIcon, Palette, Layers,
  Tag, ClipboardCheck, Download,
  Megaphone, Headphones, Library, Rocket, Users,
  type LucideIcon,
} from 'lucide-react';
import type { Chapter } from '@/hooks/useSubscriptionGeneration';

export type StepStatus = 'done' | 'in_progress' | 'todo';

export interface JourneyStep {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tabId: string;
  externalRoute?: string; // for routes outside planner tabs
  estimate?: string;
  highlight?: boolean; // visually featured (ex: image tools)
  isDone: (ctx: JourneyContext) => boolean;
}

export interface JourneyPhase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: string; // hex
  bg: string; // light bg hex
  icon: LucideIcon;
  steps: JourneyStep[];
}

export interface JourneyContext {
  ebookTitle: string;
  authorName: string;
  bookDescription: string;
  targetAudience: string;
  genre: string;
  chapters: Chapter[];
  preface: string;
  conclusion: string;
  coverImageUrl?: string;
  kdpDescription?: string;
  kdpKeywords?: string;
  kdpCategories?: string[] | string;
}

const wordsOf = (s?: string) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);

export function chaptersFilledRatio(chapters: Chapter[]): number {
  if (!chapters.length) return 0;
  const filled = chapters.filter(c => (c.content?.length ?? 0) > 200).length;
  return filled / chapters.length;
}

export const JOURNEY_PHASES: JourneyPhase[] = [
  {
    id: 'preparation',
    number: 1,
    title: 'Préparation',
    subtitle: 'Trouvez votre idée et structurez votre livre',
    color: '#008296',
    bg: '#E6F4F5',
    icon: Lightbulb,
    steps: [
      {
        id: 'idea',
        label: 'Idée & niche',
        description: 'Explorez 600+ niches porteuses sur Amazon KDP',
        icon: Lightbulb,
        tabId: 'projects',
        externalRoute: '/ebook-ideas',
        estimate: '15 min',
        isDone: (c) => c.ebookTitle.length > 3 && c.genre.length > 0,
      },
      {
        id: 'identity',
        label: 'Titre, sous-titre, audience',
        description: 'Définissez l\'identité de votre livre',
        icon: FileText,
        tabId: 'planner',
        estimate: '10 min',
        isDone: (c) => c.ebookTitle.length > 3 && c.targetAudience.length > 5,
      },
      {
        id: 'plan',
        label: 'Plan détaillé des chapitres',
        description: 'Construisez le squelette de votre ebook',
        icon: ListChecks,
        tabId: 'planner',
        estimate: '20 min',
        isDone: (c) => c.chapters.length >= 3 && c.chapters.every(ch => ch.title?.length > 3),
      },
    ],
  },
  {
    id: 'redaction',
    number: 2,
    title: 'Rédaction',
    subtitle: 'Écrivez avec l\'IA ou manuellement',
    color: '#FF9E2D',
    bg: '#FFF4E6',
    icon: PenLine,
    steps: [
      {
        id: 'workflow-ia',
        label: 'Workflow IA 15 Agents',
        description: 'Génération automatique professionnelle (recommandé)',
        icon: Bot,
        tabId: 'complete-workflow',
        estimate: '30 min',
        highlight: true,
        isDone: (c) => chaptersFilledRatio(c.chapters) >= 0.8,
      },
      {
        id: 'manual',
        label: 'Rédaction manuelle / retouches',
        description: 'Affinez chaque chapitre à la main',
        icon: PenLine,
        tabId: 'writing',
        estimate: 'libre',
        isDone: (c) => chaptersFilledRatio(c.chapters) >= 0.5,
      },
      {
        id: 'preface',
        label: 'Préface & conclusion',
        description: 'Encadrez votre manuscrit',
        icon: BookOpen,
        tabId: 'writing',
        estimate: '15 min',
        isDone: (c) => wordsOf(c.preface) > 80 && wordsOf(c.conclusion) > 80,
      },
    ],
  },
  {
    id: 'visuels',
    number: 3,
    title: 'Visuels & Couvertures',
    subtitle: 'Créez vos visuels professionnels avec l\'IA',
    color: '#9333EA',
    bg: '#F3E8FF',
    icon: ImageIcon,
    steps: [
      {
        id: 'cover-ai',
        label: 'Couverture IA (Imagen)',
        description: 'Générez une couverture photoréaliste en 1 clic',
        icon: ImageIcon,
        tabId: 'cover',
        estimate: '5 min',
        highlight: true,
        isDone: (c) => !!c.coverImageUrl,
      },
      {
        id: 'cover-editor',
        label: 'Éditeur de couverture',
        description: 'Personnalisez typographie, couleurs et éléments',
        icon: Palette,
        tabId: 'cover-design-editor',
        estimate: '10 min',
        highlight: true,
        isDone: () => false,
      },
      {
        id: 'backcover',
        label: '4ème de couverture',
        description: 'Générez le verso avec dos calculé pour KDP',
        icon: Layers,
        tabId: 'backcover',
        estimate: '5 min',
        highlight: true,
        isDone: () => false,
      },
    ],
  },
  {
    id: 'publication',
    number: 4,
    title: 'Publication KDP',
    subtitle: 'Préparez votre livre pour Amazon',
    color: '#232F3E',
    bg: '#EAEDED',
    icon: ClipboardCheck,
    steps: [
      {
        id: 'kdp-meta',
        label: 'Description & mots-clés KDP',
        description: 'Optimisez la fiche Amazon (4000 caractères)',
        icon: Tag,
        tabId: 'kdp',
        estimate: '15 min',
        isDone: (c) => (c.kdpDescription?.length ?? 0) > 500 && (c.kdpKeywords?.length ?? 0) > 20,
      },
      {
        id: 'checklist',
        label: 'Checklist pré-publication',
        description: 'Vérifiez la conformité KDP (typographie, dimensions)',
        icon: ClipboardCheck,
        tabId: 'kdp-prepublish-checklist',
        estimate: '10 min',
        isDone: () => false,
      },
      {
        id: 'export',
        label: 'Export PDF / EPUB',
        description: 'Téléchargez les fichiers prêts pour KDP',
        icon: Download,
        tabId: 'export',
        estimate: '5 min',
        isDone: () => false,
      },
    ],
  },
  {
    id: 'apres',
    number: 5,
    title: 'Après publication',
    subtitle: 'Vendez plus, créez votre écosystème',
    color: '#16A34A',
    bg: '#DCFCE7',
    icon: Rocket,
    steps: [
      {
        id: 'marketing',
        label: 'Plan marketing',
        description: 'Stratégie de lancement et promotion',
        icon: Megaphone,
        tabId: 'marketing',
        estimate: '30 min',
        isDone: () => false,
      },
      {
        id: 'launch',
        label: 'Plan de lancement',
        description: 'Calendrier de lancement détaillé',
        icon: Rocket,
        tabId: 'launch-plan',
        estimate: '20 min',
        isDone: () => false,
      },
      {
        id: 'audio',
        label: 'Audiobook Express',
        description: 'Transformez votre ebook en livre audio',
        icon: Headphones,
        tabId: 'audio-express',
        estimate: '20 min',
        highlight: true,
        isDone: () => false,
      },
      {
        id: 'series',
        label: 'Créer une série / tomes',
        description: 'Étendez votre univers en collection',
        icon: Library,
        tabId: 'series',
        estimate: '15 min',
        isDone: () => false,
      },
      {
        id: 'community',
        label: 'Communauté & forum',
        description: 'Échangez avec d\'autres auteurs',
        icon: Users,
        tabId: 'projects',
        externalRoute: '/forum',
        estimate: 'libre',
        isDone: () => false,
      },
    ],
  },
];

export function getPhaseStatus(phase: JourneyPhase, ctx: JourneyContext): StepStatus {
  const done = phase.steps.filter(s => s.isDone(ctx)).length;
  if (done === phase.steps.length) return 'done';
  if (done > 0) return 'in_progress';
  return 'todo';
}

export function getActivePhaseId(ctx: JourneyContext): string {
  for (const p of JOURNEY_PHASES) {
    if (getPhaseStatus(p, ctx) !== 'done') return p.id;
  }
  return JOURNEY_PHASES[JOURNEY_PHASES.length - 1].id;
}

export function getOverallProgress(ctx: JourneyContext): number {
  const all = JOURNEY_PHASES.flatMap(p => p.steps);
  const done = all.filter(s => s.isDone(ctx)).length;
  return Math.round((done / all.length) * 100);
}

export function getNextStep(ctx: JourneyContext): JourneyStep | null {
  for (const p of JOURNEY_PHASES) {
    for (const s of p.steps) {
      if (!s.isDone(ctx)) return s;
    }
  }
  return null;
}
