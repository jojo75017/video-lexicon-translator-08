
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefreshCw, MessageSquareText, Reply, Lightbulb, Send } from 'lucide-react';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const popularQuestions = [
    "Comment améliorer le référencement de mon site web en 2024 ?",
    "Quelles sont les meilleures stratégies de marketing digital pour une petite entreprise ?",
    "Comment créer une stratégie de contenu efficace pour les réseaux sociaux ?",
    "Quels sont les outils SEO indispensables pour analyser la concurrence ?",
    "Comment optimiser mon site pour le mobile-first indexing de Google ?"
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
    toast.loading("Génération de contenu en cours...");

    try {
      // Simuler un délai pour la génération d'IA
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (questionMode === "ask") {
        // Générer une question basée sur le titre
        const generatedQuestion = `${quoraTitle} Et quelles sont les meilleures pratiques à suivre ?`;
        setQuoraQuestion(generatedQuestion);
        
        // Générer également une réponse pour avoir un aperçu
        const sampleAnswer = `En tant qu'expert dans ce domaine, voici ce que je peux vous dire sur ${quoraTitle.toLowerCase()}.

Les meilleures pratiques incluent...`;
        setQuoraAnswer(sampleAnswer);
      } else {
        // En mode réponse, nous gardons la question existante et générons une réponse
        if (!quoraQuestion.trim()) {
          toast.error("Veuillez sélectionner ou saisir une question à répondre");
          setIsGenerating(false);
          return;
        }
        
        let generatedAnswer = "";
        switch (tone) {
          case "expert":
            generatedAnswer = `En tant qu'expert avec plus de 10 ans d'expérience dans ce domaine, je peux vous affirmer que ${quoraTitle.toLowerCase()} nécessite une approche méthodique et stratégique.

Voici les 3 points essentiels à considérer :

1. **Analyse préalable** - Avant toute action, réalisez un audit complet de votre situation actuelle. Identifiez vos forces, faiblesses et opportunités. Selon une étude récente de McKinsey, les entreprises qui commencent par cette étape ont 64% plus de chances de réussir.

2. **Mise en œuvre progressive** - Ne cherchez pas à tout faire d'un coup. Priorisez vos actions selon leur impact potentiel et leur facilité de mise en œuvre. Un déploiement par phases permet de mesurer les résultats et d'ajuster votre stratégie.

3. **Mesure et optimisation** - Définissez des KPIs clairs et suivez-les régulièrement. Ce qui ne peut être mesuré ne peut être amélioré. Les données vous guideront vers les ajustements nécessaires.

Dans mon livre "Stratégies d'excellence", j'explique comment j'ai aidé plus de 200 clients à obtenir des résultats exceptionnels en suivant ces principes. La clé est la constance et l'adaptation continue.

N'hésitez pas à me poser des questions plus spécifiques sur l'un de ces aspects.`;
            break;
          case "conversational":
            generatedAnswer = `Ah, ${quoraTitle} ! C'est une super question que beaucoup de gens se posent.

Je me souviens quand j'ai commencé à m'y intéresser, j'étais complètement perdu 😅

Mais avec le temps, j'ai découvert quelques astuces qui marchent vraiment bien :

• D'abord, prenez le temps de bien comprendre votre situation. C'est comme quand on part en voyage - on vérifie la météo et on prépare sa valise en conséquence, non ?

• Ensuite, avancez étape par étape. Rome ne s'est pas construite en un jour ! J'ai fait l'erreur de vouloir tout faire en même temps et... catastrophe !

• Finalement, gardez un œil sur vos progrès. Comme quand on suit un régime, il faut se peser régulièrement pour voir si ça fonctionne.

J'ai partagé mon expérience sur mon blog si ça vous intéresse d'en savoir plus. Le plus important c'est de rester motivé et de ne pas abandonner au premier obstacle.

Qu'est-ce qui vous intéresse le plus dans tout ça ? Je serais ravi d'approfondir un aspect particulier !`;
            break;
          case "storytelling":
            generatedAnswer = `Il y a trois ans, Marc, un entrepreneur passionné, s'est retrouvé face au même défi que vous concernant ${quoraTitle.toLowerCase()}.

Son entreprise stagnait, malgré tous ses efforts. Un soir, épuisé, il a rencontré un mentor qui lui a partagé une approche qui allait tout changer.

**Première révélation : l'importance de l'analyse**
Marc a commencé par cartographier précisément sa situation. "C'était comme allumer la lumière dans une pièce sombre", m'a-t-il confié. Cette clarté lui a permis d'identifier des opportunités invisibles jusque-là.

**Deuxième tournant : la méthode des petits pas**
Au lieu de tout bouleverser, Marc a adopté une approche progressive. Chaque semaine, une nouvelle amélioration. "C'était comme construire un mur, brique par brique", explique-t-il. En six mois, la transformation était spectaculaire.

**Moment décisif : le pouvoir des données**
Marc a mis en place un tableau de bord simple pour suivre ses progrès. "Les chiffres m'ont raconté une histoire que mon intuition ne pouvait pas voir", dit-il. Cette visibilité l'a guidé vers des ajustements cruciaux.

Aujourd'hui, l'entreprise de Marc a triplé son chiffre d'affaires. Son histoire n'est pas unique - j'ai accompagné des dizaines d'entrepreneurs vers des réussites similaires en suivant ces principes.

Quelle est votre plus grande difficulté actuellement avec ${quoraTitle.toLowerCase()} ?`;
            break;
          default:
            generatedAnswer = `Concernant ${quoraTitle}, voici les points essentiels à considérer :

1. Commencez par une analyse approfondie
2. Procédez par étapes progressives
3. Mesurez régulièrement vos résultats

Ces trois principes vous permettront d'obtenir des résultats optimaux et durables.`;
        }

        setQuoraAnswer(generatedAnswer);
      }

      toast.dismiss();
      toast.success("Contenu généré avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la génération du contenu");
      console.error("Erreur IA:", error);
    } finally {
      setIsGenerating(false);
    }
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
                    placeholder="Ex: L'optimisation du référencement local"
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
        </TabsContent>
      </Tabs>

      {quoraQuestion && quoraAnswer && (
        <Card className="mt-4 p-4 bg-gray-50 border-[#b92b27]/20">
          <CardContent className="p-0">
            <h4 className="font-medium mb-2">{quoraQuestion}</h4>
            <div className="bg-white p-3 rounded-md">
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
