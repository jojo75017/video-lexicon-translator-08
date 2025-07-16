
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const ContentGenerator: React.FC = () => {
  return (
    <UnifiedDashboard>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold">Générateur de contenu</h1>
        </div>
        <p className="text-gray-600">
          Créez du contenu optimisé SEO automatiquement.
        </p>
      </Card>
    </UnifiedDashboard>
  );
};

export default ContentGenerator;
