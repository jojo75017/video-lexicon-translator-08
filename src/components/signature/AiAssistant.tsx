
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
      
      // Système de réponse amélioré basé sur des mots-clés dans la question
      let aiResponse = "";
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes("youtube") || lowerQuestion.includes("abonnés") || lowerQuestion.includes("vues")) {
        aiResponse = "Pour obtenir 1 000 abonnés rapidement sur YouTube, concentrez-vous sur des stratégies éthiques comme la collaboration avec d'autres créateurs, l'optimisation de vos titres/descriptions avec des mots-clés pertinents, et la promotion de votre contenu sur d'autres plateformes sociales. Créez un contenu de qualité qui répond à un besoin spécifique ou résout un problème pour votre audience cible. Attention cependant: la croissance organique prend généralement plus de temps, et les méthodes pour gagner 1 000 abonnés en une seule journée peuvent violer les conditions d'utilisation de YouTube et mettre votre chaîne en danger.";
      } 
      else if (lowerQuestion.includes("signature") && lowerQuestion.includes("professionnelle")) {
        aiResponse = "Une signature professionnelle devrait inclure votre nom complet, titre, entreprise, numéro de téléphone, email et site web. Pensez à garder un design sobre et élégant qui reflète l'identité visuelle de votre entreprise. Limitez les polices à 1-2 maximum et assurez-vous que votre signature est adaptée aux mobiles.";
      } 
      else if (lowerQuestion.includes("couleur") || lowerQuestion.includes("design")) {
        aiResponse = "Pour un design efficace, choisissez des couleurs qui correspondent à votre identité visuelle. Le bleu inspire confiance, le vert évoque la croissance, le rouge l'énergie. Évitez trop de couleurs vives dans une signature professionnelle et limitez-vous à 2-3 couleurs maximum pour maintenir une cohérence visuelle professionnelle.";
      }
      else if (lowerQuestion.includes("logo")) {
        aiResponse = "Intégrer votre logo dans votre signature email renforce votre image de marque. Assurez-vous qu'il soit de petite taille (idéalement moins de 200px de large) et en format PNG avec un fond transparent. Le positionnement optimal est généralement en haut ou à gauche de votre signature pour une meilleure visibilité.";
      }
      else if (lowerQuestion.includes("lien") || lowerQuestion.includes("url")) {
        aiResponse = "Pour ajouter des liens cliquables, sélectionnez le texte et utilisez le bouton de lien. Vous pouvez inclure des liens vers votre site web, profils sociaux ou calendrier de réunion. Assurez-vous que tous les liens fonctionnent correctement et envisagez d'utiliser des icônes reconnaissables pour les réseaux sociaux plutôt que de longs URL.";
      }
      else if (lowerQuestion.includes("seo") || lowerQuestion.includes("référencement")) {
        aiResponse = "Pour améliorer le SEO de votre site, concentrez-vous sur la création de contenu de qualité qui répond aux besoins de vos utilisateurs. Optimisez vos balises title et meta descriptions, utilisez des mots-clés pertinents dans votre contenu, améliorez la vitesse de chargement de votre site et assurez-vous qu'il est mobile-friendly. Les backlinks de qualité restent également un facteur important pour le référencement naturel.";
      }
      else if (lowerQuestion.includes("marketing") || lowerQuestion.includes("publicité")) {
        aiResponse = "Une stratégie de marketing digital efficace combine plusieurs canaux : SEO, publicité payante, marketing par email, réseaux sociaux et content marketing. L'important est d'identifier où se trouve votre audience cible et d'adapter votre message en fonction de chaque plateforme. Mesurez régulièrement vos résultats avec des outils d'analyse pour optimiser votre retour sur investissement.";
      }
      else {
        aiResponse = "Je suis votre assistant pour répondre à vos questions. Votre question semble porter sur un sujet que je n'ai pas spécifiquement identifié. N'hésitez pas à me poser des questions sur les signatures email, le marketing digital, le SEO, YouTube, ou tout autre sujet lié au web et aux médias sociaux, et je ferai de mon mieux pour vous fournir une réponse détaillée et utile.";
      }
      
      // S'assurer que la réponse fait au moins 500 caractères
      if (aiResponse.length < 500) {
        const additionalInfo = "Pour approfondir ce sujet, je vous recommande également d'explorer les dernières tendances et meilleures pratiques dans ce domaine. Les technologies et stratégies évoluent rapidement, et rester informé des développements récents vous donnera un avantage concurrentiel. N'hésitez pas à me poser des questions plus spécifiques sur certains aspects particuliers qui vous intéressent, et je pourrai vous donner des conseils plus ciblés adaptés à votre situation.";
        aiResponse += " " + additionalInfo;
      }
      
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
