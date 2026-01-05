import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { GitBranch, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const EbookChapterCoherence = () => {
  const [title, setTitle] = useState('');
  const [chaptersContent, setChaptersContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    coherenceGlobale: string;
    continuite: string;
    contradictions: Array<{ chapitre: string; probleme: string; correction: string }>;
    progressionPedagogique: string;
    score: number;
    recommandations: string[];
  } | null>(null);

  const analyzeCoherence = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer le titre de votre ebook');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('chapter-coherence', {
        body: { 
          title: title.trim(),
          chaptersContent: chaptersContent.trim() || undefined
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast.success('Analyse de cohérence terminée !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <GitBranch className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <span className="text-purple-400 text-sm font-mono">P10</span>
              <h2 className="text-xl">Cohérence Globale Inter-Chapitres</h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-sm text-muted-foreground">
              <strong>🔗 Effet :</strong> Niveau éditeur senior. Vérifie la cohérence des idées, 
              la continuité logique et l'absence de contradictions. Ce que 99% des outils ne font pas.
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
            <Label htmlFor="chapters">Contenu des chapitres (optionnel)</Label>
            <Textarea
              id="chapters"
              value={chaptersContent}
              onChange={(e) => setChaptersContent(e.target.value)}
              placeholder="Collez ici le contenu de vos chapitres pour une analyse précise, ou laissez vide pour une analyse basée sur le titre..."
              className="min-h-[150px] bg-background/50"
            />
          </div>

          <Button 
            onClick={analyzeCoherence} 
            disabled={isAnalyzing || !title.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <GitBranch className="mr-2 h-4 w-4" />
                Analyser la Cohérence
              </>
            )}
          </Button>

          {analysis && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <span className="font-medium">Score de Cohérence</span>
                <div className={`text-2xl font-bold ${
                  analysis.score >= 8 ? 'text-green-400' : 
                  analysis.score >= 6 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {analysis.score}/10
                </div>
              </div>

              <div className="grid gap-4">
                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400">Cohérence Globale</Label>
                  <p className="mt-1 text-sm">{analysis.coherenceGlobale}</p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400">Continuité Logique</Label>
                  <p className="mt-1 text-sm">{analysis.continuite}</p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400">Progression Pédagogique</Label>
                  <p className="mt-1 text-sm">{analysis.progressionPedagogique}</p>
                </div>

                {analysis.contradictions && analysis.contradictions.length > 0 && (
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <Label className="text-red-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Incohérences Détectées
                    </Label>
                    <div className="space-y-3 mt-2">
                      {analysis.contradictions.map((c, i) => (
                        <div key={i} className="p-3 bg-background/50 rounded border">
                          <p className="text-xs text-muted-foreground">{c.chapitre}</p>
                          <p className="text-sm text-red-300 mt-1">{c.probleme}</p>
                          <p className="text-sm text-green-300 mt-1">→ {c.correction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.recommandations && analysis.recommandations.length > 0 && (
                  <div className="p-4 bg-background/50 rounded-lg border">
                    <Label className="text-purple-400">Recommandations</Label>
                    <ul className="mt-2 space-y-1">
                      {analysis.recommandations.map((rec, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookChapterCoherence;
