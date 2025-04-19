
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
  
  // Déterminer l'onglet actif basé sur le chemin actuel avec plus de précision
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
      // Ajoutez d'autres chemins si nécessaire
    };
    
    // Log pour le débogage
    console.log('Current Path:', path);
    console.log('Mapped Tab:', pathToTabMap[path] || 'hierarchy');
    
    return pathToTabMap[path] || 'hierarchy';
  };
  
  const [activeTab, setActiveTab] = useState<string>(determineActiveTab());
  
  // Mettre à jour l'onglet actif lorsque le chemin change
  useEffect(() => {
    const newActiveTab = determineActiveTab();
    console.log('Updating active tab:', newActiveTab);
    setActiveTab(newActiveTab);
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
    
    // Forcer la navigation si nécessaire
    if (tabPaths[value]) {
      console.log(`Navigating to: ${tabPaths[value]}`);
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

