
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen } from 'lucide-react';

const TabNavigation = () => {
  const tabs = [
    { id: 'seo', icon: Search, label: 'SEO', color: 'purple' },
    { id: 'structure', icon: Globe, label: 'Structure', color: 'red' },
    { id: 'hierarchy', icon: Database, label: 'Hiérarchie', color: 'green' },
    { id: 'backlinks', icon: Link2, label: 'Backlinks', color: 'orange' },
    { id: 'metrics', icon: ChartBar, label: 'Métriques', color: 'pink' },
    { id: 'advanced', icon: Settings, label: 'Avancé', color: 'yellow' },
    { id: 'integrations', icon: Hash, label: 'Intégrations', color: 'teal' },
    { id: 'signature', icon: Pen, label: 'Signature', color: 'blue' }
  ];

  return (
    <TabsList className="w-full border-b flex overflow-x-auto space-x-2 mb-4 bg-white/50 backdrop-blur-sm">
      {tabs.map(({ id, icon: Icon, label, color }) => (
        <TabsTrigger 
          key={id}
          value={id} 
          id={id} 
          className={`border-b-2 border-transparent data-[state=active]:border-${color}-500 data-[state=active]:text-${color}-600 data-[state=active]:bg-${color}-50`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabNavigation;
