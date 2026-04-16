import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProgressEngagementProps {
  currentStep?: number;
  totalSteps?: number;
  onComplete?: () => void;
}

const ProgressEngagement = ({ 
  currentStep = 1, 
  totalSteps = 5,
  onComplete 
}: ProgressEngagementProps) => {
  const [progress, setProgress] = useState(0);
  const [showCta, setShowCta] = useState(false);
  
  const targetProgress = Math.min((currentStep / totalSteps) * 100, 100);
  
  const steps = [
    { id: 1, label: "Découverte", icon: "👀" },
    { id: 2, label: "Intérêt", icon: "💡" },
    { id: 3, label: "Confiance", icon: "🤝" },
    { id: 4, label: "Décision", icon: "🎯" },
    { id: 5, label: "Action", icon: "🚀" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 300);
    
    if (targetProgress >= 80) {
      setTimeout(() => setShowCta(true), 1000);
    }
    
    return () => clearTimeout(timer);
  }, [targetProgress]);

  const scrollToOffer = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    onComplete?.();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-primary/30 py-3 px-4 md:py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Votre progression vers votre 1er ebook
                </span>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  progress >= 80 
                    ? "bg-primary/20 text-primary border-primary/20 animate-pulse" 
                    : "bg-primary/20 text-primary border-primary/30"
                }`}
              >
                {Math.round(progress)}%
              </Badge>
            </div>
            
            <Progress value={progress} className="h-2 bg-muted" />
            
            <div className="hidden md:flex justify-between mt-2">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-1 text-xs transition-all ${
                    currentStep >= step.id 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  ) : (
                    <span>{step.icon}</span>
                  )}
                  <span className="hidden lg:inline">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showCta && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
              >
                <Button
                  onClick={scrollToOffer}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-4 md:px-6 h-10 shadow-lg shadow-primary/25"
                >
                  <span className="hidden sm:inline">Plus qu'un pas !</span>
                  <ArrowRight className="w-4 h-4 sm:ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProgressEngagement;
