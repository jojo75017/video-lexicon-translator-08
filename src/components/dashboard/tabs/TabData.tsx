
import React from 'react';
import { BarChart2, FileText, Zap, PieChart, Type, FilePenLine, LayoutGrid, ThumbsUp, Target, LinkIcon, Link2, LineChart, CheckCircle2, TicketCheck } from "lucide-react";

export const tabs = [
  { 
    id: 'hierarchy', 
    label: 'Structure',
    icon: <FileText className="h-4 w-4" />,
    description: "Analyser la structure de vos contenus",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    link: null,
    category: 'content'
  },
  { 
    id: 'wordcount', 
    label: 'Audit de contenu',
    icon: <BarChart2 className="h-4 w-4" />,
    description: "Analyse du nombre de mots et de la lisibilité",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    link: null,
    category: 'content'
  },
  { 
    id: 'suggestions', 
    label: 'Suggestions', 
    icon: <ThumbsUp className="h-4 w-4" />,
    description: "Suggestions d'amélioration de contenu",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    link: null,
    category: 'content'
  },
  { 
    id: 'seo', 
    label: 'SEO',
    icon: <Target className="h-4 w-4" />,
    description: "Analyse SEO complète",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    link: null,
    category: 'seo'
  },
  {
    id: 'structure',
    label: 'Structure du site',
    icon: <LayoutGrid className="h-4 w-4" />,
    description: "Analyser l'architecture du site",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    link: null,
    category: 'seo'
  },
  { 
    id: 'backlinks', 
    label: 'Backlinks',
    icon: <LinkIcon className="h-4 w-4" />,
    description: "Analyser les backlinks",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    link: null,
    category: 'seo'
  },
  { 
    id: 'internal-links', 
    label: 'Liens internes',
    icon: <Link2 className="h-4 w-4" />,
    description: "Optimiser les liens internes",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    link: null,
    category: 'seo'
  },
  {
    id: 'keyword-meta',
    label: 'Titres & Meta',
    icon: <Type className="h-4 w-4" />,
    description: "Optimiser vos balises title et meta",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    link: '/keyword-meta',
    category: 'seo'
  },
  { 
    id: 'performance', 
    label: 'Performance',
    icon: <Zap className="h-4 w-4" />,
    description: "Analyse des performances",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    link: null,
    category: 'performance'
  },
  { 
    id: 'metrics', 
    label: 'Métriques',
    icon: <LineChart className="h-4 w-4" />,
    description: "Métriques de performance détaillées",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    link: null,
    category: 'performance'
  },
  { 
    id: 'analytics', 
    label: 'Analytics',
    icon: <PieChart className="h-4 w-4" />,
    description: "Données analytiques",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    link: null,
    category: 'analytics'
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    // Remplacer l'icône Pinterest par FilePenLine
    icon: <FilePenLine className="h-4 w-4" />,
    description: "Générateur d'images Pinterest",
    color: "bg-red-50 text-red-700 border-red-200",
    link: '/pinterest',
    category: 'tools'
  },
  {
    id: 'signature',
    label: 'Signature Email',
    icon: <FilePenLine className="h-4 w-4" />,
    description: "Créer une signature email professionnelle",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    link: '/signature',
    category: 'tools'
  },
  {
    id: 'quora',
    label: 'Quora & Forums',
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Réponses optimisées pour forums",
    color: "bg-red-50 text-red-700 border-red-200",
    link: '/quora',
    category: 'tools'
  }
];
