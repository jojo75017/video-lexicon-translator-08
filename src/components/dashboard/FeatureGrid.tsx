
import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen, Signature } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureGrid = () => {
  const features = [
    {
      icon: Search,
      title: "SEO",
      description: "Analyse complète des facteurs SEO",
      color: "blue",
      id: "seo"
    },
    {
      icon: Globe,
      title: "Structure",
      description: "Architecture du site",
      color: "indigo",
      id: "structure"
    },
    {
      icon: Database,
      title: "Hiérarchie",
      description: "Organisation du contenu",
      color: "violet",
      id: "hierarchy"
    },
    {
      icon: Link2,
      title: "Backlinks",
      description: "Analyse des liens",
      color: "pink",
      id: "backlinks"
    },
    {
      icon: ChartBar,
      title: "Métriques",
      description: "Statistiques détaillées",
      color: "fuchsia",
      id: "metrics"
    },
    {
      icon: Settings,
      title: "Avancé",
      description: "Options avancées",
      color: "rose",
      id: "advanced"
    },
    {
      icon: Hash,
      title: "Intégrations",
      description: "Outils externes",
      color: "purple",
      id: "integrations"
    },
    {
      icon: Signature,
      title: "Signature",
      description: "Signature professionnelle",
      color: "blue",
      id: "signature",
      link: "/SignaturePage"
    }
  ];

  const handleFeatureClick = (id: string, link?: string) => {
    if (link) return; // Si un lien est fourni, on utilise le routage normal
    
    const element = document.querySelector(`[data-value="${id}"]`) as HTMLElement;
    if (element) {
      element.click();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
        Fonctionnalités
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          feature.link ? (
            <Link key={feature.id} to={feature.link} className="block">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                onClick={() => {}}
              />
            </Link>
          ) : (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              onClick={() => handleFeatureClick(feature.id, feature.link)}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
