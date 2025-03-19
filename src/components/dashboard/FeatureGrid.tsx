
import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen, Signature } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import { navigateToSection } from '@/utils/navigationHelpers';

const FeatureGrid = () => {
  const features = [
    {
      icon: Search,
      title: "SEO",
      description: "Analyse complète des facteurs SEO",
      color: "blue",
      id: "seo",
      tabValue: "info"
    },
    {
      icon: Globe,
      title: "Structure",
      description: "Architecture du site",
      color: "indigo",
      id: "structure",
      tabValue: "structure" 
    },
    {
      icon: Database,
      title: "Hiérarchie",
      description: "Organisation du contenu",
      color: "violet",
      id: "hierarchy",
      tabValue: "structure"
    },
    {
      icon: Link2,
      title: "Backlinks",
      description: "Analyse des liens",
      color: "pink",
      id: "backlinks",
      tabValue: "info"
    },
    {
      icon: ChartBar,
      title: "Métriques",
      description: "Statistiques détaillées",
      color: "fuchsia",
      id: "metrics",
      tabValue: "info"
    },
    {
      icon: Settings,
      title: "Avancé",
      description: "Options avancées",
      color: "rose",
      id: "advanced",
      tabValue: "info"
    },
    {
      icon: Hash,
      title: "Intégrations",
      description: "Outils externes",
      color: "purple",
      id: "integrations",
      tabValue: "info"
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

  // Improved function to handle feature clicks
  const handleFeatureClick = (id: string, tabValue?: string, link?: string) => {
    if (link) {
      // No action needed, routing is handled by the Link component
      return;
    }
    
    // Using improved navigation helper
    if (tabValue) {
      navigateToSection(id, tabValue);
    } else {
      navigateToSection(id);
    }
    
    // Notify user about the navigation
    toast.info(`Navigation vers ${id}`, {
      description: `Affichage des données de ${id}`,
      duration: 2000
    });
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
            <div 
              key={feature.id} 
              className="cursor-pointer" 
              onClick={() => handleFeatureClick(feature.id, feature.tabValue)}
              id={`feature-card-${feature.id}`}
              data-feature-id={feature.id}
              data-tab-value={feature.tabValue}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                onClick={() => {}}
              />
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
