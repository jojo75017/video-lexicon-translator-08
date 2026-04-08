import {
  Crown, Search, LayoutDashboard, PenTool, Sparkles, FileEdit,
  Shield, Brain, GitBranch, Eye, RefreshCw, Fingerprint, Award,
  Palette, Download, Headphones, FileText,
  ClipboardCheck, MessageSquare, Rocket,
  FolderOpen, CreditCard, Settings,
  Users, Bot, Play, Glasses,
  type LucideIcon
} from 'lucide-react';

export interface TrelloCard {
  id: string;
  label: string;
  icon: LucideIcon;
  requiredSteps?: string[];
  isWorkflowStep?: boolean;
  isPro?: boolean;
}

export interface TrelloColumn {
  id: string;
  label: string;
  emoji: string;
  color: string;
  cards: TrelloCard[];
}

export const TRELLO_COLUMNS: TrelloColumn[] = [
  {
    id: 'create',
    label: 'Créer',
    emoji: '📝',
    color: 'emerald',
    cards: [
      { id: 'editorial-director', label: 'P1 · Zyro — Niche', icon: Crown, isWorkflowStep: true, isPro: true },
      { id: 'market-analysis', label: 'P2 · Jano — Marché', icon: Search, isWorkflowStep: true, requiredSteps: ['P1'], isPro: true },
      { id: 'content-architect', label: 'P3 · Kiro — Plan', icon: LayoutDashboard, isWorkflowStep: true, requiredSteps: ['P1', 'P2'], isPro: true },
      { id: 'expert-writing', label: 'P4 · Alia — Rédaction', icon: PenTool, isWorkflowStep: true, requiredSteps: ['P3'], isPro: true },
      { id: 'planner', label: 'Formulaire manuel', icon: FileText },
      { id: 'writing', label: 'Écrire les chapitres', icon: PenTool },
      { id: 'characters', label: 'Personnages', icon: Users },
      { id: 'aichat', label: 'Assistant IA', icon: Bot },
    ],
  },
  {
    id: 'optimize',
    label: 'Optimiser',
    emoji: '⚡',
    color: 'violet',
    cards: [
      { id: 'natural-rewrite', label: 'P5 · Lexo — Réécriture', icon: Sparkles, isWorkflowStep: true, requiredSteps: ['P4'], isPro: true },
      { id: 'editorial-quality', label: 'P6 · Vero — Qualité', icon: FileEdit, isWorkflowStep: true, requiredSteps: ['P5'], isPro: true },
      { id: 'editorial-memory', label: 'P9 · Emio — Voix', icon: Brain, isWorkflowStep: true, requiredSteps: ['P5'], isPro: true },
      { id: 'chapter-coherence', label: 'P10 · Mira — Transitions', icon: GitBranch, isWorkflowStep: true, requiredSteps: ['P5'], isPro: true },
      { id: 'self-critique', label: 'P11 · Beto — Lecteur test', icon: Eye, isWorkflowStep: true, requiredSteps: ['P5'], isPro: true },
      { id: 'iterative-loop', label: 'P12 · Nexa — Corrections', icon: RefreshCw, isWorkflowStep: true, requiredSteps: ['P6'], isPro: true },
      { id: 'style-signature', label: 'P13 · Huma — Style', icon: Fingerprint, isWorkflowStep: true, requiredSteps: ['P5'], isPro: true },
      { id: 'humanize-anti-ia', label: 'P15 · Orin — Anti-IA', icon: Shield, isWorkflowStep: true, requiredSteps: ['P5'], isPro: true },
      { id: 'strict-proofread', label: 'Relecture Stricte', icon: Glasses },
    ],
  },
  {
    id: 'produce',
    label: 'Produire',
    emoji: '🎨',
    color: 'blue',
    cards: [
      { id: 'cover-design-editor', label: 'Éditeur Couverture', icon: Palette },
      { id: 'cover', label: 'Couverture IA', icon: Sparkles },
      { id: 'export', label: 'Export PDF / Word', icon: Download },
      { id: 'calibre-epub', label: 'Export ePub', icon: Download },
      { id: 'audiobook', label: 'Livre Audio', icon: Headphones },
      { id: 'audio-express', label: 'Audio Express', icon: Play },
    ],
  },
  {
    id: 'publish',
    label: 'Publier',
    emoji: '📦',
    color: 'orange',
    cards: [
      { id: 'editorial-packaging', label: 'P7 · Kado — KDP', icon: FileText, isWorkflowStep: true, requiredSteps: ['P5'], isPro: true },
      { id: 'final-diagnosis', label: 'P8 · Conso — Diagnostic', icon: Shield, isWorkflowStep: true, requiredSteps: ['P5'], isPro: true },
      { id: 'ultimate-verdict', label: 'P14 · Tila — Verdict', icon: Award, isWorkflowStep: true, requiredSteps: ['P7', 'P8'], isPro: true },
      { id: 'kdp', label: 'Description KDP', icon: FileText },
      { id: 'kdp-prepublish-checklist', label: 'Checklist KDP', icon: ClipboardCheck },
      { id: 'backcover', label: '4e de Couverture', icon: FileText },
    ],
  },
  {
    id: 'sell',
    label: 'Vendre',
    emoji: '📣',
    color: 'rose',
    cards: [
      { id: 'marketing', label: 'Posts Réseaux Sociaux', icon: MessageSquare },
      { id: 'launch-plan', label: 'Plan Lancement', icon: Rocket },
    ],
  },
];

// Mapping workflow step IDs (P1-P15) to their tab IDs
export const WORKFLOW_STEP_TO_TAB: Record<string, string> = {
  P1: 'editorial-director',
  P2: 'market-analysis',
  P3: 'content-architect',
  P4: 'expert-writing',
  P5: 'natural-rewrite',
  P6: 'editorial-quality',
  P7: 'editorial-packaging',
  P8: 'final-diagnosis',
  P9: 'editorial-memory',
  P10: 'chapter-coherence',
  P11: 'self-critique',
  P12: 'iterative-loop',
  P13: 'style-signature',
  P14: 'ultimate-verdict',
  P15: 'humanize-anti-ia',
};

export const TAB_TO_WORKFLOW_STEP: Record<string, string> = Object.fromEntries(
  Object.entries(WORKFLOW_STEP_TO_TAB).map(([k, v]) => [v, k])
);

// Quick access items for "Mon Compte" in header
export const ACCOUNT_QUICK_ITEMS = [
  { id: 'projects', label: 'Mes Projets', icon: FolderOpen },
  { id: 'subscription', label: 'Abonnement', icon: CreditCard },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

// Color configuration for columns
export const COLUMN_COLORS: Record<string, { bg: string; border: string; header: string; card: string; cardHover: string; badge: string; text: string }> = {
  emerald: {
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    header: 'bg-gradient-to-r from-emerald-500/15 to-emerald-400/10',
    card: 'bg-card border-emerald-500/10',
    cardHover: 'hover:border-emerald-500/30 hover:shadow-emerald-500/10',
    badge: 'bg-emerald-500/15 text-emerald-400',
    text: 'text-emerald-400',
  },
  violet: {
    bg: 'bg-violet-500/5',
    border: 'border-violet-500/20',
    header: 'bg-gradient-to-r from-violet-500/15 to-violet-400/10',
    card: 'bg-card border-violet-500/10',
    cardHover: 'hover:border-violet-500/30 hover:shadow-violet-500/10',
    badge: 'bg-violet-500/15 text-violet-400',
    text: 'text-violet-400',
  },
  blue: {
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    header: 'bg-gradient-to-r from-blue-500/15 to-blue-400/10',
    card: 'bg-card border-blue-500/10',
    cardHover: 'hover:border-blue-500/30 hover:shadow-blue-500/10',
    badge: 'bg-blue-500/15 text-blue-400',
    text: 'text-blue-400',
  },
  orange: {
    bg: 'bg-orange-500/5',
    border: 'border-orange-500/20',
    header: 'bg-gradient-to-r from-orange-500/15 to-orange-400/10',
    card: 'bg-card border-orange-500/10',
    cardHover: 'hover:border-orange-500/30 hover:shadow-orange-500/10',
    badge: 'bg-orange-500/15 text-orange-400',
    text: 'text-orange-400',
  },
  rose: {
    bg: 'bg-rose-500/5',
    border: 'border-rose-500/20',
    header: 'bg-gradient-to-r from-rose-500/15 to-rose-400/10',
    card: 'bg-card border-rose-500/10',
    cardHover: 'hover:border-rose-500/30 hover:shadow-rose-500/10',
    badge: 'bg-rose-500/15 text-rose-400',
    text: 'text-rose-400',
  },
};
