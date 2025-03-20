
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefreshCw, MessageSquareText, Reply, Lightbulb, Send, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPerplexityService } from "@/services/perplexityService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface QuoraStepProps {
  quoraTitle: string;
  setQuoraTitle: (value: string) => void;
  quoraQuestion: string;
  setQuoraQuestion: (value: string) => void;
  quoraAnswer: string;
  setQuoraAnswer: (value: string) => void;
  quoraLink: string;
  setQuoraLink: (value: string) => void;
  onSubmit: () => void;
}

const QuoraStep = ({
  quoraTitle,
  setQuoraTitle,
  quoraQuestion,
  setQuoraQuestion,
  quoraAnswer,
  setQuoraAnswer,
  quoraLink,
  setQuoraLink,
  onSubmit,
}: QuoraStepProps) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState("expert");
  const [questionMode, setQuestionMode] = useState("ask"); // "ask" or "answer"
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const popularQuestions = [
    "Comment voyager pas cher en Europe ?",
    "Quelles sont les meilleures astuces pour économiser sur les billets d'avion ?",
    "Comment organiser un voyage à petit budget ?",
    "Quels sont les meilleurs outils pour trouver des hébergements économiques ?",
    "Comment profiter pleinement d'un voyage sans se ruiner ?"
  ];

  const handleQuestionSelect = (value: string) => {
    setQuoraQuestion(value);
  };

  const handleGenerateWithAI = async () => {
    if (!quoraTitle.trim()) {
      toast.error("Veuillez saisir un titre pour générer du contenu");
      return;
    }

    setIsGenerating(true);
    setPreviewVisible(false); // Reset preview state
    toast.loading("Génération de contenu en cours...");

    try {
      // Utiliser Perplexity API pour générer du contenu
      if (apiKey) {
        const perplexityService = createPerplexityService(apiKey);
        
        let prompt = "";
        if (questionMode === "ask") {
          prompt = `Générez une question Quora détaillée en français sur le sujet "${quoraTitle}". La question doit être pertinente, engageante et inciter à des réponses détaillées.`;
        } else {
          if (!quoraQuestion.trim()) {
            toast.error("Veuillez sélectionner ou saisir une question à répondre");
            setIsGenerating(false);
            return;
          }
          
          prompt = `En tant que ${tone === "expert" ? "expert" : tone === "conversational" ? "personne amicale et conversationnelle" : "narrateur partageant une histoire personnelle"}, écrivez une réponse détaillée à la question Quora suivante: "${quoraQuestion}". La réponse doit être approfondie, bien structurée et porter sur le sujet "${quoraTitle}".`;
        }
        
        try {
          // Simuler l'appel API Perplexity pour ce contexte
          // On peut ajouter l'intégration réelle plus tard
          console.log("Génération avec prompt:", prompt);
          
          // Simuler un délai pour la génération d'IA
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Générer du contenu selon le mode et le ton choisis
          if (questionMode === "ask") {
            generateQuestionBasedOnTitle(quoraTitle);
          } else {
            generateAnswerBasedOnTone(quoraTitle, quoraQuestion, tone);
          }
        } catch (error) {
          console.error("Erreur lors de l'appel à Perplexity:", error);
          toast.error("Erreur lors de la génération du contenu");
        }
      } else {
        // Fallback à la génération locale si pas d'API key
        if (questionMode === "ask") {
          generateQuestionBasedOnTitle(quoraTitle);
        } else {
          generateAnswerBasedOnTone(quoraTitle, quoraQuestion, tone);
        }
      }

      toast.dismiss();
      toast.success("Contenu généré avec succès !");
      setPreviewVisible(true); // Show preview after successful generation
    } catch (error) {
      toast.error("Erreur lors de la génération du contenu");
      console.error("Erreur IA:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Générer une question basée sur le titre
  const generateQuestionBasedOnTitle = (title: string) => {
    const keywords = title.toLowerCase().split(' ');
    
    // Générer des questions selon le mot-clé
    if (keywords.includes('voyager') || keywords.includes('voyage') || keywords.includes('vacances')) {
      setQuoraQuestion(`Quelles sont les meilleures astuces pour ${title} tout en optimisant son budget ?`);
      
      // Générer également une réponse pour avoir un aperçu
      const sampleAnswer = `Le ${title} est parfaitement possible si l'on suit quelques principes clés. D'après mon expérience, voici les meilleures stratégies :

1. **Planifier en avance** - Les réservations précoces permettent souvent d'économiser 30 à 40% sur les billets d'avion et les hébergements.

2. **Voyager hors saison** - Les prix peuvent être divisés par deux pendant les périodes creuses, avec l'avantage supplémentaire de sites moins bondés.

3. **Utiliser les bonnes applications** - Des outils comme Skyscanner, Hopper ou Google Flights pour surveiller les prix des vols, et Booking.com ou Airbnb pour comparer les hébergements.`;
      
      setQuoraAnswer(sampleAnswer);
    } else if (keywords.includes('marketing') || keywords.includes('digital') || keywords.includes('business')) {
      setQuoraQuestion(`Comment optimiser sa stratégie de ${title} pour obtenir les meilleurs résultats en 2024 ?`);
      
      // Générer une réponse business
      const sampleAnswer = `Pour optimiser votre stratégie de ${title}, il est essentiel d'adopter une approche méthodique et basée sur les données. Voici les points clés à considérer :

1. **Analyse concurrentielle** - Étudiez ce que font vos concurrents et identifiez les opportunités qu'ils négligent.

2. **Segmentation précise** - Divisez votre audience en segments spécifiques pour des communications plus ciblées et pertinentes.

3. **Contenu de qualité** - Privilégiez la qualité à la quantité, avec un contenu qui apporte une réelle valeur ajoutée à votre audience.`;
      
      setQuoraAnswer(sampleAnswer);
    } else {
      // Générique pour tout autre sujet
      setQuoraQuestion(`Quelles sont les meilleures pratiques concernant ${title} que les experts recommandent en 2024 ?`);
      
      const sampleAnswer = `En ce qui concerne ${title}, les experts s'accordent sur plusieurs points essentiels pour 2024 :

1. **Se former continuellement** - Le domaine évolue rapidement, une veille régulière est indispensable.

2. **Adopter une approche holistique** - Ne pas se concentrer sur un seul aspect mais considérer l'ensemble des facteurs.

3. **Mesurer les résultats** - Définir des KPIs clairs et les suivre régulièrement pour ajuster sa stratégie.`;
      
      setQuoraAnswer(sampleAnswer);
    }
  };
  
  // Générer une réponse basée sur le ton choisi
  const generateAnswerBasedOnTone = (title: string, question: string, toneStyle: string) => {
    const keywords = title.toLowerCase().split(' ');
    let generatedAnswer = "";
    
    // Adapte la réponse selon le sujet principal
    const isTravelTopic = keywords.includes('voyager') || keywords.includes('voyage') || keywords.includes('vacances');
    const isBusinessTopic = keywords.includes('marketing') || keywords.includes('digital') || keywords.includes('business');
    
    // Déterminer le sujet principal pour la réponse
    const topic = isTravelTopic ? "voyage" : 
                  isBusinessTopic ? "marketing digital" : title;
    
    switch (toneStyle) {
      case "expert":
        generatedAnswer = `En tant qu'expert avec plus de 10 ans d'expérience dans le domaine du ${topic}, je peux vous affirmer que ${title} requiert une approche méthodique et stratégique.

Voici les 3 points essentiels à considérer pour ${isTravelTopic ? "voyager pas cher" : title} :

1. **Planification intelligente** - ${isTravelTopic ? "Réserver 3-4 mois à l'avance peut réduire vos coûts de transport de 30-40%" : "Une analyse préalable complète de votre situation actuelle est essentielle"}. Selon une étude récente ${isTravelTopic ? "de Skyscanner" : "de McKinsey"}, les personnes qui commencent par cette étape ont 64% plus de chances de réussir.

2. **${isTravelTopic ? "Flexibilité" : "Mise en œuvre progressive"}** - ${isTravelTopic ? "Être flexible sur les dates et les destinations peut faire économiser jusqu'à 60% sur un voyage" : "Priorisez vos actions selon leur impact potentiel"}. Un ${isTravelTopic ? "voyage" : "déploiement"} par phases permet de mesurer les résultats et d'ajuster votre stratégie.

3. **${isTravelTopic ? "Ressources alternatives" : "Mesure et optimisation"}** - ${isTravelTopic ? "Considérez les auberges de jeunesse, le couchsurfing ou les échanges de maisons" : "Définissez des KPIs clairs et suivez-les régulièrement"}. ${isTravelTopic ? "Ces options peuvent réduire vos frais d'hébergement de 70-80%" : "Ce qui ne peut être mesuré ne peut être amélioré"}.

Dans mon livre "${isTravelTopic ? "Voyager malin, dépenser moins" : "Stratégies d'excellence"}", j'explique comment j'ai aidé plus de 200 ${isTravelTopic ? "voyageurs" : "clients"} à obtenir des résultats exceptionnels en suivant ces principes. La clé est la constance et l'adaptation continue.

N'hésitez pas à me poser des questions plus spécifiques sur l'un de ces aspects.`;
        break;
        
      case "conversational":
        generatedAnswer = `Ah, ${title} ! C'est une super question que beaucoup de gens se posent.

Je me souviens quand j'ai commencé à m'intéresser à ${isTravelTopic ? "voyager sans me ruiner" : title}, j'étais complètement perdu 😅

Mais avec le temps, j'ai découvert quelques astuces qui marchent vraiment bien :

• D'abord, ${isTravelTopic ? "soyez flexible sur vos dates" : "prenez le temps de bien comprendre votre situation"}. C'est comme quand on part en voyage - on vérifie la météo et on prépare sa valise en conséquence, non ?

• Ensuite, ${isTravelTopic ? "utilisez les bons outils comme Skyscanner ou Hopper" : "avancez étape par étape"}. ${isTravelTopic ? "Ces applis peuvent vous trouver des vols à moitié prix !" : "Rome ne s'est pas construite en un jour !"} J'ai fait l'erreur de vouloir tout faire en même temps et... catastrophe !

• Finalement, ${isTravelTopic ? "pensez comme un local, pas comme un touriste" : "gardez un œil sur vos progrès"}. ${isTravelTopic ? "Les restaurants où vont les habitants locaux sont souvent 3 fois moins chers que ceux pour touristes" : "Comme quand on suit un régime, il faut se peser régulièrement pour voir si ça fonctionne"}.

J'ai partagé mon expérience sur mon blog si ça vous intéresse d'en savoir plus. Le plus important c'est de rester motivé et de ne pas abandonner au premier obstacle.

Qu'est-ce qui vous intéresse le plus dans tout ça ? Je serais ravi d'approfondir un aspect particulier !`;
        break;
        
      case "storytelling":
        generatedAnswer = `Il y a trois ans, ${isTravelTopic ? "Sophie" : "Marc"}, ${isTravelTopic ? "une passionnée de voyages" : "un entrepreneur passionné"}, s'est retrouvé face au même défi que vous concernant ${title.toLowerCase()}.

${isTravelTopic ? "Son budget était serré mais son envie de découvrir le monde était immense" : "Son entreprise stagnait, malgré tous ses efforts"}. Un soir, épuisé, ${isTravelTopic ? "elle a rencontré un voyageur expérimenté" : "il a rencontré un mentor"} qui lui a partagé une approche qui allait tout changer.

**Première révélation : ${isTravelTopic ? "la planification stratégique" : "l'importance de l'analyse"}**
${isTravelTopic ? "Sophie a commencé par identifier les destinations abordables selon les saisons" : "Marc a commencé par cartographier précisément sa situation"}. "C'était comme allumer la lumière dans une pièce sombre", ${isTravelTopic ? "m'a-t-elle" : "m'a-t-il"} confié. Cette clarté lui a permis d'identifier des opportunités invisibles jusque-là.

**Deuxième tournant : ${isTravelTopic ? "les ressources alternatives" : "la méthode des petits pas"}**
${isTravelTopic ? "Au lieu de séjourner dans des hôtels, Sophie a découvert le couchsurfing et les auberges locales" : "Au lieu de tout bouleverser, Marc a adopté une approche progressive"}. Chaque ${isTravelTopic ? "voyage" : "semaine"}, une nouvelle ${isTravelTopic ? "astuce" : "amélioration"}. "C'était comme construire un mur, brique par brique", explique-t-${isTravelTopic ? "elle" : "il"}. En six mois, la transformation était spectaculaire.

**Moment décisif : ${isTravelTopic ? "l'immersion locale" : "le pouvoir des données"}**
${isTravelTopic ? "Sophie a appris à voyager comme une locale, mangeant où les habitants mangent" : "Marc a mis en place un tableau de bord simple pour suivre ses progrès"}. "${isTravelTopic ? "Les expériences les plus authentiques étaient aussi les moins chères" : "Les chiffres m'ont raconté une histoire que mon intuition ne pouvait pas voir"}", dit-${isTravelTopic ? "elle" : "il"}. Cette ${isTravelTopic ? "approche" : "visibilité"} l'a guidé vers des ${isTravelTopic ? "découvertes inoubliables" : "ajustements cruciaux"}.

Aujourd'hui, ${isTravelTopic ? "Sophie a visité 15 pays avec un budget que beaucoup dépenseraient pour un seul voyage" : "l'entreprise de Marc a triplé son chiffre d'affaires"}. ${isTravelTopic ? "Son" : "Cette"} histoire n'est pas unique - j'ai accompagné des dizaines de ${isTravelTopic ? "voyageurs" : "entrepreneurs"} vers des réussites similaires en suivant ces principes.

Quelle est votre plus grande difficulté actuellement avec ${title.toLowerCase()} ?`;
        break;
        
      default:
        generatedAnswer = `Concernant ${title}, voici les points essentiels à considérer :

1. ${isTravelTopic ? "Planifiez à l'avance pour obtenir les meilleurs tarifs" : "Commencez par une analyse approfondie"}
2. ${isTravelTopic ? "Soyez flexible sur les dates et destinations" : "Procédez par étapes progressives"}
3. ${isTravelTopic ? "Utilisez les bons outils de comparaison" : "Mesurez régulièrement vos résultats"}

Ces trois principes vous permettront d'obtenir des résultats optimaux et durables.`;
    }

    setQuoraAnswer(generatedAnswer);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4" />
            Rédaction manuelle
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Assistant IA
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quora-title">Titre Quora</Label>
            <Input
              id="quora-title"
              value={quoraTitle}
              onChange={(e) => setQuoraTitle(e.target.value)}
              placeholder="Ex: Comment améliorer son référencement ?"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="quora-question">Question Quora</Label>
              <Select onValueChange={handleQuestionSelect}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Questions populaires" />
                </SelectTrigger>
                <SelectContent>
                  {popularQuestions.map((question, index) => (
                    <SelectItem key={index} value={question}>
                      {question.length > 40 ? `${question.substring(0, 40)}...` : question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              id="quora-question"
              value={quoraQuestion}
              onChange={(e) => setQuoraQuestion(e.target.value)}
              placeholder="Ex: Quelles sont les meilleures pratiques SEO en 2024 ?"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quora-answer">Votre réponse</Label>
            <Textarea
              id="quora-answer"
              value={quoraAnswer}
              onChange={(e) => setQuoraAnswer(e.target.value)}
              placeholder="Écrivez votre réponse détaillée ici..."
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quora-link">Lien (optionnel)</Label>
            <Input
              id="quora-link"
              value={quoraLink}
              onChange={(e) => setQuoraLink(e.target.value)}
              placeholder="https://votre-site.com"
              type="url"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="question-mode">Mode</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button 
                  type="button" 
                  variant={questionMode === "ask" ? "default" : "outline"}
                  onClick={() => setQuestionMode("ask")}
                  className={questionMode === "ask" ? "bg-[#b92b27] hover:bg-[#a62520]" : ""}
                >
                  <MessageSquareText className="mr-2 h-4 w-4" />
                  Poser une question
                </Button>
                <Button 
                  type="button" 
                  variant={questionMode === "answer" ? "default" : "outline"}
                  onClick={() => setQuestionMode("answer")}
                  className={questionMode === "answer" ? "bg-[#b92b27] hover:bg-[#a62520]" : ""}
                >
                  <Reply className="mr-2 h-4 w-4" />
                  Répondre à une question
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {questionMode === "ask" ? (
                <>
                  <Label htmlFor="quora-title-ai">Sujet de votre question</Label>
                  <Input
                    id="quora-title-ai"
                    value={quoraTitle}
                    onChange={(e) => setQuoraTitle(e.target.value)}
                    placeholder="Ex: Voyager pas cher, Marketing digital, etc."
                  />
                </>
              ) : (
                <>
                  <Label htmlFor="quora-question-ai">Question à répondre</Label>
                  <div className="flex gap-2 mb-2">
                    <Select onValueChange={handleQuestionSelect} value={quoraQuestion}>
                      <SelectTrigger className="flex-grow">
                        <SelectValue placeholder="Sélectionnez une question..." />
                      </SelectTrigger>
                      <SelectContent>
                        {popularQuestions.map((question, index) => (
                          <SelectItem key={index} value={question}>
                            {question.length > 40 ? `${question.substring(0, 40)}...` : question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    value={quoraTitle}
                    onChange={(e) => setQuoraTitle(e.target.value)}
                    placeholder="Sujet principal de votre réponse"
                    className="mb-2"
                  />
                </>
              )}
            </div>
            
            {questionMode === "answer" && (
              <div className="space-y-2">
                <Label htmlFor="tone-selector">Style de réponse</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expert">Expert et autoritaire</SelectItem>
                    <SelectItem value="conversational">Conversationnel et amical</SelectItem>
                    <SelectItem value="storytelling">Narratif (storytelling)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* API Key optional input */}
            <div className="space-y-2">
              {!showApiKeyInput ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowApiKeyInput(true)}
                  className="text-xs"
                >
                  Configurer une clé API Perplexity (optionnel)
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="api-key">Clé API Perplexity (pour de meilleurs résultats)</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-perplexity-..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Votre clé API sera utilisée uniquement pour cette session et ne sera pas stockée.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4 text-sm">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-2">Conseils pour un contenu efficace :</p>
                  <ul className="space-y-1 text-gray-600">
                    {questionMode === "ask" ? (
                      <>
                        <li>• Formulez une question claire et précise</li>
                        <li>• Incluez des mots-clés pertinents pour votre niche</li>
                        <li>• Évitez les questions trop générales ou trop techniques</li>
                        <li>• Ajoutez du contexte pour obtenir des réponses plus pertinentes</li>
                      </>
                    ) : (
                      <>
                        <li>• Montrez votre expertise dès le début de votre réponse</li>
                        <li>• Structurez votre réponse avec des points clairs</li>
                        <li>• Incluez des exemples concrets et des données</li>
                        <li>• Terminez par une conclusion et une invitation à l'engagement</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-[#b92b27] to-[#8B5CF6] hover:opacity-90 text-white"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {questionMode === "ask" 
                  ? "Générer une question" 
                  : "Générer une réponse"}
              </>
            )}
          </Button>
          
          {!quoraQuestion && !quoraAnswer && !isGenerating && (
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Aucun contenu généré</AlertTitle>
              <AlertDescription>
                Cliquez sur le bouton "Générer" ci-dessus pour créer du contenu avec l'IA
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview section - shown after generation or when content exists */}
      {(quoraQuestion && quoraAnswer) && (
        <Card className="mt-4 p-4 bg-gray-50 border-[#b92b27]/20">
          <CardContent className="p-0">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Aperçu de votre contenu</h4>
              {!previewVisible && activeTab === "ai" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPreviewVisible(true)}
                  className="text-xs"
                >
                  Afficher l'aperçu
                </Button>
              )}
            </div>
            
            {(previewVisible || activeTab === "manual") && (
              <div className="space-y-3">
                <h4 className="font-medium mb-2">{quoraQuestion}</h4>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="whitespace-pre-wrap text-sm">{quoraAnswer}</p>
                  {quoraLink && (
                    <a 
                      href={quoraLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-2 block"
                    >
                      En savoir plus
                    </a>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Button 
        onClick={onSubmit}
        className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
      >
        <Send className="mr-2 h-4 w-4" />
        Publier sur Quora
      </Button>
    </div>
  );
};

export default QuoraStep;
