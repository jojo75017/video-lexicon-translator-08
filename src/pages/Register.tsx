
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Inscription</h1>
        </div>
        <div className="space-y-4">
          <Input placeholder="Nom" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Mot de passe" type="password" />
          <Input placeholder="Confirmer le mot de passe" type="password" />
          <Button className="w-full">S'inscrire</Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
