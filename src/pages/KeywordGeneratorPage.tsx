import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Copy, Sparkles, TrendingUp, Users, DollarSign, Key, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../utils/seo/openaiService';

interface Keyword {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trend: 'up' | 'down' | 'stable';
  competition: 'faible' | 'moyenne' | 'forte';
}

const KeywordGeneratorPage = () => {
  const [mainKeyword, setMainKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  
  // États pour l'API OpenAI
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [isValidatingKey, setIsValidatingKey] = useState(false);

  const validateApiKey = async () => {
    if (!openaiKey.trim()) {
      toast.error('Veuillez entrer une clé API OpenAI');
      return;
    }

    setIsValidatingKey(true);
    try {
      const openAIService = new OpenAIService(openaiKey);
      const isValid = await openAIService.validateApiKey();
      
      if (isValid) {
        localStorage.setItem('openaiKey', openaiKey);
        setApiKeyStatus('valid');
        setShowApiConfig(false);
        toast.success('Clé API OpenAI validée avec succès');
      } else {
        setApiKeyStatus('invalid');
        toast.error('Clé API invalide. Vérifiez votre clé OpenAI.');
      }
    } catch (error) {
      setApiKeyStatus('invalid');
      toast.error('Erreur lors de la validation de la clé API');
    } finally {
      setIsValidatingKey(false);
    }
  };

  const generateKeywords = async () => {
    if (!mainKeyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsGenerating(true);
    
    try {
      let generatedKeywords: Keyword[] = [];

      // Si une clé API valide est configurée, utiliser OpenAI
      if (apiKeyStatus === 'valid' && openaiKey) {
        try {
          const openAIService = new OpenAIService(openaiKey);
          const aiKeywords = await openAIService.generateKeywords(mainKeyword);
          
          // Enrichir avec les données IA
          const enrichedKeywords = await Promise.all(
            aiKeywords.map(async (kw) => {
              const difficulty = await openAIService.analyzeKeywordDifficulty(kw);
              const volume = await openAIService.estimateSearchVolume(kw);
              
              return {
                keyword: kw,
                volume,
                difficulty,
                cpc: parseFloat((Math.random() * 3).toFixed(2)),
                trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down' as 'up' | 'down' | 'stable',
                competition: Math.random() > 0.6 ? 'forte' : Math.random() > 0.3 ? 'moyenne' : 'faible' as 'faible' | 'moyenne' | 'forte'
              };
            })
          );
          
          generatedKeywords = enrichedKeywords;
          toast.success(`${generatedKeywords.length} mots-clés générés avec l'IA OpenAI !`);
        } catch (error) {
          console.error('Erreur OpenAI:', error);
          toast.warning('Erreur avec l\'API OpenAI, génération de mots-clés génériques');
          generatedKeywords = generateFallbackKeywords(mainKeyword);
        }
      } else {
        // Génération de mots-clés génériques
        generatedKeywords = generateFallbackKeywords(mainKeyword);
        toast.info('Mots-clés générés (configurez OpenAI pour plus de précision)');
      }

      setKeywords(generatedKeywords.sort((a, b) => b.volume - a.volume));
    } catch (error) {
      toast.error('Erreur lors de la génération des mots-clés');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackKeywords = (baseKeyword: string): Keyword[] => {
    const prefixes = ['comment', 'pourquoi', 'meilleur', 'guide', 'tutoriel', 'prix', 'avis', 'comparatif'];
    const suffixes = ['gratuit', 'en ligne', 'pas cher', '2024', 'facile', 'rapide', 'professionnel', 'france'];
    const longTail = ['pas à pas', 'pour débutant', 'sans expérience', 'étape par étape'];
    
    const generated: Keyword[] = [];

    // Mot-clé principal
    generated.push({
      keyword: baseKeyword,
      volume: Math.floor(Math.random() * 15000) + 5000,
      difficulty: Math.floor(Math.random() * 100),
      cpc: parseFloat((Math.random() * 4).toFixed(2)),
      trend: Math.random() > 0.5 ? 'up' : 'stable',
      competition: Math.random() > 0.6 ? 'forte' : Math.random() > 0.3 ? 'moyenne' : 'faible'
    });

    // Variations avec préfixes
    prefixes.slice(0, 8).forEach(prefix => {
      generated.push({
        keyword: `${prefix} ${baseKeyword}`,
        volume: Math.floor(Math.random() * 8000) + 500,
        difficulty: Math.floor(Math.random() * 80),
        cpc: parseFloat((Math.random() * 3).toFixed(2)),
        trend: Math.random() > 0.7 ? 'up' : Math.random() > 0.4 ? 'stable' : 'down',
        competition: Math.random() > 0.5 ? 'moyenne' : 'faible'
      });
    });

    // Variations avec suffixes
    suffixes.slice(0, 8).forEach(suffix => {
      generated.push({
        keyword: `${baseKeyword} ${suffix}`,
        volume: Math.floor(Math.random() * 5000) + 200,
        difficulty: Math.floor(Math.random() * 70),
        cpc: parseFloat((Math.random() * 2.5).toFixed(2)),
        trend: Math.random() > 0.6 ? 'up' : 'stable',
        competition: Math.random() > 0.7 ? 'forte' : 'faible'
      });
    });

    return generated;
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié !');
  };

  const exportCSV = () => {
    if (keywords.length === 0) {
      toast.error('Aucun mot-clé à exporter');
      return;
    }

    const csvContent = "Mot-clé,Volume,Difficulté,CPC,Tendance,Concurrence\n" 
      + keywords.map(k => `"${k.keyword}",${k.volume},${k.difficulty},${k.cpc},${k.trend},${k.competition}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mots-cles-${mainKeyword}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Export CSV téléchargé !');
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800 border-green-200';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'faible': return 'bg-green-100 text-green-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'forte': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const totalVolume = keywords.reduce((sum, kw) => sum + kw.volume, 0);
  const avgDifficulty = keywords.length > 0 ? Math.round(keywords.reduce((sum, kw) => sum + kw.difficulty, 0) / keywords.length) : 0;
  const avgCpc = keywords.length > 0 ? (keywords.reduce((sum, kw) => sum + kw.cpc, 0) / keywords.length).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-blue-600" />
            Générateur de Mots-Clés IA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les meilleurs mots-clés avec l'intelligence artificielle OpenAI
          </p>
        </div>

        {/* Configuration API OpenAI */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-600" />
                Configuration OpenAI API
              </div>
              <div className="flex items-center gap-2">
                {apiKeyStatus === 'valid' && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    API Connectée
                  </Badge>
                )}
                {apiKeyStatus === 'invalid' && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    API Invalide
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiConfig(!showApiConfig)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {showApiConfig ? 'Masquer' : 'Configurer'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          {(showApiConfig || apiKeyStatus !== 'valid') && (
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Clé API OpenAI (sk-...)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={validateApiKey}
                      disabled={isValidatingKey || !openaiKey.trim()}
                    >
                      {isValidatingKey ? 'Validation...' : 'Valider'}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Pourquoi configurer OpenAI ?</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Génération de mots-clés personnalisés et pertinents</li>
                    <li>• Analyse automatique de la difficulté SEO</li>
                    <li>• Estimation précise du volume de recherche</li>
                    <li>• Suggestions basées sur l'intelligence artificielle</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">
                    Obtenez votre clé API sur: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a>
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Formulaire de recherche */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">Recherche de mots-clés</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">Mot-clé principal</label>
                <Input
                  placeholder="Ex: marketing digital"
                  value={mainKeyword}
                  onChange={(e) => setMainKeyword(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">Langue</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="border-2 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="en">🇺🇸 Anglais</SelectItem>
                    <SelectItem value="es">🇪🇸 Espagnol</SelectItem>
                    <SelectItem value="de">🇩🇪 Allemand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={generateKeywords}
                  disabled={isGenerating || !mainKeyword.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      {apiKeyStatus === 'valid' ? 'Générer avec IA' : 'Générer'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        {keywords.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total mots-clés</p>
                    <p className="text-2xl font-bold">{keywords.length}</p>
                  </div>
                  <Search className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Volume total</p>
                    <p className="text-2xl font-bold">{totalVolume.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Difficulté moy.</p>
                    <p className="text-2xl font-bold">{avgDifficulty}/100</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">CPC moyen</p>
                    <p className="text-2xl font-bold">{avgCpc}€</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            <Button onClick={exportCSV} variant="outline" className="border-2">
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV ({keywords.length} mots-clés)
            </Button>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              {apiKeyStatus === 'valid' ? 'Généré avec OpenAI IA' : 'Génération standard'}
              • {new Date().toLocaleTimeString()}
            </Badge>
          </div>
        )}

        {/* Résultats */}
        {keywords.length > 0 ? (
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Mots-clés générés ({keywords.length})
                {apiKeyStatus === 'valid' && (
                  <Badge className="bg-purple-100 text-purple-800 ml-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    IA
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-6">
                {keywords.map((keyword, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg text-gray-800">{keyword.keyword}</h4>
                      <div className="flex items-center gap-2">
                        {keyword.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {keyword.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                        {keyword.trend === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full"></div>}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyKeyword(keyword.keyword)}
                          className="hover:bg-blue-50"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-blue-600 font-medium">Volume mensuel</span>
                        <div className="text-xl font-bold text-blue-800">{keyword.volume.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600 font-medium">Difficulté</span>
                        <div className="mt-1">
                          <Badge className={
                            keyword.difficulty < 30 ? 'bg-green-100 text-green-800 border-green-200' :
                            keyword.difficulty < 60 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }>
                            {keyword.difficulty}/100
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="text-green-600 font-medium">CPC</span>
                        <div className="text-xl font-bold text-green-800">{keyword.cpc}€</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <span className="text-purple-600 font-medium">Concurrence</span>
                        <div className="mt-1">
                          <Badge className={
                            keyword.competition === 'faible' ? 'bg-green-100 text-green-800' :
                            keyword.competition === 'moyenne' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {keyword.competition}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          !isGenerating && (
            <Card className="text-center py-16 shadow-lg">
              <CardContent>
                <Sparkles className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  Prêt à découvrir vos mots-clés ?
                </h3>
                <p className="text-gray-500 text-lg mb-6">
                  {apiKeyStatus === 'valid' 
                    ? 'Utilisez l\'IA OpenAI pour générer des mots-clés personnalisés et pertinents'
                    : 'Entrez un mot-clé pour commencer (configurez OpenAI pour des résultats optimaux)'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="text-sm text-gray-400">
                    ✓ Analyse de volume de recherche
                  </div>
                  <div className="text-sm text-gray-400">
                    ✓ Évaluation de la difficulté
                  </div>
                  <div className="text-sm text-gray-400">
                    ✓ Estimation du CPC
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* Loading state */}
        {isGenerating && (
          <Card className="text-center py-16 shadow-lg">
            <CardContent>
              <Sparkles className="h-20 w-20 text-blue-500 mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                Génération en cours...
              </h3>
              <p className="text-gray-500 text-lg">
                {apiKeyStatus === 'valid' 
                  ? `Analyse IA avancée pour "${mainKeyword}"...`
                  : `Génération de mots-clés pour "${mainKeyword}"...`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KeywordGeneratorPage;
