import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import ApiConfiguration from './ApiConfiguration';
import KeywordTabsNavigation from './KeywordTabsNavigation';
import KeywordTabsContent from './KeywordTabsContent';
import { Sparkles, Settings, Loader2, Key } from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';

const AdvancedKeywordGenerator: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState('generator');
  const [keyword, setKeyword] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [standardKeywords, setStandardKeywords] = useState<KeywordSuggestion[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const handleKeyValidated = () => {
    setShowApiConfig(false);
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
      const mockStandardKeywords: KeywordSuggestion[] = [
        { 
          keyword: `${keyword} guide`, 
          volume: 1200, 
          difficulty: 45, 
          cpc: 1.25, 
          type: 'standard',
          intent: 'informational',
          opportunity: 75
        },
        { 
          keyword: `${keyword} tips`, 
          volume: 800, 
          difficulty: 35, 
          cpc: 0.95, 
          type: 'standard',
          intent: 'informational',
          opportunity: 60
        },
        { 
          keyword: `${keyword} best practices`, 
          volume: 600, 
          difficulty: 55, 
          cpc: 1.50, 
          type: 'standard',
          intent: 'commercial',
          opportunity: 80
        },
      ];
      
      const mockLongTailKeywords: KeywordSuggestion[] = [
        { 
          keyword: `how to ${keyword} for beginners`, 
          volume: 300, 
          difficulty: 25, 
          cpc: 0.85, 
          type: 'long-tail',
          intent: 'informational',
          opportunity: 65
        },
        { 
          keyword: `best ${keyword} tools 2024`, 
          volume: 250, 
          difficulty: 30, 
          cpc: 1.10, 
          type: 'long-tail',
          intent: 'commercial',
          opportunity: 70
        },
        { 
          keyword: `${keyword} vs alternatives comparison`, 
          volume: 180, 
          difficulty: 40, 
          cpc: 1.35, 
          type: 'long-tail',
          intent: 'commercial',
          opportunity: 55
        },
      ];
      
      setStandardKeywords(mockStandardKeywords);
      setLongTailKeywords(mockLongTailKeywords);
      setIsGenerating(false);
      toast.success(`${mockStandardKeywords.length + mockLongTailKeywords.length} mots-clés générés`);
    }, 2000);
  };

  const toggleKeywordSelection = (keywordText: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keywordText)
        ? prev.filter(k => k !== keywordText)
        : [...prev, keywordText]
    );
  };

  const clearSelectedKeywords = () => {
    setSelectedKeywords([]);
    toast.info('Sélection effacée');
  };

  const exportSelectedKeywords = () => {
    if (selectedKeywords.length === 0) {
      toast.error('Aucun mot-clé sélectionné');
      return;
    }
    
    const csvContent = selectedKeywords.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'keywords.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${selectedKeywords.length} mots-clés exportés`);
  };

  const handleIntelligentKeywords = (keywordsList: KeywordSuggestion[]) => {
    setStandardKeywords(prev => [...prev, ...keywordsList]);
    toast.success(`${keywordsList.length} nouveaux mots-clés ajoutés`);
  };

  const handleCompetitorKeywords = (keywordsList: string[]) => {
    const competitorKeywords: KeywordSuggestion[] = keywordsList.map(kw => ({
      keyword: kw,
      volume: Math.floor(Math.random() * 1000) + 100,
      difficulty: Math.floor(Math.random() * 80) + 20,
      cpc: Math.random() * 2 + 0.5,
      type: 'competitor' as const,
      intent: 'mixed' as const,
      opportunity: Math.floor(Math.random() * 60) + 40
    }));
    
    setStandardKeywords(prev => [...prev, ...competitorKeywords]);
    toast.success(`${keywordsList.length} mots-clés concurrents ajoutés`);
  };

  if (showApiConfig) {
    return (
      <ApiConfiguration
        openaiKey={openaiKey}
        setOpenaiKey={setOpenaiKey}
        onKeyValidated={handleKeyValidated}
      />
    );
  }

  const allKeywords = [...standardKeywords, ...longTailKeywords];

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
        
        {openaiKey && (
          <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">✅ API OpenAI configurée - IA activée !</span>
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

      {/* Navigation et contenu des onglets */}
      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="space-y-4">
        <KeywordTabsNavigation 
          activeTab={activeMainTab}
          setActiveTab={setActiveMainTab}
          hasResults={allKeywords.length > 0}
        />
        
        <KeywordTabsContent
          activeTab={activeMainTab}
          keywords={allKeywords}
          keyword={keyword}
        />
      </Tabs>
    </div>
  );
};

export default AdvancedKeywordGenerator;
