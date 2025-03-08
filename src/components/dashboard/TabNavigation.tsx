
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen } from 'lucide-react';

const TabNavigation = () => {
  const tabs = [
    { id: 'seo', icon: Search, label: 'SEO', color: 'text-blue-600' },
    { id: 'structure', icon: Globe, label: 'Structure', color: 'text-indigo-600' },
    { id: 'hierarchy', icon: Database, label: 'Hiérarchie', color: 'text-violet-600' },
    { id: 'backlinks', icon: Link2, label: 'Backlinks', color: 'text-pink-600' },
    { id: 'metrics', icon: ChartBar, label: 'Métriques', color: 'text-fuchsia-600' },
    { id: 'advanced', icon: Settings, label: 'Avancé', color: 'text-rose-600' },
    { id: 'integrations', icon: Hash, label: 'Intégrations', color: 'text-purple-600' },
    { id: 'signature', icon: Pen, label: 'Signature', color: 'text-blue-600' }
  ];

  return (
    <TabsList className="w-full flex overflow-x-auto justify-between bg-white shadow-md rounded-lg p-2 mb-6 border border-gray-100">
      {tabs.map(({ id, icon: Icon, label, color }) => (
        <TabsTrigger 
          key={id}
          value={id}
          data-value={id}
          className="flex items-center gap-2 px-4 py-2 rounded-md"
        >
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="font-medium">{label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabNavigation;
