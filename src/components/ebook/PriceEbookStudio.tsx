import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Loader2, TrendingUp, DollarSign, BookOpen, Target, Sparkles,
  BarChart3, Lightbulb, ChevronRight, Rocket, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PriceStrategy {
  ebookPrice: {
    recommended: number; min: number; max: number;
    royalty70: number; royalty35: number; justification: string;
  };
  paperbackPrice: {
    recommended: number; min: number; max: number;
    printingCost: number; royaltyEstimate: number; justification: string;
  };
  competitorAnalysis: {
    averagePrice: number; priceRange: string;
    positioning: string; topCompetitors: string[];
  };
  launchStrategy: {
    phase1: { name: string; duration: string; ebookPrice: number; paperbackPrice: number; description: string };
    phase2: { name: string; duration: string; ebookPrice: number; paperbackPrice: number; description: string };
    phase3: { name: string; duration: string; ebookPrice: number; paperbackPrice: number; description: string };
  };
  revenueProjection: {
    monthly30: { units: number; revenue: number };
    monthly100: { units: number; revenue: number };
    monthly500: { units: number; revenue: number };
  };
  tips: string[];
  kdpCategories: string[];
  priceScore: number;
}

const categories = [
  'Développement personnel', 'Business & Entrepreneuriat', 'Santé & Bien-être',
  'Finance & Investissement', 'Marketing Digital', 'Cuisine & Recettes',
  'Fiction & Roman', 'Science-fiction & Fantasy', 'Romance',
  'Thriller & Suspense', 'Biographie & Mémoires', 'Éducation & Formation',
  'Voyage & Aventure', 'Art & Créativité', 'Technologie & IA',
  'Parentalité & Famille', 'Sport & Fitness', 'Spiritualité & Religion',
  'Histoire', 'Sciences', 'Autre',
];

export const PriceEbookStudio: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [pages, setPages] = useState('');
  const [format, setFormat] = useState('both');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<PriceStrategy | null>(null);

  const generateStrategy = async () => {
    if (!title || !category || !pages) {
      toast.error('Veuillez remplir le titre, la catégorie et le nombre de pages');
      return;
    }
    setIsGenerating(true);
    toast.info('📊 Analyse de la stratégie de prix en cours...');

    try {
      const { data, error } = await supabase.functions.invoke('generate-price-strategy', {
        body: { title, subtitle, category, pages: parseInt(pages), format, targetAudience }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.strategy) {
        setStrategy(data.strategy);
        toast.success('✨ Stratégie de prix générée !');
      }
    } catch (err: any) {
      console.error('Price strategy error:', err);
      toast.error(err.message || 'Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDgiLz48L2c+PC9zdmc+')] opacity-60" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Price Master</h2>
            <p className="text-orange-100 text-sm">Stratégie de tarification avancée pour ebook et livre broché</p>
          </div>
          <Badge className="ml-auto bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            IA Pro
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-1" />
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-500" />
              Informations sur votre ebook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-semibold">Titre de l'ebook *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Le Guide Complet du Marketing Digital" className="mt-1" />
            </div>
            <div>
              <Label className="font-semibold">Sous-titre (optionnel)</Label>
              <Input value={subtitle} onChange={e => setSubtitle(e.target.value)}
                placeholder="Ex: Stratégies pratiques pour 2026" className="mt-1" />
            </div>
            <div>
              <Label className="font-semibold">Catégorie *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionnez une catégorie" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Nombre de pages *</Label>
                <Input type="number" value={pages} onChange={e => setPages(e.target.value)}
                  placeholder="Ex: 250" className="mt-1" min="10" />
              </div>
              <div>
                <Label className="font-semibold">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">📚 Ebook + Broché</SelectItem>
                    <SelectItem value="ebook">📱 Ebook uniquement</SelectItem>
                    <SelectItem value="paperback">📖 Broché uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="font-semibold">Public cible (optionnel)</Label>
              <Input value={targetAudience} onChange={e => setTargetAudience(e.target.value)}
                placeholder="Ex: Entrepreneurs débutants, 25-45 ans" className="mt-1" />
            </div>

            <Button onClick={generateStrategy} disabled={isGenerating || !title || !category || !pages}
              className="w-full h-14 text-base font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white shadow-xl shadow-orange-500/25"
              size="lg">
              {isGenerating ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Analyse en cours...</>
              ) : (
                <><TrendingUp className="h-5 w-5 mr-2" />Générer la stratégie de prix</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right: Results */}
        <div className="space-y-5">
          {strategy ? (
            <>
              {/* Price Score */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1" />
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(142, 76%, 36%)"
                          strokeWidth="3" strokeDasharray={`${strategy.priceScore}, 100`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
                        {strategy.priceScore}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Score de tarification</h3>
                      <p className="text-sm text-muted-foreground">Potentiel de rentabilité estimé</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Prices */}
              <div className="grid grid-cols-2 gap-4">
                {(format === 'both' || format === 'ebook') && (
                  <Card className="border-0 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1" />
                    <CardContent className="pt-5 text-center">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ebook</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{strategy.ebookPrice.recommended.toFixed(2)}€</p>
                      <p className="text-xs text-muted-foreground mt-1">{strategy.ebookPrice.min.toFixed(2)}€ - {strategy.ebookPrice.max.toFixed(2)}€</p>
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Royalties 70%</span>
                          <span className="font-semibold text-emerald-600">{strategy.ebookPrice.royalty70.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Royalties 35%</span>
                          <span className="font-semibold text-foreground">{strategy.ebookPrice.royalty35.toFixed(2)}€</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {(format === 'both' || format === 'paperback') && (
                  <Card className="border-0 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-1" />
                    <CardContent className="pt-5 text-center">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Broché</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{strategy.paperbackPrice.recommended.toFixed(2)}€</p>
                      <p className="text-xs text-muted-foreground mt-1">{strategy.paperbackPrice.min.toFixed(2)}€ - {strategy.paperbackPrice.max.toFixed(2)}€</p>
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Coût impression</span>
                          <span className="font-semibold text-foreground">{strategy.paperbackPrice.printingCost.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Royalties est.</span>
                          <span className="font-semibold text-emerald-600">{strategy.paperbackPrice.royaltyEstimate.toFixed(2)}€</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Competitor Analysis */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-1" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    Analyse concurrentielle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Prix moyen</p>
                      <p className="text-lg font-bold text-foreground">{strategy.competitorAnalysis.averagePrice.toFixed(2)}€</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Fourchette</p>
                      <p className="text-lg font-bold text-foreground">{strategy.competitorAnalysis.priceRange}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{strategy.competitorAnalysis.positioning}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.competitorAnalysis.topCompetitors.map((comp, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{comp}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Launch Strategy */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-emerald-500" />
                    Stratégie de lancement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[strategy.launchStrategy.phase1, strategy.launchStrategy.phase2, strategy.launchStrategy.phase3].map((phase, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                          i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}>{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{phase.name}</span>
                            <Badge variant="outline" className="text-[10px]">{phase.duration}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
                          <div className="flex gap-3 mt-1.5">
                            <span className="text-xs"><strong>Ebook:</strong> {phase.ebookPrice.toFixed(2)}€</span>
                            <span className="text-xs"><strong>Broché:</strong> {phase.paperbackPrice.toFixed(2)}€</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Projections */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    Projections de revenus mensuels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: '30 ventes/mois', data: strategy.revenueProjection.monthly30 },
                      { label: '100 ventes/mois', data: strategy.revenueProjection.monthly100 },
                      { label: '500 ventes/mois', data: strategy.revenueProjection.monthly500 },
                    ].map((proj, i) => (
                      <div key={i} className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-[11px] text-muted-foreground">{proj.label}</p>
                        <p className="text-xl font-bold text-foreground mt-1 flex items-center justify-center gap-0.5">
                          {proj.data.revenue.toFixed(0)}€
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-1" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Conseils stratégiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {strategy.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* KDP Categories */}
              {strategy.kdpCategories && strategy.kdpCategories.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      Catégories KDP recommandées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {strategy.kdpCategories.map((cat, i) => (
                        <Badge key={i} className="bg-amber-100 text-amber-800 border-amber-200">{cat}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-1" />
              <CardContent className="pt-6">
                <div className="border-2 border-dashed border-border rounded-2xl h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-muted/30 to-amber-50/20">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                    <TrendingUp className="w-10 h-10 text-amber-300" />
                  </div>
                  <p className="text-muted-foreground font-medium">Stratégie de prix</p>
                  <p className="text-xs text-muted-foreground mt-2 text-center px-6">
                    Remplissez les informations et cliquez "Générer" pour obtenir votre stratégie de tarification optimale
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
