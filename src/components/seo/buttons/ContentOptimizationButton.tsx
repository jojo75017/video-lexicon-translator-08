
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, Target, XCircle, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { analyzeContentWithAI } from '@/utils/seo/aiContentAnalyzer';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

const contentOptimizationSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  content: z.string().min(50, "Le contenu doit contenir au moins 50 caractères"),
  targetKeywords: z.string().optional(),
});

type ContentOptimizationData = z.infer<typeof contentOptimizationSchema>;

const ContentOptimizationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<{
    score: number;
    suggestions: Array<{category: string; suggestion: string; score: number}>;
    metrics: {
      title: number;
      headings: number;
      terms: number;
      words: number;
    };
    aiSuggestions: Array<{
      type: 'amélioration' | 'erreur' | 'optimisation';
      message: string;
      priorité: 'haute' | 'moyenne' | 'basse';
    }>;
  } | null>(null);

  const form = useForm<ContentOptimizationData>({
    resolver: zodResolver(contentOptimizationSchema),
    defaultValues: {
      title: '',
      content: '',
      targetKeywords: '',
    },
  });

  const onSubmit = async (data: ContentOptimizationData) => {
    setIsAnalyzing(true);
    
    try {
      // Analyse du contenu via l'IA
      const aiSuggestions = await analyzeContentWithAI(data.content);
      
      // Calcul du score basé sur différents critères
      const wordCount = data.content.split(/\s+/).length;
      const keywordsPresent = data.targetKeywords ? 
        data.targetKeywords.split(',').map(k => k.trim().toLowerCase())
          .filter(k => data.content.toLowerCase().includes(k)).length : 0;
      const keywordsTotal = data.targetKeywords ? data.targetKeywords.split(',').length : 0;
      
      // Facteurs de score
      const lengthScore = Math.min(100, (wordCount / 300) * 100); // Optimal around 300+ words
      const keywordScore = keywordsTotal ? (keywordsPresent / keywordsTotal) * 100 : 70;
      const titleScore = data.title.length > 10 && data.title.length < 70 ? 90 : 60;
      const paragraphCount = data.content.split(/\n\s*\n/).length;
      const structureScore = paragraphCount > 2 ? 85 : 50;
      
      // Pénalités basées sur l'analyse IA
      let aiPenalty = 0;
      aiSuggestions.forEach(s => {
        if (s.type === 'erreur') aiPenalty += s.priorité === 'haute' ? 15 : s.priorité === 'moyenne' ? 10 : 5;
        if (s.type === 'optimisation') aiPenalty += s.priorité === 'haute' ? 8 : s.priorité === 'moyenne' ? 5 : 2;
        if (s.type === 'amélioration') aiPenalty += s.priorité === 'haute' ? 5 : s.priorité === 'moyenne' ? 3 : 1;
      });
      
      // Score final
      const finalScore = Math.max(0, Math.min(100, Math.round(
        (lengthScore * 0.25) + (keywordScore * 0.3) + (titleScore * 0.2) + (structureScore * 0.25) - aiPenalty
      )));
      
      // Simulation de métriques pour l'affichage visuel
      const mockScore = finalScore;
      
      setOptimizationResults({
        score: mockScore,
        suggestions: [
          {
            category: 'Titre',
            suggestion: 'Ajoutez des mots-clés ciblés dans votre titre pour améliorer son efficacité SEO.',
            score: titleScore
          },
          {
            category: 'Structure',
            suggestion: 'Utilisez plus de sous-titres (H2, H3) pour mieux structurer votre contenu.',
            score: structureScore
          },
          {
            category: 'Mots-clés',
            suggestion: `Intégrez vos mots-clés principaux dans les premiers 100 mots du contenu.`,
            score: keywordScore
          },
          {
            category: 'Lisibilité',
            suggestion: 'Raccourcissez vos phrases pour améliorer la lisibilité du contenu.',
            score: lengthScore
          }
        ],
        metrics: {
          title: Math.round(titleScore),
          headings: Math.round(structureScore),
          terms: Math.round(keywordScore),
          words: wordCount
        },
        aiSuggestions
      });
      
      toast.success("Analyse de contenu terminée avec succès!");
    } catch (error) {
      console.error("Erreur lors de l'analyse du contenu:", error);
      toast.error("Erreur lors de l'analyse du contenu");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    setOptimizationResults(null);
    form.reset();
  };

  // Fonction pour obtenir l'icône selon le type de suggestion
  const getSuggestionIcon = (type: 'amélioration' | 'erreur' | 'optimisation') => {
    switch (type) {
      case 'erreur':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'optimisation':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'amélioration':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  // Fonction pour obtenir la couleur de la suggestion selon la priorité
  const getSuggestionColor = (priorité: 'haute' | 'moyenne' | 'basse') => {
    switch (priorité) {
      case 'haute':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'moyenne':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'basse':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="pastel" 
        className="flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Optimisation de contenu
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Optimisation de contenu
            </DialogTitle>
            <DialogDescription>
              Analysez et optimisez votre contenu pour améliorer son positionnement SEO
            </DialogDescription>
          </DialogHeader>

          {!optimizationResults ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez le titre de votre contenu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mots-clés cibles (séparés par des virgules)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: aquarium, poisson, débutant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Collez votre contenu ici pour l'analyser..." 
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialog}>Annuler</Button>
                  <Button type="submit" disabled={isAnalyzing}>
                    {isAnalyzing ? 'Analyse en cours...' : 'Analyser le contenu'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Score de contenu</h3>
                <Button variant="ghost" size="sm" onClick={closeDialog}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative w-full h-36 flex items-center justify-center">
                {/* Score circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <div 
                      className="absolute inset-0 rounded-full" 
                      style={{
                        background: `conic-gradient(${getScoreColor(optimizationResults.score)} ${optimizationResults.score}%, transparent 0)`,
                        transform: 'rotate(-90deg)'
                      }}
                    ></div>
                    <div className="relative bg-white rounded-full w-24 h-24 flex items-center justify-center">
                      <span className="text-3xl font-bold">{optimizationResults.score}%</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="absolute right-0 top-0 bottom-0 space-y-1 flex flex-col justify-center">
                  <MetricItem label="TITLE" value={optimizationResults.metrics.title} />
                  <MetricItem label="HEADINGS" value={optimizationResults.metrics.headings} />
                  <MetricItem label="TERMS" value={optimizationResults.metrics.terms} />
                  <MetricItem label="WORDS" value={optimizationResults.metrics.words} suffix=" mots" isCounting />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium mb-2">Recommandations IA</h3>
                
                <div className="space-y-2">
                  {optimizationResults.aiSuggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className={`p-3 border rounded-md ${getSuggestionColor(suggestion.priorité)}`}
                    >
                      <div className="flex gap-2 items-start">
                        {getSuggestionIcon(suggestion.type)}
                        <div>
                          <p className="text-sm">{suggestion.message}</p>
                          <span className="text-xs mt-1 opacity-70">
                            {suggestion.priorité === 'haute' ? 'Priorité haute' : 
                             suggestion.priorité === 'moyenne' ? 'Priorité moyenne' : 
                             'Priorité basse'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {optimizationResults.aiSuggestions.length === 0 && (
                    <Alert>
                      <AlertDescription>
                        Aucune suggestion d'amélioration n'a été détectée par notre IA. Votre contenu semble bien optimisé !
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <h3 className="text-lg font-medium mb-2">Checklist d'optimisation</h3>

                {optimizationResults.suggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-md p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{suggestion.category}</span>
                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{
                            width: `${suggestion.score}%`,
                            backgroundColor: getScoreColor(suggestion.score)
                          }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => setOptimizationResults(null)} 
                  variant="outline"
                  className="mr-2"
                >
                  Retour à l'éditeur
                </Button>
                <Button onClick={closeDialog}>Terminer</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Composant d'affichage des métriques
const MetricItem = ({ 
  label, 
  value, 
  suffix = "%", 
  isCounting = false 
}: { 
  label: string; 
  value: number; 
  suffix?: string;
  isCounting?: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div className="w-24 text-xs font-medium text-gray-500">{label}</div>
    <div className="flex items-center gap-1">
      {!isCounting && (
        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full" 
            style={{
              width: `${value}%`,
              backgroundColor: getScoreColor(value)
            }}
          ></div>
        </div>
      )}
      <span className="text-xs font-medium">{value}{suffix}</span>
    </div>
  </div>
);

// Fonction qui retourne une couleur en fonction du score
const getScoreColor = (score: number): string => {
  if (score >= 90) return '#22c55e'; // vert
  if (score >= 70) return '#84cc16'; // vert-jaune
  if (score >= 50) return '#eab308'; // jaune
  if (score >= 30) return '#f97316'; // orange
  return '#ef4444'; // rouge
};

export default ContentOptimizationButton;
