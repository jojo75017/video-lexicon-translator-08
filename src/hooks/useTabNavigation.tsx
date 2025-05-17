
import { useState, useEffect } from 'react';
import { tabs } from '@/components/dashboard/tabs/TabData';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";

export interface MainTab {
  id: string;
  label: string;
  color: string;
  path?: string;
}

export const useTabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine the active tab based on the current path
  const determineActiveTab = (): string => {
    const path = location.pathname.replace('/', '');
    
    const pathToTabMap: Record<string, string> = {
      '': 'hierarchy',
      'index': 'hierarchy',
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
      // Localized routes (French)
      'hierarchie': 'hierarchy',
      'nombre-mots': 'wordcount',
      'metriques': 'metrics',
      'liens-internes': 'internal-links',
    };
    
    // Debug log
    console.log('TabNavigation current path:', path);
    console.log('TabNavigation mapped tab:', pathToTabMap[path] || 'hierarchy');
    
    return pathToTabMap[path] || 'hierarchy';
  };
  
  const [activeTab, setActiveTab] = useState<string>(determineActiveTab());
  
  // Update active tab when path changes
  useEffect(() => {
    const newActiveTab = determineActiveTab();
    console.log('Updating active tab from', activeTab, 'to', newActiveTab);
    setActiveTab(newActiveTab);
  }, [location.pathname]);
  
  // Define main categories with navigation paths
  const mainTabs: MainTab[] = [
    {id: 'content', label: 'Contenu', color: 'border-blue-600', path: '/hierarchy'},
    {id: 'seo', label: 'SEO', color: 'border-purple-600', path: '/seo'},
    {id: 'performance', label: 'Performance', color: 'border-amber-600', path: '/performance'},
    {id: 'analytics', label: 'Analytics', color: 'border-emerald-600', path: '/analytics'}
  ];
  
  // Handle tab selection with navigation to dedicated pages
  const handleTabChange = (value: string) => {
    console.log(`useTabNavigation: Tab change to: ${value}`);
    
    // Don't continue if it's already the active tab
    if (value === activeTab) {
      console.log('Tab already active, no action needed');
      return;
    }
    
    setActiveTab(value);
    
    // Define paths for each tab
    const tabPaths: Record<string, string> = {
      'hierarchy': '/hierarchy',
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
      'keyword-generator': '/keyword-generator'
    };
    
    // Force navigation if necessary
    if (tabPaths[value]) {
      console.log(`useTabNavigation: Navigating to: ${tabPaths[value]}`);
      navigate(tabPaths[value]);
      
      // Visual notification of tab change
      toast.info(`Navigation vers ${value}`, {
        description: "Chargement de la page...",
        duration: 1500
      });
    }
  };

  // Get sub-tabs based on the active main tab
  const getSubTabs = () => {
    // Determine main category based on active tab
    const getMainCategory = (tabId: string): string => {
      if (['hierarchy', 'wordcount', 'suggestions'].includes(tabId)) {
        return 'content';
      } else if (['seo', 'structure', 'backlinks', 'internal-links', 'keyword-meta'].includes(tabId)) {
        return 'seo';
      } else if (['performance', 'metrics'].includes(tabId)) {
        return 'performance';
      } else if (tabId === 'analytics') {
        return 'analytics';
      } else if (tabId === 'quora' || tabId === 'signature' || tabId === 'pinterest' || tabId === 'keyword-generator') {
        return tabId; // These are their own categories
      }
      
      return 'content'; // Default, return 'content'
    };
    
    const mainCategory = getMainCategory(activeTab);
    console.log('useTabNavigation: Main category for', activeTab, 'is', mainCategory);
    
    // Filter tabs based on main category
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
    else if (['quora', 'signature', 'pinterest', 'keyword-generator'].includes(mainCategory)) {
      return tabs.filter(tab => [mainCategory].includes(tab.id));
    }
    
    // Default - show content tabs
    console.log('useTabNavigation: Using default content tabs');
    return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
  };
  
  return {
    activeTab,
    mainTabs,
    subTabs: getSubTabs(),
    handleTabChange
  };
};
