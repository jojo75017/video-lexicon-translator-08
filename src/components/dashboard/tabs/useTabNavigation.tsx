
import { useState, useEffect } from 'react';
import { tabs } from './TabData';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { activateSection, getMainTabCategory } from '@/utils/navigationHelpers';

export interface MainTab {
  id: string;
  label: string;
  color: string;
  path?: string;
}

export const useTabNavigation = () => {
  const [activeTab, setActiveTab] = useState<string>('hierarchy');
  const navigate = useNavigate();
  
  // Définir les catégories principales avec les chemins de navigation
  const mainTabs: MainTab[] = [
    {id: 'content', label: 'Contenu', color: 'border-blue-600', path: '/hierarchy'},
    {id: 'seo', label: 'SEO', color: 'border-purple-600', path: '/seo'},
    {id: 'performance', label: 'Performance', color: 'border-amber-600', path: '/performance'},
    {id: 'analytics', label: 'Analytics', color: 'border-emerald-600', path: '/analytics'}
  ];
  
  // Filtrer les onglets sans liens externes
  const contentTabs = tabs.filter(tab => !tab.link);
  
  // Initialiser à partir du hash URL ou définir par défaut
  useEffect(() => {
    const handleInitialTabActivation = () => {
      // Vérifier le hash dans l'URL
      const hash = window.location.hash.replace('#', '');
      if (hash && tabs.some(tab => tab.id === hash)) {
        console.log(`Hash trouvé dans l'URL: ${hash}, activation de cet onglet`);
        setActiveTab(hash);
        
        // Activation immédiate de la section correspondante
        setTimeout(() => {
          activateSection(hash);
          toast.info(`Onglet ${hash} activé depuis l'URL`, {
            duration: 1500
          });
        }, 800);
      } else {
        // Par défaut, aller au premier onglet si pas de hash
        const defaultTab = 'hierarchy';
        setActiveTab(defaultTab);
        
        // Activation immédiate de la section par défaut
        setTimeout(() => {
          activateSection(defaultTab);
          toast.info(`Onglet par défaut activé: ${defaultTab}`, {
            duration: 1500
          });
        }, 800);
      }
    };
    
    // Exécuter après un court délai pour laisser le DOM se mettre en place
    setTimeout(handleInitialTabActivation, 300);
    
    // Écouter les changements de hash
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && tabs.some(tab => tab.id === newHash)) {
        console.log(`Hash changé en ${newHash}, mise à jour de l'onglet actif`);
        setActiveTab(newHash);
        setTimeout(() => {
          activateSection(newHash);
          toast.info(`Navigation vers l'onglet ${newHash}`, {
            description: "URL mise à jour",
            duration: 1500
          });
        }, 500);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
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
    };
    
    if (tabPaths[value]) {
      navigate(tabPaths[value]);
      return;
    }
    
    // Si pas de page dédiée, mise à jour de l'URL avec le hash
    window.location.hash = value;
    
    // Assurer que le contenu de l'onglet est visible
    setTimeout(() => {
      // Activer la section appropriée
      activateSection(value);
      
      // Notification visuelle du changement d'onglet
      toast.info(`Navigation vers l'onglet ${value}`, {
        description: "Chargement du contenu en cours...",
        duration: 1500
      });
    }, 500);
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
