
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, SendIcon, User, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AiAssistantProps {
  onUseResponse: (response: string) => void;
}

const AiAssistant = ({ onUseResponse }: AiAssistantProps) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [replyingToIndex, setReplyingToIndex] = useState<number | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Veuillez saisir une question");
      return;
    }

    // Ajouter la question à la conversation
    const newMessage = { role: 'user' as const, content: question };
    if (isReplyMode && replyingToIndex !== null) {
      // Créer une copie de la conversation
      const updatedConversation = [...conversation];
      // Insérer la réponse après la question à laquelle on répond
      updatedConversation.splice(replyingToIndex + 1, 0, newMessage);
      setConversation(updatedConversation);
    } else {
      setConversation(prev => [...prev, newMessage]);
    }
    
    setIsLoading(true);
    
    try {
      // Simule une réponse IA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Générer une réponse personnalisée en fonction de la question
      let aiResponse = generateResponse(question);
      
      // Ajouter la réponse à la conversation
      if (isReplyMode && replyingToIndex !== null) {
        // Créer une copie de la conversation
        const updatedConversation = [...conversation];
        // Insérer la réponse après notre réponse utilisateur
        updatedConversation.splice(replyingToIndex + 2, 0, { role: 'assistant', content: aiResponse });
        setConversation(updatedConversation);
      } else {
        setConversation(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      }
      
      // Réinitialiser le mode de réponse
      setIsReplyMode(false);
      setReplyingToIndex(null);
    } catch (error) {
      toast.error("Erreur lors de la génération de la réponse");
      console.error("Erreur IA:", error);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  // Générer une réponse différente pour chaque question
  const generateResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase();
    
    // Base de données de réponses par thèmes
    const responses = {
      youtube: [
        "Pour développer votre chaîne YouTube, concentrez-vous sur la qualité plutôt que la quantité. Publiez régulièrement du contenu qui apporte une vraie valeur à votre audience. Analysez vos statistiques pour comprendre ce qui fonctionne et engagez-vous avec votre communauté dans les commentaires. Les algorithmes de YouTube favorisent l'engagement et le temps de visionnage.",
        "L'achat d'abonnés sur YouTube est fortement déconseillé. Ces abonnés sont généralement des comptes inactifs qui n'interagiront jamais avec votre contenu, ce qui peut nuire à votre taux d'engagement et même conduire à des sanctions de la part de YouTube. Mieux vaut avoir 100 vrais fans qu'un million d'abonnés fantômes.",
        "Pour optimiser vos vidéos YouTube, travaillez sur vos titres, descriptions et miniatures. Utilisez des mots-clés pertinents, créez des miniatures accrocheuses et structurez vos descriptions avec des timestamps et des liens utiles. N'oubliez pas d'inciter vos spectateurs à s'abonner et à laisser un commentaire.",
        "Les Shorts YouTube sont un excellent moyen d'accroître votre visibilité. Ce format vertical court (moins de 60 secondes) est idéal pour captiver rapidement l'attention. Essayez de transformer vos meilleurs moments de vidéos longues en Shorts ou créez du contenu spécifique pour ce format."
      ],
      email: [
        "Une signature email professionnelle doit être concise et contenir vos informations essentielles : nom, fonction, entreprise, coordonnées et éventuellement logo. Évitez les polices fantaisistes et limitez-vous à 2-3 couleurs maximum pour maintenir un aspect professionnel.",
        "Pour améliorer le taux d'ouverture de vos emails, travaillez sur l'objet : il doit être court (moins de 50 caractères), personnalisé et créer une sensation d'urgence ou de curiosité. Évitez les termes spammy comme 'gratuit' ou 'promotion' qui peuvent déclencher les filtres anti-spam.",
        "La meilleure heure pour envoyer des emails professionnels est généralement entre 10h et 11h ou entre 14h et 15h, du mardi au jeudi. Cependant, ces horaires peuvent varier selon votre secteur et votre audience - testez différents moments pour trouver ce qui fonctionne le mieux pour vous.",
        "Pour une campagne d'emailing réussie, segmentez votre audience, personnalisez le contenu et incluez un call-to-action clair et unique. Mesurez systématiquement vos performances (taux d'ouverture, de clic, de conversion) et optimisez continuellement vos campagnes sur la base de ces données."
      ],
      marketing: [
        "Le marketing de contenu reste l'une des stratégies les plus efficaces en 2024. Créez du contenu utile qui répond aux questions de votre audience à chaque étape de leur parcours d'achat. Un contenu de qualité construit votre autorité dans votre domaine et génère un trafic organique durable.",
        "Pour augmenter votre taux de conversion, optimisez votre entonnoir de vente en éliminant les frictions. Simplifiez les formulaires, réduisez le nombre d'étapes jusqu'à l'achat, proposez plusieurs options de paiement et mettez en place un système de relance automatique pour les paniers abandonnés.",
        "Les micro-influenceurs (1 000 à 50 000 abonnés) offrent souvent un meilleur ROI que les influenceurs à grande audience. Leur communauté est généralement plus engagée et leurs recommandations sont perçues comme plus authentiques, ce qui peut générer un taux de conversion plus élevé.",
        "Pour mesurer l'efficacité de votre marketing digital, suivez ces KPIs essentiels : coût d'acquisition client (CAC), valeur vie client (LTV), taux de conversion, engagement sur les réseaux sociaux et positionnement SEO. L'important est de lier ces métriques à vos objectifs business globaux."
      ],
      seo: [
        "Le référencement (SEO) est un processus de long terme. Concentrez-vous sur la création de contenu de qualité qui répond aux questions de vos utilisateurs. Optimisez vos mots-clés, vos balises titre et méta descriptions, et travaillez votre netlinking. Les résultats peuvent prendre 3 à 6 mois pour être visibles.",
        "Pour améliorer votre référencement local, assurez-vous que votre fiche Google My Business est complète et à jour. Collectez des avis positifs, utilisez des mots-clés locaux dans votre contenu et créez des pages dédiées pour chaque zone géographique que vous servez.",
        "La vitesse de chargement est un facteur de classement majeur. Optimisez vos images, utilisez la mise en cache, minifiez vos CSS et JavaScript, et envisagez d'utiliser un CDN. Visez un temps de chargement inférieur à 3 secondes pour un impact positif sur votre SEO.",
        "Le netlinking reste crucial pour le SEO. Privilégiez la qualité à la quantité : un seul backlink provenant d'un site autoritaire dans votre domaine a plus de valeur que des dizaines de liens de faible qualité. Créez du contenu linkable et développez des partenariats avec d'autres sites de votre secteur."
      ],
      social: [
        "Pour réussir sur les réseaux sociaux en 2024, misez sur l'authenticité et l'interaction plutôt que sur le volume de publication. Engagez-vous régulièrement avec votre communauté, répondez aux commentaires et créez du contenu qui suscite des conversations plutôt que de simplement promouvoir vos produits.",
        "Chaque plateforme sociale a ses spécificités : Instagram pour le visuel, LinkedIn pour le professionnel, TikTok pour le divertissement créatif, etc. Adaptez votre contenu à chaque plateforme plutôt que de publier le même message partout. Un bon contenu sur une plateforme peut être totalement inefficace sur une autre.",
        "L'algorithme de TikTok favorise particulièrement les premières secondes d'une vidéo. Captez immédiatement l'attention avec un hook puissant dans les 3 premières secondes. Si vous ne parvenez pas à retenir l'utilisateur dans ce court laps de temps, votre vidéo aura peu de chances d'être promue par l'algorithme.",
        "Contrairement aux idées reçues, le meilleur moment pour publier sur les réseaux sociaux n'est pas toujours aux heures de pointe. Tester différents moments peut vous aider à trouver des créneaux où la concurrence est moindre mais où votre audience cible est active, augmentant ainsi votre visibilité organique."
      ],
      quora: [
        "Pour maximiser votre visibilité sur Quora, répondez aux questions récentes dans votre domaine d'expertise. Une réponse détaillée et utile sur une question nouvelle aura plus de chances d'être mise en avant qu'une réponse sur une question qui a déjà reçu des dizaines de bonnes réponses.",
        "La qualité prime sur Quora. Prenez le temps de rédiger des réponses complètes avec des exemples concrets, des données vérifiables et, si pertinent, des images ou des graphiques. Les réponses détaillées qui apportent une réelle valeur ajoutée reçoivent généralement plus de votes positifs.",
        "Quora est un excellent outil pour comprendre les préoccupations de votre audience cible. Analysez les questions populaires dans votre domaine pour identifier les problèmes récurrents, puis créez du contenu sur votre site qui y répond en profondeur.",
        "Pour utiliser Quora comme outil de marketing, évitez l'autopromotion directe qui peut être mal perçue. Établissez-vous d'abord comme une autorité en fournissant des réponses de qualité, puis intégrez subtilement des références à votre expertise ou à vos solutions lorsque c'est pertinent pour la question."
      ],
      voyage: [
        "Pour économiser sur vos voyages, la flexibilité est clé. Recherchez vos vols en navigation privée, comparez sur différentes plateformes et envisagez des aéroports secondaires. Les meilleures offres se trouvent généralement 6-8 semaines avant le départ pour les vols internationaux.",
        "Voyager hors saison peut transformer complètement votre expérience : prix réduits (jusqu'à 40%), moins de touristes et une expérience plus authentique. Renseignez-vous sur la 'saison des épaules' (juste avant ou après la haute saison) pour un bon compromis entre météo et affluence.",
        "Les applications comme Google Maps, Maps.me ou Citymapper peuvent être utilisées hors ligne en téléchargeant les cartes à l'avance. C'est un excellent moyen d'économiser sur les données mobiles à l'étranger tout en gardant une navigation précise.",
        "Pour une immersion culturelle authentique, éloignez-vous des circuits touristiques standards. Utilisez des applications comme Meetup ou Couchsurfing pour rencontrer des locaux, fréquentez les marchés de quartier et apprenez quelques phrases dans la langue locale, même si c'est juste pour commander au restaurant."
      ],
      cuisine: [
        "La clé d'une cuisine réussie est dans la préparation. Lisez la recette en entier avant de commencer et préparez tous vos ingrédients (mise en place). Cela rend le processus plus fluide et réduit les risques d'erreur, surtout pour les recettes complexes.",
        "Investissez dans quelques outils de qualité plutôt que dans un grand nombre d'ustensiles peu utilisés. Un bon couteau de chef, une planche à découper solide et une poêle en fonte sont essentiels et vous serviront pendant des années.",
        "Pour améliorer instantanément le goût de vos plats, utilisez des herbes fraîches plutôt que séchées quand c'est possible. Ajoutez-les en fin de cuisson pour préserver leur arôme. Un peu de zeste d'agrume ou quelques gouttes de vinaigre peuvent également réveiller les saveurs d'un plat trop plat.",
        "La cuisson de la viande continue après l'avoir retirée du feu (cuisson résiduelle). Sortez-la légèrement avant qu'elle n'atteigne la température souhaitée et laissez-la reposer. Ce repos permet également aux jus de se redistribuer, rendant la viande plus juteuse."
      ],
      default: [
        "Merci pour votre question! Pour vous donner une réponse plus précise, pourriez-vous me donner plus de détails ou reformuler votre demande? Je suis spécialisé dans les domaines du marketing digital, SEO, YouTube, signatures email et réseaux sociaux.",
        "Votre question touche un sujet intéressant. Pour mieux vous aider, pourriez-vous préciser dans quel contexte vous souhaitez appliquer ces informations? Cela me permettra de personnaliser ma réponse selon vos besoins spécifiques.",
        "J'aimerais vous fournir des informations pertinentes sur ce sujet. Pourriez-vous partager un peu plus sur votre objectif ou le problème spécifique que vous cherchez à résoudre? Cela m'aidera à orienter ma réponse de façon plus adaptée.",
        "C'est un sujet qui mérite une analyse approfondie. Pour vous offrir les conseils les plus utiles, pourriez-vous me préciser si vous cherchez des informations générales ou si vous avez une situation particulière à laquelle vous voulez appliquer ces connaissances?"
      ]
    };
    
    // Déterminer la catégorie de la question
    let category = "default";
    
    if (lowerQuestion.includes("youtube") || lowerQuestion.includes("vidéo") || 
        lowerQuestion.includes("abonné") || lowerQuestion.includes("chaîne") ||
        lowerQuestion.includes("shorts")) {
      category = "youtube";
    } 
    else if (lowerQuestion.includes("email") || lowerQuestion.includes("mail") || 
             lowerQuestion.includes("signature") || lowerQuestion.includes("courriel")) {
      category = "email";
    }
    else if (lowerQuestion.includes("marketing") || lowerQuestion.includes("publicité") || 
             lowerQuestion.includes("promotion") || lowerQuestion.includes("marque")) {
      category = "marketing";
    }
    else if (lowerQuestion.includes("seo") || lowerQuestion.includes("référencement") || 
             lowerQuestion.includes("google") || lowerQuestion.includes("classement")) {
      category = "seo";
    }
    else if (lowerQuestion.includes("instagram") || lowerQuestion.includes("facebook") || 
             lowerQuestion.includes("tiktok") || lowerQuestion.includes("linkedin") ||
             lowerQuestion.includes("réseau social") || lowerQuestion.includes("réseau")) {
      category = "social";
    }
    else if (lowerQuestion.includes("quora") || lowerQuestion.includes("question") || 
             lowerQuestion.includes("réponse") || lowerQuestion.includes("forum")) {
      category = "quora";
    }
    else if (lowerQuestion.includes("voyage") || lowerQuestion.includes("destination") || 
             lowerQuestion.includes("vacances") || lowerQuestion.includes("tourisme")) {
      category = "voyage";
    }
    else if (lowerQuestion.includes("cuisine") || lowerQuestion.includes("recette") || 
             lowerQuestion.includes("cuisson") || lowerQuestion.includes("ingrédient")) {
      category = "cuisine";
    }
    
    // Sélectionner une réponse aléatoire dans la catégorie appropriée
    const categoryResponses = responses[category as keyof typeof responses];
    const randomIndex = Math.floor(Math.random() * categoryResponses.length);
    let response = categoryResponses[randomIndex];
    
    // Personnaliser la réponse en intégrant des éléments de la question
    response = response.replace(/\[question\]/g, userQuestion);
    
    // S'assurer que la réponse a une longueur minimale
    if (response.length < 500) {
      response += "\n\nN'hésitez pas à me poser des questions plus spécifiques si vous souhaitez approfondir ce sujet. Je suis là pour vous aider à obtenir les informations les plus pertinentes pour votre situation.";
    }
    
    return response;
  };

  const handleUseResponse = (response: string) => {
    onUseResponse(response);
    toast.success("Réponse utilisée dans votre signature");
  };
  
  const handleReplyClick = (index: number) => {
    setIsReplyMode(true);
    setReplyingToIndex(index);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const insertLink = () => {
    if (!linkUrl.trim() || !linkText.trim()) {
      toast.error("Veuillez saisir une URL et un texte pour le lien");
      return;
    }
    
    const formattedLink = `[${linkText}](${linkUrl})`;
    
    // Insérer le lien à la position du curseur ou remplacer la sélection
    const currentQuestion = question;
    const newQuestion = 
      currentQuestion.substring(0, selectionStart) + 
      formattedLink + 
      currentQuestion.substring(selectionEnd);
    
    setQuestion(newQuestion);
    setShowLinkPopover(false);
    setLinkUrl("");
    setLinkText("");
    
    // Remettre le focus sur le textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const handleTextareaSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      setSelectionStart(start);
      setSelectionEnd(end);
      
      // Si du texte est sélectionné, l'utiliser comme texte du lien
      if (start !== end) {
        const selectedText = question.substring(start, end);
        setLinkText(selectedText);
      }
    }
  };

  return (
    <Card className="p-4 border-t-4 border-t-primary">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bot className="w-5 h-5 text-primary" />
        Assistant IA pour signatures
      </h3>
      
      <div className="mb-4 max-h-60 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-md">
        {conversation.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Posez une question sur les signatures email, marketing, YouTube ou SEO pour obtenir des conseils personnalisés.
          </p>
        ) : (
          conversation.map((message, index) => (
            <div 
              key={index} 
              className={`flex gap-2 p-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-gray-100 ml-4' 
                  : 'bg-primary/10 mr-4'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 mt-1 flex-shrink-0" />
              ) : (
                <Bot className="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
              )}
              <div className="flex-1">
                <p className="text-sm whitespace-pre-wrap" 
                   dangerouslySetInnerHTML={{
                     __html: message.content.replace(
                       /\[([^\]]+)\]\(([^)]+)\)/g,
                       '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>'
                     )
                   }} 
                />
                <div className="mt-1 flex items-center justify-between">
                  {message.role === 'assistant' ? (
                    <>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto text-xs"
                        onClick={() => handleUseResponse(message.content)}
                      >
                        Utiliser cette réponse
                      </Button>
                      <span className="text-xs text-gray-500">{message.content.length} caractères</span>
                    </>
                  ) : (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-xs ml-auto"
                      onClick={() => handleReplyClick(index)}
                    >
                      Répondre
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="ml-2 text-sm">Génération de la réponse...</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Insérer un lien</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Texte du lien"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    placeholder="URL (https://...)"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={insertLink}
                      className="text-xs"
                    >
                      Insérer
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex-1 relative">
            {isReplyMode && (
              <div className="absolute -top-6 left-0 text-xs flex items-center text-gray-500">
                <span>En réponse à la question {replyingToIndex !== null ? replyingToIndex + 1 : ''}</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs ml-2"
                  onClick={() => {
                    setIsReplyMode(false);
                    setReplyingToIndex(null);
                  }}
                >
                  Annuler
                </Button>
              </div>
            )}
            <Textarea
              ref={textareaRef}
              placeholder={isReplyMode ? "Écrivez votre réponse..." : "Posez une question (YouTube, SEO, email, marketing)..."}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onSelect={handleTextareaSelection}
              disabled={isLoading}
              className="min-h-[80px] resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {question.length > 0 && `${question.length} caractères`}
          </div>
          <Button type="submit" size="sm" disabled={isLoading} className="ml-auto">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <SendIcon className="w-4 h-4 mr-2" />
                {isReplyMode ? "Répondre" : "Envoyer"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AiAssistant;
