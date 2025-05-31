
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const ContentAnalyzer: React.FC = () => {
  return (
    <UnifiedDashboard>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">Analyseur de contenu</h1>
        </div>
        <p className="text-gray-600">
          Analysez et optimisez votre contenu existant.
        </p>
      </Card>
    </UnifiedDashboard>
  );
};

export default ContentAnalyzer;
