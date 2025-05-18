
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, Copy, AlertTriangle, ChartLine, Users, FileText, Link2 } from 'lucide-react';
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import KeywordOpportunityChart from './keyword/KeywordOpportunityChart';
import KeywordTrendChart from './keyword/KeywordTrendChart';
import CompetitorAnalysis from './keyword/CompetitorAnalysis';
import SerpAnalysis from './keyword/SerpAnalysis';
import { 
  generateQuestionKeywords, 
  enrichKeywords, 
  groupKeywordsByIntent,
  calculateOpportunityScore
} from '@/utils/keyword/keywordAnalyzer';

// Fonction pour générer des suggestions basées sur le mot-clé de l'utilisateur
const generateKeywordSuggestions = (keyword: string): KeywordSuggestion[] => {
  // Bases des suggestions que nous allons personnaliser
  let suggestions: KeywordSuggestion[] = [];
  
  // Adapter les suggestions en fonction du thème détecté
  const keywordLowerCase = keyword.toLowerCase();
  
  // Mots-clés liés au voyage
  if (keywordLowerCase.includes('voyage') || 
      keywordLowerCase.includes('tourisme') || 
      keywordLowerCase.includes('visiter') ||
      keywordLowerCase.includes('destination') ||
      keywordLowerCase.includes('vacances')) {
    suggestions = [
      { 
        keyword: `${keyword} insolite`, 
        volume: Math.floor(Math.random() * 500) + 500, 
        competition: 0.3, 
        cpc: 1.2 + Math.random() 
      },
      { 
        keyword: `meilleur ${keyword}`, 
        volume: Math.floor(Math.random() * 700) + 800, 
        competition: 0.5, 
        cpc: 1.8 + Math.random() 
      },
      { 
        keyword: `${keyword} pas cher`, 
        volume: Math.floor(Math.random() * 1000) + 1000, 
        competition: 0.6, 
        cpc: 2.0 + Math.random() 
      },
      { 
        keyword: `${keyword} famille`,
        volume: Math.floor(Math.random() * 600) + 400, 
        competition: 0.4, 
        cpc: 1.5 + Math.random() 
      },
      { 
        keyword: `conseils ${keyword}`,
        volume: Math.floor(Math.random() * 400) + 300, 
        competition: 0.2, 
        cpc: 1.0 + Math.random() 
      }
    ];
  } 
  // Mots-clés liés à l'aquariophilie
  else if (keywordLowerCase.includes('aquari') || 
           keywordLowerCase.includes('poisson') || 
           keywordLowerCase.includes('betta') ||
           keywordLowerCase.includes('aquatique')) {
    suggestions = [
      { 
        keyword: `entretien ${keyword}`, 
        volume: Math.floor(Math.random() * 400) + 300, 
        competition: 0.2, 
        cpc: 0.8 + Math.random() 
      },
      { 
        keyword: `${keyword} débutant`, 
        volume: Math.floor(Math.random() * 600) + 500, 
        competition: 0.3, 
        cpc: 0.9 + Math.random() 
      },
      { 
        keyword: `meilleur ${keyword}`, 
        volume: Math.floor(Math.random() * 300) + 200, 
        competition: 0.4, 
        cpc: 1.1 + Math.random() 
      },
      { 
        keyword: `${keyword} prix`,
        volume: Math.floor(Math.random() * 500) + 400, 
        competition: 0.5, 
        cpc: 1.3 + Math.random() 
      },
      { 
        keyword: `alimentation ${keyword}`,
        volume: Math.floor(Math.random() * 350) + 250, 
        competition: 0.2, 
        cpc: 0.7 + Math.random() 
      }
    ];
  }
  // Autres mots-clés plus génériques
  else {
    suggestions = [
      { 
        keyword: `${keyword} guide`, 
        volume: Math.floor(Math.random() * 600) + 500, 
        competition: 0.3, 
        cpc: 1.0 + Math.random() 
      },
      { 
        keyword: `meilleur ${keyword}`, 
        volume: Math.floor(Math.random() * 800) + 700, 
        competition: 0.5, 
        cpc: 1.5 + Math.random() 
      },
      { 
        keyword: `${keyword} comparatif`, 
        volume: Math.floor(Math.random() * 500) + 400, 
        competition: 0.4, 
        cpc: 1.2 + Math.random() 
      },
      { 
        keyword: `${keyword} tutoriel`,
        volume: Math.floor(Math.random() * 400) + 300, 
        competition: 0.2, 
        cpc: 0.8 + Math.random() 
      },
      { 
        keyword: `conseils ${keyword}`,
        volume: Math.floor(Math.random() * 300) + 200, 
        competition: 0.3, 
        cpc: 0.9 + Math.random() 
      }
    ];
  }
  
  // Ajouter des attributs manquants aux suggestions et enrichir avec des informations supplémentaires
  const enrichedSuggestions = suggestions.map(suggestion => ({
    ...suggestion,
    difficulty: Math.floor(Math.random() * 70) + 10,
    relevance: Math.floor(Math.random() * 30) + 70,
  }));
  
  // Générer aussi des questions liées au mot-clé
  const questions = generateQuestionKeywords(keyword).map(question => ({
    keyword: question,
    volume: Math.floor(Math.random() * 300) + 50,
    competition: Math.random() * 0.3,
    cpc: Math.random() * 0.5 + 0.2,
    difficulty: Math.floor(Math.random() * 50) + 10,
    relevance: Math.floor(Math.random() * 20) + 70,
    type: 'question' as 'question' | 'standard' | 'long-tail' | 'related'
  }));
  
  // Combiner suggestions et questions
  return [...enrichedSuggestions, ...questions.slice(0, 3)];
};

interface KeywordGeneratorProps {
  onGenerateClick?: () => void;
  fieldValue?: string;
  onInsert?: (value: string) => void;
  maxLength?: number;
  descriptionValue?: string;
  onInsertDescription?: (value: string) => void;
  maxLengthDescription?: number;
}

const KeywordGenerator: React.FC<KeywordGeneratorProps> = ({
  onGenerateClick,
  fieldValue = "",
  onInsert,
  maxLength = 60,
  descriptionValue = "",
  onInsertDescription,
  maxLengthDescription = 155
}) => {
  const [keyword, setKeyword] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [enrichedKeywords, setEnrichedKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordSuggestion | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [title, setTitle] = useState(fieldValue);
  const [description, setDescription] = useState(descriptionValue);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(fieldValue);
  }, [fieldValue]);

  useEffect(() => {
    setDescription(descriptionValue);
  }, [descriptionValue]);

  const handleGenerate = async () => {
    if (!keyword) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedKeywords([]);
    setEnrichedKeywords([]);
    setSelectedKeyword(null);

    // Simulate generating keywords
    const interval = setInterval(() => {
      setGenerationProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 10, 100);
        return newProgress;
      });
    }, 300);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    clearInterval(interval);
    setGenerationProgress(100);

    // Utiliser notre fonction pour générer des suggestions pertinentes
    const mockKeywords = generateKeywordSuggestions(keyword);
    setGeneratedKeywords(mockKeywords);
    
    // Enrichir les mots-clés avec des données supplémentaires
    const enriched = enrichKeywords(mockKeywords);
    setEnrichedKeywords(enriched);
    
    setIsGenerating(false);
    toast.success("Mots-clés générés avec succès!");
    
    if (onGenerateClick) {
      onGenerateClick();
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers!");
  };

  const handleInsertTitle = () => {
    if (onInsert) {
      onInsert(title);
      toast.success("Titre inséré avec succès!");
    }
  };

  const handleInsertDescription = () => {
    if (onInsertDescription) {
      onInsertDescription(description);
      toast.success("Description insérée avec succès!");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTitle(value);

    if (value.length > maxLength) {
      setTitleError(`Le titre ne doit pas dépasser ${maxLength} caractères.`);
    } else {
      setTitleError(null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);

    if (value.length > maxLengthDescription) {
      setDescriptionError(`La description ne doit pas dépasser ${maxLengthDescription} caractères.`);
    } else {
      setDescriptionError(null);
    }
  };
  
  const handleKeywordSelect = (kw: KeywordSuggestion) => {
    setSelectedKeyword(kw);
    setActiveTab("analysis");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Générateur de Mots-clés
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Analysez les mots-clés, leur difficulté et identifiez les meilleures opportunités
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowApiConfig(!showApiConfig)}
          >
            {showApiConfig ? "Masquer la configuration" : "Configuration API"}
          </Button>
        </div>

        {showApiConfig && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border">
            <h3 className="text-sm font-medium mb-2">Paramètres de connexion</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="apikey" className="text-xs">Clé API</Label>
                <Input
                  id="apikey"
                  type="password"
                  placeholder="Entrez votre clé API SEMrush ou SISTRIX"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500">
                En l'absence de clé API, des données simulées seront utilisées à des fins de démonstration.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="Mot-clé principal"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyser
              </>
            )}
          </Button>
        </div>

        {generationProgress > 0 && generationProgress < 100 && (
          <Progress 
            value={generationProgress} 
            className="h-2 mt-2"
          />
        )}
      </Card>

      {enrichedKeywords.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="suggestions" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1">
              <ChartLine className="h-4 w-4 mr-2" />
              Analyse
            </TabsTrigger>
            <TabsTrigger value="seo-content" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Contenu SEO
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Concurrence
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggestions" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Suggestions de mots-clés</h3>
              
              <div className="mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Mot-clé</span>
                    <div className="flex gap-8">
                      <span>Volume</span>
                      <span>Difficulté</span>
                      <span>CPC (€)</span>
                      <span>Opportunité</span>
                      <span></span>
                    </div>
                  </div>
                  <Separator />
                </div>
                
                <div className="space-y-2 mt-2">
                  {enrichedKeywords.map((kw, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleKeywordSelect(kw)}
                    >
                      <span className="font-medium">{kw.keyword}</span>
                      <div className="flex items-center gap-8">
                        <span className="text-gray-600 w-16 text-right">{kw.volume}</span>
                        <div className="w-20 flex items-center gap-1">
                          <Progress 
                            value={kw.difficulty} 
                            className="h-2" 
                            indicatorColor={
                              kw.difficulty! > 70 ? "bg-red-500" :
                              kw.difficulty! > 40 ? "bg-yellow-500" :
                              "bg-green-500"
                            }
                          />
                          <span className="text-xs text-gray-500">{kw.difficulty}</span>
                        </div>
                        <span className="text-gray-600 w-16 text-right">{kw.cpc?.toFixed(2)}</span>
                        <span className="w-20 text-right">
                          <Badge className={
                            kw.opportunity! > 70 ? "bg-green-100 text-green-800" :
                            kw.opportunity! > 40 ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }>
                            {kw.opportunity || calculateOpportunityScore(kw)}
                          </Badge>
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyToClipboard(kw.keyword);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Questions associées</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {generateQuestionKeywords(keyword).map((question, idx) => (
                    <div key={idx} className="border rounded-md p-2 text-sm">
                      {question}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-6">
            <div className="space-y-6">
              {selectedKeyword ? (
                <>
                  <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
                    <h3 className="text-xl font-semibold mb-1">{selectedKeyword.keyword}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        Volume: {selectedKeyword.volume}
                      </Badge>
                      <Badge className={
                        selectedKeyword.difficulty! > 70 ? "bg-red-100 text-red-800" :
                        selectedKeyword.difficulty! > 40 ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }>
                        Difficulté: {selectedKeyword.difficulty}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800">
                        CPC: {selectedKeyword.cpc?.toFixed(2)}€
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800">
                        Intent: {selectedKeyword.intent}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <KeywordTrendChart keyword={selectedKeyword.keyword} />
                    <SerpAnalysis keyword={selectedKeyword.keyword} serpData={selectedKeyword.serps} />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <KeywordOpportunityChart keywords={enrichedKeywords} />
                  <KeywordTrendChart keyword={keyword} />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="seo-content" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Titre SEO ({title ? title.length : 0}/{maxLength})</h3>
                <Textarea
                  placeholder="Entrez votre titre SEO"
                  value={title || ""}
                  onChange={handleTitleChange}
                  className="resize-none"
                  maxLength={maxLength}
                />
                {titleError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{titleError}</AlertDescription>
                  </Alert>
                )}
                <Button size="sm" onClick={handleInsertTitle} disabled={!title || !!titleError}>
                  Insérer le titre
                </Button>
                
                {enrichedKeywords.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Suggestions de titres</h4>
                    <div className="space-y-2">
                      {enrichedKeywords.slice(0, 3).map((kw, idx) => (
                        <div 
                          key={idx}
                          className="p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100"
                          onClick={() => setTitle(`Guide complet sur ${kw.keyword}: Conseils et astuces ${new Date().getFullYear()}`)}
                        >
                          Guide complet sur {kw.keyword}: Conseils et astuces {new Date().getFullYear()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
              
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Description SEO ({description ? description.length : 0}/{maxLengthDescription})</h3>
                <Textarea
                  placeholder="Entrez votre description SEO"
                  value={description || ""}
                  onChange={handleDescriptionChange}
                  className="resize-none"
                  maxLength={maxLengthDescription}
                />
                {descriptionError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{descriptionError}</AlertDescription>
                  </Alert>
                )}
                <Button size="sm" onClick={handleInsertDescription} disabled={!description || !!descriptionError}>
                  Insérer la description
                </Button>
                
                {enrichedKeywords.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Suggestions de descriptions</h4>
                    <div className="space-y-2">
                      {enrichedKeywords.slice(0, 2).map((kw, idx) => (
                        <div 
                          key={idx}
                          className="p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => setDescription(`Découvrez notre guide complet sur ${kw.keyword}. Conseils d'experts, comparatif des meilleures options et astuces pour optimiser vos résultats. Tout ce que vous devez savoir sur ${kw.keyword} en ${new Date().getFullYear()}.`)}
                        >
                          Découvrez notre guide complet sur {kw.keyword}. Conseils d'experts, comparatif des meilleures options et astuces pour optimiser vos résultats. Tout ce que vous devez savoir sur {kw.keyword} en {new Date().getFullYear()}.
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="competition" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CompetitorAnalysis keyword={keyword} />
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Stratégie de contenu recommandée</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pour vous positionner sur "{keyword}", nous recommandons de créer les contenus suivants:
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                    <h4 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      Page pilier
                    </h4>
                    <p className="text-sm mt-1">
                      Guide complet sur {keyword} (≥ 2000 mots)
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <h4 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Articles de cluster
                    </h4>
                    <ul className="text-sm mt-1 space-y-1">
                      {enrichedKeywords.slice(0, 3).map((kw, idx) => (
                        <li key={idx}>{kw.keyword} (≥ 1200 mots)</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                    <h4 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      Questions & Réponses
                    </h4>
                    <ul className="text-sm mt-1 space-y-1">
                      {generateQuestionKeywords(keyword).slice(0, 3).map((question, idx) => (
                        <li key={idx}>{question} (≥ 800 mots)</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Structure de maillage interne</h4>
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Recommandations de liens:</span>
                    </div>
                    <ul className="text-sm space-y-2">
                      <li>Toutes les pages cluster doivent pointer vers la page pilier</li>
                      <li>La page pilier doit contenir des liens vers toutes les pages cluster</li>
                      <li>Les pages Q&A doivent être liées depuis les articles pertinents</li>
                      <li>Ajouter des liens entre les pages cluster traitant de sujets connexes</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default KeywordGenerator;
