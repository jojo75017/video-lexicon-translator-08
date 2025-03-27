
import React, { useEffect, useRef } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import WordCountTabContent from './WordCountTabContent';
import HierarchyTabContent from './HierarchyTabContent';
import DefaultTabContent from './DefaultTabContent';
import { 
  SeoTabContent, 
  StructureTabContent, 
  BacklinksTabContent, 
  MetricsTabContent,
  AdvancedTabContent,
  IntegrationsTabContent
} from './StandardTabContents';
import PerformanceTabContent from './PerformanceTabContent';
import SuggestionsTabContent from './SuggestionsTabContent';
import AnalyticsTabContent from './AnalyticsTabContent';
import { Tab } from './types';
import { activateSection } from '@/utils/navigationHelpers';
import { toast } from "sonner";

interface TabContentsRendererProps {
  contentTabs: Tab[];
  activeTab: string;
}

const TabContentsRenderer: React.FC<TabContentsRendererProps> = ({ 
  contentTabs,
  activeTab
}) => {
  // Liste des identifiants d'onglets qui ont des composants spécialisés
  const specializedTabs = [
    'hierarchy', 'wordcount', 'seo', 'structure', 'backlinks', 
    'metrics', 'advanced', 'integrations', 'analytics', 
    'performance', 'suggestions'
  ];
  
  const initialRender = useRef(true);
  
  console.log(`TabContentsRenderer: Rendu du contenu pour l'onglet actif: ${activeTab}`);
  
  // S'assurer que le contenu est visible lorsque activeTab change
  useEffect(() => {
    // Court délai pour s'assurer que le DOM est mis à jour
    const timer = setTimeout(() => {
      // Activer la section spécifique
      activateSection(activeTab);
      console.log(`TabContentsRenderer: Activation de la section ${activeTab} après délai`);
      
      // Notification pour indiquer le changement d'onglet (seulement après le premier rendu)
      if (!initialRender.current) {
        toast.success(`Contenu de l'onglet ${activeTab} chargé`, {
          description: "Le contenu a été mis à jour",
          duration: 1500
        });
      }
      initialRender.current = false;
    }, 500); // Délai augmenté pour garantir que le DOM est complètement chargé
    
    return () => clearTimeout(timer);
  }, [activeTab]);
  
  // Utilisation de styles inline plus agressifs pour contrôler la visibilité
  const getTabStyle = (tabId: string) => ({
    display: activeTab === tabId ? 'block' : 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  });
  
  return (
    <div className="tab-content-container relative min-h-[500px]">
      {/* Contenu d'onglet spécialisé */}
      <TabsContent 
        value="hierarchy" 
        id="hierarchy" 
        data-tab-content="hierarchy" 
        className="absolute inset-0 w-full"
        style={getTabStyle('hierarchy')}
      >
        <HierarchyTabContent />
      </TabsContent>
      
      <TabsContent 
        value="wordcount" 
        id="wordcount" 
        data-tab-content="wordcount" 
        className="absolute inset-0 w-full"
        style={getTabStyle('wordcount')}
      >
        <WordCountTabContent />
      </TabsContent>
      
      <TabsContent 
        value="suggestions" 
        id="suggestions" 
        data-tab-content="suggestions" 
        className="absolute inset-0 w-full"
        style={getTabStyle('suggestions')}
      >
        <SuggestionsTabContent />
      </TabsContent>
      
      <TabsContent 
        value="seo" 
        id="seo" 
        data-tab-content="seo" 
        className="absolute inset-0 w-full"
        style={getTabStyle('seo')}
      >
        <SeoTabContent />
      </TabsContent>
      
      <TabsContent 
        value="structure" 
        id="structure" 
        data-tab-content="structure" 
        className="absolute inset-0 w-full"
        style={getTabStyle('structure')}
      >
        <StructureTabContent />
      </TabsContent>
      
      <TabsContent 
        value="backlinks" 
        id="backlinks" 
        data-tab-content="backlinks" 
        className="absolute inset-0 w-full"
        style={getTabStyle('backlinks')}
      >
        <BacklinksTabContent />
      </TabsContent>
      
      <TabsContent 
        value="metrics" 
        id="metrics" 
        data-tab-content="metrics" 
        className="absolute inset-0 w-full"
        style={getTabStyle('metrics')}
      >
        <MetricsTabContent />
      </TabsContent>
      
      <TabsContent 
        value="advanced" 
        id="advanced" 
        data-tab-content="advanced" 
        className="absolute inset-0 w-full"
        style={getTabStyle('advanced')}
      >
        <AdvancedTabContent />
      </TabsContent>
      
      <TabsContent 
        value="integrations" 
        id="integrations" 
        data-tab-content="integrations" 
        className="absolute inset-0 w-full"
        style={getTabStyle('integrations')}
      >
        <IntegrationsTabContent />
      </TabsContent>
      
      <TabsContent 
        value="performance" 
        id="performance" 
        data-tab-content="performance" 
        className="absolute inset-0 w-full"
        style={getTabStyle('performance')}
      >
        <PerformanceTabContent />
      </TabsContent>
      
      <TabsContent 
        value="analytics" 
        id="analytics" 
        data-tab-content="analytics" 
        className="absolute inset-0 w-full"
        style={getTabStyle('analytics')}
      >
        <AnalyticsTabContent />
      </TabsContent>
      
      {/* Pour tout autre onglet qui n'a pas de composant spécialisé */}
      {contentTabs
        .filter(tab => !specializedTabs.includes(tab.id))
        .map(tab => (
          <TabsContent 
            key={tab.id} 
            value={tab.id} 
            id={tab.id} 
            data-tab-content={tab.id}
            className="absolute inset-0 w-full"
            style={getTabStyle(tab.id)}
          >
            <DefaultTabContent id={tab.id} label={tab.label} />
          </TabsContent>
        ))}
    </div>
  );
};

export default TabContentsRenderer;
