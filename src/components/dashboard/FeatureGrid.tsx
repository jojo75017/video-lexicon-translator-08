
import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen, Signature } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

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
  const handleFeatureClick = (id: string, tabValue?: string, link?: string) => {
    console.log(`Feature clicked: ${id}, tab: ${tabValue}, link: ${link}`);
    
    if (link) {
      navigate(link);
      return;
    }
    
    // Navigate to section directly without using the helper
    if (tabValue) {
      // First activate the tab if necessary
      const tabElement = document.querySelector(`[data-value="${tabValue}"]`) as HTMLElement;
      if (tabElement) {
        console.log(`Tab element found: ${tabValue}`);
        tabElement.click();
        
        // Wait for tab to be activated
        setTimeout(() => {
          scrollToSection(id);
        }, 200);
      } else {
        scrollToSection(id);
      }
    } else {
      scrollToSection(id);
    }
    
    // Notification
    toast.success(`Navigation vers ${id}`, {
      description: `Affichage des données de ${id}`,
      duration: 2000
    });
  };

  const scrollToSection = (sectionId: string): void => {
    console.log(`Scrolling to section: ${sectionId}`);
    
    // Find element by ID
    const sectionElement = document.getElementById(sectionId);
    
    if (sectionElement) {
      console.log(`Section element found: ${sectionId}`);
      
      // Scroll to section with smooth behavior
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Apply highlight effect
      sectionElement.classList.add('transition-all');
      sectionElement.classList.add('duration-1000');
      
      // More visible effect
      sectionElement.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
      sectionElement.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      
      // Remove effect after delay
      setTimeout(() => {
        sectionElement.style.backgroundColor = '';
        sectionElement.style.boxShadow = 'none';
        sectionElement.classList.remove('transition-all');
        sectionElement.classList.remove('duration-1000');
      }, 3000);
    } else {
      console.log(`Section element not found: ${sectionId}`);
      
      // Try to find element with data-section attribute
      const dataAttributeSection = document.querySelector(`[data-section="${sectionId}"]`);
      if (dataAttributeSection) {
        console.log(`Found section by data attribute: ${sectionId}`);
        dataAttributeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Apply highlight effect
        dataAttributeSection.classList.add('transition-all');
        dataAttributeSection.classList.add('duration-1000');
        
        // More visible effect
        (dataAttributeSection as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        (dataAttributeSection as HTMLElement).style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
        
        // Remove effect after delay
        setTimeout(() => {
          (dataAttributeSection as HTMLElement).style.backgroundColor = '';
          (dataAttributeSection as HTMLElement).style.boxShadow = 'none';
          dataAttributeSection.classList.remove('transition-all');
          dataAttributeSection.classList.remove('duration-1000');
        }, 3000);
        return;
      }
      
      // Try to find element with class name
      const classSection = document.querySelector(`.section-${sectionId}`);
      if (classSection) {
        console.log(`Found section by class: ${sectionId}`);
        classSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Apply highlight effect
        (classSection as HTMLElement).classList.add('transition-all');
        (classSection as HTMLElement).classList.add('duration-1000');
        
        // More visible effect
        (classSection as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        (classSection as HTMLElement).style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
        
        // Remove effect after delay
        setTimeout(() => {
          (classSection as HTMLElement).style.backgroundColor = '';
          (classSection as HTMLElement).style.boxShadow = 'none';
          (classSection as HTMLElement).classList.remove('transition-all');
          (classSection as HTMLElement).classList.remove('duration-1000');
        }, 3000);
        return;
      }
      
      // If no specific section is found, inform the user
      toast.info("Section non trouvée", {
        description: "Veuillez d'abord analyser un site web pour accéder à cette section",
      });
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
          <div 
            key={feature.id} 
            className="cursor-pointer" 
            id={`feature-card-${feature.id}`}
            data-feature-id={feature.id}
            data-tab-value={feature.tabValue}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              onClick={() => handleFeatureClick(feature.id, feature.tabValue, feature.link)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
