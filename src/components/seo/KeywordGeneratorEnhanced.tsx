
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import ApiKeyConfig from './ApiKeyConfig';
import KeywordTabsNavigation from './keyword/KeywordTabsNavigation';
import KeywordTabsContent from './keyword/KeywordTabsContent';
import { Sparkles, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const KeywordGeneratorEnhanced: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState('generator');
  const [keyword, setKeyword] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [validationMessage, setValidationMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [standardKeywords, setStandardKeywords] = useState([]);
  const [longTailKeywords, setLongTailKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const handleKeyValidated = () => {
    // Generate initial keywords when API key is validated
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
    // Simulate keyword generation
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

  const toggleKeywordSelection = (keywordText: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keywordText)
        ? prev.filter(k => k !== keywordText)
        : [...prev, keywordText]
    );
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
      {/* Section de configuration API - Carte bleue */}
      <Card className="p-6 border-blue-200 bg-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-900">Configuration API OpenAI</h2>
          </div>
          <Button 
            onClick={() => setShowApiConfig(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurer API
          </Button>
        </div>
        <p className="text-blue-800 text-sm">
          Configurez votre clé API OpenAI pour des suggestions de mots-clés plus intelligentes et précises.
        </p>
        {apiKeyStatus === 'valid' && (
          <div className="mt-2 text-sm text-green-700 font-medium">
            ✅ API OpenAI configurée et validée
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
