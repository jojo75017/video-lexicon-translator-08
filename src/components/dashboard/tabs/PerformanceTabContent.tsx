
import React from 'react';
import { Card } from "@/components/ui/card";

const PerformanceTabContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Performance du site</h3>
      <p className="text-sm text-gray-600">
        Analysez les performances techniques de votre site web.
      </p>
      <Card className="p-4">
        <p className="text-sm">Aucune donnée de performance disponible.</p>
      </Card>
    </div>
  );
};

export default PerformanceTabContent;
