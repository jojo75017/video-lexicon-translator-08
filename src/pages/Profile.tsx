
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <UnifiedDashboard>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Profil</h1>
        </div>
        <p className="text-gray-600">
          Gérez votre profil utilisateur.
        </p>
      </Card>
    </UnifiedDashboard>
  );
};

export default Profile;
