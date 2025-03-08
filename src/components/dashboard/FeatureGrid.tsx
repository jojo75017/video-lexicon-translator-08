
import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen } from 'lucide-react';

const FeatureGrid = () => {
  const features = [
    {
      icon: Search,
      title: "SEO",
      description: "Analyse complète des facteurs SEO",
      color: "border-blue-500",
      id: "seo"
    },
    {
      icon: Globe,
      title: "Structure",
      description: "Architecture du site",
      color: "border-indigo-500",
      id: "structure"
    },
    {
      icon: Database,
      title: "Hiérarchie",
      description: "Organisation du contenu",
      color: "border-violet-500",
      id: "hierarchy"
    },
    {
      icon: Link2,
      title: "Backlinks",
      description: "Analyse des liens",
      color: "border-pink-500",
      id: "backlinks"
    },
    {
      icon: ChartBar,
      title: "Métriques",
      description: "Statistiques détaillées",
      color: "border-fuchsia-500",
      id: "metrics"
    },
    {
      icon: Settings,
      title: "Avancé",
      description: "Options avancées",
      color: "border-rose-500",
      id: "advanced"
    },
    {
      icon: Hash,
      title: "Intégrations",
      description: "Outils externes",
      color: "border-purple-500",
      id: "integrations"
    },
    {
      icon: Pen,
      title: "Signature",
      description: "Signature professionnelle",
      color: "border-blue-500",
      id: "signature"
    }
  ];

  const handleFeatureClick = (id: string) => {
    const element = document.querySelector(`[data-value="${id}"]`) as HTMLElement;
    if (element) {
      element.click();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Fonctionnalités</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            onClick={() => handleFeatureClick(feature.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
