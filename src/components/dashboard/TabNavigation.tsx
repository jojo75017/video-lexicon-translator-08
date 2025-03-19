
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen, 
  FileText, Book, BarChart2, ExternalLink, Rocket, Zap, 
  Layers, Lightbulb, FileCode, Bell, UserPlus, MessageSquareText,
  Gauge, BarChart, Newspaper, Award, Target, Boxes, BrainCircuit
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const TabNavigation = () => {
  const tabs = [
    // Analyses principales
    { id: 'seo', icon: Search, label: 'SEO', color: 'text-blue-600', group: 'main' },
    { id: 'structure', icon: Globe, label: 'Structure', color: 'text-indigo-600', group: 'main' },
    { id: 'hierarchy', icon: Database, label: 'Hiérarchie', color: 'text-violet-600', group: 'main' },
    { id: 'backlinks', icon: Link2, label: 'Backlinks', color: 'text-pink-600', group: 'main' },
    
    // Métriques et données
    { id: 'metrics', icon: ChartBar, label: 'Métriques', color: 'text-fuchsia-600', group: 'metrics' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', color: 'text-green-600', group: 'metrics', isNew: true },
    { id: 'keywords', icon: FileText, label: 'Mots-clés', color: 'text-amber-600', group: 'metrics' },
    { id: 'performance', icon: Gauge, label: 'Performance', color: 'text-indigo-500', group: 'metrics' },
    
    // Contenu
    { id: 'content', icon: Book, label: 'Contenu', color: 'text-orange-600', group: 'content' },
    { id: 'optimize', icon: Zap, label: 'Optimisation', color: 'text-blue-600', group: 'content', isNew: true },
    { id: 'ideas', icon: Lightbulb, label: 'Idées', color: 'text-yellow-600', group: 'content' },
    { id: 'quora', icon: MessageSquareText, label: 'Quora', color: 'text-[#b92b27]', group: 'content', isNew: true, link: '/quora' },
    { id: 'airesearch', icon: BrainCircuit, label: 'Recherche IA', color: 'text-purple-700', group: 'content', isNew: true, highlighted: true },
    
    // Technique
    { id: 'advanced', icon: Settings, label: 'Avancé', color: 'text-rose-600', group: 'tech' },
    { id: 'code', icon: FileCode, label: 'Code', color: 'text-slate-600', group: 'tech' },
    { id: 'integrations', icon: Hash, label: 'Intégrations', color: 'text-purple-600', group: 'tech' },
    
    // Marketing
    { id: 'alerts', icon: Bell, label: 'Alertes', color: 'text-red-600', group: 'marketing' },
    { id: 'social', icon: UserPlus, label: 'Social', color: 'text-blue-500', group: 'marketing' },
    { id: 'reports', icon: BarChart, label: 'Rapports', color: 'text-emerald-600', group: 'marketing' },
    { id: 'trends', icon: Target, label: 'Tendances', color: 'text-cyan-600', group: 'marketing' },
    
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

  const groupLabels = {
    main: "Analyses",
    metrics: "Données",
    content: "Contenu",
    tech: "Technique",
    marketing: "Marketing",
    other: "Outils"
  };

  return (
    <TooltipProvider>
      <TabsList className="w-full flex flex-col overflow-hidden justify-between bg-white shadow-md rounded-lg p-3 mb-6 border border-gray-100">
        <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-500 mb-2 px-2">
          {Object.entries(groupLabels).map(([key, label]) => (
            <div key={key} className="flex items-center justify-center">
              {label}
            </div>
          ))}
        </div>
        
        <div className="flex overflow-x-auto justify-between bg-gray-50 rounded-md p-2">
          {Object.entries(groupedTabs).map(([groupName, groupTabs], groupIndex) => (
            <div key={groupName} className="flex-1 flex flex-col items-center min-w-fit">
              <div className="flex flex-wrap gap-1 justify-center">
                {groupTabs.map(({ id, icon: Icon, label, color, isNew, link, highlighted }) => (
                  <Tooltip key={id}>
                    <TooltipTrigger asChild>
                      {link ? (
                        <Link to={link} className="inline-block">
                          <div 
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md relative group transition-all duration-200 hover:bg-white cursor-pointer ${
                              id === 'quora' ? 'bg-[#b92b27]/10' : 
                              highlighted ? 'bg-purple-100' : ''
                            }`}
                          >
                            <span className="absolute -top-1 -right-1 transform translate-x-1/2 -translate-y-1/2 z-10">
                              {isNew && (
                                <Badge variant="default" className="text-[10px] py-0 px-1.5 h-auto bg-[#b92b27] text-white animate-pulse">
                                  Nouveau
                                </Badge>
                              )}
                            </span>
                            <Icon className={`w-4 h-4 ${color}`} />
                            <span className="font-medium text-sm">{label}</span>
                            
                            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity"></span>
                          </div>
                        </Link>
                      ) : (
                        <TabsTrigger 
                          value={id}
                          data-value={id}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md relative group transition-all duration-200 hover:bg-white ${
                            highlighted ? 'bg-purple-100' : ''
                          }`}
                        >
                          <span className="absolute -top-1 -right-1 transform translate-x-1/2 -translate-y-1/2 z-10">
                            {isNew && (
                              <Badge variant="default" className="text-[10px] py-0 px-1.5 h-auto bg-[#b92b27] text-white">
                                Nouveau
                              </Badge>
                            )}
                          </span>
                          <Icon className={`w-4 h-4 ${color}`} />
                          <span className="font-medium text-sm">{label}</span>
                          
                          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity"></span>
                        </TabsTrigger>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Accéder à {label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </TabsList>
    </TooltipProvider>
  );
};

export default TabNavigation;
