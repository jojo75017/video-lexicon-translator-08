
import { useState, useEffect } from 'react';
import { tabs } from '@/components/dashboard/tabs/TabData';
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
  
  // Déterminer l'onglet actif basé sur le chemin actuel
  const determineActiveTab = (): string => {
    const path = location.pathname.replace('/', '');
    
    // Mappings des chemins aux onglets
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
      'metrics': 'metrics'
    };
    
    return pathToTabMap[path] || 'hierarchy';
  };
  
  const [activeTab, setActiveTab] = useState<string>(determineActiveTab());
  
  // Mettre à jour l'onglet actif lorsque le chemin change
  useEffect(() => {
    setActiveTab(determineActiveTab());
  }, [location.pathname]);
  
  // Définir les catégories principales avec les chemins de navigation
  const mainTabs: MainTab[] = [
    {id: 'content', label: 'Contenu', color: 'border-blue-600', path: '/hierarchy'},
    {id: 'seo', label: 'SEO', color: 'border-purple-600', path: '/seo'},
    {id: 'performance', label: 'Performance', color: 'border-amber-600', path: '/performance'},
    {id: 'analytics', label: 'Analytics', color: 'border-emerald-600', path: '/analytics'}
  ];
  
  // Gérer la sélection d'onglet avec navigation vers les pages dédiées
  const handleTabChange = (value: string) => {
    console.log(`Changement d'onglet vers: ${value}`);
    
    // Ne pas continuer si c'est déjà l'onglet actif
    if (value === activeTab) {
      console.log('Onglet déjà actif, aucune action nécessaire');
      return;
    }
    
    setActiveTab(value);
    
    // Définir les chemins pour chaque onglet
    const tabPaths: Record<string, string> = {
      'hierarchy': '/hierarchy',
      'wordcount': '/wordcount',
      'suggestions': '/suggestions',
      'seo': '/seo',
      'structure': '/structure',
      'backlinks': '/backlinks',
      'performance': '/performance',
      'metrics': '/metrics',
      'analytics': '/analytics'
    };
    
    // Forcer la navigation si nécessaire, mais sans rediriger si nous sommes déjà sur la bonne page
    if (tabPaths[value] && location.pathname !== tabPaths[value]) {
      navigate(tabPaths[value]);
    }
  };

  // Obtenir les sous-onglets en fonction de l'onglet principal actif
  const getSubTabs = () => {
    // Déterminer la catégorie principale en fonction de l'onglet actif
    const getMainCategory = (tabId: string): string => {
      if (['hierarchy', 'wordcount', 'suggestions'].includes(tabId)) {
        return 'content';
      } else if (['seo', 'structure', 'backlinks'].includes(tabId)) {
        return 'seo';
      } else if (['performance', 'metrics'].includes(tabId)) {
        return 'performance';
      } else if (tabId === 'analytics') {
        return 'analytics';
      }
      
      return 'content'; // Par défaut, retourner 'content'
    };
    
    const mainCategory = getMainCategory(activeTab);
    
    // Filtrer les onglets en fonction de la catégorie principale
    if (mainCategory === 'content') {
      return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
    } 
    else if (mainCategory === 'seo') {
      return tabs.filter(tab => ['seo', 'structure', 'backlinks'].includes(tab.id));
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
    subTabs: getSubTabs(),
    handleTabChange
  };
};
