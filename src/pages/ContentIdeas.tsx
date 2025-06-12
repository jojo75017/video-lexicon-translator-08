
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const ContentIdeas = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Idées de Contenu</h1>
          </div>
          <p className="text-gray-600">
            Générez des idées de contenu créatives pour votre stratégie marketing.
          </p>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default ContentIdeas;
