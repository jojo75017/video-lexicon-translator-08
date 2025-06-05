
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ApiKeyConfig from './ApiKeyConfig';
import { Sparkles, Settings, Loader2, Key } from 'lucide-react';
import { toast } from 'sonner';

const KeywordGeneratorEnhanced: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [validationMessage, setValidationMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [standardKeywords, setStandardKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const handleKeyValidated = () => {
    if (keyword) {
      generateKeywords();
    }
  };

  const generateKeywords = async () => {
    if (!keyword) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const mockKeywords = [
        { keyword: `${keyword} guide`, volume: 1200, difficulty: 45, cpc: 1.25 },
        { keyword: `${keyword} tips`, volume: 800, difficulty: 35, cpc: 0.95 },
        { keyword: `${keyword} best practices`, volume: 600, difficulty: 55, cpc: 1.50 },
      ];
      setStandardKeywords(mockKeywords as any);
      setIsGenerating(false);
      toast.success(`${mockKeywords.length} mots-clés générés`);
    }, 2000);
  };

  if (showApiConfig) {
    return (
      <ApiKeyConfig
        openaiKey={openaiKey}
        setOpenaiKey={setOpenaiKey}
        apiKeyStatus={apiKeyStatus}
        setApiKeyStatus={setApiKeyStatus}
        validationMessage={validationMessage}
        setValidationMessage={setValidationMessage}
        onKeyValidated={handleKeyValidated}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Section de configuration API - Carte bleue avec bordure et fond bleu */}
      <Card className="p-6 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Key className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">Configuration API OpenAI</h2>
              <p className="text-sm text-blue-700">Activez l'IA pour des suggestions avancées</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowApiConfig(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            size="lg"
          >
            <Settings className="h-5 w-5 mr-2" />
            Configurer API
          </Button>
        </div>
        
        <div className="bg-white/70 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm mb-2">
            <strong>Pourquoi configurer OpenAI ?</strong>
          </p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Suggestions de mots-clés plus intelligentes et contextuelles</li>
            <li>• Analyse sémantique avancée</li>
            <li>• Génération de contenu SEO optimisé</li>
            <li>• Recommandations personnalisées</li>
          </ul>
        </div>
        
        {apiKeyStatus === 'valid' && (
          <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">✅ API OpenAI configurée et validée - IA activée !</span>
          </div>
        )}
        
        {apiKeyStatus === 'invalid' && (
          <div className="mt-4 flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
            <Settings className="h-5 w-5" />
            <span className="font-medium">❌ Configuration API requise pour utiliser l'IA</span>
          </div>
        )}
      </Card>

      {/* Formulaire de recherche */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Générateur de mots-clés
        </h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Entrez un mot-clé principal..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateKeywords()}
            />
          </div>
          <Button 
            onClick={generateKeywords} 
            disabled={isGenerating || !keyword}
            className="flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Générer
          </Button>
        </div>
      </Card>

      {/* Résultats */}
      {standardKeywords.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Résultats</h3>
          <div className="space-y-2">
            {standardKeywords.map((kw: any, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <span>{kw.keyword}</span>
                <div className="flex gap-2 text-sm text-gray-600">
                  <span>Vol: {kw.volume}</span>
                  <span>Diff: {kw.difficulty}</span>
                  <span>CPC: {kw.cpc}€</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default KeywordGeneratorEnhanced;
