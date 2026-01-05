import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Sparkles, BookOpen, CheckCircle2, Loader2, AlertCircle,
  Rocket, Target, TrendingUp, Layers, FileText, Award, User, Hash,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EbookCompleteWorkflowProps {
  onComplete: (bookData: any) => void;
}

const workflowSteps = [
  { id: 'P1', name: 'Directeur Éditorial', icon: Target, description: 'Vision stratégique et analyse du projet' },
  { id: 'P2', name: 'Analyse de Marché', icon: TrendingUp, description: 'Positionnement Amazon KDP + 7 mots-clés stratégiques' },
  { id: 'P3', name: 'Architecte de Contenu', icon: Layers, description: 'Structure détaillée (400+ pages)' },
  { id: 'P4', name: 'Rédaction Experte', icon: FileText, description: 'Écriture professionnelle chapitre par chapitre' },
  { id: 'P5', name: 'Réécriture Naturelle', icon: Sparkles, description: 'Humanisation du texte (votre voix, pas un robot)' },
  { id: 'P6', name: 'Qualité Éditoriale', icon: CheckCircle2, description: 'Contrôle qualité approfondi' },
  { id: 'P7', name: 'Packaging Éditorial', icon: BookOpen, description: 'Métadonnées et mots-clés KDP optimisés' },
  { id: 'P8', name: 'Diagnostic Final', icon: Target, description: 'Vérification cohérence globale' },
  { id: 'P9', name: 'Mémoire Éditoriale', icon: Sparkles, description: 'Capture de VOTRE voix unique d\'auteur' },
  { id: 'P10', name: 'Cohérence Chapitres', icon: Layers, description: 'Transitions fluides entre chapitres' },
  { id: 'P11', name: 'Auto-Critique', icon: AlertCircle, description: 'Détection des faiblesses (sans flatterie)' },
  { id: 'P12', name: 'Boucle Itérative', icon: Sparkles, description: 'Améliorations automatiques' },
  { id: 'P13', name: 'Signature de Style', icon: Award, description: 'Voix d\'auteur unifiée et reconnaissable' },
  { id: 'P14', name: 'Verdict Ultime', icon: CheckCircle2, description: 'Validation finale par l\'éditeur professionnel' },
];

const EbookCompleteWorkflow: React.FC<EbookCompleteWorkflowProps> = ({ onComplete }) => {
  // Form state
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [numberOfChapters, setNumberOfChapters] = useState(8);
  const [hasReadSteps, setHasReadSteps] = useState(false);
  
  // Workflow state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [stepResults, setStepResults] = useState<Record<string, { result: any; displayContent: string }>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [allContext, setAllContext] = useState<Record<string, any>>({});

  const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / 14) * 100 : 0;
  const canGenerate = title.trim() && authorName.trim() && hasReadSteps;

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const runStep = async (stepId: string, context: Record<string, any>): Promise<{ result: any; displayContent: string } | null> => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('complete-book-workflow', {
        body: {
          step: stepId,
          title,
          authorName,
          numberOfChapters,
          previousContext: context
        }
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      return {
        result: data.result,
        displayContent: data.displayContent || 'Résultat généré'
      };
    } catch (err: any) {
      console.error(`Step ${stepId} error:`, err);
      throw err;
    }
  };

  const generateCompleteBook = async () => {
    if (!title.trim() || !authorName.trim()) {
      toast.error('Veuillez remplir le titre et le nom d\'auteur');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStepIndex(0);
    setStepResults({});
    setExpandedSteps({});
    
    const context: Record<string, any> = {};
    setAllContext({});

    toast.info('🚀 Le Directeur Éditorial lance le workflow complet...');

    try {
      for (let i = 0; i < workflowSteps.length; i++) {
        const step = workflowSteps[i];
        setCurrentStepIndex(i);
        
        // Auto-expand current step
        setExpandedSteps(prev => ({ ...prev, [step.id]: true }));

        const result = await runStep(step.id, context);
        
        if (result) {
          // Store result
          setStepResults(prev => ({ ...prev, [step.id]: result }));
          context[step.id] = result.result;
          setAllContext(prev => ({ ...prev, [step.id]: result.result }));
          
          // Collapse previous step, keep current expanded
          if (i > 0) {
            const prevStep = workflowSteps[i - 1];
            setExpandedSteps(prev => ({ ...prev, [prevStep.id]: false }));
          }
        }

        // Small delay between steps to avoid rate limiting
        if (i < workflowSteps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // All steps complete
      setCurrentStepIndex(14);
      
      // Build final book data
      const bookData = {
        title,
        authorName,
        numberOfChapters,
        preface: context.P7?.descriptionKDP || '',
        bookSynopsis: context.P1?.promesseCentrale || '',
        chapters: (context.P4?.chapitres || context.P5?.chapitresFinal || []).map((ch: any, idx: number) => ({
          number: ch.numero || idx + 1,
          title: ch.titre || ch.title || `Chapitre ${idx + 1}`,
          content: ch.contenu || ch.content || ''
        })),
        conclusion: context.P8?.verdict || '',
        marketPositioning: context.P2 || {},
        backCover: {
          description: context.P7?.descriptionKDP || '',
          accroche: context.P7?.accroche4emeCouverture || ''
        },
        styleSignature: context.P13 || {},
        finalVerdict: context.P14 || {},
        qualityScores: context.P6 || {}
      };

      toast.success('✅ Livre généré avec succès ! Vérifiez chaque étape ci-dessous.');
      onComplete(bookData);

    } catch (err: any) {
      console.error('Workflow error:', err);
      setError(err.message || 'Erreur lors de la génération');
      toast.error(`Erreur: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Estimation réaliste : 3000-4000 mots/chapitre = ~12-16 pages/chapitre
  const estimatedPages = Math.round(numberOfChapters * 15);

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) {
          return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h2>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold mt-2">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('**')) {
          const parts = line.split('**');
          return (
            <p key={i} className="mt-1">
              {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
            </p>
          );
        }
        if (line.startsWith('_') && line.endsWith('_')) {
          return <p key={i} className="italic text-muted-foreground mt-2">{line.slice(1, -1)}</p>;
        }
        if (line.startsWith('✓') || line.startsWith('✗') || line.startsWith('•') || line.startsWith('⚠️') || line.startsWith('✦') || line.startsWith('→')) {
          return <p key={i} className="ml-4 mt-1">{line}</p>;
        }
        if (line.startsWith('---')) {
          return <hr key={i} className="my-4 border-border" />;
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i} className="mt-1">{line}</p>;
      });
  };

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
            Entrez les informations, puis lancez le workflow. Vous verrez le contenu de chaque étape en temps réel.
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

          {/* Mandatory Checkbox */}
          <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <Checkbox
              id="hasReadSteps"
              checked={hasReadSteps}
              onCheckedChange={(checked) => setHasReadSteps(checked === true)}
              disabled={isGenerating}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label 
                htmlFor="hasReadSteps" 
                className="text-sm font-medium cursor-pointer leading-tight"
              >
                ✅ J'ai lu et compris les 14 étapes du workflow éditorial
              </Label>
              <p className="text-xs text-muted-foreground">
                Je comprends que le système capture MA voix d'auteur (P9) et unifie mon style (P13) pour un résultat humain et naturel, pas robotique.
              </p>
            </div>
          </div>

          {/* Generate Button */}
          {currentStepIndex < 0 && (
            <motion.div
              whileHover={{ scale: canGenerate ? 1.02 : 1 }}
              whileTap={{ scale: canGenerate ? 0.98 : 1 }}
              className="text-center space-y-3"
            >
              <Button
                type="button"
                size="lg"
                onClick={generateCompleteBook}
                disabled={!canGenerate}
                className="gap-3 px-10 py-7 text-lg font-bold bg-gradient-to-r from-primary via-amber-500 to-orange-500 hover:from-primary/90 hover:via-amber-500/90 hover:to-orange-500/90 shadow-xl shadow-primary/30 transition-all duration-300 w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Rocket className="h-6 w-6" />
                Lancer la génération complète
              </Button>
              
              {!title.trim() || !authorName.trim() ? (
                <p className="text-sm text-destructive">
                  ⚠️ Veuillez remplir le titre et le nom d'auteur
                </p>
              ) : !hasReadSteps ? (
                <p className="text-sm text-amber-600">
                  ⚠️ Veuillez cocher la case ci-dessus pour confirmer que vous avez lu les 14 étapes
                </p>
              ) : null}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Steps Card - Always visible */}
      <Card className="border border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Les 14 étapes du Directeur Éditorial
          </CardTitle>
          
          {/* Progress bar */}
          {currentStepIndex >= 0 && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {currentStepIndex >= 14 ? 'Terminé !' : `Étape ${currentStepIndex + 1} sur 14`}
                </span>
                <span className="font-semibold text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-2">
          {/* Steps List with Real Content */}
          {workflowSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = isGenerating && index === currentStepIndex;
            const isCompleted = stepResults[step.id] !== undefined;
            const stepData = stepResults[step.id];
            const isExpanded = expandedSteps[step.id] || false;
            
            return (
              <Collapsible
                key={step.id}
                open={isExpanded}
                onOpenChange={() => isCompleted && toggleStep(step.id)}
              >
                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: isCompleted || isActive ? 1 : (currentStepIndex >= 0 ? 0.4 : 1),
                    scale: isActive ? 1.01 : 1
                  }}
                  className={`
                    rounded-lg transition-all overflow-hidden
                    ${isCompleted ? 'bg-green-500/10 border border-green-500/30' : ''}
                    ${isActive ? 'bg-primary/10 border border-primary/30 shadow-md' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted/20 border border-muted/30' : ''}
                  `}
                >
                  <CollapsibleTrigger asChild>
                    <div className={`flex items-center gap-3 p-3 ${isCompleted ? 'cursor-pointer hover:bg-green-500/20' : ''}`}>
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
                          {step.description}
                        </p>
                      </div>

                      {isActive && (
                        <div className="text-xs text-primary font-medium animate-pulse">
                          En cours...
                        </div>
                      )}
                      
                      {isCompleted && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs text-green-600">
                            Terminé
                          </Badge>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    {stepData && (
                      <div className="px-4 pb-4 pt-2 border-t border-border/50">
                        <div className="bg-background/50 rounded-lg p-4 text-sm">
                          {renderMarkdown(stepData.displayContent)}
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </motion.div>
              </Collapsible>
            );
          })}

          {/* Final Success Message */}
          {currentStepIndex >= 14 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-500/10 border-2 border-green-500/30 rounded-lg text-center mt-4"
            >
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-xl text-green-700 dark:text-green-400">
                Livre généré avec succès !
              </p>
              <p className="text-muted-foreground mt-2">
                Cliquez sur chaque étape pour vérifier le contenu généré.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Le Verdict Éditeur Ultime a validé votre projet.
              </p>
            </motion.div>
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
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => {
                  setError(null);
                  setCurrentStepIndex(-1);
                }}
              >
                Réessayer
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EbookCompleteWorkflow;