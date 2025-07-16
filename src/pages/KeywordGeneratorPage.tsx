
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import AdvancedKeywordGenerator from '@/components/seo/keyword/AdvancedKeywordGenerator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KeywordGeneratorPage = () => {
  const navigate = useNavigate();

  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Générateur de Mots-Clés IA Avancé
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Générez des mots-clés intelligents avec l'IA OpenAI. Obtenez des suggestions sémantiques, 
            longue traîne, analyses approfondies, générateur de contenu, FAQ automatique et optimisation complète.
          </p>
        </div>

        {/* Bouton d'accès à l'analyse concurrentielle */}
        <Card className="p-4 mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                Analyse Concurrentielle Triple
              </h3>
              <p className="text-purple-600 text-sm">
                Comparez votre site avec 2 concurrents simultanément sur tous les aspects SEO
              </p>
            </div>
            <Button 
              onClick={() => navigate('/competitor-analysis')}
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            >
              <Users className="h-4 w-4" />
              Analyser les concurrents
            </Button>
          </div>
        </Card>

        <AdvancedKeywordGenerator />
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordGeneratorPage;
