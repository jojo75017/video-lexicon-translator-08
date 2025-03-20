
import { useState, useEffect } from 'react';
import { tabs } from './TabData';
import { activateSection } from '@/utils/navigationHelpers';

export interface MainTab {
  id: string;
  label: string;
  color: string;
}

export const useTabNavigation = () => {
  const [activeTab, setActiveTab] = useState<string>('hierarchy');
  
  // Define main categories with more SEMrush/UberSuggest-like styling
  const mainTabs: MainTab[] = [
    {id: 'seo', label: 'SEO', color: 'text-purple-800 border-purple-600'},
    {id: 'content', label: 'Contenu', color: 'text-blue-800 border-blue-600'},
    {id: 'performance', label: 'Performance', color: 'text-amber-800 border-amber-600'},
    {id: 'analytics', label: 'Analytics', color: 'text-emerald-800 border-emerald-600'}
  ];
  
  // Filter tabs without external links
  const contentTabs = tabs.filter(tab => !tab.link);
  
  // Initialize from URL hash or set default
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
      setTimeout(() => activateSection(hash), 200);
    } else {
      // Default to hierarchy tab if no hash
      const defaultTab = 'hierarchy';
      console.log(`No hash in URL, defaulting to: ${defaultTab}`);
      setActiveTab(defaultTab);
      setTimeout(() => activateSection(defaultTab), 200);
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

  // Get sub-tabs based on active main tab or selected tab
  const getSubTabs = () => {
    // Determine the tab group based on active tab
    let tabGroup = '';
    
    // First, check if the active tab belongs to a main tab
    if (activeTab.startsWith('seo') || tabs.some(t => t.id === activeTab && t.group === 'seo')) {
      tabGroup = 'seo';
    } else if (activeTab.startsWith('content') || activeTab === 'hierarchy' || activeTab === 'wordcount' || activeTab === 'suggestions' || 
               tabs.some(t => t.id === activeTab && t.group === 'content')) {
      tabGroup = 'content';
    } else if (activeTab.startsWith('performance') || activeTab === 'metrics' || 
               tabs.some(t => t.id === activeTab && t.group === 'performance')) {
      tabGroup = 'performance';
    } else if (activeTab.startsWith('analytics') || 
               tabs.some(t => t.id === activeTab && t.group === 'analytics')) {
      tabGroup = 'analytics';
    } else {
      // If none of the above, try to find the group directly
      const tabItem = tabs.find(t => t.id === activeTab);
      if (tabItem) {
        tabGroup = tabItem.group;
      }
    }
    
    // Return tabs based on determined group
    switch (tabGroup) {
      case 'seo':
        return tabs.filter(tab => ['seo', 'structure', 'backlinks'].includes(tab.id));
      case 'content':
        return tabs.filter(tab => ['wordcount', 'hierarchy', 'suggestions'].includes(tab.id));
      case 'performance':
        return tabs.filter(tab => ['performance', 'metrics'].includes(tab.id));
      case 'analytics':
        return tabs.filter(tab => ['analytics'].includes(tab.id));
      default:
        // Find tabs of the same group as the active tab
        const currentTabItem = tabs.find(t => t.id === activeTab);
        if (currentTabItem) {
          return tabs.filter(t => t.group === currentTabItem.group && !t.link);
        }
        return [];
    }
  };
  
  return {
    activeTab,
    mainTabs,
    contentTabs,
    subTabs: getSubTabs(),
    handleTabChange
  };
};
