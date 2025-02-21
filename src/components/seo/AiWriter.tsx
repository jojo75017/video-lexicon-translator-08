
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

  const generateContentWithWordCount = (keyword: string, targetWordCount: number) => {
    // Phrases de base pour la génération de contenu
    const phrases = [
      `Une approche innovante de ${keyword} permet d'obtenir des résultats remarquables.`,
      `Les experts du domaine recommandent fortement l'utilisation de ${keyword} pour optimiser les performances.`,
      `L'impact de ${keyword} sur le marché actuel est indéniable.`,
      `Les dernières études montrent que ${keyword} devient de plus en plus important dans notre secteur.`,
      `Pour maximiser les résultats avec ${keyword}, il est essentiel de suivre les meilleures pratiques.`,
      `L'évolution constante de ${keyword} nécessite une adaptation continue des stratégies.`,
      `Les professionnels qui maîtrisent ${keyword} obtiennent généralement de meilleurs résultats.`,
      `L'intégration de ${keyword} dans votre stratégie peut transformer votre approche.`,
    ];

    // Fonction pour générer un paragraphe avec un nombre de mots cible
    const generateParagraph = (targetWords: number) => {
      let paragraph = '';
      let currentWords = 0;

      while (currentWords < targetWords) {
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        paragraph += ' ' + randomPhrase;
        currentWords = paragraph.split(/\s+/).length;
      }

      return paragraph.trim();
    };

    // Calcul de la répartition des mots
    const introWords = Math.floor(targetWordCount * 0.2); // 20% pour l'intro
    const sectionWords = Math.floor((targetWordCount * 0.8) / 3); // Le reste divisé en 3 sections

    return {
      title: `Guide Complet : ${keyword} - Tout ce que vous devez savoir`,
      intro: generateParagraph(introWords),
      sections: [
        {
          heading: `Les Fondamentaux de ${keyword}`,
          content: generateParagraph(sectionWords)
        },
        {
          heading: `Optimisation et Stratégies pour ${keyword}`,
          content: generateParagraph(sectionWords)
        },
        {
          heading: `L'Avenir de ${keyword}`,
          content: generateParagraph(sectionWords)
        }
      ]
    };
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
