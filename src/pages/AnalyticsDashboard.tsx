
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const AnalyticsDashboard = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Analysez les performances de votre site web et suivez vos métriques importantes.
          </p>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default AnalyticsDashboard;
