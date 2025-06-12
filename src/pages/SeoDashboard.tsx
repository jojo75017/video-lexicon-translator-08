
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const SeoDashboard = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">SEO Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Optimisez votre référencement naturel avec nos outils avancés.
          </p>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default SeoDashboard;
