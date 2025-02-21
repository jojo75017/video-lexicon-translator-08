
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
import InstagramStep from './writer/InstagramStep';
import TwitterStep from './writer/TwitterStep';
import LinkedInStep from './writer/LinkedInStep';
import FacebookStep from './writer/FacebookStep';
import { generateContentWithWordCount } from '@/utils/seo/contentGenerator';

interface AiWriterProps {
  keywords: KeywordSuggestion[];
  onContentGenerated: (content: { title: string; intro: string; sections: Array<{ heading: string; content: string; }> }) => void;
}

type SocialMode = 'default' | 'quora' | 'instagram' | 'twitter' | 'linkedin' | 'facebook';

const AiWriter: React.FC<AiWriterProps> = ({ keywords, onContentGenerated }) => {
  const [step, setStep] = useState(1);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [wordCount, setWordCount] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [socialMode, setSocialMode] = useState<SocialMode>('default');
  const [showResponse, setShowResponse] = useState(false);
  
  // Quora state
  const [quoraTitle, setQuoraTitle] = useState('');
  const [quoraQuestion, setQuoraQuestion] = useState('');
  const [quoraAnswer, setQuoraAnswer] = useState('');
  const [quoraLink, setQuoraLink] = useState('');

  // Instagram state
  const [igPostTitle, setIgPostTitle] = useState('');
  const [igDescription, setIgDescription] = useState('');
  const [igTone, setIgTone] = useState('excited');
  
  // Twitter state
  const [tweetSubject, setTweetSubject] = useState('');
  const [tweetCount, setTweetCount] = useState(2);
  const [tweetTone, setTweetTone] = useState('excited');
  
  // LinkedIn state
  const [linkedinTitle, setLinkedinTitle] = useState('');
  const [linkedinDescription, setLinkedinDescription] = useState('');
  const [linkedinTone, setLinkedinTone] = useState('excited');
  
  // Facebook state
  const [fbPostTitle, setFbPostTitle] = useState('');
  const [fbDescription, setFbDescription] = useState('');
  const [fbTone, setFbTone] = useState('excited');

  const handleSocialModeClick = (mode: SocialMode) => {
    setSocialMode(mode);
    setStep(2);
    setShowResponse(false);
  };

  const handleSubmit = () => {
    let isValid = true;
    let errorMessage = '';

    switch (socialMode) {
      case 'quora':
        if (!quoraTitle || !quoraQuestion || !quoraAnswer) {
          isValid = false;
          errorMessage = "Veuillez remplir tous les champs obligatoires pour Quora";
        }
        break;
      case 'instagram':
        if (!igPostTitle || !igDescription) {
          isValid = false;
          errorMessage = "Veuillez remplir tous les champs obligatoires pour Instagram";
        }
        break;
      case 'twitter':
        if (!tweetSubject || tweetCount < 1) {
          isValid = false;
          errorMessage = "Veuillez remplir tous les champs obligatoires pour Twitter";
        }
        break;
      case 'linkedin':
        if (!linkedinTitle || !linkedinDescription) {
          isValid = false;
          errorMessage = "Veuillez remplir tous les champs obligatoires pour LinkedIn";
        }
        break;
      case 'facebook':
        if (!fbPostTitle || !fbDescription) {
          isValid = false;
          errorMessage = "Veuillez remplir tous les champs obligatoires pour Facebook";
        }
        break;
    }

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    setShowResponse(true);
    toast.success(`Contenu ${socialMode} généré avec succès !`);
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
      if (step === 2) {
        setSocialMode('default');
      }
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
            {socialMode === 'default' ? 'Rédacteur IA 2.0' : 
             socialMode === 'quora' ? 'Générateur de réponses Quora' :
             socialMode === 'instagram' ? 'Générateur de posts Instagram' :
             socialMode === 'twitter' ? 'Générateur de fils Twitter' :
             socialMode === 'linkedin' ? 'Générateur de posts LinkedIn' :
             'Générateur de posts Facebook'}
          </h3>
          <Progress value={step * 33.33} className="h-2" />
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <KeywordStep
              selectedKeyword={selectedKeyword}
              keywords={keywords}
              onKeywordChange={setSelectedKeyword}
              onQuoraClick={() => handleSocialModeClick('quora')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => handleSocialModeClick('instagram')}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white"
              >
                Mode Instagram
              </Button>
              <Button 
                onClick={() => handleSocialModeClick('twitter')}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
              >
                Mode Twitter
              </Button>
              <Button 
                onClick={() => handleSocialModeClick('linkedin')}
                className="bg-[#0077b5] hover:bg-[#006396] text-white"
              >
                Mode LinkedIn
              </Button>
              <Button 
                onClick={() => handleSocialModeClick('facebook')}
                className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
              >
                Mode Facebook
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            {socialMode === 'quora' && (
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
                  onSubmit={handleSubmit}
                />
                {showResponse && (
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

            {socialMode === 'instagram' && (
              <InstagramStep
                postTitle={igPostTitle}
                setPostTitle={setIgPostTitle}
                description={igDescription}
                setDescription={setIgDescription}
                tone={igTone}
                setTone={setIgTone}
                onSubmit={handleSubmit}
              />
            )}

            {socialMode === 'twitter' && (
              <TwitterStep
                subject={tweetSubject}
                setSubject={setTweetSubject}
                count={tweetCount}
                setCount={setTweetCount}
                tone={tweetTone}
                setTone={setTweetTone}
                onSubmit={handleSubmit}
              />
            )}

            {socialMode === 'linkedin' && (
              <LinkedInStep
                title={linkedinTitle}
                setTitle={setLinkedinTitle}
                description={linkedinDescription}
                setDescription={setLinkedinDescription}
                tone={linkedinTone}
                setTone={setLinkedinTone}
                onSubmit={handleSubmit}
              />
            )}

            {socialMode === 'facebook' && (
              <FacebookStep
                title={fbPostTitle}
                setTitle={setFbPostTitle}
                description={fbDescription}
                setDescription={setFbDescription}
                tone={fbTone}
                setTone={setFbTone}
                onSubmit={handleSubmit}
              />
            )}
          </>
        )}

        {step === 2 && socialMode === 'default' && (
          <LanguageStep
            language={language}
            wordCount={wordCount}
            onLanguageChange={setLanguage}
            onWordCountChange={setWordCount}
          />
        )}

        {step === 3 && socialMode === 'default' && (
          <SummaryStep
            selectedKeyword={selectedKeyword}
            language={language}
            wordCount={wordCount}
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

          {socialMode === 'default' && step < 3 && (
            <Button onClick={handleNext}>
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {socialMode === 'default' && step === 3 && (
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
