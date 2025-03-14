
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, Target, XCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

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
      // Simulation d'une analyse de contenu (à remplacer par une API réelle)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockScore = Math.floor(70 + Math.random() * 30);
      
      setOptimizationResults({
        score: mockScore,
        suggestions: [
          {
            category: 'Titre',
            suggestion: 'Ajoutez des mots-clés ciblés dans votre titre pour améliorer son efficacité SEO.',
            score: Math.floor(70 + Math.random() * 30)
          },
          {
            category: 'Structure',
            suggestion: 'Utilisez plus de sous-titres (H2, H3) pour mieux structurer votre contenu.',
            score: Math.floor(60 + Math.random() * 40)
          },
          {
            category: 'Mots-clés',
            suggestion: 'Intégrez vos mots-clés principaux dans les premiers 100 mots du contenu.',
            score: Math.floor(50 + Math.random() * 50)
          },
          {
            category: 'Lisibilité',
            suggestion: 'Raccourcissez vos phrases pour améliorer la lisibilité du contenu.',
            score: Math.floor(70 + Math.random() * 30)
          }
        ],
        metrics: {
          title: Math.floor(80 + Math.random() * 20),
          headings: Math.floor(60 + Math.random() * 40),
          terms: Math.floor(80 + Math.random() * 20),
          words: Math.floor(data.content.split(/\s+/).length / 10)
        }
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
                      <span className="text-3xl font-bold">{optimizationResults.score}</span>
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
