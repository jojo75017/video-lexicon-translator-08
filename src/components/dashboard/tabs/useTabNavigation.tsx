
import { useState, useEffect } from 'react';
import { tabs } from './TabData';
import { activateSection } from '@/utils/navigationHelpers';

export interface MainTab {
  id: string;
  label: string;
  color: string;
}

export const useTabNavigation = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  
  // Define main categories with more SEMrush/UberSuggest-like styling
  const mainTabs: MainTab[] = [
    {id: 'seo', label: 'SEO', color: 'text-purple-800 border-purple-600'},
    {id: 'content', label: 'Contenu', color: 'text-blue-800 border-blue-600'},
    {id: 'performance', label: 'Performance', color: 'text-amber-800 border-amber-600'},
    {id: 'analytics', label: 'Analytics', color: 'text-emerald-800 border-emerald-600'}
  ];
  
  // Filter tabs without external links
  const contentTabs = tabs.filter(tab => !tab.link);
  
  // Initialize from URL hash
  useEffect(() => {
    // Hide all tab content initially
    document.querySelectorAll('[data-tab-content]').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Check for hash in URL
    const hash = window.location.hash.replace('#', '');
    if (hash && tabs.some(tab => tab.id === hash)) {
      console.log(`Found hash in URL: ${hash}, activating this tab`);
      setActiveTab(hash);
      setTimeout(() => activateSection(hash), 100);
    } else {
      // Default to first tab if no hash
      const defaultTab = 'seo';
      console.log(`No hash in URL, defaulting to first tab: ${defaultTab}`);
      setActiveTab(defaultTab);
      setTimeout(() => activateSection(defaultTab), 100);
    }
    
    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && tabs.some(tab => tab.id === newHash)) {
        console.log(`Hash changed to ${newHash}, updating active tab`);
        setActiveTab(newHash);
        activateSection(newHash);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Handle tab selection
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    setActiveTab(value);
    
    // Make the section visible by using its ID
    activateSection(value);
    
    // Update URL
    window.location.hash = value;
  };

  // Get sub-tabs based on active main tab
  const getSubTabs = () => {
    if (activeTab === 'seo' || mainTabs.some(t => t.id === 'seo' && t.id === activeTab)) {
      return tabs.filter(tab => ['seo', 'structure', 'backlinks'].includes(tab.id));
    } else if (activeTab === 'content' || mainTabs.some(t => t.id === 'content' && t.id === activeTab)) {
      return tabs.filter(tab => ['wordcount', 'hierarchy', 'suggestions'].includes(tab.id));
    } else if (activeTab === 'performance' || mainTabs.some(t => t.id === 'performance' && t.id === activeTab)) {
      return tabs.filter(tab => ['performance', 'metrics'].includes(tab.id));
    } else if (activeTab === 'analytics' || mainTabs.some(t => t.id === 'analytics' && t.id === activeTab)) {
      return tabs.filter(tab => ['analytics'].includes(tab.id));
    }
    return [];
  };
  
  return {
    activeTab,
    mainTabs,
    contentTabs,
    subTabs: getSubTabs(),
    handleTabChange
  };
};
