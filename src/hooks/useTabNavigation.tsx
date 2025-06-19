
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
  
  const [activeTab, setActiveTab] = useState<string>(pathToTabMap[currentPath] || 'hierarchy');
  
  useEffect(() => {
    const newTab = pathToTabMap[currentPath] || 'hierarchy';
    setActiveTab(newTab);
  }, [currentPath]);
  
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
  
  const handleTabChange = (value: string) => {
    if (value === activeTab) return;
    
    setActiveTab(value);
    
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
      navigate(tabPaths[value]);
    }
  };

  return {
    activeTab,
    contentTabs,
    handleTabChange
  };
};
