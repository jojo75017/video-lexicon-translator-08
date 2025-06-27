
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, Target, TrendingUp, Building2, Search, 
  FileText, Brain, Users, BarChart3, Smartphone, 
  Mic, Calendar, Lightbulb, Link, Zap, DollarSign, 
  HelpCircle, Layers, Download, TreePine
} from "lucide-react";

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
  const tabs = [
    { id: 'generator', label: 'Générateur', icon: Sparkles, color: 'text-blue-500' },
    { id: 'suggestions', label: 'Suggestions', icon: Target, color: 'text-green-500' },
    { id: 'trends', label: 'Tendances', icon: TrendingUp, color: 'text-purple-500' },
    { id: 'competitive', label: 'Concurrence', icon: Building2, color: 'text-blue-500' },
    { id: 'serp', label: 'SERP', icon: Search, color: 'text-green-500' },
    { id: 'content', label: 'Plan d\'article', icon: FileText, color: 'text-orange-500' },
    { id: 'structure', label: 'Structure', icon: TreePine, color: 'text-teal-500' },
    { id: 'intelligent', label: 'IA Avancée', icon: Brain, color: 'text-purple-600' },
    { id: 'audience', label: 'Audience', icon: Users, color: 'text-indigo-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-emerald-500' },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-cyan-500' },
    { id: 'voice', label: 'Vocal', icon: Mic, color: 'text-pink-500' },
    { id: 'seasonal', label: 'Saisonnier', icon: Calendar, color: 'text-amber-500' },
    { id: 'opportunities', label: 'Opportunités', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 'internal-links', label: 'Liens internes', icon: Link, color: 'text-teal-500' },
    { id: 'difficulty', label: 'Difficulté', icon: Zap, color: 'text-red-500' },
    { id: 'roi', label: 'ROI', icon: DollarSign, color: 'text-green-600' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'text-slate-500' },
    { id: 'clustering', label: 'Clustering', icon: Layers, color: 'text-violet-500' },
    { id: 'export', label: 'Export', icon: Download, color: 'text-gray-500' }
  ];

  return (
    <div className="w-full overflow-x-auto">
      <TabsList className="inline-flex h-auto p-1 bg-muted/50 w-full min-w-max">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent className={`h-4 w-4 ${tab.color}`} />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};

export default KeywordTabsNavigation;
