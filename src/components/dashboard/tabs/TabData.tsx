
import { Tab } from './types';
import { 
  BarChart2, 
  Clock, 
  Code, 
  ExternalLink, 
  FileText, 
  HardDrive, 
  Layout, 
  Link2, 
  List, 
  Maximize2, 
  PieChart, 
  Settings, 
  SlidersHorizontal, 
  Zap
} from 'lucide-react';

export const groupLabels: Record<string, string> = {
  'content': 'Contenu',
  'seo': 'SEO',
  'backlinks': 'Backlinks',
  'performance': 'Performance',
  'advanced': 'Avancé',
  'external': 'Liens',
};

export const tabs: Tab[] = [
  {
    id: 'wordcount',
    label: 'Mots-clés',
    description: 'Analyse de la densité des mots-clés',
    icon: <List />,
    group: 'content',
    color: 'text-blue-600' // Added color property
  },
  {
    id: 'hierarchy',
    label: 'Hiérarchie',
    description: 'Structure des titres et contenu',
    icon: <Layout />,
    group: 'content',
    color: 'text-green-600' // Added color property
  },
  {
    id: 'seo',
    label: 'SEO',
    description: 'Analyse du référencement',
    icon: <Maximize2 />,
    group: 'seo',
    color: 'text-purple-600' // Added color property
  },
  {
    id: 'structure',
    label: 'Structure',
    description: 'Structure du site et navigation',
    icon: <HardDrive />,
    group: 'seo',
    color: 'text-yellow-600' // Added color property
  },
  {
    id: 'backlinks',
    label: 'Backlinks',
    description: 'Analyse des liens entrants',
    icon: <Link2 />,
    group: 'backlinks',
    color: 'text-indigo-600' // Added color property
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Données statistiques et analytiques',
    icon: <BarChart2 />,
    group: 'seo',
    color: 'text-orange-600' // Added color property
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'Vitesse et optimisations',
    icon: <Zap />,
    group: 'performance',
    color: 'text-amber-600' // Added color property
  },
  {
    id: 'metrics',
    label: 'Métriques',
    description: 'KPIs et statistiques',
    icon: <PieChart />,
    group: 'performance',
    color: 'text-emerald-600' // Added color property
  },
  {
    id: 'advanced',
    label: 'Avancé',
    description: 'Options et analyses avancées',
    icon: <SlidersHorizontal />,
    group: 'advanced',
    color: 'text-gray-600' // Added color property
  },
  {
    id: 'code',
    label: 'Code',
    description: 'Analyse technique du code',
    icon: <Code />,
    group: 'advanced',
    color: 'text-rose-600' // Added color property
  },
  {
    id: 'integrations',
    label: 'Intégrations',
    description: 'Connexion avec d\'autres outils',
    icon: <Settings />,
    group: 'advanced',
    color: 'text-cyan-600' // Added color property
  },
  {
    id: 'gsc',
    label: 'Search Console',
    description: 'Données de Google Search Console',
    icon: <FileText />,
    link: 'https://search.google.com/search-console',
    group: 'external',
    color: 'text-red-600' // Added color property
  },
  {
    id: 'ga',
    label: 'Google Analytics',
    description: 'Données de Google Analytics',
    icon: <BarChart2 />,
    link: 'https://analytics.google.com/',
    group: 'external',
    color: 'text-blue-600' // Added color property
  },
  {
    id: 'lighthouse',
    label: 'Lighthouse',
    description: 'Audit de performance',
    icon: <Clock />,
    link: 'https://developers.google.com/web/tools/lighthouse',
    group: 'external',
    color: 'text-yellow-600' // Added color property
  },
  {
    id: 'pagespeed',
    label: 'PageSpeed',
    description: 'Analyse de vitesse Google',
    icon: <ExternalLink />,
    link: 'https://developers.google.com/speed/pagespeed/insights/',
    group: 'external',
    color: 'text-green-600' // Added color property
  }
];

export const getGroupedTabs = (): Record<string, Tab[]> => {
  const grouped: Record<string, Tab[]> = {};
  
  tabs.forEach(tab => {
    if (!grouped[tab.group]) {
      grouped[tab.group] = [];
    }
    grouped[tab.group].push(tab);
  });
  
  return grouped;
};
