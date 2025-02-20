
import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureGrid = () => {
  const features = [
    {
      icon: Pen,
      title: "Signature",
      description: "Créez votre signature professionnelle",
      color: "border-purple-500",
      id: "signature"
    },
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
    }
  ];

  const handleFeatureClick = (id: string) => {
    const element = document.querySelector(`[data-value="${id}"]`) as HTMLElement;
    if (element) {
      element.click();
      // Faire défiler jusqu'à l'élément
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
  );
};

export default FeatureGrid;
