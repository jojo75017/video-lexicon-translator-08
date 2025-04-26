
import React, { useState, useEffect } from 'react';
import { KeywordSuggestion } from '@/types/seo';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OpenAIService } from '@/utils/seo/openaiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmojiTab from '@/components/seo/analysis/EmojiTab';
import HashtagsTab from '@/components/seo/analysis/HashtagsTab';
import { Card } from "@/components/ui/card";
import { generateBothDescriptions } from '@/utils/seo/generators/descriptionGenerator';

const KeywordTabContent = () => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [descriptionType, setDescriptionType] = useState<'short' | 'long'>('short');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');

  // Vérifier la clé API au chargement du composant
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = localStorage.getItem('openaiKey');
      if (!apiKey) {
        setApiKeyStatus('invalid');
        return;
      }

      try {
        const openAIService = new OpenAIService(apiKey);
        // Essayer de valider la clé API
        OpenAIService.enableProxy();
        const isValid = await openAIService.validateApiKey();
        setApiKeyStatus(isValid ? 'valid' : 'invalid');
        
        if (!isValid) {
          toast.warning("Clé API potentiellement invalide", {
            description: "La validation de votre clé API a échoué"
          });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la clé API:", error);
        toast.error("Erreur de connexion", {
          description: "Impossible de vérifier votre clé API. Vérifiez votre connexion Internet."
        });
      }
    };
    
    checkApiKey();
  }, []);

  const handleGenerateKeywords = async () => {
    if (!keyword) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = localStorage.getItem('openaiKey');
      if (!apiKey) {
        toast.error("Clé API OpenAI manquante", {
          description: "Veuillez configurer votre clé API dans les paramètres"
        });
        setIsLoading(false);
        return;
      }

      // S'assurer que le proxy est activé
      OpenAIService.enableProxy();
      
      const openAIService = new OpenAIService(apiKey);

      // Utiliser une méthode pour générer des données de démonstration en cas d'échec
      let results;
      try {
        results = await openAIService.getKeywordSuggestions(keyword);
        console.log("Suggestions générées avec l'API:", results);
      } catch (error) {
        console.error("Erreur API, génération de données de démonstration:", error);
        // Générer des données de démonstration
        results = generateDemoKeywords(keyword);
        toast.warning("Mode démonstration activé", {
          description: "Connexion à l'API impossible. Utilisation de données de démonstration."
        });
      }

      // Assurons-nous que chaque suggestion a des descriptions courtes et longues
      const enhancedResults = results.map(kw => {
        if (!kw.suggestedShortDescription || !kw.suggestedLongDescription) {
          const descriptions = generateBothDescriptions(kw.keyword);
          return {
            ...kw,
            suggestedShortDescription: kw.suggestedShortDescription || descriptions.short,
            suggestedLongDescription: kw.suggestedLongDescription || descriptions.long
          };
        }
        return kw;
      });
      
      setSuggestions(enhancedResults);
      toast.success("Suggestions générées avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast.error("Erreur de génération", {
        description: "Impossible de générer des suggestions pour ce mot-clé. Vérifiez votre clé API et votre connexion."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour générer des données de démonstration
  const generateDemoKeywords = (keyword: string): KeywordSuggestion[] => {
    const baseKeyword = keyword.toLowerCase();
    return [
      {
        keyword: baseKeyword,
        searchVolume: 5200,
        difficulty: 67,
        suggestedTitle: `Guide ultime ${baseKeyword} : Les secrets des experts | 2024`,
        suggestedDescription: `Découvrez tout sur ${baseKeyword}. Conseils d'experts, astuces pratiques et stratégies éprouvées pour maîtriser ${baseKeyword} en 2024.`,
        suggestedShortDescription: `Guide complet sur ${baseKeyword} avec conseils d'experts et stratégies éprouvées.`,
        suggestedLongDescription: `Explorez notre guide approfondi sur ${baseKeyword}. Des conseils d'experts aux astuces pratiques, découvrez comment maîtriser ${baseKeyword} efficacement et obtenir des résultats tangibles en 2024. Nous avons rassemblé les meilleures techniques et tactiques utilisées par les professionnels du secteur pour vous aider à progresser rapidement et à atteindre vos objectifs avec ${baseKeyword}. Que vous soyez débutant ou que vous souhaitiez perfectionner vos compétences, vous trouverez des informations précieuses adaptées à votre niveau et à vos besoins spécifiques.`,
        relevance: 95,
        competition: 0.78,
        cpc: 2.34,
        volume: 5200
      },
      {
        keyword: `meilleur ${baseKeyword}`,
        searchVolume: 3800,
        difficulty: 58,
        suggestedTitle: `Top 10 des meilleurs ${baseKeyword} | Comparatif complet`,
        suggestedDescription: `Notre classement des meilleurs ${baseKeyword} en 2024. Comparatif détaillé, avantages et inconvénients pour choisir en toute connaissance.`,
        suggestedShortDescription: `Comparatif détaillé des 10 meilleurs ${baseKeyword} en 2024.`,
        suggestedLongDescription: `Explorez notre sélection rigoureuse des 10 meilleurs ${baseKeyword} disponibles aujourd'hui. Analysez les avantages, inconvénients et fonctionnalités clés pour faire un choix éclairé selon vos besoins spécifiques. Notre équipe d'experts a testé et évalué chaque option selon des critères précis comme la qualité, la durabilité, le rapport qualité-prix et la satisfaction des utilisateurs. Ce guide complet vous accompagne étape par étape dans votre processus de décision, avec des conseils personnalisés pour identifier la solution qui correspond parfaitement à vos exigences particulières.`,
        relevance: 88,
        competition: 0.82,
        cpc: 3.12,
        volume: 3800
      },
      {
        keyword: `${baseKeyword} pas cher`,
        searchVolume: 2900,
        difficulty: 45,
        suggestedTitle: `${baseKeyword} pas cher : Guide d'achat pour petits budgets 2024`,
        suggestedDescription: `Comment trouver des ${baseKeyword} abordables sans compromettre la qualité ? Bons plans, conseils d'achat et options économiques pour tous les budgets.`,
        suggestedShortDescription: `Guide d'achat ${baseKeyword} pour petits budgets avec bons plans.`,
        suggestedLongDescription: `Économisez sans compromis avec notre guide des ${baseKeyword} abordables. Découvrez où et comment trouver des options de qualité à prix réduits, les périodes idéales pour acheter, et nos astuces pour maximiser votre investissement. Nous révélons les secrets des professionnels pour identifier les véritables bonnes affaires et éviter les pièges des fausses promotions. Apprenez à reconnaître les caractéristiques essentielles à préserver même à petit prix et celles sur lesquelles vous pouvez faire des concessions sans impact majeur sur la qualité globale. Des alternatives économiques aux modèles premium sont analysées en détail.`,
        relevance: 82,
        competition: 0.65,
        cpc: 1.88,
        volume: 2900
      },
      {
        keyword: `comment choisir ${baseKeyword}`,
        searchVolume: 2200,
        difficulty: 42,
        suggestedTitle: `Comment choisir le bon ${baseKeyword} ? Guide pratique 2024`,
        suggestedDescription: `Les critères essentiels pour bien choisir votre ${baseKeyword}. Méthodologie pas à pas, erreurs à éviter et conseils personnalisés selon vos besoins.`,
        suggestedShortDescription: `Guide complet pour choisir le ${baseKeyword} idéal selon vos besoins.`,
        suggestedLongDescription: `Apprenez à sélectionner le ${baseKeyword} parfait pour vos besoins spécifiques. Notre guide détaille les caractéristiques techniques à considérer, propose une méthode d'évaluation en 5 étapes et vous aide à éviter les pièges courants lors de votre achat. Découvrez comment identifier vos priorités personnelles et comment les traduire en critères de sélection concrets. Nos experts partagent leur méthodologie éprouvée pour comparer objectivement différentes options disponibles sur le marché, en tenant compte de facteurs comme la qualité de fabrication, la durabilité, les fonctionnalités innovantes et le service après-vente. Des témoignages d'utilisateurs complètent cette analyse.`,
        relevance: 79,
        competition: 0.58,
        cpc: 1.65,
        volume: 2200
      },
      {
        keyword: `${baseKeyword} avis`,
        searchVolume: 4100,
        difficulty: 51,
        suggestedTitle: `Avis ${baseKeyword} : Ce qu'en pensent vraiment les utilisateurs`,
        suggestedDescription: `Découvrez les avis authentiques sur ${baseKeyword}. Témoignages d'utilisateurs, tests indépendants et analyse objective des avantages et inconvénients.`,
        suggestedShortDescription: `Avis et témoignages objectifs sur ${baseKeyword} par des utilisateurs réels.`,
        suggestedLongDescription: `Plongez dans notre analyse complète des avis sur ${baseKeyword}. Nous avons recueilli et synthétisé les retours de centaines d'utilisateurs, de tests professionnels et d'évaluations à long terme pour vous offrir une vision réelle et impartiale des performances et de la satisfaction. Notre équipe a analysé méticuleusement les tendances communes dans les retours clients pour identifier les véritables forces et faiblesses de chaque option. Découvrez comment ces produits ou services se comportent dans des conditions réelles d'utilisation quotidienne, au-delà des promesses marketing. Les évaluations sont segmentées par profils d'utilisateurs pour vous aider à trouver des avis pertinents pour votre situation spécifique.`,
        relevance: 86,
        competition: 0.72,
        cpc: 2.05,
        volume: 4100
      }
    ];
  };

  const handleInsertTitle = (value: string) => {
    setTitle(value);
    toast.success("Titre inséré");
  };

  const handleInsertDescription = (value: string) => {
    if (descriptionType === 'short') {
      setShortDescription(value);
      toast.success("Description courte insérée");
    } else {
      setLongDescription(value);
      toast.success("Description longue insérée");
    }
  };

  const handleSwitchDescriptionType = (type: 'short' | 'long') => {
    setDescriptionType(type);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Entrez votre mot-clé principal"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleGenerateKeywords}
          disabled={isLoading}
        >
          {isLoading ? "Génération..." : "Générer"}
        </Button>
      </div>

      {apiKeyStatus === 'invalid' && (
        <Card className="p-4 border-yellow-300 bg-yellow-50">
          <p className="text-sm text-yellow-800">
            Aucune clé API OpenAI valide détectée. Veuillez configurer votre clé dans les paramètres pour des résultats optimaux.
          </p>
        </Card>
      )}

      {suggestions.length > 0 && (
        <>
          <KeywordSuggestions
            generatedKeywords={suggestions}
            onGenerateClick={handleGenerateKeywords}
            fieldValue={title}
            onInsert={handleInsertTitle}
            maxLength={60}
            descriptionValue={descriptionType === 'short' ? shortDescription : longDescription}
            onInsertDescription={handleInsertDescription}
            maxLengthDescription={descriptionType === 'short' ? 155 : 500}
            descriptionType={descriptionType}
          />

          <Card className="p-6 shadow-sm border-t-4 border-t-blue-500">
            <h3 className="text-lg font-medium mb-4">Optimisez votre contenu</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Titre SEO ({title.length}/60)
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
                className={`${title.length > 55 ? 'border-yellow-400' : title.length > 45 ? 'border-green-400' : 'border-gray-300'}`}
              />
            </div>
            
            <Tabs defaultValue="short" onValueChange={(value) => handleSwitchDescriptionType(value as 'short' | 'long')}>
              <TabsList className="mb-2">
                <TabsTrigger value="short">Description courte</TabsTrigger>
                <TabsTrigger value="long">Description longue</TabsTrigger>
              </TabsList>
              
              <TabsContent value="short">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Description courte ({shortDescription.length}/155)
                  </label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    maxLength={155}
                    rows={3}
                    className={`w-full p-2 border rounded-md ${shortDescription.length > 145 ? 'border-yellow-400' : shortDescription.length > 120 ? 'border-green-400' : 'border-gray-300'}`}
                  ></textarea>
                </div>
              </TabsContent>
              
              <TabsContent value="long">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Description longue ({longDescription.length}/500)
                  </label>
                  <textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    maxLength={500}
                    rows={6}
                    className={`w-full p-2 border rounded-md ${longDescription.length > 480 ? 'border-yellow-400' : longDescription.length > 400 ? 'border-green-400' : 'border-gray-300'}`}
                  ></textarea>
                </div>
              </TabsContent>
            </Tabs>
            
            <Tabs defaultValue="emoji" className="mt-6">
              <TabsList className="mb-2">
                <TabsTrigger value="emoji">Emojis</TabsTrigger>
                <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              </TabsList>
              
              <TabsContent value="emoji">
                <EmojiTab 
                  fieldValue={title} 
                  onInsert={handleInsertTitle}
                  maxLength={60}
                />
              </TabsContent>
              
              <TabsContent value="hashtags">
                <HashtagsTab 
                  fieldValue={descriptionType === 'short' ? shortDescription : longDescription} 
                  onInsert={handleInsertDescription}
                  maxLength={descriptionType === 'short' ? 155 : 500}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </>
      )}
    </div>
  );
};

export default KeywordTabContent;
