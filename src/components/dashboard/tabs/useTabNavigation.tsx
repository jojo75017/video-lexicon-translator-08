
import { useState, useEffect } from 'react';
import { tabs } from './TabData';
import { toast } from "sonner";
import { activateSection } from '@/utils/navigationHelpers';

export interface MainTab {
  id: string;
  label: string;
  color: string;
}

export const useTabNavigation = () => {
  const [activeTab, setActiveTab] = useState<string>('hierarchy');
  
  // Define main categories 
  const mainTabs: MainTab[] = [
    {id: 'content', label: 'Contenu', color: 'border-blue-600'},
    {id: 'seo', label: 'SEO', color: 'border-purple-600'},
    {id: 'performance', label: 'Performance', color: 'border-amber-600'},
    {id: 'analytics', label: 'Analytics', color: 'border-emerald-600'}
  ];
  
  // Filter tabs without external links
  const contentTabs = tabs.filter(tab => !tab.link);
  
  // Initialize from URL hash or set default
  useEffect(() => {
    // Set default tab
    const defaultTab = 'hierarchy';
    console.log(`Setting default tab: ${defaultTab}`);
    setActiveTab(defaultTab);
    
    // Check for hash in URL
    const hash = window.location.hash.replace('#', '');
    if (hash && tabs.some(tab => tab.id === hash)) {
      console.log(`Found hash in URL: ${hash}, activating this tab`);
      setActiveTab(hash);
    }
    
    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && tabs.some(tab => tab.id === newHash)) {
        console.log(`Hash changed to ${newHash}, updating active tab`);
        setActiveTab(newHash);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Handle tab selection
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    setActiveTab(value);
    
    // Update URL
    window.location.hash = value;
    
    // Make sure the tab content is visible
    activateSection(value);
    
    // Special case for main category tabs
    if (value === 'content') {
      activateSection('hierarchy');
    } else if (value === 'seo') {
      activateSection('seo');
    } else if (value === 'performance') {
      activateSection('performance');
    } else if (value === 'analytics') {
      activateSection('analytics');
    }
    
    // Show notification
    toast.success(`Onglet ${value} affiché`, {
      description: "Contenu mis à jour",
      duration: 2000
    });
  };

  // Get sub-tabs based on active main tab
  const getSubTabs = () => {
    if (['hierarchy', 'wordcount', 'suggestions'].includes(activeTab) || 
        activeTab === 'content') {
      return tabs.filter(tab => ['hierarchy', 'wordcount', 'suggestions'].includes(tab.id));
    } 
    else if (['seo', 'structure', 'backlinks'].includes(activeTab)) {
      return tabs.filter(tab => ['seo', 'structure', 'backlinks'].includes(tab.id));
    } 
    else if (['performance', 'metrics'].includes(activeTab)) {
      return tabs.filter(tab => ['performance', 'metrics'].includes(tab.id));
    } 
    else if (activeTab === 'analytics') {
      return tabs.filter(tab => ['analytics'].includes(tab.id));
    }
    
    // Default - show content tabs
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
