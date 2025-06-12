
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { FilePenLine } from 'lucide-react';

const AiWriterPage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FilePenLine className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Rédacteur IA 2.0</h1>
          </div>
          <p className="text-gray-600">
            Créez du contenu de qualité avec l'aide de l'intelligence artificielle.
          </p>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default AiWriterPage;
