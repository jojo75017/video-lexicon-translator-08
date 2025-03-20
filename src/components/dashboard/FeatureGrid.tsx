
import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen, Signature } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { navigateToSection } from '@/utils/navigationHelpers';

const FeatureGrid = () => {
  const navigate = useNavigate();
  
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

  // Fonction pour gérer les clics sur les fonctionnalités
  const handleFeatureClick = (e: React.MouseEvent<HTMLDivElement>, id: string, tabValue?: string, link?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Feature clicked: ${id}, tab: ${tabValue}, link: ${link}`);
    
    if (link) {
      navigate(link);
      return;
    }
    
    if (tabValue) {
      navigateToSection(id, tabValue);
    } else {
      navigateToSection(id);
    }
    
    // Notification
    toast.success(`Navigation vers ${id}`, {
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
            <div 
              key={feature.id}
              onClick={(e) => handleFeatureClick(e, feature.id, feature.tabValue, feature.link)}
              className="cursor-pointer"
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                onClick={(e) => handleFeatureClick(e, feature.id, feature.tabValue, feature.link)}
              />
            </div>
          ) : (
            <div 
              key={feature.id} 
              className="cursor-pointer" 
              id={`feature-card-${feature.id}`}
              data-feature-id={feature.id}
              data-tab-value={feature.tabValue}
              onClick={(e) => handleFeatureClick(e, feature.id, feature.tabValue)}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                onClick={(e) => handleFeatureClick(e, feature.id, feature.tabValue)}
              />
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
