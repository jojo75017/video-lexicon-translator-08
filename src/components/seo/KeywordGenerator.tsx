import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { StepBack, StepForward, Check, ArrowRight } from 'lucide-react';
import { toast } from "sonner";

interface KeywordGeneratorProps {
  onKeywordsGenerated: (keywords: Array<{ keyword: string; volume: number; difficulty: number; relevance: number; searchVolume: number; trend: string; competition: number; cpc: number; seasonality: { peak: string[]; low: string[]; }; }>) => void;
}

const KeywordGenerator = ({ onKeywordsGenerated }: KeywordGeneratorProps) => {
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState('');
  const [location, setLocation] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (step === 1 && !domain) {
      toast.error("Veuillez entrer un domaine");
      return;
    }
    if (step === 2 && !location) {
      toast.error("Veuillez entrer une localisation");
      return;
    }
    if (step < 4) {
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
    toast.info("Génération des suggestions de mots-clés...");

    try {
      // Simulation de la génération de mots-clés
      const simulatedKeywords = [
        { 
          keyword: `${domain} ${location}`, 
          relevance: 85,
          searchVolume: Math.floor(Math.random() * 1000), 
          difficulty: Math.floor(Math.random() * 100),
          trend: 'up' as const,
          competition: Math.random(),
          cpc: Math.random() * 5,
          seasonality: {
            peak: ['Jun', 'Jul', 'Aug'],
            low: ['Jan', 'Feb']
          }
        },
        { 
          keyword: `services ${domain}`,
          relevance: 75,
          searchVolume: Math.floor(Math.random() * 1000),
          difficulty: Math.floor(Math.random() * 100)
        },
        { 
          keyword: `${domain} près de ${location}`,
          relevance: 90,
          searchVolume: Math.floor(Math.random() * 1000),
          difficulty: Math.floor(Math.random() * 100)
        }
      ];

      toast.success("Suggestions générées avec succès!");
      onKeywordsGenerated(simulatedKeywords);
    } catch (error) {
      toast.error("Erreur lors de la génération des suggestions");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Générateur de Mots-clés</h3>
        <Progress value={step * 25} className="h-2" />
      </div>

      <div className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <Label htmlFor="domain">Entrez votre domaine</Label>
            <Input
              id="domain"
              placeholder="ex: marketing-digital"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Label htmlFor="location">Localisation de votre entreprise</Label>
            <Input
              id="location"
              placeholder="ex: Paris"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Label htmlFor="competitor">URL d'un concurrent (optionnel)</Label>
            <Input
              id="competitor"
              placeholder="ex: concurrent.com"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Récapitulatif</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Domaine : {domain}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Localisation : {location}
                </li>
                {competitor && (
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Concurrent : {competitor}
                  </li>
                )}
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

          {step < 4 ? (
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
                  Générer les suggestions
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeywordGenerator;
