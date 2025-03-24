
import React from 'react';
import { Card } from "@/components/ui/card";

const AnalyticsTabContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Analytics</h3>
      <p className="text-sm text-gray-600">
        Consultez les statistiques et analyses de trafic de votre site web.
      </p>
      <Card className="p-4">
        <p className="text-sm">Aucune donnée d'analytics disponible.</p>
      </Card>
    </div>
  );
};

export default AnalyticsTabContent;
