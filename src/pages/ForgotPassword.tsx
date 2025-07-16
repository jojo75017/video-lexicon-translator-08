
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <Key className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
          <Input placeholder="Email" type="email" />
          <Button className="w-full">Envoyer le lien</Button>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
