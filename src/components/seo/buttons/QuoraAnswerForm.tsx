
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Send } from 'lucide-react';
import { getResponseForQuestion } from './QuoraConstants';

interface QuoraAnswerFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const QuoraAnswerForm: React.FC<QuoraAnswerFormProps> = ({ onSubmit, loading }) => {
  const [questionToAnswer, setQuestionToAnswer] = useState('');
  const [generatedAnswer, setGeneratedAnswer] = useState('');

  const handleGenerateAnswer = () => {
    if (!questionToAnswer.trim()) {
      toast.error("Veuillez saisir la question à laquelle vous souhaitez répondre");
      return;
    }

    onSubmit({
      question: questionToAnswer,
      type: 'answer'
    });

    // Générer une réponse en utilisant notre nouvelle fonction
    setTimeout(() => {
      const answer = getResponseForQuestion(questionToAnswer);
      setGeneratedAnswer(answer);
    }, 1500);
  };

  const popularQuestions = [
    "Comment améliorer le référencement de mon site e-commerce?",
    "Quelles sont les meilleures stratégies de marketing digital en 2024?",
    "Comment créer un contenu qui engage vraiment mon audience?",
    "Quels sont les outils SEO indispensables pour une petite entreprise?",
    "Comment optimiser ma présence sur les réseaux sociaux?"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question-to-answer" className="font-medium">Question à répondre *</Label>
        <div className="flex gap-2">
          <Input
            id="question-to-answer"
            value={questionToAnswer}
            onChange={(e) => setQuestionToAnswer(e.target.value)}
            placeholder="Copiez-collez une question Quora ici"
            className="flex-1"
          />
          <Button 
            variant="ghost"
            onClick={() => {
              const random = Math.floor(Math.random() * popularQuestions.length);
              setQuestionToAnswer(popularQuestions[random]);
            }}
            className="whitespace-nowrap"
          >
            <Search className="h-4 w-4 mr-2" />
            Exemple
          </Button>
        </div>
      </div>

      {questionToAnswer && (
        <Button 
          onClick={handleGenerateAnswer}
          disabled={loading || !questionToAnswer.trim()} 
          className="w-full bg-[#b92b27] hover:bg-[#a62520]"
        >
          {loading ? (
            <>Génération en cours...</>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Générer une réponse
            </>
          )}
        </Button>
      )}

      {generatedAnswer && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-2">Réponse générée</h3>
            <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap">
              {generatedAnswer}
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generatedAnswer);
                  toast.success("Réponse copiée dans le presse-papiers");
                }}
              >
                Copier
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium mb-2 text-blue-700">Conseils pour une réponse efficace</h3>
            <ul className="list-disc pl-5 space-y-1 text-blue-700">
              <li>Personnalisez cette réponse avec vos propres expériences</li>
              <li>Ajoutez des exemples concrets pour illustrer vos points</li>
              <li>Incluez des données ou statistiques si pertinent</li>
              <li>Formatez votre réponse pour faciliter la lecture</li>
              <li>Ajoutez un call-to-action subtil à la fin si approprié</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoraAnswerForm;
