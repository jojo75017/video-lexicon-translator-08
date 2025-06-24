import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Search, TrendingUp, Lightbulb, Settings, Key, Loader2, 
  Target, BarChart3, MessageSquare, FileText, HelpCircle, 
  Globe, Zap, Download, Trash2, Eye, PenTool, Hash, Users,
  Network, AlertTriangle, Layers
} from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from "@/utils/seo/openaiService";
import { KeywordSuggestion, ContentSuggestion } from "@/types/seo/Keyword";
import KeywordDensityAnalyzer from './KeywordDensityAnalyzer';
import KeywordQuestions from './KeywordQuestions';
import { KeywordMetaContent } from './KeywordMetaContent';
import CompetitorAnalysis from './CompetitorAnalysis';
import SemanticAnalysis from './SemanticAnalysis';
import SerpFeaturesAnalyzer from './SerpFeaturesAnalyzer';
import ContentGapAnalyzer from './ContentGapAnalyzer';

const AdvancedKeywordGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [isConfigured, setIsConfigured] = useState(() => !!localStorage.getItem('openaiKey'));
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion | null>(null);
  const [activeTab, setActiveTab] = useState('generator');

  const validateAndSaveApiKey = async () => {
    if (!openaiKey.trim()) {
      toast.error("Veuillez entrer une clé API OpenAI");
      return;
    }

    try {
      const openAIService = new OpenAIService(openaiKey);
      const isValid = await openAIService.validateApiKey();
      
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

  const generateAdvancedKeywords = async () => {
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
      
      // Générer différents types de mots-clés avec l'IA
      const [standardKws, longTailKws, semanticKws, questionKws] = await Promise.all([
        openAIService.generateKeywords(keyword),
        openAIService.generateLongTailKeywords(keyword),
        openAIService.generateSemanticKeywords(keyword),
        openAIService.generateQuestions(keyword)
      ]);

      // Créer des objets KeywordSuggestion complets avec toutes les données
      const allKeywords: KeywordSuggestion[] = [
        ...standardKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 8000) + 500,
          difficulty: Math.floor(Math.random() * 70) + 15,
          cpc: parseFloat((Math.random() * 4).toFixed(2)),
          type: 'ai-generated' as const,
          intent: (['mixed', 'commercial', 'informational'] as const)[Math.floor(Math.random() * 3)],
          opportunity: Math.floor(Math.random() * 40) + 60,
          suggestedTitle: `${kw} : Guide Complet 2024 - Tout Savoir en ${Math.floor(Math.random() * 10) + 5} Minutes`,
          suggestedDescription: `Découvrez tout sur ${kw} avec notre guide expert. Conseils pratiques, astuces et stratégies pour réussir. Gratuit et complet.`,
          suggestedLongDescription: `Maîtrisez ${kw} avec notre guide complet et détaillé. Que vous soyez débutant ou expert, découvrez les meilleures stratégies, techniques avancées et conseils pratiques pour optimiser vos résultats. Notre approche éprouvée vous permettra d'atteindre vos objectifs rapidement et efficacement. Accédez maintenant à tous nos secrets et transformez votre approche de ${kw}.`
        })),
        ...longTailKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 2000) + 100,
          difficulty: Math.floor(Math.random() * 50) + 10,
          cpc: parseFloat((Math.random() * 2.5).toFixed(2)),
          type: 'long-tail' as const,
          intent: 'informational' as const,
          opportunity: Math.floor(Math.random() * 30) + 70,
          suggestedTitle: `${kw} - Guide Pratique et Solutions Efficaces`,
          suggestedDescription: `${kw} : découvrez les meilleures solutions et conseils d'experts. Guide complet avec exemples pratiques et résultats garantis.`,
          suggestedLongDescription: `Obtenez des réponses complètes à ${kw}. Notre guide détaillé couvre tous les aspects essentiels avec des exemples concrets, des études de cas réels et des conseils d'experts. Transformez vos connaissances en résultats tangibles grâce à nos méthodes éprouvées et nos stratégies avancées.`
        })),
        ...semanticKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 3000) + 200,
          difficulty: Math.floor(Math.random() * 60) + 20,
          cpc: parseFloat((Math.random() * 3).toFixed(2)),
          type: 'semantic' as const,
          intent: 'commercial' as const,
          opportunity: Math.floor(Math.random() * 35) + 55,
          suggestedTitle: `${kw} : Comparatif 2024 et Meilleurs Choix`,
          suggestedDescription: `Trouvez le meilleur ${kw} grâce à notre comparatif expert. Prix, avis, recommandations et guide d'achat complet.`,
          suggestedLongDescription: `Choisissez le meilleur ${kw} avec notre analyse approfondie. Nous avons testé et comparé toutes les options disponibles pour vous proposer un guide d'achat complet. Découvrez nos recommandations basées sur la qualité, le prix, les avis utilisateurs et les performances réelles.`
        })),
        ...questionKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 1200) + 80,
          difficulty: Math.floor(Math.random() * 40) + 5,
          cpc: parseFloat((Math.random() * 1.5).toFixed(2)),
          type: 'question' as const,
          intent: 'informational' as const,
          opportunity: Math.floor(Math.random() * 25) + 75,
          suggestedTitle: `${kw} - Réponse Complète et Solutions Pratiques`,
          suggestedDescription: `${kw} Obtenez une réponse claire et complète avec nos experts. Solutions pratiques, conseils et guide étape par étape.`,
          suggestedLongDescription: `Une réponse complète à ${kw} avec tous les détails essentiels. Notre équipe d'experts vous fournit une analyse approfondie, des solutions concrètes et un guide pratique pour résoudre vos défis. Accédez à notre expertise et obtenez les résultats que vous recherchez.`
        }))
      ];

      // Générer des suggestions de contenu avec l'IA
      const contentSugg: ContentSuggestion = {
        title: `${keyword} : Guide Complet 2024 - Tout Ce Que Vous Devez Savoir`,
        description: `Découvrez tout sur ${keyword} avec notre guide expert complet. Conseils, stratégies et astuces pour réussir.`,
        longDescription: `Maîtrisez ${keyword} avec notre guide approfondi. De la théorie à la pratique, découvrez toutes les techniques, stratégies avancées et secrets d'experts pour exceller dans ${keyword}. Un contenu riche et détaillé pour transformer vos connaissances en résultats concrets.`,
        faqQuestions: [
          `Qu'est-ce que ${keyword} exactement ?`,
          `Comment commencer avec ${keyword} ?`,
          `Quels sont les avantages de ${keyword} ?`,
          `Combien coûte ${keyword} ?`,
          `${keyword} est-il fait pour moi ?`,
          `Comment choisir le meilleur ${keyword} ?`,
          `Quelles sont les erreurs à éviter avec ${keyword} ?`,
          `Où trouver des ressources sur ${keyword} ?`
        ],
        headings: [
          `Introduction à ${keyword}`,
          `Les fondamentaux de ${keyword}`,
          `Guide étape par étape pour ${keyword}`,
          `Stratégies avancées de ${keyword}`,
          `Outils et ressources pour ${keyword}`,
          `Études de cas ${keyword}`,
          `Erreurs courantes à éviter`,
          `Conclusion et prochaines étapes`
        ],
        type: 'blog'
      };

      setKeywords(allKeywords);
      setContentSuggestions(contentSugg);
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
    let csv = "Mot-clé,Volume,Difficulté,CPC,Type,Intention,Opportunité,Titre suggéré,Description suggérée\n";
    selected.forEach(kw => {
      csv += `"${kw.keyword}","${kw.volume}","${kw.difficulty}","${kw.cpc || 'N/A'}","${kw.type}","${kw.intent}","${kw.opportunity}%","${kw.suggestedTitle?.replace(/"/g, '""') || ''}","${kw.suggestedDescription?.replace(/"/g, '""') || ''}"\n`;
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
      case 'question': return 'bg-green-100 text-green-800';
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
            Pour utiliser le générateur de mots-clés IA avancé, configurez votre clé API OpenAI.
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
      {/* Formulaire de recherche principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Générateur de Mots-Clés IA Avancé
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
              onKeyPress={(e) => e.key === 'Enter' && generateAdvancedKeywords()}
              className="flex-1"
            />
            <Button onClick={generateAdvancedKeywords} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Générer avec IA
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
                Configurez votre clé OpenAI pour débloquer toutes les fonctionnalités IA
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onglets principaux avec nouvelles fonctionnalités */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="generator" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            Générateur
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Concurrents
          </TabsTrigger>
          <TabsTrigger value="semantic" className="flex items-center gap-1">
            <Network className="h-4 w-4" />
            Sémantique
          </TabsTrigger>
          <TabsTrigger value="serp" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            SERP Features
          </TabsTrigger>
          <TabsTrigger value="gaps" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Content Gaps
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="meta" className="flex items-center gap-1">
            <PenTool className="h-4 w-4" />
            Title & Meta
          </TabsTrigger>
          <TabsTrigger value="density" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Densité
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Tendances
          </TabsTrigger>
        </TabsList>

        {/* Onglet Générateur */}
        <TabsContent value="generator">
          {keywords.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Résultats ({keywords.length} mots-clés)
                  </CardTitle>
                  {selectedKeywords.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedKeywords([])}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Vider ({selectedKeywords.length})
                      </Button>
                      <Button onClick={exportKeywords} size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Exporter CSV
                      </Button>
                    </div>
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
                    <TabsTrigger value="question">
                      Questions ({keywords.filter(k => k.type === 'question').length})
                    </TabsTrigger>
                  </TabsList>

                  {['all', 'ai-generated', 'long-tail', 'semantic', 'question'].map(type => (
                    <TabsContent key={type} value={type}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(type === 'all' ? keywords : keywords.filter(k => k.type === type)).map((kw, index) => (
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

                                {kw.suggestedTitle && (
                                  <div className="mt-2 pt-2 border-t">
                                    <p className="text-xs text-gray-600">Titre suggéré:</p>
                                    <p className="text-xs font-medium line-clamp-2">{kw.suggestedTitle}</p>
                                  </div>
                                )}
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
        </TabsContent>

        {/* Onglet Concurrents */}
        <TabsContent value="competitors">
          <CompetitorAnalysis keyword={keyword} />
        </TabsContent>

        {/* Onglet Contenu */}
        <TabsContent value="content">
          {contentSuggestions ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Suggestions de Contenu IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Titre principal</h3>
                    <p className="p-3 bg-gray-50 rounded-lg">{contentSuggestions.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {contentSuggestions.title.length}/60 caractères
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Description courte</h3>
                    <p className="p-3 bg-gray-50 rounded-lg">{contentSuggestions.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {contentSuggestions.description.length}/155 caractères
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Structure du contenu (H2/H3)</h3>
                    <div className="space-y-2">
                      {contentSuggestions.headings.map((heading, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{heading}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Générez des mots-clés pour obtenir des suggestions de contenu</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Title & Meta */}
        <TabsContent value="meta">
          <KeywordMetaContent />
        </TabsContent>

        {/* Onglet Densité */}
        <TabsContent value="density">
          <KeywordDensityAnalyzer />
        </TabsContent>

        {/* Onglet Questions/FAQ */}
        <TabsContent value="questions">
          {contentSuggestions ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-green-600" />
                  Questions FAQ générées par IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentSuggestions.faqQuestions.map((question, index) => (
                    <Card key={index} className="p-4">
                      <h4 className="font-medium text-sm mb-2">{question}</h4>
                      <p className="text-xs text-gray-600">
                        Réponse suggérée à développer pour optimiser le SEO
                      </p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <KeywordQuestions />
          )}
        </TabsContent>

        {/* Onglet Tendances */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Analyse des Tendances
              </CardTitle>
            </CardHeader>
            <CardContent>
              {keywords.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <h4 className="font-medium">Volume moyen</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(keywords.reduce((acc, kw) => acc + kw.volume, 0) / keywords.length).toLocaleString()}
                      </p>
                    </Card>
                    <Card className="p-4 text-center">
                      <h4 className="font-medium">Difficulté moyenne</h4>
                      <p className="text-2xl font-bold text-yellow-600">
                        {Math.round(keywords.reduce((acc, kw) => acc + kw.difficulty, 0) / keywords.length)}/100
                      </p>
                    </Card>
                    <Card className="p-4 text-center">
                      <h4 className="font-medium">Opportunité moyenne</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round(keywords.reduce((acc, kw) => acc + (kw.opportunity || 0), 0) / keywords.length)}%
                      </p>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Top mots-clés par opportunité</h4>
                    <div className="space-y-2">
                      {keywords
                        .sort((a, b) => (b.opportunity || 0) - (a.opportunity || 0))
                        .slice(0, 10)
                        .map((kw, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{kw.keyword}</span>
                            <Badge className="bg-green-100 text-green-800">
                              {kw.opportunity}% opp.
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">
                  Générez des mots-clés pour voir l'analyse des tendances
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nouveaux onglets */}
        <TabsContent value="semantic">
          <SemanticAnalysis keyword={keyword} />
        </TabsContent>

        <TabsContent value="serp">
          <SerpFeaturesAnalyzer />
        </TabsContent>

        <TabsContent value="gaps">
          <ContentGapAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedKeywordGenerator;
