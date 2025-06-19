
import { useState, useEffect } from 'react';
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
    console.log("Navigation: chemin actuel:", currentPath);
    
    const pathToTabMap: Record<string, string> = {
      '/': 'hierarchy',
      '/dashboard': 'hierarchy',
      '/hierarchy': 'hierarchy',
      '/wordcount': 'wordcount',
      '/suggestions': 'suggestions',
      '/seo': 'seo',
      '/structure': 'structure',
      '/performance': 'performance',
      '/metrics': 'metrics',
      '/analytics': 'analytics',
      '/quora': 'quora',
      '/signature': 'signature',
      '/pinterest': 'pinterest',
      '/keyword-generator': 'keyword-generator',
      '/keyword-meta': 'keyword-meta',
      '/keyword-analysis': 'keyword-analysis',
      '/internal-linking': 'internal-links'
    };
    
    const activeTab = pathToTabMap[currentPath] || 'hierarchy';
    console.log("Navigation: onglet actif déterminé:", activeTab);
    return activeTab;
  };
  
  const [activeTab, setActiveTab] = useState<string>(determineActiveTab());
  
  // Mettre à jour l'onglet actif lorsque le chemin change
  useEffect(() => {
    const newActiveTab = determineActiveTab();
    console.log("Navigation: mise à jour de l'onglet actif:", newActiveTab);
    setActiveTab(newActiveTab);
  }, [currentPath]);
  
  // Définir les catégories principales avec les chemins de navigation
  const mainTabs: MainTab[] = [
    {id: 'content', label: 'Contenu', color: 'border-blue-600', path: '/dashboard'},
    {id: 'seo', label: 'SEO', color: 'border-purple-600', path: '/seo'},
    {id: 'performance', label: 'Performance', color: 'border-amber-600', path: '/performance'},
    {id: 'analytics', label: 'Analytics', color: 'border-emerald-600', path: '/analytics'}
  ];
  
  // Tous les onglets disponibles
  const contentTabs = [
    {id: 'hierarchy', label: 'Hiérarchie'},
    {id: 'wordcount', label: 'Audit contenu'},
    {id: 'suggestions', label: 'Suggestions'},
    {id: 'seo', label: 'SEO'},
    {id: 'structure', label: 'Structure'},
    {id: 'performance', label: 'Performance'},
    {id: 'analytics', label: 'Analytics'},
    {id: 'signature', label: 'Signature'},
    {id: 'pinterest', label: 'Pinterest'},
    {id: 'quora', label: 'Quora'}
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
    
    // Navigation vers les pages dédiées
    const tabPaths: Record<string, string> = {
      'hierarchy': '/dashboard',
      'wordcount': '/wordcount',
      'suggestions': '/suggestions',
      'seo': '/seo',
      'structure': '/structure',
      'performance': '/performance',
      'metrics': '/metrics',
      'analytics': '/analytics',
      'quora': '/quora',
      'signature': '/signature',
      'pinterest': '/pinterest',
      'keyword-generator': '/keyword-generator',
      'keyword-meta': '/keyword-meta',
      'keyword-analysis': '/keyword-analysis',
      'internal-links': '/internal-linking'
    };
    
    if (tabPaths[value]) {
      console.log(`Navigation vers le chemin: ${tabPaths[value]}`);
      navigate(tabPaths[value]);
      return;
    }
  };

  return {
    activeTab,
    contentTabs,
    handleTabChange
  };
};
