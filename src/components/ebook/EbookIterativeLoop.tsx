import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RefreshCw, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

const EbookIterativeLoop = () => {
  const { apiKey: userGeminiKey } = useOpenAIConfig();

  const [title, setTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [improvedContent, setImprovedContent] = useState<{
    contenuAmeliore: string;
    changements: string[];
    metriques: {
      clarte: { avant: number; apres: number };
      valeur: { avant: number; apres: number };
      precision: { avant: number; apres: number };
      concision: { avant: number; apres: number };
    };
  } | null>(null);

  const improveContent = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer le titre de votre ebook');
      return;
    }

    setIsImproving(true);
    try {
      const { data, error } = await supabase.functions.invoke('iterative-loop', {
        body: { userApiKey: userGeminiKey, 
          title: title.trim(),
          originalContent: originalContent.trim() || undefined,
          recommendations: recommendations.trim() || undefined
        }
      });

      if (error) throw error;

      setImprovedContent(data.improvement);
      toast.success('Amélioration itérative terminée !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'amélioration');
    } finally {
      setIsImproving(false);
    }
  };

  const MetricBar = ({ label, avant, apres }: { label: string; avant: number; apres: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="text-green-400">+{apres - avant}</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-2 bg-background/50 rounded overflow-hidden">
          <div 
            className="h-full bg-muted-foreground/50" 
            style={{ width: `${avant * 10}%` }}
          />
        </div>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <div className="flex-1 h-2 bg-background/50 rounded overflow-hidden">
          <div 
            className="h-full bg-green-500" 
            style={{ width: `${apres * 10}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-purple-950/20 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <RefreshCw className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <span className="text-purple-400 text-sm font-mono">P12</span>
              <h2 className="text-xl">Amélioration Itérative (Loop)</h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-sm text-muted-foreground">
              <strong>🔄 Effet :</strong> Version 2 automatiquement meilleure. 
              Plus de clarté, plus de valeur, plus de précision, moins de longueur inutile. Niveau humain expert.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'ebook</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Maîtriser le Marketing Digital en 2024"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu original (optionnel)</Label>
            <Textarea
              id="content"
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              placeholder="Collez le contenu à améliorer..."
              className="min-h-[120px] bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendations">Recommandations précédentes (optionnel)</Label>
            <Textarea
              id="recommendations"
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Collez les recommandations issues de P11 (Auto-Critique)..."
              className="min-h-[80px] bg-background/50"
            />
          </div>

          <Button 
            onClick={improveContent} 
            disabled={isImproving || !title.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isImproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Amélioration en cours...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Lancer l'Amélioration Itérative
              </>
            )}
          </Button>

          {improvedContent && (
            <div className="space-y-4 mt-6">
              {improvedContent.metriques && (
                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400 flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4" />
                    Métriques d'Amélioration
                  </Label>
                  <div className="grid gap-3">
                    <MetricBar 
                      label="Clarté" 
                      avant={improvedContent.metriques.clarte.avant} 
                      apres={improvedContent.metriques.clarte.apres} 
                    />
                    <MetricBar 
                      label="Valeur" 
                      avant={improvedContent.metriques.valeur.avant} 
                      apres={improvedContent.metriques.valeur.apres} 
                    />
                    <MetricBar 
                      label="Précision" 
                      avant={improvedContent.metriques.precision.avant} 
                      apres={improvedContent.metriques.precision.apres} 
                    />
                    <MetricBar 
                      label="Concision" 
                      avant={improvedContent.metriques.concision.avant} 
                      apres={improvedContent.metriques.concision.apres} 
                    />
                  </div>
                </div>
              )}

              {improvedContent.changements && improvedContent.changements.length > 0 && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <Label className="text-green-400">Changements Appliqués</Label>
                  <ul className="mt-2 space-y-1">
                    {improvedContent.changements.map((c, i) => (
                      <li key={i} className="text-xs flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-background/50 rounded-lg border">
                <Label className="text-purple-400">Contenu Amélioré (V2)</Label>
                <div className="mt-2 p-3 bg-background/30 rounded text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {improvedContent.contenuAmeliore}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookIterativeLoop;
