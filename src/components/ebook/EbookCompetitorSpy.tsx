import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Search, TrendingUp, DollarSign, BookOpen, Star, BarChart3, Eye, Target, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CompetitorBook {
  title: string;
  author: string;
  price: number;
  pages: number;
  bsr: number;
  rating: number;
  reviews: number;
  strengths: string[];
  weaknesses: string[];
}

interface NicheAnalysis {
  niche: string;
  competitors: CompetitorBook[];
  averagePrice: number;
  averagePages: number;
  averageRating: number;
  totalReviews: number;
  opportunityScore: number;
  saturationLevel: string;
  entryDifficulty: string;
  revenueEstimate: { low: number; mid: number; high: number };
  recommendations: string[];
  gaps: string[];
  bestPublishDay: string;
  idealPriceRange: { min: number; max: number };
}

export const EbookCompetitorSpy: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<NicheAnalysis | null>(null);

  const analyzeNiche = async () => {
    if (!niche.trim()) { toast.error('Entrez une niche à analyser'); return; }
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-niche', {
        body: { niche: niche.trim() }
      });
      if (error) throw error;
      const raw = data?.analysis || data;

      setAnalysis({
        niche: niche.trim(),
        competitors: raw.competitors || raw.topSellers?.map((s: any) => ({
          title: s.title || s.titre || 'Titre inconnu',
          author: s.author || s.auteur || 'Auteur inconnu',
          price: s.price || s.prix || 9.99,
          pages: s.pages || 200,
          bsr: s.bsr || s.rank || 50000,
          rating: s.rating || s.note || 4.2,
          reviews: s.reviews || s.avis || 100,
          strengths: s.strengths || s.points_forts || ['Bonne couverture'],
          weaknesses: s.weaknesses || s.points_faibles || ['Contenu moyen'],
        })) || [],
        averagePrice: raw.averagePrice || raw.prixMoyen || raw.prix_moyen || 12.99,
        averagePages: raw.averagePages || raw.pagesMoyennes || raw.pages_moyennes || 180,
        averageRating: raw.averageRating || raw.noteMoyenne || raw.note_moyenne || 4.1,
        totalReviews: raw.totalReviews || raw.totalAvis || 500,
        opportunityScore: raw.opportunityScore || raw.scoreOpportunite || raw.score_opportunite || 70,
        saturationLevel: raw.saturationLevel || raw.saturation || 'Modérée',
        entryDifficulty: raw.entryDifficulty || raw.difficulte || raw.difficulte_entree || 'Moyenne',
        revenueEstimate: raw.revenueEstimate || raw.revenusEstimes || { low: 200, mid: 800, high: 2500 },
        recommendations: raw.recommendations || raw.recommandations || [],
        gaps: raw.gaps || raw.lacunes || raw.opportunites || [],
        bestPublishDay: raw.bestPublishDay || raw.meilleurJour || 'Mardi',
        idealPriceRange: raw.idealPriceRange || raw.fourchettePrix || { min: 7.99, max: 14.99 },
      });
      toast.success('Analyse concurrentielle terminée !');
    } catch (err) {
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500';
  const getDifficultyColor = (d: string) => d.toLowerCase().includes('facile') ? 'bg-green-100 text-green-800' : d.toLowerCase().includes('difficile') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Espion Concurrentiel Amazon
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analysez les top-sellers d'une niche KDP : prix, pages, avis, forces/faiblesses et opportunités cachées.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Ex: productivité, thriller psychologique, recettes keto..." className="flex-1" onKeyDown={e => e.key === 'Enter' && analyzeNiche()} />
            <Button onClick={analyzeNiche} disabled={isAnalyzing}>
              {isAnalyzing ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Analyse...</> : <><Search className="h-4 w-4 mr-1" /> Espionner</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Score Opportunité', value: `${analysis.opportunityScore}/100`, icon: Target, color: getScoreColor(analysis.opportunityScore) },
              { label: 'Prix Moyen', value: `${analysis.averagePrice.toFixed(2)}€`, icon: DollarSign, color: 'text-primary' },
              { label: 'Pages Moyennes', value: `${analysis.averagePages}`, icon: BookOpen, color: 'text-primary' },
              { label: 'Note Moyenne', value: `${analysis.averageRating}⭐`, icon: Star, color: 'text-yellow-500' },
            ].map(kpi => (
              <Card key={kpi.label} className="p-3 text-center">
                <kpi.icon className={`h-5 w-5 mx-auto mb-1 ${kpi.color}`} />
                <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{kpi.label}</div>
              </Card>
            ))}
          </div>

          {/* Market Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Vue Marché
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Badge className={getDifficultyColor(analysis.entryDifficulty)}>Difficulté: {analysis.entryDifficulty}</Badge>
                <Badge variant="outline">Saturation: {analysis.saturationLevel}</Badge>
                <Badge variant="outline">🗓️ Publier le {analysis.bestPublishDay}</Badge>
                <Badge variant="outline">💰 Prix idéal: {analysis.idealPriceRange.min}€ - {analysis.idealPriceRange.max}€</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Opportunité</span>
                  <span className={getScoreColor(analysis.opportunityScore)}>{analysis.opportunityScore}%</span>
                </div>
                <Progress value={analysis.opportunityScore} className={`h-2 ${analysis.opportunityScore >= 70 ? '[&>div]:bg-green-500' : analysis.opportunityScore >= 40 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
              </div>
              <div className="grid grid-cols-3 gap-2 bg-muted/30 rounded-lg p-3">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Revenu Bas</div>
                  <div className="font-bold text-sm">{analysis.revenueEstimate.low}€/mois</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Revenu Moyen</div>
                  <div className="font-bold text-primary">{analysis.revenueEstimate.mid}€/mois</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Revenu Haut</div>
                  <div className="font-bold text-green-500">{analysis.revenueEstimate.high}€/mois</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitors */}
          {analysis.competitors.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">🏆 Top Concurrents ({analysis.competitors.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.competitors.slice(0, 5).map((c, i) => (
                    <div key={i} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-sm">#{i + 1} {c.title}</div>
                          <div className="text-xs text-muted-foreground">par {c.author}</div>
                        </div>
                        <Badge variant="outline">{c.price}€</Badge>
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>📄 {c.pages} pages</span>
                        <span>⭐ {c.rating}</span>
                        <span>💬 {c.reviews} avis</span>
                        <span>📊 BSR #{c.bsr.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium text-green-600">Forces:</span>
                          <ul className="list-disc pl-4 mt-0.5">{c.strengths.map((s, j) => <li key={j}>{s}</li>)}</ul>
                        </div>
                        <div>
                          <span className="font-medium text-red-500">Faiblesses:</span>
                          <ul className="list-disc pl-4 mt-0.5">{c.weaknesses.map((w, j) => <li key={j}>{w}</li>)}</ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gaps & Recommendations */}
          <div className="grid md:grid-cols-2 gap-4">
            {analysis.gaps.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">🎯 Lacunes du marché</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.gaps.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {analysis.recommendations.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">💡 Recommandations</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EbookCompetitorSpy;
