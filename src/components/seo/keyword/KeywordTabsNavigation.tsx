
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Building2, 
  FileText, 
  DollarSign,
  Globe,
  Mic,
  Smartphone,
  BarChart3,
  FolderTree,
  Target,
  Lightbulb,
  Calendar,
  Users,
  PieChart
} from 'lucide-react';

interface KeywordTabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const KeywordTabsNavigation: React.FC<KeywordTabsNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const tabs = [
    { id: 'generator', label: 'Générateur', icon: Sparkles },
    { id: 'intelligent', label: 'IA', icon: Brain },
    { id: 'trends', label: 'Tendances', icon: TrendingUp },
    { id: 'trend-analyzer', label: 'Analyseur de tendances', icon: BarChart3 },
    { id: 'competitors', label: 'Concurrents', icon: Building2 },
    { id: 'competitive-intel', label: 'Intelligence concurrentielle', icon: Target },
    { id: 'content', label: 'Contenu', icon: FileText },
    { id: 'content-strategy', label: 'Stratégie de contenu', icon: Calendar },
    { id: 'predictions', label: 'Prédictions', icon: PieChart },
    { id: 'links', label: 'Liens internes', icon: Globe },
    { id: 'serp', label: 'SERP', icon: Target },
    { id: 'grouping', label: 'Groupement', icon: FolderTree },
    { id: 'ranking', label: 'Ranking', icon: TrendingUp },
    { id: 'gaps', label: 'Gaps', icon: Users },
    { id: 'roi', label: 'ROI', icon: DollarSign },
    { id: 'multilang', label: 'Multi-langue', icon: Globe },
    { id: 'voice', label: 'Recherche vocale', icon: Mic },
    { id: 'mobile', label: 'Mobile', icon: Smartphone }
  ];

  return (
    <div className="overflow-x-auto">
      <TabsList className="grid grid-flow-col auto-cols-max gap-1 w-max">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger 
              key={tab.id}
              value={tab.id} 
              className="flex items-center gap-1.5 whitespace-nowrap px-3"
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};

export default KeywordTabsNavigation;
