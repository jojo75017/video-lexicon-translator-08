
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw } from 'lucide-react';

const ResetPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <RefreshCw className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
        </div>
        <div className="space-y-4">
          <Input placeholder="Nouveau mot de passe" type="password" />
          <Input placeholder="Confirmer le mot de passe" type="password" />
          <Button className="w-full">Réinitialiser</Button>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
