
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { StepBack, StepForward, ArrowRight, Languages } from 'lucide-react';
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo";

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

  const generateFrenchContent = (keyword: string) => {
    return {
      title: `Guide Complet : ${keyword} - Tout ce que vous devez savoir`,
      intro: `Découvrez notre guide détaillé sur ${keyword}. Dans cet article, nous explorons les aspects essentiels, les meilleures pratiques et les conseils d'experts pour optimiser votre approche.`,
      sections: [
        {
          heading: `Les Fondamentaux de ${keyword}`,
          content: `Pour bien comprendre ${keyword}, il est essentiel de maîtriser les bases. Notre expertise nous permet d'identifier les éléments clés qui font la différence. Nous avons analysé les meilleures pratiques du marché et compilé les stratégies les plus efficaces pour vous aider à exceller dans ce domaine.`
        },
        {
          heading: `Optimisation et Stratégies pour ${keyword}`,
          content: `L'optimisation de ${keyword} nécessite une approche méthodique et bien planifiée. Nos experts ont développé des stratégies éprouvées qui vous permettront d'obtenir des résultats concrets. Découvrez comment maximiser votre potentiel et atteindre vos objectifs avec des techniques innovantes et efficaces.`
        },
        {
          heading: `L'Avenir de ${keyword}`,
          content: `Les tendances actuelles indiquent que ${keyword} continuera d'évoluer rapidement. Restez en avance sur la concurrence en adoptant les dernières innovations et en préparant votre stratégie pour l'avenir. Notre analyse des tendances émergentes vous aide à anticiper les changements et à adapter votre approche en conséquence.`
        }
      ]
    };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.info("Génération du contenu en cours...");

    try {
      const content = generateFrenchContent(selectedKeyword);
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
          <h3 className="text-lg font-semibold">Rédacteur IA 2.0</h3>
          <Progress value={step * 33.33} className="h-2" />
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Label>Sélectionnez un mot-clé</Label>
            <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un mot-clé" />
              </SelectTrigger>
              <SelectContent>
                {keywords.map((kw, index) => (
                  <SelectItem key={index} value={kw.keyword}>
                    {kw.keyword} (Volume: {kw.searchVolume || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="language">Langue</Label>
              <div className="flex items-center mt-2 space-x-2">
                <Languages className="h-4 w-4" />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Choisissez une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="wordCount">Nombre de mots souhaité</Label>
              <Input
                id="wordCount"
                type="number"
                min="100"
                max="2000"
                step="100"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Récapitulatif</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>Mot-clé : {selectedKeyword}</li>
                <li>Langue : {language === 'fr' ? 'Français' : language === 'en' ? 'Anglais' : 'Espagnol'}</li>
                <li>Nombre de mots : {wordCount}</li>
              </ul>
            </div>
          </div>
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

          {step < 3 ? (
            <Button onClick={handleNext}>
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
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
