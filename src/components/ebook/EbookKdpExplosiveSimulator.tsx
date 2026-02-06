import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, TrendingUp, Flame, Loader2, Copy, Sparkles, 
  Zap, Trophy, Target, Star, BarChart3, Rocket,
  ArrowRight, CheckCircle, Crown, Eye, DollarSign,
  Lightbulb, BookOpen, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ExplosiveKeyword {
  keyword: string;
  searchVolume: number;
  competition: 'très faible' | 'faible' | 'modéré' | 'élevé';
  explosiveScore: number;
  trend: 'explosion' | 'montée' | 'stable' | 'émergent';
  cpc: number;
  opportunity: string;
  relatedNiches: string[];
}

interface ViralTitle {
  title: string;
  subtitle: string;
  viralScore: number;
  emotionalHook: string;
  targetEmotion: string;
  keywordsUsed: string[];
  estimatedCtr: number;
  whyItWorks: string;
  category: 'curiosité' | 'transformation' | 'urgence' | 'autorité' | 'contrarian';
}

interface NicheOpportunity {
  niche: string;
  demandScore: number;
  competitionLevel: number;
  profitPotential: number;
  bestAngles: string[];
  avoidAngles: string[];
  idealPrice: number;
  estimatedMonthlySales: number;
}
// Utility to safely parse AI JSON responses
const cleanAndParseJSON = (content: string, type: string): any => {
  try {
    // Remove markdown code blocks
    let cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    
    // Try to extract JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    // Fix common JSON issues: trailing commas
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
    
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON parse failed for', type, ':', e, 'Content:', content.substring(0, 200));
    throw new Error(`Réponse AI mal formée pour ${type}. Réessayez.`);
  }
};

const EbookKdpExplosiveSimulator: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('keywords');
  const [loadingType, setLoadingType] = useState('');
  
  const [keywords, setKeywords] = useState<ExplosiveKeyword[]>([]);
  const [titles, setTitles] = useState<ViralTitle[]>([]);
  const [opportunities, setOpportunities] = useState<NicheOpportunity[]>([]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-500';
    if (score >= 70) return 'text-orange-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-red-500';
    if (score >= 70) return 'bg-orange-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-muted';
  };

  const getTrendEmoji = (trend: string) => {
    switch (trend) {
      case 'explosion': return '🔥💥';
      case 'montée': return '📈🚀';
      case 'émergent': return '🌱✨';
      default: return '📊';
    }
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'curiosité': return '🧐';
      case 'transformation': return '🦋';
      case 'urgence': return '⏰';
      case 'autorité': return '👑';
      case 'contrarian': return '🔄';
      default: return '💡';
    }
  };

  const handleGenerate = async (type: 'keywords' | 'titles' | 'opportunities') => {
    if (!query.trim()) {
      toast.error('Entrez une niche, un thème ou un sujet');
      return;
    }

    setIsLoading(true);
    setLoadingType(type);

    try {
      let prompt = '';

      if (type === 'keywords') {
        prompt = `Tu es un expert en recherche de mots-clés Amazon KDP. Analyse la niche "${query}" et trouve les mots-clés les plus EXPLOSIFS et sous-exploités.

Génère exactement 10 mots-clés en JSON:
{
  "keywords": [
    {
      "keyword": "mot-clé longue traîne spécifique",
      "searchVolume": 8500,
      "competition": "faible",
      "explosiveScore": 92,
      "trend": "explosion",
      "cpc": 1.45,
      "opportunity": "Explication courte de pourquoi ce mot-clé est une pépite",
      "relatedNiches": ["niche1", "niche2"]
    }
  ]
}

RÈGLES CRITIQUES:
- Les mots-clés doivent être en FRANÇAIS
- Privilégie les mots-clés LONGUE TRAÎNE (3-6 mots)
- explosiveScore de 60 à 98 : combine volume de recherche élevé + faible concurrence
- competition: "très faible", "faible", "modéré" ou "élevé"  
- trend: "explosion" (croissance >50%), "montée" (20-50%), "émergent" (<20% mais nouveau), "stable"
- Cherche les LACUNES : ce que les gens cherchent mais ne trouvent pas encore
- searchVolume entre 500 et 50000
- cpc entre 0.20 et 5.00
- Trie par explosiveScore décroissant`;
      }

      if (type === 'titles') {
        prompt = `Tu es un expert en copywriting et titres de livres best-sellers Amazon KDP. Crée des titres EXPLOSIFS pour la niche "${query}".

Génère exactement 8 titres viraux en JSON:
{
  "titles": [
    {
      "title": "Titre principal percutant et SEO",
      "subtitle": "Sous-titre descriptif avec mots-clés stratégiques",
      "viralScore": 94,
      "emotionalHook": "La promesse émotionnelle en une phrase",
      "targetEmotion": "curiosité / peur / désir / fierté / urgence",
      "keywordsUsed": ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
      "estimatedCtr": 12.5,
      "whyItWorks": "Explication psychologique de pourquoi ce titre convertit",
      "category": "curiosité"
    }
  ]
}

RÈGLES CRITIQUES:
- Utilise les FORMULES qui marchent : chiffres, "Comment", "Guide", "Secret", "Sans", négation, paradoxe
- viralScore de 65 à 98 basé sur : accroche + SEO + émotion + clarté
- estimatedCtr entre 3.0 et 18.0 (% de clics estimé)
- category: "curiosité", "transformation", "urgence", "autorité" ou "contrarian"
- Chaque titre doit utiliser une technique de copywriting DIFFÉRENTE
- Les titres doivent être en FRANÇAIS
- Trie par viralScore décroissant`;
      }

      if (type === 'opportunities') {
        prompt = `Tu es un expert en analyse de marché Amazon KDP. Trouve les opportunités de niche les plus rentables autour de "${query}".

Génère exactement 6 opportunités en JSON:
{
  "opportunities": [
    {
      "niche": "Nom précis de la sous-niche",
      "demandScore": 88,
      "competitionLevel": 25,
      "profitPotential": 92,
      "bestAngles": ["Angle éditorial 1", "Angle éditorial 2", "Angle éditorial 3"],
      "avoidAngles": ["Piège à éviter 1", "Piège à éviter 2"],
      "idealPrice": 14.99,
      "estimatedMonthlySales": 350
    }
  ]
}

RÈGLES:
- demandScore: 50-98 (intensité de la demande)
- competitionLevel: 10-90 (plus bas = moins de concurrence = mieux)
- profitPotential: 50-98 (combine marge, volume, durabilité)
- idealPrice entre 4.99 et 24.99
- estimatedMonthlySales entre 50 et 2000
- bestAngles: 3 angles éditoriaux gagnants
- avoidAngles: 2 erreurs courantes
- Trie par profitPotential décroissant`;
      }

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'kdp-explosive-simulator', prompt }
      });

      if (error) throw error;
      if (!data?.content) throw new Error('Pas de contenu dans la réponse');

      const parsed = cleanAndParseJSON(data.content, type);

      if (type === 'keywords') setKeywords(parsed.keywords || []);
      if (type === 'titles') setTitles(parsed.titles || []);
      if (type === 'opportunities') setOpportunities(parsed.opportunities || []);

      toast.success(`🔥 ${type === 'keywords' ? 'Mots-clés explosifs' : type === 'titles' ? 'Titres viraux' : 'Opportunités'} générés !`);
    } catch (err: any) {
      console.error('KDP Simulator error:', err);
      toast.error(err?.message || 'Erreur lors de la génération. Réessayez.');
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  const handleGenerateAll = async () => {
    if (!query.trim()) {
      toast.error('Entrez une niche ou un sujet');
      return;
    }
    setIsLoading(true);
    setLoadingType('all');
    
    try {
      await Promise.all([
        handleGenerateSilent('keywords'),
        handleGenerateSilent('titles'),
        handleGenerateSilent('opportunities'),
      ]);
      toast.success('🚀 Analyse explosive complète terminée !');
    } catch {
      toast.error('Certaines analyses ont échoué');
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  const handleGenerateSilent = async (type: 'keywords' | 'titles' | 'opportunities') => {
    // Same logic but without toast and loading state changes
    let prompt = '';
    if (type === 'keywords') {
      prompt = `Expert mots-clés KDP. Niche: "${query}". 10 mots-clés explosifs longue traîne FR en JSON: {"keywords":[{"keyword":"...","searchVolume":8500,"competition":"faible","explosiveScore":92,"trend":"explosion","cpc":1.45,"opportunity":"...","relatedNiches":["...",""]}]}. Règles: FR, longue traîne 3-6 mots, explosiveScore 60-98, competition: très faible/faible/modéré/élevé, trend: explosion/montée/émergent/stable, searchVolume 500-50000, cpc 0.20-5.00, tri par score desc.`;
    } else if (type === 'titles') {
      prompt = `Expert copywriting KDP. Niche: "${query}". 8 titres viraux FR en JSON: {"titles":[{"title":"...","subtitle":"...","viralScore":94,"emotionalHook":"...","targetEmotion":"curiosité","keywordsUsed":["..."],"estimatedCtr":12.5,"whyItWorks":"...","category":"curiosité"}]}. Categories: curiosité/transformation/urgence/autorité/contrarian. viralScore 65-98, estimatedCtr 3-18, techniques variées, tri desc.`;
    } else {
      prompt = `Expert marché KDP. Niche: "${query}". 6 opportunités FR en JSON: {"opportunities":[{"niche":"...","demandScore":88,"competitionLevel":25,"profitPotential":92,"bestAngles":["...","...","..."],"avoidAngles":["...","..."],"idealPrice":14.99,"estimatedMonthlySales":350}]}. demandScore 50-98, competitionLevel 10-90, profitPotential 50-98, prix 4.99-24.99, ventes 50-2000, tri desc.`;
    }

    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: { type: 'kdp-explosive-simulator', prompt }
    });
    if (error) throw error;
    if (!data?.content) throw new Error('Pas de contenu');
    const parsed = cleanAndParseJSON(data.content, type);
    if (type === 'keywords') setKeywords(parsed.keywords || []);
    if (type === 'titles') setTitles(parsed.titles || []);
    if (type === 'opportunities') setOpportunities(parsed.opportunities || []);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
              <Flame className="h-7 w-7" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Simulateur KDP Explosif
              </span>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Trouvez les mots-clés pépites et les titres qui cartonnent sur Amazon
              </p>
            </div>
            <Badge className="bg-red-500 text-white ml-auto">
              <Zap className="h-3 w-3 mr-1" /> POWER TOOL
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: développement personnel, cuisine végane, productivité..."
                className="pl-11 h-12 text-lg border-2 focus:border-red-500/50"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateAll()}
              />
            </div>
            <Button 
              onClick={handleGenerateAll}
              disabled={isLoading}
              className="h-12 px-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
            >
              {isLoading && loadingType === 'all' ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Rocket className="h-5 w-5 mr-2" />
              )}
              Analyse Explosive
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="keywords" className="gap-2">
            <Target className="h-4 w-4" />
            Mots-clés Explosifs
            {keywords.length > 0 && (
              <Badge variant="secondary" className="ml-1">{keywords.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="titles" className="gap-2">
            <Crown className="h-4 w-4" />
            Titres Viraux
            {titles.length > 0 && (
              <Badge variant="secondary" className="ml-1">{titles.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Opportunités
            {opportunities.length > 0 && (
              <Badge variant="secondary" className="ml-1">{opportunities.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* === KEYWORDS TAB === */}
        <TabsContent value="keywords" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Mots-clés longue traîne à fort potentiel et faible concurrence
            </p>
            <Button
              onClick={() => handleGenerate('keywords')}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading && loadingType === 'keywords' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
          </div>

          {keywords.length === 0 && !isLoading && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Entrez un thème et lancez l'analyse pour découvrir les mots-clés pépites
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3">
            {keywords.map((kw, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getTrendEmoji(kw.trend)}</span>
                        <h4 className="font-semibold text-base">{kw.keyword}</h4>
                        <Badge 
                          variant="outline"
                          className={kw.competition === 'très faible' || kw.competition === 'faible' 
                            ? 'border-green-500 text-green-600' 
                            : kw.competition === 'modéré' 
                            ? 'border-yellow-500 text-yellow-600'
                            : 'border-red-500 text-red-600'
                          }
                        >
                          {kw.competition}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(kw.keyword)}
                          className="h-7 w-7 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{kw.opportunity}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {kw.relatedNiches.map((n, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">{n}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-right space-y-1 shrink-0">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-muted-foreground">Score</span>
                        <span className={`text-2xl font-black ${getScoreColor(kw.explosiveScore)}`}>
                          {kw.explosiveScore}
                        </span>
                      </div>
                      <Progress value={kw.explosiveScore} className="w-20 h-2" />
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span>🔍 {kw.searchVolume.toLocaleString()}/m</span>
                        <span>💰 {kw.cpc}€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* === TITLES TAB === */}
        <TabsContent value="titles" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Titres optimisés pour maximiser les clics et les ventes
            </p>
            <Button
              onClick={() => handleGenerate('titles')}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading && loadingType === 'titles' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
          </div>

          {titles.length === 0 && !isLoading && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Crown className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Générez des titres viraux qui captivent et convertissent
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {titles.map((t, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Score bar */}
                    <div className={`w-2 ${getScoreBg(t.viralScore)}`} />
                    
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{getCategoryEmoji(t.category)}</span>
                            <Badge variant="outline" className="text-xs capitalize">{t.category}</Badge>
                          </div>
                          <h4 className="font-bold text-lg leading-tight">{t.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
                        </div>
                        
                        <div className="text-center shrink-0">
                          <div className={`text-3xl font-black ${getScoreColor(t.viralScore)}`}>
                            {t.viralScore}
                          </div>
                          <span className="text-xs text-muted-foreground">viral</span>
                          <div className="mt-1 text-xs font-medium text-green-600">
                            CTR ~{t.estimatedCtr}%
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <p className="text-sm">
                          <span className="font-medium">🎯 Hook : </span>
                          {t.emotionalHook}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">💡 Pourquoi ça marche : </span>
                          {t.whyItWorks}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {t.keywordsUsed.map((kw, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">{kw}</Badge>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${t.title}: ${t.subtitle}`)}
                        >
                          <Copy className="h-4 w-4 mr-1" /> Copier
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* === OPPORTUNITIES TAB === */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Sous-niches à fort potentiel avec faible concurrence
            </p>
            <Button
              onClick={() => handleGenerate('opportunities')}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading && loadingType === 'opportunities' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
          </div>

          {opportunities.length === 0 && !isLoading && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Découvrez les niches les plus rentables et sous-exploitées
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {opportunities.map((opp, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    {opp.niche}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <div className="text-lg font-bold text-green-600">{opp.demandScore}</div>
                      <div className="text-xs text-muted-foreground">Demande</div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <div className="text-lg font-bold text-blue-600">{100 - opp.competitionLevel}</div>
                      <div className="text-xs text-muted-foreground">Accessibilité</div>
                    </div>
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <div className="text-lg font-bold text-orange-600">{opp.profitPotential}</div>
                      <div className="text-xs text-muted-foreground">Profit</div>
                    </div>
                  </div>

                  {/* Price & Sales */}
                  <div className="flex justify-between text-sm bg-muted/50 rounded-lg p-2">
                    <span>💰 Prix idéal: <strong>{opp.idealPrice}€</strong></span>
                    <span>📦 ~{opp.estimatedMonthlySales} ventes/mois</span>
                  </div>

                  {/* Best angles */}
                  <div>
                    <p className="text-xs font-medium text-green-600 mb-1">✅ Angles gagnants :</p>
                    <div className="space-y-1">
                      {opp.bestAngles.map((a, j) => (
                        <div key={j} className="text-xs flex items-start gap-1">
                          <ArrowRight className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Avoid */}
                  <div>
                    <p className="text-xs font-medium text-red-500 mb-1">⚠️ À éviter :</p>
                    <div className="space-y-1">
                      {opp.avoidAngles.map((a, j) => (
                        <div key={j} className="text-xs flex items-start gap-1 text-muted-foreground">
                          <span>•</span>
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookKdpExplosiveSimulator;
