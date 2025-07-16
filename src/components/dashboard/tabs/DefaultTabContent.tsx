
import React from 'react';
import { Card } from "@/components/ui/card";

interface DefaultTabContentProps {
  id: string;
  label: string;
}

const DefaultTabContent: React.FC<DefaultTabContentProps> = ({ id, label }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-sm text-gray-600">
        Contenu pour l'onglet {label} ({id}).
      </p>
      <Card className="p-4">
        <p className="text-sm">Ce contenu sera disponible prochainement.</p>
      </Card>
    </div>
  );
};

export default DefaultTabContent;
