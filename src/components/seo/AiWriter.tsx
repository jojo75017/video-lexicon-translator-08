
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepBack, StepForward, ArrowRight } from 'lucide-react';
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo";
import KeywordStep from './writer/KeywordStep';
import LanguageStep from './writer/LanguageStep';
import SummaryStep from './writer/SummaryStep';
import QuoraStep from './writer/QuoraStep';
import { generateContentWithWordCount } from '@/utils/seo/contentGenerator';

interface AiWriterProps {
  keywords: KeywordSuggestion[];
  onContentGenerated: (content: { title: string; intro: string; sections: Array<{ heading: string; content: string; }> }) => void;
}

const AiWriter: React.FC<AiWriterProps> = ({ keywords, onContentGenerated }) => {
  const [step, setStep] = useState(1);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [wordCount, setWordCount] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [quoraTitle, setQuoraTitle] = useState('');
  const [quoraQuestion, setQuoraQuestion] = useState('');
  const [quoraAnswer, setQuoraAnswer] = useState('');
  const [quoraLink, setQuoraLink] = useState('');
  const [isQuoraMode, setIsQuoraMode] = useState(false);
  const [showQuoraResponse, setShowQuoraResponse] = useState(false);

  const handleQuoraClick = () => {
    setIsQuoraMode(true);
    setStep(2);
    setShowQuoraResponse(false);
  };

  const handleQuoraSubmit = () => {
    if (!quoraTitle || !quoraQuestion || !quoraAnswer) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setShowQuoraResponse(true);
    toast.success("Réponse Quora générée avec succès !");
  };

  const handleNext = () => {
    if (step === 1 && !selectedKeyword) {
      toast.error("Veuillez sélectionner un mot-clé");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.info("Génération du contenu en cours...");

    try {
      const content = generateContentWithWordCount(selectedKeyword, wordCount);
      onContentGenerated(content);
      toast.success("Contenu généré avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la génération du contenu");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {isQuoraMode ? 'Générateur de réponses Quora' : 'Rédacteur IA 2.0'}
          </h3>
          <Progress value={step * 33.33} className="h-2" />
        </div>

        {step === 1 && (
          <KeywordStep
            selectedKeyword={selectedKeyword}
            keywords={keywords}
            onKeywordChange={setSelectedKeyword}
            onQuoraClick={handleQuoraClick}
          />
        )}

        {step === 2 && isQuoraMode && (
          <>
            <QuoraStep
              quoraTitle={quoraTitle}
              setQuoraTitle={setQuoraTitle}
              quoraQuestion={quoraQuestion}
              setQuoraQuestion={setQuoraQuestion}
              quoraAnswer={quoraAnswer}
              setQuoraAnswer={setQuoraAnswer}
              quoraLink={quoraLink}
              setQuoraLink={setQuoraLink}
              onSubmit={handleQuoraSubmit}
            />
            {showQuoraResponse && (
              <Card className="mt-6 p-4 bg-gray-50">
                <h4 className="font-semibold mb-2">{quoraTitle}</h4>
                <p className="text-gray-700 mb-4">{quoraQuestion}</p>
                <div className="bg-white p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{quoraAnswer}</p>
                  {quoraLink && (
                    <a 
                      href={quoraLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-4 block"
                    >
                      En savoir plus
                    </a>
                  )}
                </div>
              </Card>
            )}
          </>
        )}

        {step === 2 && !isQuoraMode && (
          <LanguageStep
            language={language}
            wordCount={wordCount}
            onLanguageChange={setLanguage}
            onWordCountChange={setWordCount}
          />
        )}

        {step === 3 && !isQuoraMode && (
          <SummaryStep
            selectedKeyword={selectedKeyword}
            language={language}
            wordCount={wordCount}
            quoraTitle={quoraTitle}
            quoraQuestion={quoraQuestion}
          />
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <StepBack className="mr-2 h-4 w-4" />
            Retour
          </Button>

          {!isQuoraMode && step < 3 && (
            <Button onClick={handleNext}>
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {!isQuoraMode && step === 3 && (
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <StepForward className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <StepForward className="mr-2 h-4 w-4" />
                  Générer le contenu
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AiWriter;
