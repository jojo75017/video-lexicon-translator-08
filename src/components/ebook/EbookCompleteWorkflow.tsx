import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, BookOpen, CheckCircle2, Loader2, AlertCircle,
  Rocket, Target, TrendingUp, Layers, FileText, Award, User, Hash
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface EbookCompleteWorkflowProps {
  onComplete: (bookData: any) => void;
}

const workflowSteps = [
  { id: 'P1', name: 'Directeur Éditorial', icon: Target, description: 'Vision stratégique et analyse du projet' },
  { id: 'P2', name: 'Analyse de Marché', icon: TrendingUp, description: 'Positionnement Amazon KDP' },
  { id: 'P3', name: 'Architecte de Contenu', icon: Layers, description: 'Structure détaillée des chapitres' },
  { id: 'P4', name: 'Rédaction Experte', icon: FileText, description: 'Écriture professionnelle du contenu' },
  { id: 'P5', name: 'Réécriture Naturelle', icon: Sparkles, description: 'Humanisation du texte' },
  { id: 'P6', name: 'Qualité Éditoriale', icon: CheckCircle2, description: 'Contrôle qualité approfondi' },
  { id: 'P7', name: 'Packaging Éditorial', icon: BookOpen, description: 'Métadonnées et mots-clés KDP' },
  { id: 'P8', name: 'Diagnostic Final', icon: Target, description: 'Vérification cohérence globale' },
  { id: 'P9', name: 'Mémoire Éditoriale', icon: Sparkles, description: 'Capture de votre voix unique' },
  { id: 'P10', name: 'Cohérence Chapitres', icon: Layers, description: 'Transitions fluides entre chapitres' },
  { id: 'P11', name: 'Auto-Critique', icon: AlertCircle, description: 'Détection des faiblesses' },
  { id: 'P12', name: 'Boucle Itérative', icon: Sparkles, description: 'Améliorations automatiques' },
  { id: 'P13', name: 'Signature de Style', icon: Award, description: 'Voix d\'auteur unifiée' },
  { id: 'P14', name: 'Verdict Ultime', icon: CheckCircle2, description: 'Validation finale par l\'éditeur' },
];

const EbookCompleteWorkflow: React.FC<EbookCompleteWorkflowProps> = ({ onComplete }) => {
  // Form state
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [numberOfChapters, setNumberOfChapters] = useState(8);
  
  // Workflow state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepResults, setStepResults] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generateCompleteBook = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer un titre pour votre ebook');
      return;
    }
    if (!authorName.trim()) {
      toast.error('Veuillez entrer votre nom d\'auteur');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStep(0);
    setProgress(0);
    setStepResults({});

    // Animate through steps while waiting for AI
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev < 13 ? prev + 1 : prev;
        setProgress(((next + 1) / 14) * 100);
        
        // Add simulated result for visual feedback
        if (prev >= 0 && prev < 14) {
          setStepResults(results => ({
            ...results,
            [workflowSteps[prev].id]: `✓ ${workflowSteps[prev].description} - Terminé`
          }));
        }
        
        return next;
      });
    }, 2500);

    try {
      toast.info('🚀 Le Directeur Éditorial lance le workflow complet...');

      const { data, error: fnError } = await supabase.functions.invoke('complete-book-workflow', {
        body: {
          title,
          authorName,
          numberOfChapters
        }
      });

      clearInterval(stepInterval);

      if (fnError) {
        throw new Error(fnError.message || 'Erreur lors de la génération');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.success && data?.book) {
        // Mark all steps complete
        setCurrentStep(14);
        setProgress(100);
        
        const allResults: Record<string, string> = {};
        workflowSteps.forEach(step => {
          allResults[step.id] = `✓ ${step.description} - Terminé`;
        });
        setStepResults(allResults);
        
        toast.success('✅ Livre généré avec succès ! Prêt pour publication KDP.');
        onComplete(data.book);
      } else {
        throw new Error('Réponse inattendue du serveur');
      }

    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Complete workflow error:', err);
      
      const errorMessage = err.message || 'Erreur lors de la génération';
      setError(errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const estimatedPages = Math.round(numberOfChapters * 12);
  const canGenerate = title.trim() && authorName.trim();

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-amber-500/5">
        <CardHeader className="text-center pb-4">
          <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 mx-auto">
            <Sparkles className="h-4 w-4" />
            Workflow IA Éditorial Complet
          </div>
          <CardTitle className="text-2xl font-bold">
            Créer votre livre en 1 clic
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Entrez les informations de base, lisez les étapes ci-dessous, puis lancez la génération.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Form Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Titre du livre
              </Label>
              <Input
                id="title"
                placeholder="Ex: Les secrets de la productivité"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isGenerating}
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Nom d'auteur
              </Label>
              <Input
                id="author"
                placeholder="Ex: Jean Dupont"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={isGenerating}
                className="text-lg"
              />
            </div>
          </div>

          {/* Chapters Slider */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Nombre de chapitres
              </Label>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {numberOfChapters} chapitres
                </Badge>
                <Badge variant="outline" className="text-sm">
                  ~{estimatedPages} pages
                </Badge>
              </div>
            </div>
            <Slider
              value={[numberOfChapters]}
              onValueChange={(value) => setNumberOfChapters(value[0])}
              min={3}
              max={20}
              step={1}
              disabled={isGenerating}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3 chapitres (court)</span>
              <span>20 chapitres (long)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps Card - ALWAYS VISIBLE */}
      <Card className="border border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Les 14 étapes du Directeur Éditorial
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Voici ce que le système va faire automatiquement pour créer votre livre :
          </p>
          
          {/* Progress bar - only visible when generating */}
          {isGenerating && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Étape {currentStep + 1} sur 14
                </span>
                <span className="font-semibold text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Steps List - Always visible */}
          <div className="grid gap-2">
            {workflowSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = isGenerating && index === currentStep;
              const isCompleted = isGenerating && (index < currentStep || currentStep >= 14);
              const result = stepResults[step.id];
              
              return (
                <motion.div
                  key={step.id}
                  initial={false}
                  animate={{ 
                    opacity: isGenerating ? (isCompleted || isActive ? 1 : 0.4) : 1,
                    scale: isActive ? 1.02 : 1
                  }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-all
                    ${isCompleted ? 'bg-green-500/10 border border-green-500/30' : ''}
                    ${isActive ? 'bg-primary/10 border border-primary/30 shadow-md' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted/20 border border-muted/30' : ''}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center shrink-0
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isActive ? 'bg-primary text-white animate-pulse' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={isCompleted ? 'default' : isActive ? 'secondary' : 'outline'} 
                        className="text-xs"
                      >
                        {step.id}
                      </Badge>
                      <span className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                        {step.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {result || step.description}
                    </p>
                  </div>

                  {isActive && (
                    <div className="text-xs text-primary font-medium animate-pulse">
                      En cours...
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Final Success Message */}
          {currentStep >= 14 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-green-700 dark:text-green-400">
                Livre généré avec succès !
              </p>
              <p className="text-sm text-muted-foreground">
                Le Verdict Éditeur Ultime a validé votre projet. Prêt pour KDP.
              </p>
            </motion.div>
          )}

          {/* Generate Button - At the bottom after reading all steps */}
          {currentStep < 14 && (
            <div className="pt-4 border-t border-border">
              <motion.div
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                className="text-center"
              >
                <Button
                  size="lg"
                  onClick={generateCompleteBook}
                  disabled={isGenerating || !canGenerate}
                  className="gap-3 px-10 py-7 text-lg font-bold bg-gradient-to-r from-primary via-amber-500 to-orange-500 hover:from-primary/90 hover:via-amber-500/90 hover:to-orange-500/90 shadow-xl shadow-primary/30 transition-all duration-300 w-full max-w-md"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-6 w-6" />
                      J'ai lu les étapes, générer mon livre
                    </>
                  )}
                </Button>
                
                {!canGenerate && (
                  <p className="text-sm text-destructive mt-2">
                    Veuillez remplir le titre et le nom d'auteur
                  </p>
                )}
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Erreur de génération</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EbookCompleteWorkflow;
