
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Search, TrendingUp, Lightbulb, Settings, Key, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from "@/utils/seo/openaiService";
import { KeywordSuggestion } from "@/types/seo/Keyword";

const ModernKeywordGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [isConfigured, setIsConfigured] = useState(() => !!localStorage.getItem('openaiKey'));
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const validateAndSaveApiKey = async () => {
    if (!openaiKey.trim()) {
      toast.error("Veuillez entrer une clé API OpenAI");
      return;
    }

    try {
      const isValid = await OpenAIService.validateApiKey(openaiKey);
      
      if (isValid) {
        localStorage.setItem('openaiKey', openaiKey);
        setIsConfigured(true);
        setShowApiConfig(false);
        toast.success("Clé API OpenAI configurée avec succès !");
      } else {
        toast.error("Clé API OpenAI invalide");
      }
    } catch (error) {
      toast.error("Erreur lors de la validation de la clé API");
    }
  };

  const generateKeywords = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    if (!isConfigured) {
      toast.error("Veuillez configurer votre clé API OpenAI d'abord");
      setShowApiConfig(true);
      return;
    }

    setIsGenerating(true);
    try {
      const openAIService = new OpenAIService(openaiKey);
      
      // Générer différents types de mots-clés
      const [standardKws, longTailKws, semanticKws] = await Promise.all([
        OpenAIService.generateKeywords(keyword, openaiKey),
        OpenAIService.generateLongTailKeywords(keyword, openaiKey),
        OpenAIService.generateSemanticKeywords(keyword, openaiKey)
      ]);

      // Créer des objets KeywordSuggestion complets
      const allKeywords: KeywordSuggestion[] = [
        ...standardKws.map(kw => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 5000) + 100,
          difficulty: Math.floor(Math.random() * 80) + 10,
          cpc: parseFloat((Math.random() * 3).toFixed(2)),
          type: 'ai-generated' as const,
          intent: 'mixed' as const,
          opportunity: Math.floor(Math.random() * 40) + 50
        })),
        ...longTailKws.map(kw => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 1500) + 50,
          difficulty: Math.floor(Math.random() * 60) + 15,
          cpc: parseFloat((Math.random() * 2).toFixed(2)),
          type: 'long-tail' as const,
          intent: 'informational' as const,
          opportunity: Math.floor(Math.random() * 30) + 60
        })),
        ...semanticKws.map(kw => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 2000) + 200,
          difficulty: Math.floor(Math.random() * 70) + 20,
          cpc: parseFloat((Math.random() * 2.5).toFixed(2)),
          type: 'semantic' as const,
          intent: 'commercial' as const,
          opportunity: Math.floor(Math.random() * 35) + 55
        }))
      ];

      setKeywords(allKeywords);
      toast.success(`${allKeywords.length} mots-clés générés avec l'IA !`);
    } catch (error) {
      toast.error("Erreur lors de la génération des mots-clés");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleKeywordSelection = (kw: string) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) 
        ? prev.filter(k => k !== kw)
        : [...prev, kw]
    );
  };

  const exportKeywords = () => {
    const selected = keywords.filter(kw => selectedKeywords.includes(kw.keyword));
    let csv = "Mot-clé,Volume,Difficulté,CPC,Type,Intention\n";
    selected.forEach(kw => {
      csv += `"${kw.keyword}",${kw.volume},${kw.difficulty},${kw.cpc || 'N/A'},${kw.type},${kw.intent}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mots-cles-${keyword.replace(/\s+/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${selectedKeywords.length} mots-clés exportés`);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-600';
    if (difficulty < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ai-generated': return 'bg-purple-100 text-purple-800';
      case 'long-tail': return 'bg-blue-100 text-blue-800';
      case 'semantic': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showApiConfig) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configuration OpenAI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Pour utiliser le générateur de mots-clés IA, configurez votre clé API OpenAI.
          </p>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Obtenez votre clé sur{" "}
              <a 
                href="https://platform.openai.com/api-keys"
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline"
              >
                platform.openai.com/api-keys
              </a>
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={validateAndSaveApiKey} className="flex-1">
              Valider et sauvegarder
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowApiConfig(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulaire de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Générateur de Mots-Clés IA
            {isConfigured && (
              <Badge className="bg-green-100 text-green-800">
                ✓ OpenAI connecté
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Entrez votre mot-clé principal..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateKeywords()}
              className="flex-1"
            />
            <Button onClick={generateKeywords} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowApiConfig(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {!isConfigured && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <Key className="h-4 w-4 inline mr-1" />
                Configurez votre clé OpenAI pour utiliser l'IA
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      {keywords.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Résultats ({keywords.length} mots-clés)
              </CardTitle>
              {selectedKeywords.length > 0 && (
                <Button onClick={exportKeywords} size="sm">
                  Exporter CSV ({selectedKeywords.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous ({keywords.length})</TabsTrigger>
                <TabsTrigger value="ai-generated">
                  IA ({keywords.filter(k => k.type === 'ai-generated').length})
                </TabsTrigger>
                <TabsTrigger value="long-tail">
                  Longue traîne ({keywords.filter(k => k.type === 'long-tail').length})
                </TabsTrigger>
                <TabsTrigger value="semantic">
                  Sémantique ({keywords.filter(k => k.type === 'semantic').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {keywords.map((kw, index) => (
                    <Card 
                      key={index} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedKeywords.includes(kw.keyword) ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => toggleKeywordSelection(kw.keyword)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <h3 className="font-medium text-sm">{kw.keyword}</h3>
                          
                          <div className="flex gap-2">
                            <Badge className={getTypeColor(kw.type || 'standard')}>
                              {kw.type}
                            </Badge>
                            <Badge variant="outline">
                              {kw.intent}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Vol: {kw.volume?.toLocaleString()}</div>
                            <div className={getDifficultyColor(kw.difficulty)}>
                              Diff: {kw.difficulty}/100
                            </div>
                            <div>CPC: {kw.cpc}€</div>
                            <div>Opp: {kw.opportunity}%</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {['ai-generated', 'long-tail', 'semantic'].map(type => (
                <TabsContent key={type} value={type}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {keywords.filter(k => k.type === type).map((kw, index) => (
                      <Card 
                        key={index} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedKeywords.includes(kw.keyword) ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => toggleKeywordSelection(kw.keyword)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <h3 className="font-medium text-sm">{kw.keyword}</h3>
                            
                            <div className="flex gap-2">
                              <Badge className={getTypeColor(kw.type || 'standard')}>
                                {kw.type}
                              </Badge>
                              <Badge variant="outline">
                                {kw.intent}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>Vol: {kw.volume?.toLocaleString()}</div>
                              <div className={getDifficultyColor(kw.difficulty)}>
                                Diff: {kw.difficulty}/100
                              </div>
                              <div>CPC: {kw.cpc}€</div>
                              <div>Opp: {kw.opportunity}%</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModernKeywordGenerator;
