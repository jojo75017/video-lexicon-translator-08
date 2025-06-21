
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, Download, Copy, TrendingUp, Target, Globe, Zap } from "lucide-react";
import { toast } from "sonner";

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  intent: string;
  type: string;
}

const KeywordGeneratorPage = () => {
  const [mainKeyword, setMainKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [country, setCountry] = useState('fr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [standardKeywords, setStandardKeywords] = useState<KeywordData[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordData[]>([]);
  const [questionKeywords, setQuestionKeywords] = useState<KeywordData[]>([]);
  const [competitorKeywords, setCompetitorKeywords] = useState<KeywordData[]>([]);

  const generateKeywords = async () => {
    if (!mainKeyword.trim()) {
      toast.error('Veuillez entrer un mot-clé principal');
      return;
    }

    setIsGenerating(true);
    
    // Simulation de génération de mots-clés
    setTimeout(() => {
      // Mots-clés standards
      const standards = [
        { keyword: mainKeyword, volume: 8500, difficulty: 65, cpc: 1.2, competition: 0.75, intent: 'commercial', type: 'principal' },
        { keyword: `${mainKeyword} pas cher`, volume: 3200, difficulty: 45, cpc: 0.8, competition: 0.6, intent: 'transactionnel', type: 'commercial' },
        { keyword: `meilleur ${mainKeyword}`, volume: 2800, difficulty: 55, cpc: 1.5, competition: 0.7, intent: 'commercial', type: 'comparatif' },
        { keyword: `${mainKeyword} avis`, volume: 2100, difficulty: 35, cpc: 0.9, competition: 0.5, intent: 'informationnel', type: 'avis' },
        { keyword: `${mainKeyword} prix`, volume: 1900, difficulty: 40, cpc: 1.1, competition: 0.65, intent: 'commercial', type: 'prix' }
      ];

      // Mots-clés longue traîne
      const longTail = [
        { keyword: `comment choisir ${mainKeyword}`, volume: 890, difficulty: 25, cpc: 0.6, competition: 0.3, intent: 'informationnel', type: 'guide' },
        { keyword: `${mainKeyword} pour débutants`, volume: 720, difficulty: 20, cpc: 0.5, competition: 0.25, intent: 'informationnel', type: 'débutant' },
        { keyword: `où acheter ${mainKeyword} pas cher`, volume: 650, difficulty: 30, cpc: 0.7, competition: 0.4, intent: 'transactionnel', type: 'achat' },
        { keyword: `${mainKeyword} vs alternative`, volume: 580, difficulty: 28, cpc: 0.8, competition: 0.35, intent: 'commercial', type: 'comparaison' },
        { keyword: `guide complet ${mainKeyword}`, volume: 420, difficulty: 22, cpc: 0.4, competition: 0.2, intent: 'informationnel', type: 'guide' }
      ];

      // Questions fréquentes
      const questions = [
        { keyword: `qu'est-ce que ${mainKeyword}`, volume: 1200, difficulty: 15, cpc: 0.3, competition: 0.2, intent: 'informationnel', type: 'définition' },
        { keyword: `comment utiliser ${mainKeyword}`, volume: 980, difficulty: 18, cpc: 0.4, competition: 0.25, intent: 'informationnel', type: 'tutoriel' },
        { keyword: `pourquoi ${mainKeyword}`, volume: 760, difficulty: 20, cpc: 0.35, competition: 0.3, intent: 'informationnel', type: 'explication' },
        { keyword: `quand acheter ${mainKeyword}`, volume: 540, difficulty: 25, cpc: 0.6, competition: 0.4, intent: 'commercial', type: 'timing' },
        { keyword: `combien coûte ${mainKeyword}`, volume: 820, difficulty: 35, cpc: 0.9, competition: 0.5, intent: 'commercial', type: 'prix' }
      ];

      // Mots-clés concurrentiels
      const competitors = [
        { keyword: `alternative à ${mainKeyword}`, volume: 1500, difficulty: 50, cpc: 1.3, competition: 0.6, intent: 'commercial', type: 'alternative' },
        { keyword: `${mainKeyword} concurrent`, volume: 890, difficulty: 45, cpc: 1.1, competition: 0.55, intent: 'commercial', type: 'concurrent' },
        { keyword: `${mainKeyword} comparaison`, volume: 1200, difficulty: 42, cpc: 1.0, competition: 0.5, intent: 'commercial', type: 'comparaison' },
        { keyword: `remplacer ${mainKeyword}`, volume: 670, difficulty: 38, cpc: 0.85, competition: 0.45, intent: 'commercial', type: 'remplacement' }
      ];

      setStandardKeywords(standards);
      setLongTailKeywords(longTail);
      setQuestionKeywords(questions);
      setCompetitorKeywords(competitors);
      
      setIsGenerating(false);
      toast.success(`${standards.length + longTail.length + questions.length + competitors.length} mots-clés générés avec succès !`);
    }, 2000);
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié !');
  };

  const exportKeywords = () => {
    const allKeywords = [...standardKeywords, ...longTailKeywords, ...questionKeywords, ...competitorKeywords];
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Mot-clé,Volume,Difficulté,CPC,Concurrence,Intention,Type\n"
      + allKeywords.map(k => `"${k.keyword}",${k.volume},${k.difficulty},${k.cpc},${k.competition},"${k.intent}","${k.type}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mots-cles-${mainKeyword}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export CSV téléchargé !');
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'informationnel': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      case 'transactionnel': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const KeywordTable = ({ keywords, title }: { keywords: KeywordData[], title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="secondary">{keywords.length} mots-clés</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {keywords.map((keyword, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-lg">{keyword.keyword}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyKeyword(keyword.keyword)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Volume:</span>
                  <div className="font-semibold">{keyword.volume.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Difficulté:</span>
                  <Badge className={`${getDifficultyColor(keyword.difficulty)} mt-1`}>
                    {keyword.difficulty}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">CPC:</span>
                  <div className="font-semibold">{keyword.cpc}€</div>
                </div>
                <div>
                  <span className="text-gray-500">Concurrence:</span>
                  <div className="font-semibold">{Math.round(keyword.competition * 100)}%</div>
                </div>
                <div>
                  <span className="text-gray-500">Intention:</span>
                  <Badge className={`${getIntentColor(keyword.intent)} mt-1`}>
                    {keyword.intent}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <div className="font-semibold text-blue-600">{keyword.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-blue-600" />
            Générateur de Mots-Clés IA
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Générez des centaines de mots-clés pertinents avec des données de volume, difficulté et intention de recherche
          </p>
        </div>

        {/* Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Configuration de recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Mot-clé principal</label>
                <Input
                  placeholder="Ex: formation en ligne"
                  value={mainKeyword}
                  onChange={(e) => setMainKeyword(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Langue</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Pays</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="be">Belgique</SelectItem>
                    <SelectItem value="ch">Suisse</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={generateKeywords}
                  disabled={isGenerating || !mainKeyword.trim()}
                  className="w-full gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Zap className="h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Générer
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {(standardKeywords.length > 0) && (
              <div className="flex gap-2">
                <Button onClick={exportKeywords} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exporter CSV
                </Button>
                <Badge variant="secondary" className="px-3 py-1">
                  Total: {standardKeywords.length + longTailKeywords.length + questionKeywords.length + competitorKeywords.length} mots-clés
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résultats */}
        {standardKeywords.length > 0 && (
          <Tabs defaultValue="standard" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="standard" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Standards ({standardKeywords.length})
              </TabsTrigger>
              <TabsTrigger value="longtail" className="gap-2">
                <Target className="h-4 w-4" />
                Longue traîne ({longTailKeywords.length})
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2">
                <Search className="h-4 w-4" />
                Questions ({questionKeywords.length})
              </TabsTrigger>
              <TabsTrigger value="competitors" className="gap-2">
                <Globe className="h-4 w-4" />
                Concurrentiels ({competitorKeywords.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="standard">
              <KeywordTable keywords={standardKeywords} title="Mots-clés standards" />
            </TabsContent>

            <TabsContent value="longtail">
              <KeywordTable keywords={longTailKeywords} title="Mots-clés longue traîne" />
            </TabsContent>

            <TabsContent value="questions">
              <KeywordTable keywords={questionKeywords} title="Questions fréquentes" />
            </TabsContent>

            <TabsContent value="competitors">
              <KeywordTable keywords={competitorKeywords} title="Mots-clés concurrentiels" />
            </TabsContent>
          </Tabs>
        )}

        {standardKeywords.length === 0 && !isGenerating && (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Prêt à générer des mots-clés ?
              </h3>
              <p className="text-gray-500">
                Entrez un mot-clé principal et cliquez sur "Générer" pour commencer
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KeywordGeneratorPage;
