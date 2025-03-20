
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";

interface DefaultTabContentProps {
  id: string;
  label: string;
}

const DefaultTabContent: React.FC<DefaultTabContentProps> = ({ id, label }) => {
  return (
    <TabsContent key={id} value={id} className="mt-2">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">{label}</h2>
        <p className="text-gray-600">Contenu de {label} (à venir)</p>
      </div>
    </TabsContent>
  );
};

export default DefaultTabContent;
