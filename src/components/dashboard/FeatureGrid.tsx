
import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen, Signature } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeatureGrid = () => {
  const features = [
    {
      icon: Search,
      title: "SEO",
      description: "Analyse complète des facteurs SEO",
      color: "blue",
      id: "seo",
      tabValue: "seo"
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
      tabValue: "hierarchy"
    },
    {
      icon: Link2,
      title: "Backlinks",
      description: "Analyse des liens",
      color: "pink",
      id: "backlinks",
      tabValue: "backlinks"
    },
    {
      icon: ChartBar,
      title: "Métriques",
      description: "Statistiques détaillées",
      color: "fuchsia",
      id: "metrics",
      tabValue: "metrics"
    },
    {
      icon: Settings,
      title: "Avancé",
      description: "Options avancées",
      color: "rose",
      id: "advanced",
      tabValue: "advanced"
    },
    {
      icon: Hash,
      title: "Intégrations",
      description: "Outils externes",
      color: "purple",
      id: "integrations",
      tabValue: "integrations"
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

  // Fonction améliorée pour gérer le clic sur les fonctionnalités
  const handleFeatureClick = (id: string, tabValue?: string, link?: string) => {
    if (link) {
      // Aucune action nécessaire, le routage se fait via le Link
      return;
    }
    
    // Recherche d'un élément DOM correspondant à l'onglet visé
    const mainTabTrigger = document.querySelector(`[data-state="active"][role="tab"]`) as HTMLElement;
    if (mainTabTrigger) {
      // Notifie l'utilisateur de la navigation
      toast.info(`Accès à la section ${id}`, {
        description: `Affichage des données de ${id}`,
        duration: 2000
      });
      
      // Essayons de trouver un onglet plus spécifique correspondant à la fonctionnalité
      if (tabValue) {
        setTimeout(() => {
          const specificTabTrigger = document.querySelector(`[data-value="${tabValue}"]`) as HTMLElement;
          if (specificTabTrigger) {
            specificTabTrigger.click();
            specificTabTrigger.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.log(`Onglet spécifique non trouvé: ${tabValue}`);
            
            // Si nous n'avons pas trouvé l'onglet spécifique, cherchons une section par ID
            const sectionElement = document.getElementById(id);
            if (sectionElement) {
              sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              console.log(`Section non trouvée: ${id}`);
            }
          }
        }, 100);
      }
    } else {
      console.log("Aucun onglet actif trouvé");
      
      // Comme solution de secours, afficher un message à l'utilisateur
      toast.info(`Fonctionnalité ${id}`, {
        description: "Cette fonctionnalité sera disponible après avoir analysé un site.",
        duration: 3000
      });
      
      // Essayer de faire défiler jusqu'au formulaire d'analyse
      const analysisForm = document.querySelector('form') as HTMLElement;
      if (analysisForm) {
        analysisForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
            <div 
              key={feature.id} 
              className="cursor-pointer" 
              onClick={() => handleFeatureClick(feature.id, feature.tabValue)}
              id={`feature-card-${feature.id}`}
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
