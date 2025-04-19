
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
  Zap,
  Tag,
  Edit3,
  FileSignature,
  Languages,
  Image
} from 'lucide-react';

export const groupLabels: Record<string, string> = {
  'content': 'Contenu',
  'seo': 'SEO',
  'backlinks': 'Backlinks',
  'performance': 'Performance',
  'advanced': 'Avancé',
  'external': 'Liens',
  'tools': 'Outils',
};

export const tabs: Tab[] = [
  {
    id: 'wordcount',
    label: 'Mots-clés',
    description: 'Analyse de la densité des mots-clés',
    icon: <List />,
    group: 'content',
    color: 'text-blue-600'
  },
  {
    id: 'hierarchy',
    label: 'Hiérarchie',
    description: 'Structure des titres et contenu',
    icon: <Layout />,
    group: 'content',
    color: 'text-green-600'
  },
  // Nouvel onglet pour les suggestions de titre/meta description
  {
    id: 'suggestions',
    label: 'Suggestions',
    description: 'Suggestions de titres et meta descriptions',
    icon: <Edit3 />,
    group: 'content',
    color: 'text-amber-600',
    isNew: true,
    highlighted: true
  },
  {
    id: 'seo',
    label: 'SEO',
    description: 'Analyse du référencement',
    icon: <Maximize2 />,
    group: 'seo',
    color: 'text-purple-600'
  },
  {
    id: 'structure',
    label: 'Structure',
    description: 'Structure du site et navigation',
    icon: <HardDrive />,
    group: 'seo',
    color: 'text-yellow-600'
  },
  {
    id: 'backlinks',
    label: 'Backlinks',
    description: 'Analyse des liens entrants',
    icon: <Link2 />,
    group: 'backlinks',
    color: 'text-indigo-600'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Données statistiques et analytiques',
    icon: <BarChart2 />,
    group: 'seo',
    color: 'text-orange-600'
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'Vitesse et optimisations',
    icon: <Zap />,
    group: 'performance',
    color: 'text-amber-600'
  },
  {
    id: 'metrics',
    label: 'Métriques',
    description: 'KPIs et statistiques',
    icon: <PieChart />,
    group: 'metrics',
    color: 'text-emerald-600'
  },
  {
    id: 'advanced',
    label: 'Avancé',
    description: 'Options et analyses avancées',
    icon: <SlidersHorizontal />,
    group: 'advanced',
    color: 'text-gray-600'
  },
  {
    id: 'code',
    label: 'Code',
    description: 'Analyse technique du code',
    icon: <Code />,
    group: 'advanced',
    color: 'text-rose-600'
  },
  {
    id: 'integrations',
    label: 'Intégrations',
    description: 'Connexion avec d\'autres outils',
    icon: <Settings />,
    group: 'advanced',
    color: 'text-cyan-600'
  },
  // Add Signature tab with higher visibility
  {
    id: 'signature',
    label: 'Signature Email',
    description: 'Créer une signature professionnelle',
    icon: <FileSignature />,
    group: 'tools',
    color: 'text-blue-600',
    highlighted: true
  },
  // Nouvel onglet pour la traduction vidéo
  {
    id: 'translation',
    label: 'Traduction Vidéo',
    description: 'Traduire vos vidéos de l\'anglais au français',
    icon: <Languages />,
    group: 'tools',
    color: 'text-indigo-600',
    isNew: true,
    highlighted: true
  },
  // Nouvel onglet pour Pinterest
  {
    id: 'pinterest',
    label: 'Images Pinterest',
    description: 'Créer des visuels Pinterest (1000x1500)',
    icon: <Image />,
    group: 'tools',
    color: 'text-red-600',
    isNew: true,
    highlighted: true,
    path: '/pinterest'
  },
  {
    id: 'quora',
    label: 'Questions Quora',
    description: 'Trouver et répondre aux questions pertinentes',
    icon: <Tag />,
    group: 'tools',
    color: 'text-[#b92b27]'
  },
  {
    id: 'local-business',
    label: 'Entreprise Locale',
    description: 'Optimisation pour les recherches locales',
    icon: <Tag />,
    group: 'tools',
    color: 'text-indigo-600'
  },
  {
    id: 'gsc',
    label: 'Search Console',
    description: 'Données de Google Search Console',
    icon: <FileText />,
    link: 'https://search.google.com/search-console',
    group: 'external',
    color: 'text-red-600'
  },
  {
    id: 'ga',
    label: 'Google Analytics',
    description: 'Données de Google Analytics',
    icon: <BarChart2 />,
    link: 'https://analytics.google.com/',
    group: 'external',
    color: 'text-blue-600'
  },
  {
    id: 'lighthouse',
    label: 'Lighthouse',
    description: 'Audit de performance',
    icon: <Clock />,
    link: 'https://developers.google.com/web/tools/lighthouse',
    group: 'external',
    color: 'text-yellow-600'
  },
  {
    id: 'pagespeed',
    label: 'PageSpeed',
    description: 'Analyse de vitesse Google',
    icon: <ExternalLink />,
    link: 'https://developers.google.com/speed/pagespeed/insights/',
    group: 'external',
    color: 'text-green-600'
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
