
import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Signature } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { activateSection } from '@/utils/navigationHelpers';

const FeatureGrid = () => {
  const navigate = useNavigate();
  
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

  // Fonction pour gérer les clics sur les fonctionnalités
  const handleFeatureClick = (id: string, link?: string) => {
    console.log(`Feature clicked: ${id}, link: ${link}`);
    
    if (link) {
      navigate(link);
      return;
    }
    
    // Update URL hash and activate section
    window.location.hash = id;
    activateSection(id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
        Fonctionnalités
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            className="cursor-pointer" 
            id={`feature-card-${feature.id}`}
            data-feature-id={feature.id}
            onClick={() => handleFeatureClick(feature.id, feature.link)}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              onClick={() => {}} // Handled by parent div now
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
