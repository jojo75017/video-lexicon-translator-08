
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, RefreshCw, FileText, AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import { OpenAIService } from '@/utils/seo/openaiService';
import { KeywordSuggestion } from '@/types/seo';

const KeywordTabContent = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<string>('title');
  const maxTitleLength = 60;
  const maxDescriptionLength = 155;

  const generateSuggestions = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez saisir un mot-clé");
      return;
    }

    setIsGenerating(true);

    try {
      // Vérifier si une clé API est disponible
      const hasApiKey = localStorage.getItem('openaiKey');
      
      if (!hasApiKey) {
        toast.warning("Clé API non configurée", {
          description: "Les suggestions seront limitées. Configurez une clé API pour de meilleurs résultats."
        });
      }

      // Activer le proxy CORS
      OpenAIService.enableProxy();

      // Simuler un délai pour démonstration
      setTimeout(() => {
        // Génération de suggestions fictives pour la démo
        const mockSuggestions: KeywordSuggestion[] = [
          {
            keyword: keyword,
            searchVolume: Math.floor(Math.random() * 5000) + 1000,
            difficulty: Math.floor(Math.random() * 100),
            cpc: Math.random() * 5,
            competition: Math.random(),
            relevance: 90,
            suggestedTitle: `${keyword} - Guide Complet et Conseils | Expert 2024`,
            suggestedDescription: `Découvrez tout ce que vous devez savoir sur ${keyword}. Guides pratiques, conseils d'experts et stratégies éprouvées pour optimiser vos résultats.`,
            suggestedShortDescription: `Guide complet sur ${keyword}: conseils pratiques et stratégies d'experts pour 2024.`,
            suggestedLongDescription: `Plongez dans notre guide détaillé sur ${keyword} et découvrez les meilleures pratiques recommandées par les experts du domaine. Que vous soyez débutant ou expérimenté, nos conseils pratiques, astuces et stratégies éprouvées vous aideront à améliorer significativement vos résultats. Mis à jour pour 2024 avec les dernières tendances et innovations dans le domaine.`
          },
          {
            keyword: `${keyword} en ligne`,
            searchVolume: Math.floor(Math.random() * 3000) + 500,
            difficulty: Math.floor(Math.random() * 100),
            cpc: Math.random() * 4,
            competition: Math.random(),
            relevance: 75,
            suggestedTitle: `${keyword} en ligne - Solutions et Stratégies | Guide 2024`,
            suggestedDescription: `Optimisez votre approche de ${keyword} en ligne avec notre guide complet. Découvrez les stratégies qui fonctionnent réellement en 2024.`,
            suggestedShortDescription: `Stratégies efficaces pour ${keyword} en ligne. Guide complet mis à jour pour 2024.`,
            suggestedLongDescription: `Notre guide complet sur ${keyword} en ligne vous présente les stratégies les plus efficaces pour maximiser vos résultats dans l'environnement numérique actuel. Apprenez comment adapter vos techniques aux plateformes en ligne, éviter les pièges courants et exploiter les opportunités uniques qu'offre Internet. Basé sur des études de cas réels et mis à jour pour 2024.`
          },
          {
            keyword: `meilleur ${keyword}`,
            searchVolume: Math.floor(Math.random() * 2000) + 300,
            difficulty: Math.floor(Math.random() * 100),
            cpc: Math.random() * 6,
            competition: Math.random(),
            relevance: 85,
            suggestedTitle: `Meilleur ${keyword} - Comparatif Complet | Choix 2024`,
            suggestedDescription: `Comment choisir le meilleur ${keyword}? Notre comparatif analyse les options disponibles et vous guide vers le choix idéal pour vos besoins.`,
            suggestedShortDescription: `Comparatif des meilleurs ${keyword} en 2024. Critères, analyses et recommandations d'experts.`,
            suggestedLongDescription: `Comment identifier le meilleur ${keyword} parmi toutes les options disponibles sur le marché? Notre comparatif détaillé examine les caractéristiques essentielles, les avantages et les inconvénients de chaque option. Nous avons testé et analysé les produits/services/méthodes les plus populaires pour vous offrir des recommandations impartiales basées sur différents critères: rapport qualité-prix, efficacité, facilité d'utilisation et durabilité.`
          }
        ];

        setGeneratedKeywords(mockSuggestions);
        setTitle(mockSuggestions[0].suggestedTitle || '');
        setDescription(mockSuggestions[0].suggestedDescription || '');
        setIsGenerating(false);

        toast.success("Suggestions générées", {
          description: "Découvrez les titres et descriptions optimisés pour votre mot-clé"
        });
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions:", error);
      setIsGenerating(false);
      toast.error("Erreur de génération", {
        description: "Un problème est survenu. Veuillez réessayer plus tard."
      });
    }
  };

  const handleGenerateMore = () => {
    generateSuggestions();
  };

  const handleInsertTitle = (newTitle: string) => {
    setTitle(newTitle);
    setActiveTab('title');
  };

  const handleInsertDescription = (newDescription: string) => {
    setDescription(newDescription);
    setActiveTab('description');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Générateur de Title & Meta Description
          </h2>
          
          <div className="flex flex-wrap gap-4 mb-2">
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium mb-1">Mot-clé principal</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Entrez votre mot-clé cible"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-1"
                  disabled={isGenerating}
                />
                <Button 
                  onClick={generateSuggestions} 
                  disabled={isGenerating || !keyword.trim()} 
                  className="whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Générer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList>
              <TabsTrigger value="title">Title Tag</TabsTrigger>
              <TabsTrigger value="description">Meta Description</TabsTrigger>
            </TabsList>
            
            <TabsContent value="title" className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium">Title Tag</label>
                  <span className={`text-xs ${
                    title.length > maxTitleLength ? 'text-red-500' : 
                    title.length > maxTitleLength - 10 ? 'text-amber-500' : 'text-gray-500'
                  }`}>
                    {title.length}/{maxTitleLength}
                  </span>
                </div>
                <Textarea 
                  placeholder="Title tag de votre page. Idéalement entre 50 et 60 caractères."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`font-medium ${
                    title.length > maxTitleLength ? 'border-red-300 focus:ring-red-500' : ''
                  }`}
                  rows={2}
                />
                {title.length > maxTitleLength && (
                  <p className="text-xs text-red-500 mt-1">
                    Le titre dépasse la limite recommandée de {maxTitleLength} caractères.
                  </p>
                )}
              </div>
              
              {!keyword.trim() && !title && (
                <Alert className="bg-blue-50 border-blue-100">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Entrez un mot-clé et cliquez sur "Générer" pour obtenir des suggestions de titres optimisés.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="description" className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium">Meta Description</label>
                  <span className={`text-xs ${
                    description.length > maxDescriptionLength ? 'text-red-500' : 
                    description.length > maxDescriptionLength - 20 ? 'text-amber-500' : 'text-gray-500'
                  }`}>
                    {description.length}/{maxDescriptionLength}
                  </span>
                </div>
                <Textarea 
                  placeholder="Meta description de votre page. Idéalement entre 120 et 155 caractères."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${
                    description.length > maxDescriptionLength ? 'border-red-300 focus:ring-red-500' : ''
                  }`}
                  rows={3}
                />
                {description.length > maxDescriptionLength && (
                  <p className="text-xs text-red-500 mt-1">
                    La description dépasse la limite recommandée de {maxDescriptionLength} caractères.
                  </p>
                )}
              </div>

              {!keyword.trim() && !description && (
                <Alert className="bg-blue-50 border-blue-100">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Entrez un mot-clé et cliquez sur "Générer" pour obtenir des suggestions de descriptions optimisées.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {generatedKeywords.length > 0 && (
        <KeywordSuggestions 
          generatedKeywords={generatedKeywords}
          onGenerateClick={handleGenerateMore}
          fieldValue={activeTab === 'title' ? title : description}
          onInsert={activeTab === 'title' ? handleInsertTitle : handleInsertDescription}
          maxLength={activeTab === 'title' ? maxTitleLength : maxDescriptionLength}
          descriptionValue={description}
          onInsertDescription={handleInsertDescription}
          maxLengthDescription={maxDescriptionLength}
        />
      )}

      {keyword && !generatedKeywords.length && !isGenerating && (
        <Card className="p-6 border-dashed border-2 text-center">
          <Button 
            onClick={generateSuggestions}
            variant="outline"
            className="mx-auto flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Générer des suggestions pour "{keyword}"
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>
      )}
    </div>
  );
};

export default KeywordTabContent;
