
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
    <TabsList className="w-full flex overflow-x-auto justify-between bg-white shadow-lg rounded-xl p-2">
      {tabs.map(({ id, icon: Icon, label }) => (
        <TabsTrigger 
          key={id}
          value={id}
          data-value={id}
          className="group relative flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 rounded-lg transition-opacity" />
          <Icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 group-data-[state=active]:text-indigo-600" />
          <span className="text-gray-700 group-hover:text-indigo-700 group-data-[state=active]:text-indigo-700">
            {label}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabNavigation;
