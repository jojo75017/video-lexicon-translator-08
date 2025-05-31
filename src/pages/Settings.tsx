
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <UnifiedDashboard>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Paramètres</h1>
        </div>
        <p className="text-gray-600">
          Configuration de votre compte et préférences.
        </p>
      </Card>
    </UnifiedDashboard>
  );
};

export default Settings;
