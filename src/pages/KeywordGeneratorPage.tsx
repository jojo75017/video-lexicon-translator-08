
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import KeywordGeneratorEnhanced from '@/components/seo/KeywordGeneratorEnhanced';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const KeywordGeneratorPage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Générateur de mots-clés IA</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Utilisez l'intelligence artificielle pour générer des mots-clés pertinents et optimiser votre contenu SEO. 
            Configurez votre clé API OpenAI pour des suggestions encore plus précises.
          </p>
        </div>
        
        {/* Lien vers le guide complet */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Guide complet du générateur</h3>
                <p className="text-sm text-blue-700">Découvrez toutes les fonctionnalités de A à Z</p>
              </div>
            </div>
            <Link to="/keyword-guide-complete">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Voir le guide
              </Button>
            </Link>
          </div>
        </Card>
        
        <KeywordGeneratorEnhanced />
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordGeneratorPage;
