
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen } from 'lucide-react';

const TabNavigation = () => {
  const tabs = [
    { id: 'seo', icon: Search, label: 'SEO', color: 'purple' },
    { id: 'structure', icon: Globe, label: 'Structure', color: 'blue' },
    { id: 'hierarchy', icon: Database, label: 'Hiérarchie', color: 'indigo' },
    { id: 'backlinks', icon: Link2, label: 'Backlinks', color: 'pink' },
    { id: 'metrics', icon: ChartBar, label: 'Métriques', color: 'violet' },
    { id: 'advanced', icon: Settings, label: 'Avancé', color: 'fuchsia' },
    { id: 'integrations', icon: Hash, label: 'Intégrations', color: 'rose' },
    { id: 'signature', icon: Pen, label: 'Signature', color: 'purple' }
  ];

  return (
    <TabsList className="w-full flex overflow-x-auto space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-lg shadow-inner">
      {tabs.map(({ id, icon: Icon, label, color }) => (
        <TabsTrigger 
          key={id}
          value={id}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-md font-medium
            transition-all duration-300
            data-[state=active]:bg-gradient-to-br 
            data-[state=active]:from-${color}-500/20 
            data-[state=active]:to-${color}-600/20
            data-[state=active]:text-${color}-700
            data-[state=active]:shadow-sm
            hover:bg-${color}-50
          `}
        >
          <Icon className="w-4 h-4" />
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabNavigation;
