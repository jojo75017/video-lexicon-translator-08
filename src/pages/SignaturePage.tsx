
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import SignatureGenerator from '@/components/signature/SignatureGenerator';
import { Card } from '@/components/ui/card';
import { CheckCircle, FileSignature, Share2, Download } from 'lucide-react';

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
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-t-lg border-b border-blue-200">
              <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                <FileSignature className="h-5 w-5 mr-2 text-blue-600" />
                Créez votre signature professionnelle
              </h2>
              <p className="text-blue-600 text-sm mt-1">Personnalisez tous les aspects de votre signature avec notre éditeur avancé</p>
            </div>
            <div className="p-6">
              <div data-section="signature" className="block">
                <SignatureGenerator />
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="shadow-md p-5 border-blue-100 bg-white h-full">
            <h3 className="font-medium text-lg mb-3">Pourquoi créer une signature professionnelle ?</h3>
            <ul className="space-y-3">
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

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Options supplémentaires</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                  <span>Partager ma signature</span>
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="w-full flex items-center justify-between p-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                  <span>Télécharger en HTML</span>
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SignaturePage;
