
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  Globe,
  Brain,
  Users,
  FileText,
  BarChart3,
  Search,
  Smartphone,
  Mic,
  Calendar,
  Eye,
  Link,
  Zap,
  PieChart,
  MessageSquare,
  Settings,
  Download
} from 'lucide-react';

export interface KeywordTabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasResults: boolean;
}

const KeywordTabsNavigation: React.FC<KeywordTabsNavigationProps> = ({
  activeTab,
  setActiveTab,
  hasResults
}) => {
  return (
    <TabsList className="grid grid-cols-6 lg:grid-cols-10 xl:grid-cols-12 gap-1 h-auto p-1">
      <TabsTrigger 
        value="generator" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
      >
        <Sparkles className="w-4 h-4" />
        Générateur
      </TabsTrigger>
      
      <TabsTrigger 
        value="suggestions" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Target className="w-4 h-4" />
        Suggestions
      </TabsTrigger>
      
      <TabsTrigger 
        value="trends" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <TrendingUp className="w-4 h-4" />
        Tendances
      </TabsTrigger>
      
      <TabsTrigger 
        value="competitive" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Globe className="w-4 h-4" />
        Concurrence
      </TabsTrigger>
      
      <TabsTrigger 
        value="intelligent" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Brain className="w-4 h-4" />
        IA Avancée
      </TabsTrigger>
      
      <TabsTrigger 
        value="audience" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Users className="w-4 h-4" />
        Audience
      </TabsTrigger>
      
      <TabsTrigger 
        value="content" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <FileText className="w-4 h-4" />
        Contenu
      </TabsTrigger>
      
      <TabsTrigger 
        value="analytics" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <BarChart3 className="w-4 h-4" />
        Analytics
      </TabsTrigger>
      
      <TabsTrigger 
        value="serp" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Search className="w-4 h-4" />
        SERP
      </TabsTrigger>
      
      <TabsTrigger 
        value="mobile" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Smartphone className="w-4 h-4" />
        Mobile
      </TabsTrigger>
      
      <TabsTrigger 
        value="voice" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Mic className="w-4 h-4" />
        Vocal
      </TabsTrigger>
      
      <TabsTrigger 
        value="seasonal" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Calendar className="w-4 h-4" />
        Saisonnier
      </TabsTrigger>
      
      <TabsTrigger 
        value="opportunities" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Eye className="w-4 h-4" />
        Opportunités
      </TabsTrigger>
      
      <TabsTrigger 
        value="internal-links" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Link className="w-4 h-4" />
        Liens
      </TabsTrigger>
      
      <TabsTrigger 
        value="difficulty" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Zap className="w-4 h-4" />
        Difficulté
      </TabsTrigger>
      
      <TabsTrigger 
        value="roi" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <PieChart className="w-4 h-4" />
        ROI
      </TabsTrigger>
      
      <TabsTrigger 
        value="faq" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <MessageSquare className="w-4 h-4" />
        FAQ
      </TabsTrigger>
      
      <TabsTrigger 
        value="clustering" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Settings className="w-4 h-4" />
        Clustering
      </TabsTrigger>
      
      <TabsTrigger 
        value="export" 
        className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs"
        disabled={!hasResults}
      >
        <Download className="w-4 h-4" />
        Export
      </TabsTrigger>
    </TabsList>
  );
};

export default KeywordTabsNavigation;
