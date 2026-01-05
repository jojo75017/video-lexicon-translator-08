import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, BookOpen, CheckCircle2, Loader2, AlertCircle,
  Rocket, Target, TrendingUp, Layers, FileText, Award
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface EbookCompleteWorkflowProps {
  title: string;
  authorName: string;
  targetAudience?: string;
  genre?: string;
  numberOfChapters?: number;
  onComplete: (bookData: any) => void;
}

const workflowSteps = [
  { id: 'P1', name: 'Directeur Éditorial', icon: Target, description: 'Vision stratégique' },
  { id: 'P2', name: 'Analyse de Marché', icon: TrendingUp, description: 'Positionnement KDP' },
  { id: 'P3', name: 'Architecte de Contenu', icon: Layers, description: 'Structure des chapitres' },
  { id: 'P4', name: 'Rédaction Experte', icon: FileText, description: 'Écriture du contenu' },
  { id: 'P5', name: 'Réécriture Naturelle', icon: Sparkles, description: 'Humanisation du texte' },
  { id: 'P6', name: 'Qualité Éditoriale', icon: CheckCircle2, description: 'Contrôle qualité' },
  { id: 'P7', name: 'Packaging Éditorial', icon: BookOpen, description: 'Métadonnées KDP' },
  { id: 'P8', name: 'Diagnostic Final', icon: Target, description: 'Cohérence globale' },
  { id: 'P9', name: 'Mémoire Éditoriale', icon: Sparkles, description: 'Capture de votre voix' },
  { id: 'P10', name: 'Cohérence Chapitres', icon: Layers, description: 'Transitions fluides' },
  { id: 'P11', name: 'Auto-Critique', icon: AlertCircle, description: 'Détection faiblesses' },
  { id: 'P12', name: 'Boucle Itérative', icon: Sparkles, description: 'Améliorations' },
  { id: 'P13', name: 'Signature de Style', icon: Award, description: 'Voix unifiée' },
  { id: 'P14', name: 'Verdict Ultime', icon: CheckCircle2, description: 'Validation finale' },
];

const EbookCompleteWorkflow: React.FC<EbookCompleteWorkflowProps> = ({
  title,
  authorName,
  targetAudience,
  genre,
  numberOfChapters = 8,
  onComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generateCompleteBook = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer un titre pour votre ebook');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStep(0);
    setProgress(0);

    // Simulate progress through steps while waiting for AI
    const progressInterval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev < 13 ? prev + 1 : prev;
        setProgress((next / 14) * 100);
        return next;
      });
    }, 3000); // Each step takes ~3 seconds visually

    try {
      toast.info('🚀 Génération en cours... Le Directeur Éditorial orchestre les 14 modules IA.');

      const { data, error: fnError } = await supabase.functions.invoke('complete-book-workflow', {
        body: {
          title,
          authorName,
          targetAudience,
          genre,
          numberOfChapters
        }
      });

      clearInterval(progressInterval);

      if (fnError) {
        throw new Error(fnError.message || 'Erreur lors de la génération');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.success && data?.book) {
        setCurrentStep(14);
        setProgress(100);
        
        toast.success('✅ Livre généré avec succès ! Le Verdict Éditeur Ultime a validé votre projet.');
        
        // Pass the complete book data to parent
        onComplete(data.book);
      } else if (data?.rawContent) {
        // Partial success
        toast.warning('⚠️ Le livre a été généré mais le format nécessite des ajustements.');
        setError('Contenu généré mais format à vérifier. Veuillez réessayer.');
      } else {
        throw new Error('Réponse inattendue du serveur');
      }

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('Complete workflow error:', err);
      
      const errorMessage = err.message || 'Erreur lors de la génération';
      setError(errorMessage);
      
      if (errorMessage.includes('429') || errorMessage.includes('Limite')) {
        toast.error('Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.');
      } else if (errorMessage.includes('402') || errorMessage.includes('Crédits')) {
        toast.error('Crédits IA épuisés. Veuillez ajouter des crédits.');
      } else {
        toast.error(`Erreur: ${errorMessage}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-amber-500/5">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 mx-auto">
          <Sparkles className="h-4 w-4" />
          Workflow IA Complet
        </div>
        <CardTitle className="text-2xl font-bold">
          Générer le livre complet
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Le Directeur Éditorial orchestre automatiquement les 14 modules IA pour créer votre ebook.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main CTA Button */}
        <div className="text-center">
          <motion.div
            whileHover={{ scale: isGenerating ? 1 : 1.02 }}
            whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          >
            <Button
              size="lg"
              onClick={generateCompleteBook}
              disabled={isGenerating || !title.trim()}
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
                  Générer mon livre complet
                </>
              )}
            </Button>
          </motion.div>
          
          {!title.trim() && (
            <p className="text-sm text-destructive mt-2">
              Veuillez d'abord entrer un titre pour votre ebook
            </p>
          )}
        </div>

        {/* Progress Section */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression du workflow</span>
                  <span className="font-semibold text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Steps Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {workflowSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0.5 }}
                      animate={{ 
                        opacity: isCompleted ? 1 : isActive ? 1 : 0.5,
                        scale: isActive ? 1.05 : 1
                      }}
                      className={`
                        flex flex-col items-center p-2 rounded-lg text-center transition-colors
                        ${isCompleted ? 'bg-green-500/10 border border-green-500/30' : ''}
                        ${isActive ? 'bg-primary/10 border border-primary/30' : ''}
                        ${!isActive && !isCompleted ? 'bg-muted/30' : ''}
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center mb-1
                        ${isCompleted ? 'bg-green-500 text-white' : ''}
                        ${isActive ? 'bg-primary text-white animate-pulse' : ''}
                        ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                      `}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isActive ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <StepIcon className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-[10px] font-medium">{step.id}</span>
                      <span className="text-[9px] text-muted-foreground line-clamp-1">{step.name}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <span className="font-medium text-primary">
                  {workflowSteps[currentStep]?.name || 'Finalisation'}
                </span>
                {' - '}
                {workflowSteps[currentStep]?.description || 'Validation du livre'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Info Section */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Ce que fait le Directeur Éditorial :
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✅ Analyse stratégique de votre projet (P1-P2)</li>
            <li>✅ Structure et rédaction complète des chapitres (P3-P4)</li>
            <li>✅ Humanisation et contrôle qualité (P5-P6)</li>
            <li>✅ Packaging KDP et cohérence narrative (P7-P10)</li>
            <li>✅ Auto-critique et améliorations (P11-P12)</li>
            <li>✅ Signature de style unique + Verdict final (P13-P14)</li>
          </ul>
          <p className="text-xs text-muted-foreground border-t border-border pt-2 mt-2">
            💡 Le résultat est un ebook complet avec une voix d'auteur cohérente, prêt pour KDP.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EbookCompleteWorkflow;
