
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tabs } from '@/components/dashboard/tabs/TabData';

export const useTabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('hierarchy');

  // Définir les catégories principales
  const mainTabs = [
    {id: 'content', label: 'Contenu', path: '/hierarchy'},
    {id: 'seo', label: 'SEO', path: '/seo'},
    {id: 'performance', label: 'Performance', path: '/performance'},
    {id: 'analytics', label: 'Analytics', path: '/analytics'}
  ];

  // Filtrer les sous-onglets selon la catégorie active
  const getSubTabs = () => {
    const category = mainTabs.find(tab => 
      location.pathname.includes(tab.path.replace('/', ''))
    )?.id || 'content';

    switch (category) {
      case 'content':
        return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
      case 'seo':
        return tabs.filter(tab => ['seo', 'structure', 'backlinks'].includes(tab.id));
      case 'performance':
        return tabs.filter(tab => ['performance', 'metrics'].includes(tab.id));
      case 'analytics':
        return tabs.filter(tab => ['analytics'].includes(tab.id));
      default:
        return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
    }
  };

  const handleTabChange = (tabId: string) => {
    console.log('Tab change:', tabId);
    setActiveTab(tabId);
  };

  return {
    activeTab,
    mainTabs,
    subTabs: getSubTabs(),
    handleTabChange
  };
};
