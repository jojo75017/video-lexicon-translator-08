import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, Zap, ArrowRight, CheckCircle2, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ONBOARDING_KEY = 'ebookstudio_onboarding_done';

interface OnboardingGuideProps {
  userName?: string;
}

const steps = [
  {
    icon: BookOpen,
    title: "Bienvenue sur EbookStudio Pro ! 🎉",
    description: "Vous avez accès à la plateforme la plus complète pour créer et publier des ebooks sur Amazon KDP avec l'IA.",
    tips: [
      "Génération de plans structurés avec chapitres",
      "Rédaction complète par IA (Gemini 3 Flash)",
      "Couvertures professionnelles avec Imagen 3",
    ],
  },
  {
    icon: Zap,
    title: "Comment créer votre 1er ebook",
    description: "Suivez le workflow guidé pour passer de l'idée au manuscrit publié en moins d'une heure.",
    tips: [
      "1. Lancez le Workflow IA (P1 → P15) dans la sidebar",
      "2. Entrez votre titre — l'IA fait le reste",
      "3. Exportez en PDF/EPUB et publiez sur KDP",
    ],
  },
  {
    icon: Rocket,
    title: "Explorez toutes les fonctionnalités",
    description: "Votre accès à vie inclut bien plus que la création d'ebooks.",
    tips: [
      "🎧 Audiobooks avec voix neurales Azure",
      "🎓 18 modules de formation inclus",
      "📊 Recherche de mots-clés KDP intégrée",
    ],
  },
];

export const OnboardingGuide = ({ userName }: OnboardingGuideProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleSkip(); }}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border bg-card text-foreground">
        {/* Progress */}
        <div className="flex gap-1.5 px-6 pt-5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-5 shadow-lg">
              <StepIcon className="w-8 h-8 text-primary-foreground" />
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-foreground mb-2">{step.title}</h2>
            <p className="text-muted-foreground mb-5">{step.description}</p>

            {/* Tips */}
            <div className="space-y-2.5 mb-6">
              {step.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button onClick={handleSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Passer l'intro
              </button>
              <Button onClick={handleNext} className="font-bold rounded-xl px-6 gap-2">
                {currentStep < steps.length - 1 ? (
                  <>Suivant <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>C'est parti ! <Sparkles className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step counter */}
        <div className="px-6 pb-4 text-center">
          <span className="text-xs text-muted-foreground">{currentStep + 1} / {steps.length}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
