
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Target, 
  TrendingUp, 
  Building2, 
  FileText, 
  Users, 
  BarChart3,
  Lightbulb,
  Key,
  MessageSquare,
  TreePine,
  Globe
} from 'lucide-react';

interface KeywordTabsNavigationProps {
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
    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
      <TabsTrigger value="keywords" className="flex items-center gap-1">
        <Key className="h-4 w-4" />
        <span className="hidden sm:inline">Mots-clés</span>
      </TabsTrigger>
      <TabsTrigger value="serp" className="flex items-center gap-1">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">SERP</span>
      </TabsTrigger>
      <TabsTrigger value="plan" className="flex items-center gap-1">
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Plan</span>
      </TabsTrigger>
      <TabsTrigger value="structure" className="flex items-center gap-1">
        <TreePine className="h-4 w-4" />
        <span className="hidden sm:inline">Structure</span>
      </TabsTrigger>
      <TabsTrigger value="analyzer" className="flex items-center gap-1">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">Analyseur</span>
      </TabsTrigger>
      <TabsTrigger value="competitor" className="flex items-center gap-1">
        <Building2 className="h-4 w-4" />
        <span className="hidden sm:inline">Concurrence</span>
      </TabsTrigger>
      <TabsTrigger value="trends" className="flex items-center gap-1">
        <TrendingUp className="h-4 w-4" />
        <span className="hidden sm:inline">Tendances</span>
      </TabsTrigger>
      <TabsTrigger value="semantic" className="flex items-center gap-1">
        <Lightbulb className="h-4 w-4" />
        <span className="hidden sm:inline">Sémantique</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default KeywordTabsNavigation;
