
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

  const handleQuoraClick = () => {
    setIsQuoraMode(true);
    setStep(2);
  };

  const handleQuoraSubmit = () => {
    if (!quoraTitle || !quoraQuestion || !quoraAnswer) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    toast.success("Réponse Quora générée avec succès !");
    // Ici vous pouvez ajouter la logique pour sauvegarder ou utiliser la réponse Quora
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

        {step === 2 && isQuoraMode ? (
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
        ) : step === 2 && (
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
