
import { useState, useEffect } from 'react';
import { tabs } from './TabData';
import { toast } from "sonner";
import { useNavigate, useLocation } from 'react-router-dom';

export interface MainTab {
  id: string;
  label: string;
  color: string;
  path?: string;
}

export const useTabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Déterminer l'onglet actif basé sur le chemin actuel
  const determineActiveTab = (): string => {
    const pathToTabMap: Record<string, string> = {
      '/': 'hierarchy',
      '/hierarchy': 'hierarchy',
      '/wordcount': 'wordcount',
      '/seo': 'seo',
      '/structure': 'structure',
      '/performance': 'performance',
      '/analytics': 'analytics',
      '/quora': 'quora',
      '/signature': 'signature',
      '/tracking': 'rankings'
    };
    
    return pathToTabMap[currentPath] || 'hierarchy';
  };
  
  const [activeTab, setActiveTab] = useState<string>(determineActiveTab());
  
  // Mettre à jour l'onglet actif lorsque le chemin change
  useEffect(() => {
    setActiveTab(determineActiveTab());
  }, [currentPath]);
  
  // Définir les catégories principales avec les chemins de navigation
  const mainTabs: MainTab[] = [
    {id: 'content', label: 'Contenu', color: 'border-blue-600', path: '/hierarchy'},
    {id: 'seo', label: 'SEO', color: 'border-purple-600', path: '/seo'},
    {id: 'performance', label: 'Performance', color: 'border-amber-600', path: '/performance'},
    {id: 'analytics', label: 'Analytics', color: 'border-emerald-600', path: '/analytics'}
  ];
  
  // Filtrer les onglets sans liens externes
  const contentTabs = tabs.filter(tab => !tab.link);
  
  // Gérer la sélection d'onglet avec navigation vers les pages dédiées
  const handleTabChange = (value: string) => {
    console.log(`Changement d'onglet vers: ${value}`);
    
    // Ne pas continuer si c'est déjà l'onglet actif
    if (value === activeTab) {
      console.log('Onglet déjà actif, aucune action nécessaire');
      return;
    }
    
    setActiveTab(value);
    
    // Navigation vers les pages dédiées
    const tabPaths: Record<string, string> = {
      'hierarchy': '/hierarchy',
      'wordcount': '/wordcount',
      'suggestions': '/wordcount',
      'seo': '/seo',
      'structure': '/structure',
      'backlinks': '/seo',
      'performance': '/performance',
      'metrics': '/performance',
      'analytics': '/analytics',
      'quora': '/quora',
      'signature': '/signature',
      'rankings': '/tracking'
    };
    
    if (tabPaths[value]) {
      navigate(tabPaths[value]);
      
      // Notification visuelle du changement d'onglet
      toast.info(`Navigation vers ${value}`, {
        description: "Chargement de la page...",
        duration: 1500
      });
      
      return;
    }
  };

  // Obtenir les sous-onglets en fonction de l'onglet principal actif
  const getSubTabs = () => {
    // Obtenir la catégorie principale de l'onglet actif
    const getMainCategory = (tabId: string): string => {
      if (['hierarchy', 'wordcount', 'suggestions'].includes(tabId)) {
        return 'content';
      } else if (['seo', 'structure', 'backlinks', 'rankings'].includes(tabId)) {
        return 'seo';
      } else if (['performance', 'metrics'].includes(tabId)) {
        return 'performance';
      } else if (tabId === 'analytics') {
        return 'analytics';
      }
      
      return tabId;
    };
    
    const mainCategory = getMainCategory(activeTab);
    
    if (mainCategory === 'content') {
      return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
    } 
    else if (mainCategory === 'seo') {
      return tabs.filter(tab => ['seo', 'structure', 'backlinks', 'rankings'].includes(tab.id));
    } 
    else if (mainCategory === 'performance') {
      return tabs.filter(tab => ['performance', 'metrics'].includes(tab.id));
    } 
    else if (mainCategory === 'analytics') {
      return tabs.filter(tab => ['analytics'].includes(tab.id));
    }
    
    // Par défaut - afficher les onglets de contenu
    return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
  };
  
  return {
    activeTab,
    mainTabs,
    contentTabs,
    subTabs: getSubTabs(),
    handleTabChange
  };
};
