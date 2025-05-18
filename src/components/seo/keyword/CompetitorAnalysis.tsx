
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ExternalLink, TrendingUp, Search } from 'lucide-react';
import ApiKeyConfig from '@/components/seo/ApiKeyConfig';

interface CompetitorAnalysisProps {
  competitors: any[];
  keyword: string;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ competitors, keyword }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [validationMessage, setValidationMessage] = useState('');

  // Charger la clé API depuis le localStorage au démarrage
  useEffect(() => {
    const savedKey = localStorage.getItem('openaiKey');
    if (savedKey) {
      setOpenaiKey(savedKey);
      setApiKeyStatus('unchecked');
      setValidationMessage('Clé API chargée, mais non vérifiée');
    }
  }, []);

  const handleKeyValidated = () => {
    // Vous pourriez rafraîchir les données des concurrents ici
    console.log("Clé API validée, des données plus précises seront chargées");
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Analyse concurrentielle pour le mot-clé <span className="font-semibold">"{keyword}"</span>
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitors.map((competitor, idx) => (
          <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">{competitor.name}</h3>
              <a 
                href={competitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <span>Visiter</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-blue-50 p-2 rounded text-center">
                <span className="text-xs text-gray-500 block">Force</span>
                <span className="text-blue-700 font-medium">{competitor.strength}/100</span>
              </div>
              <div className="bg-green-50 p-2 rounded text-center">
                <span className="text-xs text-gray-500 block">Trafic</span>
                <span className="text-green-700 font-medium">{competitor.organic_traffic.toLocaleString()}</span>
              </div>
              <div className="bg-purple-50 p-2 rounded text-center">
                <span className="text-xs text-gray-500 block">Mots-clés</span>
                <span className="text-purple-700 font-medium">{competitor.keywords.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 mt-2 text-sm">
              <Search className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Top du contenu pour ce mot-clé</span>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Section de configuration de la clé API */}
      <div className="mt-4">
        <ApiKeyConfig 
          openaiKey={openaiKey}
          setOpenaiKey={setOpenaiKey}
          apiKeyStatus={apiKeyStatus}
          setApiKeyStatus={setApiKeyStatus}
          validationMessage={validationMessage}
          setValidationMessage={setValidationMessage}
          onKeyValidated={handleKeyValidated}
        />
      </div>
      
      <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
        <p className="text-sm text-slate-600">
          <span className="font-medium">Note:</span> Pour obtenir des données concurrentielles plus précises, veuillez valider votre clé API OpenAI dans la section de configuration ci-dessus.
        </p>
      </div>
    </div>
  );
};

export default CompetitorAnalysis;
