
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
    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white rounded-lg shadow-sm border-2 border-blue-100">
      <TabsTrigger 
        value="keywords" 
        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-blue-50 transition-all duration-200 rounded-md"
      >
        <Key className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Mots-clés</span>
      </TabsTrigger>
      <TabsTrigger 
        value="serp" 
        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white hover:bg-green-50 transition-all duration-200 rounded-md"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">SERP</span>
      </TabsTrigger>
      <TabsTrigger 
        value="plan" 
        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white hover:bg-orange-50 transition-all duration-200 rounded-md"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Plan</span>
      </TabsTrigger>
      <TabsTrigger 
        value="structure" 
        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white hover:bg-purple-50 transition-all duration-200 rounded-md"
      >
        <TreePine className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Structure</span>
      </TabsTrigger>
      <TabsTrigger 
        value="analyzer" 
        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white hover:bg-teal-50 transition-all duration-200 rounded-md"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Analyseur</span>
      </TabsTrigger>
      <TabsTrigger 
        value="competitor" 
        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white hover:bg-indigo-50 transition-all duration-200 rounded-md"
      >
        <Building2 className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Concurrence</span>
      </TabsTrigger>
      <TabsTrigger 
        value="trends" 
        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white hover:bg-rose-50 transition-all duration-200 rounded-md"
      >
        <TrendingUp className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Tendances</span>
      </TabsTrigger>
      <TabsTrigger 
        value="semantic" 
        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white hover:bg-yellow-50 transition-all duration-200 rounded-md"
      >
        <Lightbulb className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Sémantique</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default KeywordTabsNavigation;
