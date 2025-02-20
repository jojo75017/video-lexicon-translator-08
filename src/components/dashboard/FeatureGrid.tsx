
import React from 'react';
import FeatureCard from './FeatureCard';
import { Pen, Search, Globe, Database, Link2, ChartBar, Settings, Hash } from 'lucide-react';

const FeatureGrid = () => {
  const features = [
    {
      icon: Pen,
      title: "Signature",
      description: "Générateur de signature",
      color: "border-blue-500",
      id: "signature"
    },
    {
      icon: Search,
      title: "SEO",
      description: "Analyse complète des facteurs SEO",
      color: "border-purple-500",
      id: "seo"
    },
    {
      icon: Globe,
      title: "Structure",
      description: "Architecture du site",
      color: "border-red-500",
      id: "structure"
    },
    {
      icon: Database,
      title: "Hiérarchie",
      description: "Organisation du contenu",
      color: "border-green-500",
      id: "hierarchy"
    },
    {
      icon: Link2,
      title: "Backlinks",
      description: "Analyse des liens",
      color: "border-orange-500",
      id: "backlinks"
    },
    {
      icon: ChartBar,
      title: "Métriques",
      description: "Statistiques",
      color: "border-pink-500",
      id: "metrics"
    },
    {
      icon: Settings,
      title: "Avancé",
      description: "Options avancées",
      color: "border-yellow-500",
      id: "advanced"
    },
    {
      icon: Hash,
      title: "Intégrations",
      description: "Outils externes",
      color: "border-teal-500",
      id: "integrations"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          color={feature.color}
          onClick={() => document.getElementById(feature.id)?.click()}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;
