
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";

export const SeoTabContent: React.FC = () => (
  <TabsContent value="seo" className="mt-2">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
      <p className="text-gray-600">Contenu de l'analyse SEO</p>
    </div>
  </TabsContent>
);

export const StructureTabContent: React.FC = () => (
  <TabsContent value="structure" className="mt-2">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Structure du Site</h2>
      <p className="text-gray-600">Contenu de l'analyse de structure</p>
    </div>
  </TabsContent>
);

export const BacklinksTabContent: React.FC = () => (
  <TabsContent value="backlinks" className="mt-2">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Analyse des Backlinks</h2>
      <p className="text-gray-600">Contenu de l'analyse des backlinks</p>
    </div>
  </TabsContent>
);

export const MetricsTabContent: React.FC = () => (
  <TabsContent value="metrics" className="mt-2">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Métriques</h2>
      <p className="text-gray-600">Contenu des métriques</p>
    </div>
  </TabsContent>
);
