
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import SignatureGenerator from '@/components/signature/SignatureGenerator';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const SignaturePage = () => {
  return (
    <PageLayout 
      title="Générateur de Signature Email" 
      description="Créez une signature email professionnelle et personnalisée pour renforcer votre image de marque"
      currentTab="signature"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Card className="shadow-md border-blue-100">
            <div className="bg-blue-50 p-3 rounded-t-lg border-b border-blue-100">
              <h2 className="text-xl font-semibold text-blue-800">Créez votre signature professionnelle</h2>
              <p className="text-blue-600 text-sm">Personnalisez tous les aspects de votre signature avec notre éditeur avancé</p>
            </div>
            <div className="p-6">
              <div data-section="signature">
                <SignatureGenerator />
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="shadow-md p-4 border-blue-100 bg-white h-full">
            <h3 className="font-medium text-lg mb-3">Pourquoi créer une signature professionnelle ?</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Renforcez votre crédibilité et professionnalisme</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Facilitez les contacts avec vos informations complètes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Créez une identité visuelle cohérente</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Intégrez des liens vers votre site et réseaux sociaux</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Personnalisez avec votre logo et votre charte graphique</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SignaturePage;
