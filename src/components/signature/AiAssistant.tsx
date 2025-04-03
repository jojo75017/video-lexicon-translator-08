
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, SendIcon, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AiAssistantProps {
  onUseResponse: (response: string) => void;
}

const AiAssistant = ({ onUseResponse }: AiAssistantProps) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Veuillez saisir une question");
      return;
    }

    // Ajouter la question à la conversation
    setConversation(prev => [...prev, { role: 'user', content: question }]);
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
      setConversation(prev => [...prev, { role: 'assistant', content: aiResponse }]);
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
                <p className="text-sm">{message.content}</p>
                {message.role === 'assistant' && (
                  <div className="mt-1 flex items-center justify-between">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-xs"
                      onClick={() => handleUseResponse(message.content)}
                    >
                      Utiliser cette réponse
                    </Button>
                    <span className="text-xs text-gray-500">{message.content.length} caractères</span>
                  </div>
                )}
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
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Posez une question (YouTube, SEO, email, marketing)..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SendIcon className="w-4 h-4" />
          )}
        </Button>
      </form>
    </Card>
  );
};

export default AiAssistant;
