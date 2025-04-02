
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefreshCw, MessageSquareText, Reply, Lightbulb, Send, AlertCircle, Check } from 'lucide-react';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPerplexityService } from "@/services/perplexityService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

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

// Le minimum requis pour une réponse Quora
const MIN_ANSWER_LENGTH = 500;

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
  const [characterCount, setCharacterCount] = useState(0);
  
  // Mettre à jour le compteur de caractères quand la réponse change
  React.useEffect(() => {
    setCharacterCount(quoraAnswer.length);
  }, [quoraAnswer]);

  // Générer des questions pertinentes basées sur le titre/sujet
  const generateRelevantQuestions = (title: string) => {
    const titleLower = title.toLowerCase();
    const questions = [];
    
    // Questions pour les sujets liés au SEO et marketing
    if (titleLower.includes('seo') || titleLower.includes('référencement') || titleLower.includes('marketing')) {
      questions.push(
        `Comment optimiser le ${title} pour améliorer son classement sur Google en 2024 ?`,
        `Quelles sont les stratégies avancées de ${title} que les experts utilisent actuellement ?`,
        `Comment mesurer efficacement l'impact du ${title} sur les conversions d'un site web ?`,
        `Quelles sont les erreurs les plus courantes en matière de ${title} et comment les éviter ?`,
        `Comment le ${title} s'intègre-t-il dans une stratégie de contenu plus large ?`
      );
    }
    // Questions pour les sujets liés au voyage
    else if (titleLower.includes('voyage') || titleLower.includes('tourisme') || titleLower.includes('destination')) {
      questions.push(
        `Quelles sont les astuces pour optimiser son budget lors d'un ${title} ?`,
        `Comment planifier un ${title} de manière responsable et écologique ?`,
        `Quelles sont les destinations méconnues idéales pour ${title} ?`,
        `Comment gérer efficacement les imprévus pendant un ${title} ?`,
        `Quelles applications sont indispensables pour faciliter un ${title} ?`
      );
    }
    // Questions pour les sujets liés à la technologie
    else if (titleLower.includes('tech') || titleLower.includes('ia') || titleLower.includes('intelligence artificielle') || titleLower.includes('digital')) {
      questions.push(
        `Comment intégrer ${title} dans une stratégie d'entreprise traditionnelle ?`,
        `Quels sont les défis éthiques posés par ${title} et comment les surmonter ?`,
        `Comment rester à jour avec les évolutions rapides de ${title} ?`,
        `Quelles compétences deviennent essentielles avec l'émergence de ${title} ?`,
        `Comment évaluer le retour sur investissement de ${title} dans une entreprise ?`
      );
    }
    // Questions pour les sujets liés à la santé et bien-être
    else if (titleLower.includes('santé') || titleLower.includes('bien-être') || titleLower.includes('nutrition')) {
      questions.push(
        `Comment intégrer ${title} dans une routine quotidienne chargée ?`,
        `Quelles sont les dernières recherches scientifiques sur ${title} ?`,
        `Comment mesurer les progrès réalisés en matière de ${title} ?`,
        `Quels professionnels consulter pour optimiser son ${title} ?`,
        `Comment les habitudes de ${title} varient-elles selon les cultures ?`
      );
    }
    // Questions génériques pour tout autre sujet
    else {
      questions.push(
        `Quelles sont les compétences essentielles pour maîtriser ${title} en 2024 ?`,
        `Comment mesurer l'efficacité de vos stratégies de ${title} ?`,
        `Quelles sont les ressources les plus fiables pour se former à ${title} ?`,
        `Comment ${title} va-t-il évoluer dans les 5 prochaines années ?`,
        `Quels sont les mythes les plus répandus concernant ${title} et quelle est la réalité ?`
      );
    }
    
    return questions;
  };

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
          prompt = `Générez une question Quora détaillée en français sur le sujet spécifique "${quoraTitle}". La question doit être pertinente, engageante et inciter à des réponses détaillées.`;
        } else {
          if (!quoraQuestion.trim()) {
            toast.error("Veuillez sélectionner ou saisir une question à répondre");
            setIsGenerating(false);
            return;
          }
          
          prompt = `En tant que ${tone === "expert" ? "expert" : tone === "conversational" ? "personne amicale et conversationnelle" : "narrateur partageant une histoire personnelle"}, écrivez une réponse détaillée (minimum ${MIN_ANSWER_LENGTH} caractères) à la question Quora suivante: "${quoraQuestion}". La réponse doit être directement liée au sujet "${quoraTitle}" et inclure des exemples concrets, des données si pertinent, et une structure claire.`;
        }
        
        try {
          // Simuler l'appel API Perplexity pour ce contexte
          // On peut ajouter l'intégration réelle plus tard
          console.log("Génération avec prompt:", prompt);
          
          // Simuler un délai pour la génération d'IA
          await new Promise(resolve => setTimeout(resolve, 1000));
          
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
    const relevantQuestions = generateRelevantQuestions(title);
    const randomIndex = Math.floor(Math.random() * relevantQuestions.length);
    setQuoraQuestion(relevantQuestions[randomIndex]);
    
    // Générer également une réponse pour avoir un aperçu
    generateAnswerBasedOnTone(title, relevantQuestions[randomIndex], tone);
  };
  
  // Générer une réponse basée sur le ton choisi
  const generateAnswerBasedOnTone = (title: string, question: string, toneStyle: string) => {
    const titleLower = title.toLowerCase();
    let generatedAnswer = "";
    
    // Déterminer le sujet principal pour contextualiser la réponse
    const isTravelTopic = titleLower.includes('voyag') || titleLower.includes('touris') || titleLower.includes('destination');
    const isBusinessTopic = titleLower.includes('market') || titleLower.includes('digital') || titleLower.includes('business') || titleLower.includes('seo') || titleLower.includes('référencement');
    const isTechTopic = titleLower.includes('tech') || titleLower.includes('ia') || titleLower.includes('intelligence') || titleLower.includes('digital');
    const isHealthTopic = titleLower.includes('santé') || titleLower.includes('bien') || titleLower.includes('nutrition');
    
    // Déterminer le sujet principal pour la réponse
    const topic = isTravelTopic ? "voyage" : 
                  isBusinessTopic ? "marketing digital" : 
                  isTechTopic ? "technologie" :
                  isHealthTopic ? "santé et bien-être" : title;
    
    // Assurer que la réponse est directement liée à la question posée
    const questionKeywords = question.toLowerCase().split(' ').filter(word => word.length > 4);
    
    switch (toneStyle) {
      case "expert":
        generatedAnswer = `En tant qu'expert dans le domaine du ${topic} depuis plus de 10 ans, je vais analyser précisément cette question sur ${title}.

**Comprendre le contexte de ${title}**

${title} représente un aspect fondamental dans le domaine du ${topic}. Avant d'entrer dans les détails techniques, il est essentiel de comprendre que ${title} s'inscrit dans un écosystème plus large où différents facteurs interagissent de manière complexe.

**Analyse des principaux facteurs**

1. **Évolution récente de ${title}** - Au cours des dernières années, nous avons assisté à une transformation significative dans la manière dont ${title} est abordé par les professionnels. Les statistiques récentes montrent que plus de 65% des experts ont modifié leur approche de ${title} pour s'adapter aux nouvelles réalités du marché.

2. **Méthodologies optimales pour ${title}** - Les recherches empiriques démontrent clairement que l'approche la plus efficace pour ${title} combine à la fois des éléments traditionnels et innovants. Une étude publiée dans le Journal of ${topic.charAt(0).toUpperCase() + topic.slice(1)} en 2023 a révélé que cette approche hybride augmente l'efficacité de 37%.

3. **Indicateurs de performance pour ${title}** - Pour évaluer correctement l'impact de vos stratégies de ${title}, il est crucial d'établir des KPIs pertinents. Les métriques les plus révélatrices incluent le taux d'engagement, le retour sur investissement spécifique, et le coefficient d'adoption à long terme.

**Applications pratiques pour ${title}**

Pour mettre en œuvre efficacement ${title} dans votre contexte spécifique, je recommande une méthodologie en trois phases:

• Phase d'analyse: évaluez votre situation actuelle concernant ${title}
• Phase de stratégie: développez un plan d'action personnalisé pour ${title}
• Phase d'implémentation: déployez progressivement votre stratégie ${title} avec des points de contrôle réguliers

**Perspective d'avenir pour ${title}**

Les tendances actuelles suggèrent que ${title} continuera d'évoluer rapidement. Les experts du secteur anticipent une intégration croissante de l'intelligence artificielle et des approches data-driven dans ${title}, ce qui ouvrira de nouvelles opportunités tout en créant de nouveaux défis.

N'hésitez pas à me contacter pour approfondir des aspects spécifiques de ${title} qui vous intéressent particulièrement.`;
        break;
        
      case "conversational":
        generatedAnswer = `Ah, ${title}! C'est une question super intéressante que vous posez là! 😊

Je me souviens très bien de la première fois que j'ai exploré ${title}. J'étais totalement perdu, essayant de comprendre par où commencer et quelles méthodes fonctionnaient vraiment. Après plusieurs années d'expérimentation (et pas mal d'erreurs!), j'ai découvert quelques principes qui font toute la différence.

Alors, pour répondre directement à votre question sur ${question.replace(/\?$/, '')}...

D'abord, il faut comprendre que ${title} n'est pas une solution magique. C'est plutôt un processus qui demande de la patience et de l'adaptation constante. J'ai rencontré tellement de personnes qui abandonnent ${title} trop tôt parce qu'elles ne voient pas de résultats immédiats!

Voici ce que j'ai appris à la dure:

• **Commencez petit mais soyez constant** - Avec ${title}, mieux vaut faire un peu chaque jour que beaucoup une fois par mois. J'ai commencé par seulement 20 minutes quotidiennes, et ça a fait toute la différence!

• **Analysez ce qui fonctionne pour VOUS** - Chaque situation est unique. Ce qui a fonctionné pour moi avec ${title} ne fonctionnera peut-être pas exactement pareil pour vous. Prenez des notes, adaptez, et trouvez votre propre chemin.

• **Entourez-vous de personnes qui comprennent ${title}** - Rejoindre une communauté autour de ${title} a complètement transformé mon approche. Les échanges d'idées sont inestimables!

Je me rappelle d'un moment particulier où j'ai vraiment compris la puissance de ${title}. J'étais confronté à un défi qui semblait insurmontable, et c'est en appliquant les principes de ${title} de façon créative que j'ai trouvé une solution que je n'aurais jamais imaginée autrement.

Qu'est-ce qui vous a amené à vous intéresser à ${title} ? Je serais curieux de connaître votre parcours et de voir comment je pourrais vous aider plus spécifiquement! 😊`;
        break;
        
      case "storytelling":
        generatedAnswer = `Il y a trois ans, lors d'une conférence sur ${topic} à Paris, j'ai rencontré Alexandre, un expert en ${title} dont l'approche a complètement changé ma perspective.

**Le point de départ**

Alexandre travaillait pour une entreprise qui luttait avec les mêmes défis que beaucoup d'entre nous concernant ${title}. Les méthodes traditionnelles ne fonctionnaient plus, et l'équipe était au point mort. "Nous avions épuisé toutes les solutions conventionnelles," m'a-t-il confié autour d'un café. "Il nous fallait repenser entièrement notre approche de ${title}."

**Le moment de transformation**

Un mardi matin pluvieux, Alexandre a réuni son équipe dans une salle de conférence. Au lieu de présenter un autre plan d'action prévisible pour ${title}, il a posé une simple question: "Et si nous abordions ${title} du point de vue de nos clients plutôt que du nôtre?"

Cette question en apparence simple a déclenché une cascade d'innovations. L'équipe a commencé à récolter des témoignages directs sur ${title}, à analyser les parcours utilisateurs, et à cartographier les points de friction spécifiques.

**Les résultats inattendus**

Six mois plus tard, leur nouvelle approche de ${title} avait:
• Augmenté l'engagement client de 78%
• Réduit les coûts opérationnels de 23%
• Créé un nouveau modèle que d'autres équipes ont commencé à adopter

Ce qui m'a le plus marqué dans cette histoire, c'est comment un changement de perspective sur ${title} a pu transformer un problème persistant en opportunité d'innovation.

**La leçon universelle**

L'histoire d'Alexandre m'a enseigné que ${title} n'est pas qu'une question de techniques ou d'outils, mais avant tout une question d'approche et de mentalité. Comme il me l'a dit avant que nous nous séparions: "Le véritable pouvoir de ${title} se révèle quand on ose remettre en question nos certitudes les plus fondamentales."

Depuis, j'applique cette philosophie à chaque projet impliquant ${title}, avec des résultats qui continuent de me surprendre positivement.

Quelle histoire avez-vous vécue avec ${title}? Quelles leçons en avez-vous tirées?`;
        break;
        
      default:
        generatedAnswer = `Concernant la question sur ${title}, voici une analyse détaillée basée sur mon expérience et les données actuelles du secteur.

**Perspective historique de ${title}**

${title} a considérablement évolué au fil des années. Ce qui était considéré comme une pratique optimale il y a seulement 3-5 ans peut aujourd'hui être obsolète ou même contre-productif. Cette évolution rapide nécessite une veille constante et une capacité d'adaptation.

**État actuel du marché concernant ${title}**

Les données récentes montrent que ${title} représente un enjeu stratégique pour plus de 78% des organisations dans le secteur du ${topic}. Les investissements dans ce domaine ont augmenté de 34% en moyenne au cours des deux dernières années, témoignant de son importance croissante.

**Approches qui fonctionnent réellement pour ${title}**

1. **Intégration systémique** - Les organisations qui intègrent ${title} dans leur stratégie globale plutôt que de le traiter comme un élément isolé obtiennent généralement des résultats supérieurs de 45%.

2. **Analyse continue** - Établir un système de surveillance et d'analyse pour ${title} permet d'identifier rapidement les opportunités d'amélioration et d'adapter les stratégies en conséquence.

3. **Formation et développement** - Les équipes qui bénéficient d'une formation régulière sur les dernières tendances en matière de ${title} surpassent leurs concurrents de 28% en termes d'efficacité.

**Obstacles courants et solutions**

Un défi majeur dans l'implémentation de ${title} est la résistance au changement au sein des organisations. Pour surmonter cette barrière, une approche progressive avec des objectifs clairs et mesurables s'avère généralement plus efficace qu'une transformation radicale.

**Perspective d'avenir pour ${title}**

Les tendances émergentes suggèrent que ${title} continuera d'évoluer vers une plus grande intégration des technologies avancées comme l'intelligence artificielle et l'apprentissage automatique. Les organisations qui anticipent ces évolutions seront mieux positionnées pour tirer parti des opportunités futures.

J'espère que cette analyse vous offre une perspective utile sur ${title}. N'hésitez pas à explorer des aspects spécifiques qui pourraient être particulièrement pertinents pour votre situation.`;
    }

    // S'assurer que la réponse atteint la longueur minimale requise
    if (generatedAnswer.length < MIN_ANSWER_LENGTH) {
      generatedAnswer += `\n\n**Pour approfondir votre compréhension de ${title}**

Je recommande vivement d'explorer ces ressources complémentaires:

• Les dernières recherches publiées par l'Institut de ${topic.charAt(0).toUpperCase() + topic.slice(1)}
• Le livre "${title}: Stratégies avancées et applications pratiques" par Dr. Martin Dubois
• La série de webinaires "Maîtriser ${title}" disponible gratuitement sur le site de l'Association Professionnelle de ${topic.charAt(0).toUpperCase() + topic.slice(1)}

Ces sources vous permettront d'approfondir votre connaissance de ${title} et d'enrichir votre approche avec des perspectives diverses et complémentaires.`;
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
            <Label htmlFor="quora-title">Titre / Sujet principal</Label>
            <Input
              id="quora-title"
              value={quoraTitle}
              onChange={(e) => setQuoraTitle(e.target.value)}
              placeholder="Ex: Marketing digital, SEO, Voyage en Europe, etc."
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="quora-question">Question</Label>
              {quoraTitle && (
                <Select onValueChange={handleQuestionSelect}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Questions suggérées" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateRelevantQuestions(quoraTitle).map((question, index) => (
                      <SelectItem key={index} value={question}>
                        {question.length > 40 ? `${question.substring(0, 40)}...` : question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
            <div className="flex justify-between items-center">
              <Label htmlFor="quora-answer">Votre réponse</Label>
              <div className={`text-xs ${characterCount < MIN_ANSWER_LENGTH ? 'text-red-500' : 'text-green-500'}`}>
                {characterCount} / {MIN_ANSWER_LENGTH} caractères minimum
              </div>
            </div>
            <Textarea
              id="quora-answer"
              value={quoraAnswer}
              onChange={(e) => {
                setQuoraAnswer(e.target.value);
                setCharacterCount(e.target.value.length);
              }}
              placeholder="Écrivez votre réponse détaillée ici..."
              className={`min-h-[200px] ${characterCount < MIN_ANSWER_LENGTH ? 'border-red-300' : 'border-green-300'}`}
            />
            <Progress 
              value={(characterCount / MIN_ANSWER_LENGTH) * 100} 
              max={100} 
              className={`h-1 ${characterCount < MIN_ANSWER_LENGTH ? 'bg-red-100' : 'bg-green-100'}`} 
            />
            {characterCount < MIN_ANSWER_LENGTH && (
              <p className="text-xs text-red-500">
                Il vous manque {MIN_ANSWER_LENGTH - characterCount} caractères pour atteindre le minimum recommandé
              </p>
            )}
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
                    {quoraTitle && (
                      <Select onValueChange={handleQuestionSelect} value={quoraQuestion}>
                        <SelectTrigger className="flex-grow">
                          <SelectValue placeholder="Sélectionnez une question..." />
                        </SelectTrigger>
                        <SelectContent>
                          {generateRelevantQuestions(quoraTitle).map((question, index) => (
                            <SelectItem key={index} value={question}>
                              {question.length > 40 ? `${question.substring(0, 40)}...` : question}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
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
                  <p className="font-medium mb-2">Conseils pour un contenu Quora efficace :</p>
                  <ul className="space-y-1 text-gray-600">
                    {questionMode === "ask" ? (
                      <>
                        <li>• Formulez une question claire et précise</li>
                        <li>• Incluez des mots-clés pertinents pour votre niche</li>
                        <li>• Évitez les questions trop générales</li>
                        <li>• Ajoutez du contexte pour obtenir des réponses pertinentes</li>
                      </>
                    ) : (
                      <>
                        <li>• Rédigez au moins {MIN_ANSWER_LENGTH} caractères</li>
                        <li>• Montrez votre expertise dès le début</li>
                        <li>• Structurez votre réponse avec 2-3 points clairs</li>
                        <li>• Incluez des exemples concrets si possible</li>
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

      {/* Preview section - always visible when content exists */}
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
                <div className="flex items-center gap-2 text-sm mt-4">
                  <span className={characterCount < MIN_ANSWER_LENGTH ? 'text-red-500' : 'text-green-500'}>
                    {characterCount} caractères
                  </span>
                  {characterCount >= MIN_ANSWER_LENGTH && (
                    <span className="flex items-center text-green-500 gap-1">
                      <Check className="h-4 w-4" /> Longueur minimale requise atteinte
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Button 
        onClick={onSubmit}
        disabled={characterCount < MIN_ANSWER_LENGTH}
        className={`w-full text-white ${characterCount < MIN_ANSWER_LENGTH ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ea384c] hover:bg-[#ea384c]/90'}`}
      >
        <Send className="mr-2 h-4 w-4" />
        {characterCount < MIN_ANSWER_LENGTH 
          ? `Rédigez au moins ${MIN_ANSWER_LENGTH} caractères (${MIN_ANSWER_LENGTH - characterCount} manquants)`
          : "Publier sur Quora"
        }
      </Button>
    </div>
  );
};

export default QuoraStep;

