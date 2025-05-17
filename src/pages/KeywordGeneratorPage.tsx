
import React from 'react';
import { Card } from '@/components/ui/card';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import KeywordGenerator from '@/components/seo/KeywordGenerator';
import { FileText } from 'lucide-react';

const KeywordGeneratorPage: React.FC = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold">Générateur de mots-clés</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Utilisez notre générateur de mots-clés pour trouver les meilleurs termes pour votre contenu et améliorer votre référencement.
          </p>
          
          <KeywordGenerator />
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordGeneratorPage;
