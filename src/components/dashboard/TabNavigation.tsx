
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen, 
  FileText, Book, BarChart2, ExternalLink, Rocket, Zap, 
  Layers, Lightbulb, FileCode, Bell, UserPlus
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const TabNavigation = () => {
  const tabs = [
    // Analyses principales
    { id: 'seo', icon: Search, label: 'SEO', color: 'text-blue-600', group: 'main' },
    { id: 'structure', icon: Globe, label: 'Structure', color: 'text-indigo-600', group: 'main' },
    { id: 'hierarchy', icon: Database, label: 'Hiérarchie', color: 'text-violet-600', group: 'main' },
    { id: 'backlinks', icon: Link2, label: 'Backlinks', color: 'text-pink-600', group: 'main' },
    
    // Métriques et données
    { id: 'metrics', icon: ChartBar, label: 'Métriques', color: 'text-fuchsia-600', group: 'metrics' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', color: 'text-green-600', group: 'metrics' },
    { id: 'keywords', icon: FileText, label: 'Mots-clés', color: 'text-amber-600', group: 'metrics' },
    
    // Contenu
    { id: 'content', icon: Book, label: 'Contenu', color: 'text-orange-600', group: 'content' },
    { id: 'optimize', icon: Zap, label: 'Optimisation', color: 'text-blue-600', group: 'content' },
    { id: 'ideas', icon: Lightbulb, label: 'Idées', color: 'text-yellow-600', group: 'content' },
    
    // Technique
    { id: 'advanced', icon: Settings, label: 'Avancé', color: 'text-rose-600', group: 'tech' },
    { id: 'code', icon: FileCode, label: 'Code', color: 'text-slate-600', group: 'tech' },
    { id: 'integrations', icon: Hash, label: 'Intégrations', color: 'text-purple-600', group: 'tech' },
    
    // Marketing
    { id: 'alerts', icon: Bell, label: 'Alertes', color: 'text-red-600', group: 'marketing' },
    { id: 'social', icon: UserPlus, label: 'Social', color: 'text-blue-500', group: 'marketing' },
    { id: 'performance', icon: Rocket, label: 'Performance', color: 'text-indigo-500', group: 'marketing' },
    
    // Autres outils
    { id: 'signature', icon: Pen, label: 'Signature', color: 'text-blue-600', group: 'other' },
    { id: 'external', icon: ExternalLink, label: 'Externe', color: 'text-teal-600', group: 'other' },
  ];

  const groupedTabs = {
    main: tabs.filter(tab => tab.group === 'main'),
    metrics: tabs.filter(tab => tab.group === 'metrics'),
    content: tabs.filter(tab => tab.group === 'content'),
    tech: tabs.filter(tab => tab.group === 'tech'),
    marketing: tabs.filter(tab => tab.group === 'marketing'),
    other: tabs.filter(tab => tab.group === 'other'),
  };

  return (
    <TooltipProvider>
      <TabsList className="w-full flex overflow-x-auto justify-between bg-white shadow-md rounded-lg p-2 mb-6 border border-gray-100 flex-wrap">
        {Object.entries(groupedTabs).map(([groupName, groupTabs], groupIndex) => (
          <React.Fragment key={groupName}>
            {groupIndex > 0 && <Separator orientation="vertical" className="h-8 mx-1" />}
            
            <div className="flex items-center gap-1">
              {groupTabs.map(({ id, icon: Icon, label, color }) => (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>
                    <TabsTrigger 
                      value={id}
                      data-value={id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md"
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="font-medium text-sm">{label}</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Accéder à {label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </React.Fragment>
        ))}
      </TabsList>
    </TooltipProvider>
  );
};

export default TabNavigation;
