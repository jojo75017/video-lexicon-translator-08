
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tabs } from './tabs/TabData';
import MainTabList from './tabs/MainTabList';
import SubTabList from './tabs/SubTabList';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import PageHeader from './PageHeader';
import SeoActionButtons from './SeoActionButtons';

const UnifiedDashboard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Déterminer l'onglet actif basé sur le chemin actuel
  const determineActiveTab = (): string => {
    const path = location.pathname.replace('/', '');
    
    const pathToTabMap: Record<string, string> = {
      '': 'hierarchy',
      'hierarchy': 'hierarchy',
      'wordcount': 'wordcount',
      'seo': 'seo',
      'structure': 'structure',
      'performance': 'performance',
      'analytics': 'analytics',
      'suggestions': 'suggestions',
      'backlinks': 'backlinks',
      'metrics': 'metrics',
      'quora': 'quora',
      'signature': 'signature',
      'pinterest': 'pinterest',
      'internal-linking': 'internal-links',
      'keyword-meta': 'keyword-meta',
      'keyword-generator': 'keyword-generator',
      'outils-seo': 'outils-seo',
      // Routes localisées (français)
      'hierarchie': 'hierarchy',
      'nombre-mots': 'wordcount',
      'liens-internes': 'internal-links',
      'metriques': 'metrics',
      'analyse-seo': 'seo',
      'mots-cles': 'keyword-generator',
      'performances': 'performance',
      'structure-site': 'structure',
    };
    
    return pathToTabMap[path] || 'hierarchy';
  };
  
  const [activeTab, setActiveTab] = useState<string>(determineActiveTab());
  
  // Mettre à jour l'onglet actif lorsque le chemin change
  useEffect(() => {
    setActiveTab(determineActiveTab());
  }, [location.pathname]);
  
  // Définir les catégories principales avec les chemins de navigation
  const mainTabs = [
    {id: 'content', label: 'Contenu', color: 'border-blue-600', path: '/hierarchy', isNew: false},
    {id: 'seo', label: 'SEO', color: 'border-purple-600', path: '/seo', isNew: false},
    {id: 'performance', label: 'Performance', color: 'border-amber-600', path: '/performance', isNew: false},
    {id: 'analytics', label: 'Analytics', color: 'border-emerald-600', path: '/analytics', isNew: false},
    {id: 'keyword-meta', label: 'Title & Meta', color: 'border-blue-600', path: '/keyword-meta', isNew: true}
  ];
  
  // Gérer la sélection d'onglet avec navigation vers les pages dédiées
  const handleTabChange = (value: string) => {
    if (value === activeTab) return;
    
    setActiveTab(value);
    
    // Définir les chemins pour chaque onglet
    const tabPaths: Record<string, string> = {
      'hierarchy': '/',
      'wordcount': '/wordcount',
      'suggestions': '/suggestions',
      'seo': '/seo',
      'structure': '/structure',
      'backlinks': '/backlinks',
      'performance': '/performance',
      'metrics': '/metrics',
      'analytics': '/analytics',
      'quora': '/quora',
      'signature': '/signature',
      'pinterest': '/pinterest',
      'internal-links': '/internal-linking',
      'keyword-meta': '/keyword-meta',
      'keyword-generator': '/keyword-generator',
      'outils-seo': '/outils-seo',
    };
    
    // Forcer la navigation si nécessaire
    if (tabPaths[value]) {
      navigate(tabPaths[value]);
      
      // Notification visuelle du changement d'onglet
      toast.info(`Navigation vers ${value}`, {
        description: "Chargement de la page...",
        duration: 1500
      });
    }
  };

  // Obtenir les sous-onglets en fonction de l'onglet principal actif
  const getSubTabs = () => {
    // Déterminer la catégorie principale en fonction de l'onglet actif
    const getMainCategory = (tabId: string): string => {
      if (['hierarchy', 'wordcount', 'suggestions'].includes(tabId)) {
        return 'content';
      } else if (['seo', 'structure', 'backlinks', 'internal-links', 'keyword-meta'].includes(tabId)) {
        return 'seo';
      } else if (['performance', 'metrics'].includes(tabId)) {
        return 'performance';
      } else if (tabId === 'analytics') {
        return 'analytics';
      } else if (tabId === 'quora' || tabId === 'signature' || tabId === 'pinterest' || tabId === 'keyword-generator' || tabId === 'outils-seo') {
        return tabId;
      }
      
      return 'content';
    };
    
    const mainCategory = getMainCategory(activeTab);
    
    if (mainCategory === 'content') {
      return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
    } 
    else if (mainCategory === 'seo') {
      return tabs.filter(tab => ['seo', 'structure', 'backlinks', 'internal-links', 'keyword-meta'].includes(tab.id));
    } 
    else if (mainCategory === 'performance') {
      return tabs.filter(tab => ['performance', 'metrics'].includes(tab.id));
    } 
    else if (mainCategory === 'analytics') {
      return tabs.filter(tab => ['analytics'].includes(tab.id));
    }
    else if (['quora', 'signature', 'pinterest', 'keyword-generator', 'outils-seo'].includes(mainCategory)) {
      return tabs.filter(tab => [mainCategory].includes(tab.id));
    }
    
    // Par défaut - afficher les onglets de contenu
    return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      
      <div className="container mx-auto py-4">
        <SeoActionButtons />
        
        <div className="mb-6 mt-8">
          <Card className="p-4">
            <MainTabList 
              mainTabs={mainTabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            
            <SubTabList 
              tabs={getSubTabs()}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Card>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default UnifiedDashboard;
