
import React, { useEffect } from 'react';
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
  
  console.log(`TabContentsRenderer: Rendu du contenu pour l'onglet actif: ${activeTab}`);
  
  // S'assurer que le contenu est visible lorsque activeTab change
  useEffect(() => {
    // Court délai pour s'assurer que le DOM est mis à jour
    setTimeout(() => {
      // Activer la section spécifique
      activateSection(activeTab);
    }, 100);
  }, [activeTab]);
  
  return (
    <div className="tab-content-container relative">
      {/* Contenu d'onglet spécialisé */}
      <TabsContent 
        value="hierarchy" 
        id="hierarchy" 
        data-tab-content="hierarchy" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'hierarchy' ? 'block' : 'none' }}
      >
        <HierarchyTabContent />
      </TabsContent>
      
      <TabsContent 
        value="wordcount" 
        id="wordcount" 
        data-tab-content="wordcount" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'wordcount' ? 'block' : 'none' }}
      >
        <WordCountTabContent />
      </TabsContent>
      
      <TabsContent 
        value="suggestions" 
        id="suggestions" 
        data-tab-content="suggestions" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'suggestions' ? 'block' : 'none' }}
      >
        <SuggestionsTabContent />
      </TabsContent>
      
      <TabsContent 
        value="seo" 
        id="seo" 
        data-tab-content="seo" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'seo' ? 'block' : 'none' }}
      >
        <SeoTabContent />
      </TabsContent>
      
      <TabsContent 
        value="structure" 
        id="structure" 
        data-tab-content="structure" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'structure' ? 'block' : 'none' }}
      >
        <StructureTabContent />
      </TabsContent>
      
      <TabsContent 
        value="backlinks" 
        id="backlinks" 
        data-tab-content="backlinks" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'backlinks' ? 'block' : 'none' }}
      >
        <BacklinksTabContent />
      </TabsContent>
      
      <TabsContent 
        value="metrics" 
        id="metrics" 
        data-tab-content="metrics" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'metrics' ? 'block' : 'none' }}
      >
        <MetricsTabContent />
      </TabsContent>
      
      <TabsContent 
        value="advanced" 
        id="advanced" 
        data-tab-content="advanced" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'advanced' ? 'block' : 'none' }}
      >
        <AdvancedTabContent />
      </TabsContent>
      
      <TabsContent 
        value="integrations" 
        id="integrations" 
        data-tab-content="integrations" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'integrations' ? 'block' : 'none' }}
      >
        <IntegrationsTabContent />
      </TabsContent>
      
      <TabsContent 
        value="performance" 
        id="performance" 
        data-tab-content="performance" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'performance' ? 'block' : 'none' }}
      >
        <PerformanceTabContent />
      </TabsContent>
      
      <TabsContent 
        value="analytics" 
        id="analytics" 
        data-tab-content="analytics" 
        className="absolute inset-0 w-full"
        style={{ display: activeTab === 'analytics' ? 'block' : 'none' }}
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
            style={{ display: activeTab === tab.id ? 'block' : 'none' }}
          >
            <DefaultTabContent id={tab.id} label={tab.label} />
          </TabsContent>
        ))}
    </div>
  );
};

export default TabContentsRenderer;
