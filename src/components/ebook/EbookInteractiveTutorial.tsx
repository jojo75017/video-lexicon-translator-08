import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, BookOpen, Wand2, CheckCircle2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ReactNode;
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "1. Entrez votre titre",
    description: "Commencez par donner un titre accrocheur à votre ebook. C'est la base de tout !",
    targetSelector: '[data-tutorial="title-input"]',
    position: 'bottom',
    icon: <BookOpen className="w-5 h-5" />,
    action: "Tapez votre titre ici"
  },
  {
    id: 2,
    title: "2. Choisissez le genre",
    description: "Sélectionnez le genre qui correspond à votre livre. Cela aide l'IA à générer un contenu adapté.",
    targetSelector: '[data-tutorial="genre-select"]',
    position: 'bottom',
    icon: <Sparkles className="w-5 h-5" />,
    action: "Cliquez pour choisir"
  },
  {
    id: 3,
    title: "3. Générez le plan !",
    description: "Cliquez sur ce bouton magique pour que l'IA crée automatiquement la structure complète de votre livre.",
    targetSelector: '[data-tutorial="generate-button"]',
    position: 'bottom',
    icon: <Wand2 className="w-5 h-5" />,
    action: "Un clic et c'est parti !"
  }
];

interface EbookInteractiveTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const EbookInteractiveTutorial: React.FC<EbookInteractiveTutorialProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const step = tutorialSteps[currentStep];
      const element = document.querySelector(step.targetSelector);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });

        // Calculate tooltip position based on step.position
        let tooltipTop = 0;
        let tooltipLeft = 0;
        const tooltipWidth = 320;
        const tooltipHeight = 200;
        const offset = 16;

        switch (step.position) {
          case 'top':
            tooltipTop = rect.top + window.scrollY - tooltipHeight - offset;
            tooltipLeft = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'bottom':
            tooltipTop = rect.top + window.scrollY + rect.height + offset;
            tooltipLeft = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'left':
            tooltipTop = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
            tooltipLeft = rect.left + window.scrollX - tooltipWidth - offset;
            break;
          case 'right':
            tooltipTop = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
            tooltipLeft = rect.left + window.scrollX + rect.width + offset;
            break;
        }

        // Ensure tooltip stays within viewport
        tooltipLeft = Math.max(16, Math.min(tooltipLeft, window.innerWidth - tooltipWidth - 16));
        tooltipTop = Math.max(16, tooltipTop);

        setTooltipPosition({ top: tooltipTop, left: tooltipLeft });

        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with spotlight effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            style={{
              background: `radial-gradient(circle at ${targetPosition.left + targetPosition.width / 2}px ${targetPosition.top + targetPosition.height / 2}px, transparent 0px, transparent ${Math.max(targetPosition.width, targetPosition.height) + 20}px, rgba(0,0,0,0.75) ${Math.max(targetPosition.width, targetPosition.height) + 40}px)`
            }}
          />

          {/* Highlight ring around target element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-[101] pointer-events-none"
            style={{
              top: targetPosition.top - 8,
              left: targetPosition.left - 8,
              width: targetPosition.width + 16,
              height: targetPosition.height + 16,
            }}
          >
            <div className="absolute inset-0 rounded-xl border-2 border-primary animate-pulse" />
            <div className="absolute inset-0 rounded-xl ring-4 ring-primary/30" />
          </motion.div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-[102] w-80"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left
            }}
          >
            <div className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {step.action && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-xl border border-primary/20">
                    <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-primary">{step.action}</span>
                  </div>
                )}

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {tutorialSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentStep 
                          ? 'bg-primary w-6' 
                          : index < currentStep 
                            ? 'bg-green-500' 
                            : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Passer le tutoriel
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="gap-2"
                    >
                      {currentStep === tutorialSteps.length - 1 ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Terminer
                        </>
                      ) : (
                        <>
                          Suivant
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow pointing to target */}
            <div 
              className="absolute w-4 h-4 bg-card border-l-2 border-t-2 border-primary/30 transform rotate-45"
              style={{
                top: step.position === 'bottom' ? -8 : step.position === 'top' ? 'auto' : '50%',
                bottom: step.position === 'top' ? -8 : 'auto',
                left: step.position === 'right' ? -8 : step.position === 'left' ? 'auto' : '50%',
                right: step.position === 'left' ? -8 : 'auto',
                transform: step.position === 'bottom' ? 'translateX(-50%) rotate(45deg)' :
                           step.position === 'top' ? 'translateX(-50%) rotate(-135deg)' :
                           step.position === 'right' ? 'translateY(-50%) rotate(-45deg)' :
                           'translateY(-50%) rotate(135deg)',
                marginLeft: (step.position === 'top' || step.position === 'bottom') ? 0 : undefined,
                marginTop: (step.position === 'left' || step.position === 'right') ? 0 : undefined
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
