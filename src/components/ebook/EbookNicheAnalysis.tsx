import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lightbulb, AlertTriangle, Sparkles, CheckCircle2, ArrowRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface NicheAnalysis {
  forces: Array<{ text: string }>;
  pointsAttention: Array<{ text: string }>;
  demarquer: Array<{ text: string }>;
}

const EbookNicheAnalysis: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<NicheAnalysis | null>(null);

  const analyzeNiche = async () => {
    if (!niche.trim()) {
      toast.error('Veuillez entrer une niche à analyser');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-niche', {
        body: { niche: niche.trim() }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setAnalysis(data.analysis);
      toast.success('Analyse terminée !');
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de l'analyse de la niche");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Analyse de Niche</h2>
              <p className="text-sm text-muted-foreground font-normal mt-0.5">
                Entre ta niche pour découvrir ses forces, risques et comment te démarquer
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Ex: Investissement immobilier pour débutants"
              className="flex-1 bg-background/80"
              onKeyDown={(e) => e.key === 'Enter' && !isAnalyzing && analyzeNiche()}
            />
            <Button
              onClick={analyzeNiche}
              disabled={isAnalyzing || !niche.trim()}
              className="shrink-0"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Analyser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {analysis && (
        <div className="grid gap-6">
          {/* Forces */}
          <Card className="border-green-500/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="p-1.5 rounded-lg bg-green-500/15">
                  <Lightbulb className="h-5 w-5 text-green-500" />
                </div>
                Forces de ton idée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.forces.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Points d'attention */}
          <Card className="border-amber-500/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="p-1.5 rounded-lg bg-amber-500/15">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                Points d'attention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.pointsAttention.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <span className="text-amber-500 font-bold text-sm mt-0.5 shrink-0">!</span>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Comment se démarquer */}
          <Card className="border-blue-500/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="p-1.5 rounded-lg bg-blue-500/15">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </div>
                Comment te démarquer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.demarquer.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <ArrowRight className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EbookNicheAnalysis;
