
import { 
  Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen, 
  FileText, Book, BarChart2, ExternalLink, Rocket, Zap, 
  Layers, Lightbulb, FileCode, Bell, UserPlus, MessageSquareText,
  Gauge, BarChart, Newspaper, Award, Target, Boxes, BrainCircuit, Signature, FileCheck
} from 'lucide-react';
import { TabItemType, GroupedTabsType, GroupLabelsType } from './types';

export const tabs: TabItemType[] = [
  // Analyses principales
  { id: 'seo', icon: Search, label: 'SEO', color: 'text-blue-600', group: 'main' },
  { id: 'structure', icon: Globe, label: 'Structure', color: 'text-indigo-600', group: 'main' },
  { id: 'hierarchy', icon: Database, label: 'Hiérarchie', color: 'text-violet-600', group: 'main' },
  { id: 'backlinks', icon: Link2, label: 'Backlinks', color: 'text-pink-600', group: 'main' },
  
  // Métriques et données
  { id: 'metrics', icon: ChartBar, label: 'Métriques', color: 'text-fuchsia-600', group: 'metrics' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics', color: 'text-green-600', group: 'metrics', isNew: true },
  { id: 'keywords', icon: FileText, label: 'Mots-clés', color: 'text-amber-600', group: 'metrics' },
  { id: 'performance', icon: Gauge, label: 'Performance', color: 'text-indigo-500', group: 'metrics' },
  
  // Contenu
  { id: 'content', icon: Book, label: 'Contenu', color: 'text-orange-600', group: 'content' },
  { id: 'optimize', icon: Zap, label: 'Optimisation', color: 'text-blue-600', group: 'content', isNew: true },
  { id: 'ideas', icon: Lightbulb, label: 'Idées', color: 'text-yellow-600', group: 'content' },
  { id: 'quora', icon: MessageSquareText, label: 'Quora', color: 'text-[#b92b27]', group: 'content', isNew: true, link: '/QuoraPage' },
  { id: 'airesearch', icon: BrainCircuit, label: 'Recherche IA', color: 'text-purple-700', group: 'content', isNew: true, highlighted: true },
  
  // New Tab for Word Count Analysis
  { id: 'wordcount', icon: FileCheck, label: '500 Mots', color: 'text-green-700', group: 'content', isNew: true, highlighted: true },
  
  // Technique
  { id: 'advanced', icon: Settings, label: 'Avancé', color: 'text-rose-600', group: 'tech' },
  { id: 'code', icon: FileCode, label: 'Code', color: 'text-slate-600', group: 'tech' },
  { id: 'integrations', icon: Hash, label: 'Intégrations', color: 'text-purple-600', group: 'tech' },
  
  // Marketing
  { id: 'alerts', icon: Bell, label: 'Alertes', color: 'text-red-600', group: 'marketing' },
  { id: 'social', icon: UserPlus, label: 'Social', color: 'text-blue-500', group: 'marketing' },
  { id: 'reports', icon: BarChart, label: 'Rapports', color: 'text-emerald-600', group: 'marketing' },
  { id: 'trends', icon: Target, label: 'Tendances', color: 'text-cyan-600', group: 'marketing' },
  
  // Autres outils
  { id: 'signature', icon: Signature, label: 'Signature', color: 'text-blue-600', group: 'other', link: '/SignaturePage' },
  { id: 'external', icon: ExternalLink, label: 'Externe', color: 'text-teal-600', group: 'other' },
];

export const getGroupedTabs = (): GroupedTabsType => {
  return {
    main: tabs.filter(tab => tab.group === 'main'),
    metrics: tabs.filter(tab => tab.group === 'metrics'),
    content: tabs.filter(tab => tab.group === 'content'),
    tech: tabs.filter(tab => tab.group === 'tech'),
    marketing: tabs.filter(tab => tab.group === 'marketing'),
    other: tabs.filter(tab => tab.group === 'other'),
  };
};

export const groupLabels: GroupLabelsType = {
  main: "Analyses",
  metrics: "Données",
  content: "Contenu",
  tech: "Technique",
  marketing: "Marketing",
  other: "Outils"
};
