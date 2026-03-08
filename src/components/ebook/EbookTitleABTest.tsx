import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Plus, Trash2, Trophy, Sparkles, Target, TrendingUp, Eye, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TitleVariant {
  id: string;
  title: string;
  subtitle: string;
  scores: {
    accroche: number;
    seo: number;
    emotion: number;
    clarte: number;
    curiosite: number;
    global: number;
  } | null;
  feedback: string;
  isWinner: boolean;
}

interface EbookTitleABTestProps {
  currentTitle?: string;
}

export const EbookTitleABTest: React.FC<EbookTitleABTestProps> = ({ currentTitle = '' }) => {
  const [variants, setVariants] = useState<TitleVariant[]>([
    { id: '1', title: currentTitle, subtitle: '', scores: null, feedback: '', isWinner: false },
    { id: '2', title: '', subtitle: '', scores: null, feedback: '', isWinner: false },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [niche, setNiche] = useState('');

  const addVariant = () => {
    if (variants.length >= 6) { toast.error('Maximum 6 variantes'); return; }
    setVariants(prev => [...prev, { id: Date.now().toString(), title: '', subtitle: '', scores: null, feedback: '', isWinner: false }]);
  };

  const removeVariant = (id: string) => {
    if (variants.length <= 2) { toast.error('Minimum 2 variantes'); return; }
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, field: 'title' | 'subtitle', value: string) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const analyzeAllTitles = async () => {
    const validVariants = variants.filter(v => v.title.trim());
    if (validVariants.length < 2) { toast.error('Ajoutez au moins 2 titres à comparer'); return; }

    setIsAnalyzing(true);
    try {
      const titlesText = validVariants.map((v, i) => `Variante ${i + 1}: "${v.title}"${v.subtitle ? ` — Sous-titre: "${v.subtitle}"` : ''}`).join('\n');

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'title-ab-test',
          prompt: `Analyse comparative de titres pour un ebook${niche ? ` dans la niche "${niche}"` : ''}:\n\n${titlesText}\n\nPour CHAQUE variante, donne un score de 0 à 100 sur ces critères:\n- accroche (pouvoir d'accroche, curiosité déclenchée)\n- seo (potentiel SEO Amazon, mots-clés)\n- emotion (impact émotionnel, désir)\n- clarte (clarté du sujet, promesse)\n- curiosite (donne envie de cliquer)\n- global (moyenne pondérée)\n- feedback (1 phrase de conseil)\n\nDésigne le GAGNANT. Réponds en JSON:\n{"variantes": [{"index": 0, "accroche": 85, "seo": 70, "emotion": 90, "clarte": 80, "curiosite": 75, "global": 80, "feedback": "...", "isWinner": false}]}`,
        }
      });

      if (error) throw error;
      const content = data?.content || data?.analysis || '';
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const results = parsed.variantes || parsed.variants || [];
          setVariants(prev => prev.map((v, i) => {
            const result = results[i];
            if (!result || !v.title.trim()) return { ...v, scores: null, isWinner: false };
            return {
              ...v,
              scores: {
                accroche: result.accroche || 0,
                seo: result.seo || 0,
                emotion: result.emotion || 0,
                clarte: result.clarte || 0,
                curiosite: result.curiosite || 0,
                global: result.global || 0,
              },
              feedback: result.feedback || '',
              isWinner: result.isWinner || false,
            };
          }));
          toast.success('Analyse terminée !');
        }
      } catch {
        toast.error('Erreur de parsing des résultats');
      }
    } catch (err) {
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return '[&>div]:bg-green-500';
    if (score >= 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-red-500';
  };

  const sortedVariants = [...variants].filter(v => v.scores).sort((a, b) => (b.scores?.global || 0) - (a.scores?.global || 0));

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            A/B Test de Titres — Trouvez le titre qui vend
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Comparez jusqu'à 6 variantes de titres. L'IA évalue chacune sur 5 critères KDP et désigne le gagnant.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Niche / Catégorie (optionnel)</label>
            <Input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Ex: développement personnel, thriller, cuisine..." className="mt-1" />
          </div>

          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={v.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">V{i + 1}</Badge>
                    {v.isWinner && <Badge className="bg-yellow-500 text-white text-xs">🏆 Gagnant</Badge>}
                  </div>
                  <Input value={v.title} onChange={e => updateVariant(v.id, 'title', e.target.value)} placeholder={`Titre variante ${i + 1}`} />
                  <Input value={v.subtitle} onChange={e => updateVariant(v.id, 'subtitle', e.target.value)} placeholder="Sous-titre (optionnel)" className="text-sm" />
                </div>
                {variants.length > 2 && (
                  <Button variant="ghost" size="icon" onClick={() => removeVariant(v.id)} className="mt-6">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={addVariant} disabled={variants.length >= 6}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter variante
            </Button>
            <Button onClick={analyzeAllTitles} disabled={isAnalyzing} className="bg-primary">
              {isAnalyzing ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Analyse IA...</> : <><Sparkles className="h-4 w-4 mr-1" /> Analyser & Comparer</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {sortedVariants.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedVariants.map((v, rank) => (
            <Card key={v.id} className={`relative ${v.isWinner ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-border'}`}>
              {v.isWinner && <div className="absolute -top-3 left-4"><Badge className="bg-yellow-500 text-white">🏆 MEILLEUR TITRE</Badge></div>}
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  #{rank + 1} — {v.title}
                  {v.subtitle && <span className="block text-sm text-muted-foreground font-normal mt-1">{v.subtitle}</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <span className={`text-3xl font-bold ${getScoreColor(v.scores!.global)}`}>{v.scores!.global}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                {[
                  { key: 'accroche', label: 'Accroche', icon: Target },
                  { key: 'seo', label: 'SEO Amazon', icon: TrendingUp },
                  { key: 'emotion', label: 'Émotion', icon: Heart },
                  { key: 'clarte', label: 'Clarté', icon: Eye },
                  { key: 'curiosite', label: 'Curiosité', icon: Sparkles },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1"><Icon className="h-3 w-3" />{label}</span>
                      <span className={getScoreColor(v.scores![key as keyof typeof v.scores] as number)}>{v.scores![key as keyof typeof v.scores]}/100</span>
                    </div>
                    <Progress value={v.scores![key as keyof typeof v.scores] as number} className={`h-1.5 ${getProgressColor(v.scores![key as keyof typeof v.scores] as number)}`} />
                  </div>
                ))}
                {v.feedback && <p className="text-xs text-muted-foreground italic border-t pt-2 mt-2">{v.feedback}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EbookTitleABTest;
