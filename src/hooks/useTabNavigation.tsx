
import { useState, useEffect } from 'react';
import { tabs } from '@/components/dashboard/tabs/TabData';
import { toast } from "sonner";
import { useNavigate, useLocation } from 'react-router-dom';
import { getMainTabCategory } from '@/utils/navigationHelpers';

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
      '/index': 'hierarchy',
      '/hierarchy': 'hierarchy',
      '/wordcount': 'wordcount',
      '/suggestions': 'suggestions',
      '/seo': 'seo',
      '/structure': 'structure',
      '/backlinks': 'backlinks',
      '/performance': 'performance',
      '/metrics': 'metrics',
      '/analytics': 'analytics',
      '/quora': 'quora',
      '/signature': 'signature',
      '/local-business': 'local-business'
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
      'suggestions': '/suggestions',
      'seo': '/seo',
      'structure': '/structure',
      'backlinks': '/backlinks',
      'performance': '/performance',
      'metrics': '/metrics',
      'analytics': '/analytics',
      'quora': '/quora',
      'signature': '/signature',
      'local-business': '/local-business'
    };
    
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
    // Obtenir la catégorie principale de l'onglet actif
    const mainCategory = getMainTabCategory(activeTab);
    
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
    contentTabs,
    subTabs: getSubTabs(),
    handleTabChange
  };
};
