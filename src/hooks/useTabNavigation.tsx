
import { useState, useEffect } from 'react';
import { tabs } from '@/components/dashboard/tabs/TabData';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";

export interface MainTab {
  id: string;
  label: string;
  color: string;
  path?: string;
  isNew?: boolean;
}

export const useTabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Déterminer l'onglet actif basé sur le chemin actuel
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
      'outils-seo': 'outils-seo',
      'tracking': 'rankings', // Mapping explicite pour la page de tracking
      // Routes localisées (français)
      'hierarchie': 'hierarchy',
      'nombre-mots': 'wordcount',
      'metriques': 'metrics',
      'liens-internes': 'internal-links',
      'analyse-seo': 'seo',
      'mots-cles': 'keyword-generator',
      'performances': 'performance',
      'structure-site': 'structure',
      'suivi-positions': 'rankings', // Variante française
    };
    
    console.log("Active tab determination from path:", path, "->", pathToTabMap[path] || 'hierarchy');
    return pathToTabMap[path] || 'hierarchy';
  };
  
  const [activeTab, setActiveTab] = useState<string>(determineActiveTab());
  
  // Mettre à jour l'onglet actif lorsque le chemin change
  useEffect(() => {
    const newActiveTab = determineActiveTab();
    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);
      console.log("Tab changed to:", newActiveTab);
    }
  }, [location.pathname]);
  
  // Définir les catégories principales avec les chemins de navigation
  const mainTabs: MainTab[] = [
    {id: 'content', label: 'Contenu', color: 'border-blue-600', path: '/hierarchy'},
    {id: 'seo', label: 'SEO', color: 'border-purple-600', path: '/seo'},
    {id: 'performance', label: 'Performance', color: 'border-amber-600', path: '/performance'},
    {id: 'analytics', label: 'Analytics', color: 'border-emerald-600', path: '/analytics'},
    {id: 'keyword-meta', label: 'Title & Meta', color: 'border-blue-600', path: '/keyword-meta', isNew: true}
  ];
  
  // Gérer la sélection d'onglet avec navigation vers les pages dédiées
  const handleTabChange = (value: string) => {
    // Ne pas continuer si c'est déjà l'onglet actif
    if (value === activeTab) return;
    
    console.log("handleTabChange:", value);
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
      'rankings': '/tracking', // S'assurer que le lien de l'onglet rankings pointe vers /tracking
    };
    
    // Forcer la navigation si nécessaire
    if (tabPaths[value]) {
      console.log("Navigation vers:", tabPaths[value]);
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
      } else if (['seo', 'structure', 'backlinks', 'internal-links', 'keyword-meta', 'rankings'].includes(tabId)) {
        return 'seo';
      } else if (['performance', 'metrics'].includes(tabId)) {
        return 'performance';
      } else if (tabId === 'analytics') {
        return 'analytics';
      } else if (['quora', 'signature', 'pinterest', 'keyword-generator', 'outils-seo'].includes(tabId)) {
        return tabId;
      }
      
      return 'content';
    };
    
    const mainCategory = getMainCategory(activeTab);
    console.log("Main category:", mainCategory, "for active tab:", activeTab);
    
    if (mainCategory === 'content') {
      return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
    } 
    else if (mainCategory === 'seo') {
      return tabs.filter(tab => ['seo', 'structure', 'backlinks', 'internal-links', 'keyword-meta', 'rankings'].includes(tab.id));
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
  
  return {
    activeTab,
    mainTabs,
    subTabs: getSubTabs(),
    handleTabChange
  };
};

export default useTabNavigation;
