
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Users, FileText, Target, BarChart3, Link, Search, Network, Trophy, AlertTriangle, DollarSign, Globe, Mic, Smartphone, Calendar, Eye, PenTool } from 'lucide-react';

interface KeywordTabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const KeywordTabsNavigation: React.FC<KeywordTabsNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { value: 'generator', icon: Target, label: 'Standard' },
    { value: 'intelligent', icon: Brain, label: 'IA' },
    { value: 'trends', icon: TrendingUp, label: 'Tendances' },
    { value: 'trend-analyzer', icon: Calendar, label: 'Analyse Trends' },
    { value: 'competitors', icon: Users, label: 'Concurrents' },
    { value: 'competitive-intel', icon: Eye, label: 'Intelligence' },
    { value: 'content', icon: FileText, label: 'Contenu' },
    { value: 'content-strategy', icon: PenTool, label: 'Stratégie' },
    { value: 'predictions', icon: BarChart3, label: 'Prédictions' },
    { value: 'links', icon: Link, label: 'Liens' },
    { value: 'serp', icon: Search, label: 'SERP' },
    { value: 'grouping', icon: Network, label: 'Groupes' },
    { value: 'ranking', icon: Trophy, label: 'Positions' },
    { value: 'gaps', icon: AlertTriangle, label: 'Gaps' },
    { value: 'roi', icon: DollarSign, label: 'ROI' },
    { value: 'multilang', icon: Globe, label: 'Multi-langues' },
    { value: 'voice', icon: Mic, label: 'Vocal' },
    { value: 'mobile', icon: Smartphone, label: 'Mobile' }
  ];

  return (
    <TabsList className="grid grid-cols-6 md:grid-cols-18 gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className="flex items-center gap-1"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default KeywordTabsNavigation;
