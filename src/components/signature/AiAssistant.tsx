
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
      // Dans un cas réel, vous feriez un appel API à un service d'IA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réponses prédéfinies selon le type de question
      let aiResponse = "";
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes("signature") && lowerQuestion.includes("professionnelle")) {
        aiResponse = "Une signature professionnelle devrait inclure votre nom complet, titre, entreprise, numéro de téléphone, email et site web. Pensez à garder un design sobre et élégant.";
      } 
      else if (lowerQuestion.includes("couleur") || lowerQuestion.includes("design")) {
        aiResponse = "Pour un design efficace, choisissez des couleurs qui correspondent à votre identité visuelle. Le bleu inspire confiance, le vert évoque la croissance, le rouge l'énergie. Évitez trop de couleurs vives dans une signature professionnelle.";
      }
      else if (lowerQuestion.includes("logo")) {
        aiResponse = "Intégrer votre logo dans votre signature email renforce votre image de marque. Assurez-vous qu'il soit de petite taille (idéalement moins de 200px de large) et en format PNG avec un fond transparent.";
      }
      else if (lowerQuestion.includes("lien") || lowerQuestion.includes("url")) {
        aiResponse = "Pour ajouter des liens cliquables, sélectionnez le texte et utilisez le bouton de lien. Vous pouvez inclure des liens vers votre site web, profils sociaux ou calendrier de réunion.";
      }
      else {
        aiResponse = "Je suis votre assistant pour la création de signature email. Je peux vous conseiller sur le design, les éléments à inclure ou comment optimiser votre signature professionnelle. N'hésitez pas à me poser une question précise.";
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
            Posez une question sur les signatures email pour obtenir des conseils personnalisés.
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
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="mt-1 p-0 h-auto text-xs"
                    onClick={() => handleUseResponse(message.content)}
                  >
                    Utiliser cette réponse
                  </Button>
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
          placeholder="Posez une question sur les signatures email..."
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
