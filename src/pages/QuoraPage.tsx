
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/dashboard/PageHeader";
import TabNavigation from "@/components/dashboard/TabNavigation";
import QuoraButton from "@/components/seo/buttons/QuoraButton";
import { MessageSquareText } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateQuoraContent } from "@/utils/seo/quoraGenerator";

const QuoraPage = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error("Veuillez saisir une question");
      return;
    }
    
    if (response.trim()) {
      setIsSubmitted(true);
      toast.success("Votre réponse a été enregistrée !");
    } else {
      toast.error("Veuillez saisir une réponse");
    }
  };

  const handleGenerateResponse = () => {
    if (!question.trim()) {
      toast.error("Veuillez d'abord saisir une question");
      return;
    }

    const content = generateQuoraContent(
      question,
      500,
      undefined,
      'expert'
    );

    setGeneratedResponse(content.answer);
    toast.success("Réponse générée avec succès");
  };

  const useGeneratedResponse = () => {
    setResponse(generatedResponse);
    setGeneratedResponse("");
    toast.success("Réponse ajoutée au formulaire");
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <PageHeader 
          title="Quora - Questions et Réponses"
          description="Gérez et optimisez votre présence sur Quora pour améliorer votre visibilité"
          icon={<MessageSquareText className="h-6 w-6 text-[#b92b27]" />}
        />
      </div>
      
      <TabNavigation />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg bg-white border-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1 h-6 bg-[#b92b27] rounded-full mr-3"></span>
            Assistant Quora
          </h2>
          
          <div className="flex flex-col space-y-6">
            <p className="text-lg">
              Utilisez notre assistant Quora pour créer des questions pertinentes et des réponses de haute qualité qui augmenteront votre visibilité et établiront votre autorité sur la plateforme.
            </p>
            
            <div className="flex justify-center py-4">
              <QuoraButton />
            </div>
            
            <div className="bg-[#b92b27]/5 p-4 rounded-lg border border-[#b92b27]/20">
              <h3 className="font-semibold text-[#b92b27] mb-2">Conseils pour réussir sur Quora</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Répondez régulièrement aux questions liées à votre domaine d'expertise</li>
                <li>Incluez des exemples concrets et des données vérifiables dans vos réponses</li>
                <li>Utilisez des histoires personnelles pour rendre vos réponses mémorables</li>
                <li>Ajoutez des images ou des graphiques pertinents pour illustrer vos points</li>
                <li>Suivez les sujets pertinents pour votre secteur d'activité</li>
              </ul>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 shadow-lg bg-white border-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1 h-6 bg-[#b92b27] rounded-full mr-3"></span>
            Répondre à une question
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="question" className="block text-sm font-medium">
                Question à répondre
              </label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Quelle est votre question ?"
                className="min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={handleGenerateResponse}
                  variant="outline" 
                  size="sm"
                  className="text-xs border-[#b92b27] text-[#b92b27] hover:bg-[#b92b27]/10"
                >
                  Générer une réponse professionnelle
                </Button>
              </div>
            </div>
            
            {generatedResponse && (
              <div className="space-y-2 bg-[#b92b27]/5 p-4 rounded-lg border border-[#b92b27]/20">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[#b92b27]">Réponse générée</h3>
                  <Button 
                    type="button" 
                    onClick={useGeneratedResponse}
                    size="sm" 
                    className="bg-[#b92b27] hover:bg-[#a02622] text-white text-xs"
                  >
                    Utiliser cette réponse
                  </Button>
                </div>
                <p className="text-sm whitespace-pre-wrap">{generatedResponse}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="response" className="block text-sm font-medium">
                Votre réponse
              </label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Rédigez votre réponse ici..."
                className="min-h-[150px]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#b92b27] hover:bg-[#a02622] text-white"
            >
              Publier ma réponse
            </Button>
          </form>
          
          {isSubmitted && (
            <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Réponse soumise avec succès !</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Question :</p>
                  <p className="text-sm bg-white p-2 rounded border">{question}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Votre réponse :</p>
                  <p className="text-sm bg-white p-2 rounded border whitespace-pre-wrap">{response}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QuoraPage;
