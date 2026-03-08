import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Scan, Sparkles, AlertTriangle, CheckCircle2, Copy, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DetectionResult {
  score: number;
  humanScore: number;
  markers: string[];
  repetitivePatterns?: string[];
  vocabularyAnalysis?: { richness: number; diversity: number; naturalness: number };
  structureAnalysis?: { paragraphVariety: number; sentenceLengthVariety: number; transitionQuality: number };
  verdict: string;
  recommendations: string[];
}

export const EbookAIDetectorScore: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [humanizedContent, setHumanizedContent] = useState('');

  const analyzeContent = async () => {
    if (!content.trim() || content.trim().split(/\s+/).length < 50) {
      toast.error('Minimum 50 mots requis pour une analyse fiable');
      return;
    }
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-detection-score', {
        body: { content, action: 'detect' }
      });
      if (error) throw error;
      setResult(data);
      toast.success('Analyse terminée !');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const humanizeContent = async () => {
    if (!content.trim()) return;
    setIsHumanizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-detection-score', {
        body: { content, action: 'humanize' }
      });
      if (error) throw error;
      setHumanizedContent(data.humanizedContent);
      toast.success('Texte humanisé avec succès !');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'humanisation');
    } finally {
      setIsHumanizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-500';
    if (score <= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score <= 30) return 'bg-green-500';
    if (score <= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            Détecteur Anti-IA + Humanisation
            <Badge className="bg-primary/10 text-primary border-primary/30">NOUVEAU</Badge>
          </CardTitle>
          <CardDescription>
            Analysez votre texte pour détecter les marqueurs IA et humanisez-le automatiquement
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Scan className="h-5 w-5" /> Texte à analyser
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Collez votre texte ici (minimum 50 mots)..."
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{wordCount} mots</span>
              <div className="flex gap-2">
                <Button onClick={analyzeContent} disabled={isAnalyzing || wordCount < 50}>
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Scan className="h-4 w-4 mr-2" />}
                  Analyser
                </Button>
                <Button variant="secondary" onClick={humanizeContent} disabled={isHumanizing || wordCount < 20}>
                  {isHumanizing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Humaniser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Score principal */}
              <Card className="border-2" style={{ borderColor: result.score <= 30 ? '#22c55e' : result.score <= 60 ? '#f59e0b' : '#ef4444' }}>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className={`text-6xl font-black ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </div>
                    <p className="text-lg font-semibold">Score de détection IA</p>
                    <Badge variant={result.verdict === 'Probablement Humain' ? 'default' : result.verdict === 'Mixte' ? 'secondary' : 'destructive'} className="text-base px-4 py-1">
                      {result.verdict === 'Probablement Humain' ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <AlertTriangle className="h-4 w-4 mr-1" />}
                      {result.verdict}
                    </Badge>
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Humain</span><span>IA</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${getProgressColor(result.score)}`} style={{ width: `${result.score}%` }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analyse détaillée */}
              {result.vocabularyAnalysis && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Analyse du vocabulaire</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { label: 'Richesse', value: result.vocabularyAnalysis.richness },
                      { label: 'Diversité', value: result.vocabularyAnalysis.diversity },
                      { label: 'Naturel', value: result.vocabularyAnalysis.naturalness },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-xs w-20">{label}</span>
                        <Progress value={value * 10} className="flex-1 h-2" />
                        <span className="text-xs font-mono w-8">{value}/10</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Marqueurs IA */}
              {result.markers.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" /> Marqueurs IA détectés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.markers.map((m, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{m}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommandations */}
              {result.recommendations.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> Recommandations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Texte humanisé */}
          {humanizedContent && (
            <Card className="border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Texte humanisé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="max-h-[300px] overflow-y-auto text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                  {humanizedContent}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(humanizedContent); toast.success('Copié !'); }}>
                    <Copy className="h-3 w-3 mr-1" /> Copier
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setContent(humanizedContent); setHumanizedContent(''); toast.success('Texte remplacé, relancez l\'analyse'); }}>
                    <RefreshCw className="h-3 w-3 mr-1" /> Utiliser & re-analyser
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EbookAIDetectorScore;
