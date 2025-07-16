
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

const SeoAnalyzer: React.FC = () => {
  return (
    <UnifiedDashboard>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Analyseur SEO</h1>
        </div>
        <p className="text-gray-600">
          Analysez complètement le SEO de vos pages web.
        </p>
      </Card>
    </UnifiedDashboard>
  );
};

export default SeoAnalyzer;
