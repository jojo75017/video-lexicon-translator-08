import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, TrendingUp, Target, Sparkles, AlertTriangle, CheckCircle2,
  BarChart3, PieChart, Zap, Calculator, Lightbulb, ArrowRight, Info,
  Search, Tag, MousePointerClick, Eye, ShoppingCart, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CampaignSimulation {
  dailyBudget: number;
  duration: number;
  cpc: number;
  conversionRate: number;
  bookPrice: number;
  royaltyRate: number;
}

interface KeywordSuggestion {
  keyword: string;
  searchVolume: string;
  competition: 'low' | 'medium' | 'high';
  suggestedBid: number;
  relevance: number;
}

const EbookAmazonAdsSimulator: React.FC<{ ebookTitle?: string; genre?: string }> = ({ 
  ebookTitle = '', 
  genre = '' 
}) => {
  const [activeTab, setActiveTab] = useState('budget');
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  
  // Campaign parameters
  const [campaign, setCampaign] = useState<CampaignSimulation>({
    dailyBudget: 10,
    duration: 30,
    cpc: 0.35,
    conversionRate: 15,
    bookPrice: 9.99,
    royaltyRate: 70
  });

  // Generated keywords
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [niche, setNiche] = useState(genre || 'développement personnel');
  
  // Campaign type
  const [campaignType, setCampaignType] = useState<'sponsored-products' | 'sponsored-brands'>('sponsored-products');

  // Calculate projections
  const projections = useMemo(() => {
    const totalBudget = campaign.dailyBudget * campaign.duration;
    const estimatedClicks = Math.floor(totalBudget / campaign.cpc);
    const estimatedSales = Math.floor(estimatedClicks * (campaign.conversionRate / 100));
    const revenuePerSale = campaign.bookPrice * (campaign.royaltyRate / 100);
    const totalRevenue = estimatedSales * revenuePerSale;
    const totalCost = totalBudget;
    const profit = totalRevenue - totalCost;
    const acos = totalRevenue > 0 ? (totalCost / totalRevenue) * 100 : 0;
    const roas = totalCost > 0 ? totalRevenue / totalCost : 0;
    const roi = totalCost > 0 ? ((profit) / totalCost) * 100 : 0;
    
    return {
      totalBudget,
      estimatedClicks,
      estimatedSales,
      revenuePerSale,
      totalRevenue,
      profit,
      acos,
      roas,
      roi,
      isProfitable: profit > 0
    };
  }, [campaign]);

  // Generate keyword suggestions based on niche
  const generateKeywords = async () => {
    setIsGeneratingKeywords(true);
    
    // Simulate AI keyword generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const nicheKeywords: Record<string, KeywordSuggestion[]> = {
      'développement personnel': [
        { keyword: 'développement personnel livre', searchVolume: '12K', competition: 'high', suggestedBid: 0.45, relevance: 95 },
        { keyword: 'confiance en soi ebook', searchVolume: '8K', competition: 'medium', suggestedBid: 0.35, relevance: 90 },
        { keyword: 'habitudes productivité', searchVolume: '5K', competition: 'low', suggestedBid: 0.25, relevance: 85 },
        { keyword: 'mindset entrepreneur', searchVolume: '4K', competition: 'medium', suggestedBid: 0.40, relevance: 88 },
        { keyword: 'réussir sa vie livre', searchVolume: '6K', competition: 'medium', suggestedBid: 0.38, relevance: 82 },
        { keyword: 'motivation succès', searchVolume: '3K', competition: 'low', suggestedBid: 0.22, relevance: 80 },
        { keyword: 'croissance personnelle', searchVolume: '7K', competition: 'high', suggestedBid: 0.48, relevance: 92 },
      ],
      'romance': [
        { keyword: 'romance française ebook', searchVolume: '15K', competition: 'high', suggestedBid: 0.50, relevance: 95 },
        { keyword: 'histoire amour kindle', searchVolume: '10K', competition: 'medium', suggestedBid: 0.35, relevance: 90 },
        { keyword: 'roman sentimental', searchVolume: '8K', competition: 'medium', suggestedBid: 0.32, relevance: 88 },
        { keyword: 'love story français', searchVolume: '5K', competition: 'low', suggestedBid: 0.25, relevance: 85 },
        { keyword: 'romance contemporaine', searchVolume: '6K', competition: 'medium', suggestedBid: 0.38, relevance: 87 },
      ],
      'thriller': [
        { keyword: 'thriller français kindle', searchVolume: '12K', competition: 'high', suggestedBid: 0.48, relevance: 95 },
        { keyword: 'polar ebook', searchVolume: '9K', competition: 'medium', suggestedBid: 0.35, relevance: 92 },
        { keyword: 'suspense livre', searchVolume: '7K', competition: 'medium', suggestedBid: 0.30, relevance: 88 },
        { keyword: 'enquête policière roman', searchVolume: '5K', competition: 'low', suggestedBid: 0.25, relevance: 85 },
      ],
      'business': [
        { keyword: 'livre business entrepreneur', searchVolume: '10K', competition: 'high', suggestedBid: 0.55, relevance: 95 },
        { keyword: 'création entreprise ebook', searchVolume: '6K', competition: 'medium', suggestedBid: 0.40, relevance: 90 },
        { keyword: 'marketing digital livre', searchVolume: '8K', competition: 'high', suggestedBid: 0.52, relevance: 88 },
        { keyword: 'startup guide', searchVolume: '4K', competition: 'low', suggestedBid: 0.28, relevance: 85 },
      ],
      'cuisine': [
        { keyword: 'recettes faciles ebook', searchVolume: '14K', competition: 'high', suggestedBid: 0.42, relevance: 95 },
        { keyword: 'livre cuisine maison', searchVolume: '9K', competition: 'medium', suggestedBid: 0.35, relevance: 92 },
        { keyword: 'recettes healthy', searchVolume: '11K', competition: 'high', suggestedBid: 0.45, relevance: 90 },
        { keyword: 'meal prep livre', searchVolume: '5K', competition: 'low', suggestedBid: 0.25, relevance: 85 },
      ],
      'fantasy': [
        { keyword: 'fantasy français ebook', searchVolume: '8K', competition: 'medium', suggestedBid: 0.38, relevance: 95 },
        { keyword: 'roman fantastique kindle', searchVolume: '6K', competition: 'medium', suggestedBid: 0.35, relevance: 90 },
        { keyword: 'magie aventure livre', searchVolume: '4K', competition: 'low', suggestedBid: 0.28, relevance: 88 },
      ],
    };

    const selectedKeywords = nicheKeywords[niche.toLowerCase()] || nicheKeywords['développement personnel'];
    setKeywords(selectedKeywords);
    setIsGeneratingKeywords(false);
    toast.success(`${selectedKeywords.length} mots-clés générés pour "${niche}"`);
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAcosStatus = (acos: number) => {
    if (acos <= 30) return { color: 'text-green-500', label: 'Excellent', icon: CheckCircle2 };
    if (acos <= 50) return { color: 'text-yellow-500', label: 'Acceptable', icon: AlertTriangle };
    return { color: 'text-red-500', label: 'Élevé', icon: AlertTriangle };
  };

  const acosStatus = getAcosStatus(projections.acos);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-orange-500" />
            Simulateur Amazon Ads
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px]">
              2026
            </Badge>
          </h2>
          <p className="text-muted-foreground">
            Planifiez et optimisez vos campagnes publicitaires Amazon
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-600">Simulation à titre indicatif</p>
              <p className="text-muted-foreground">
                Les projections sont basées sur des moyennes du marché. Les résultats réels peuvent varier selon votre niche, la qualité de votre couverture, et la saisonnalité.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="budget" className="gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Budget</span>
          </TabsTrigger>
          <TabsTrigger value="keywords" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Keywords</span>
          </TabsTrigger>
          <TabsTrigger value="acos" className="gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">ACOS</span>
          </TabsTrigger>
          <TabsTrigger value="roi" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">ROI</span>
          </TabsTrigger>
        </TabsList>

        {/* Budget Planner Tab */}
        <TabsContent value="budget" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Configuration de la campagne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Campaign Type */}
                <div className="space-y-2">
                  <Label>Type de campagne</Label>
                  <Select value={campaignType} onValueChange={(v: any) => setCampaignType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sponsored-products">Sponsored Products (Recommandé)</SelectItem>
                      <SelectItem value="sponsored-brands">Sponsored Brands</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Daily Budget */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Budget quotidien</Label>
                    <span className="text-lg font-bold text-green-500">{campaign.dailyBudget}€</span>
                  </div>
                  <Slider
                    value={[campaign.dailyBudget]}
                    onValueChange={([v]) => setCampaign(prev => ({ ...prev, dailyBudget: v }))}
                    min={5}
                    max={100}
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5€ (Minimum)</span>
                    <span>100€ (Agressif)</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Durée de campagne</Label>
                    <span className="text-lg font-bold">{campaign.duration} jours</span>
                  </div>
                  <Slider
                    value={[campaign.duration]}
                    onValueChange={([v]) => setCampaign(prev => ({ ...prev, duration: v }))}
                    min={7}
                    max={90}
                    step={7}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>7 jours (Test)</span>
                    <span>90 jours (Optimal)</span>
                  </div>
                </div>

                {/* CPC */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Coût par clic estimé (CPC)</Label>
                    <span className="text-lg font-bold">{campaign.cpc.toFixed(2)}€</span>
                  </div>
                  <Slider
                    value={[campaign.cpc * 100]}
                    onValueChange={([v]) => setCampaign(prev => ({ ...prev, cpc: v / 100 }))}
                    min={15}
                    max={100}
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.15€ (Niche faible)</span>
                    <span>1.00€ (Compétitif)</span>
                  </div>
                </div>

                {/* Book Price */}
                <div className="space-y-2">
                  <Label>Prix de votre ebook</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={campaign.bookPrice}
                      onChange={(e) => setCampaign(prev => ({ ...prev, bookPrice: parseFloat(e.target.value) || 0 }))}
                      step="0.01"
                      min="0.99"
                      max="99.99"
                    />
                    <span className="flex items-center text-muted-foreground">€</span>
                  </div>
                </div>

                {/* Royalty Rate */}
                <div className="space-y-2">
                  <Label>Taux de royalties KDP</Label>
                  <Select 
                    value={campaign.royaltyRate.toString()} 
                    onValueChange={(v) => setCampaign(prev => ({ ...prev, royaltyRate: parseInt(v) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="35">35% (Prix &lt; 2.99€ ou &gt; 9.99€)</SelectItem>
                      <SelectItem value="70">70% (Prix entre 2.99€ et 9.99€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Résumé de la campagne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Budget total</div>
                    <div className="text-2xl font-bold text-blue-500">{projections.totalBudget}€</div>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3" />
                      Clics estimés
                    </div>
                    <div className="text-2xl font-bold text-purple-500">{projections.estimatedClicks.toLocaleString()}</div>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      Ventes estimées
                    </div>
                    <div className="text-2xl font-bold text-green-500">{projections.estimatedSales}</div>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Revenu par vente</div>
                    <div className="text-2xl font-bold text-amber-500">{projections.revenuePerSale.toFixed(2)}€</div>
                  </motion.div>
                </div>

                {/* Conversion Rate Slider */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Taux de conversion
                    </Label>
                    <span className="text-lg font-bold text-primary">{campaign.conversionRate}%</span>
                  </div>
                  <Slider
                    value={[campaign.conversionRate]}
                    onValueChange={([v]) => setCampaign(prev => ({ ...prev, conversionRate: v }))}
                    min={5}
                    max={30}
                    step={1}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5% (Conservateur)</span>
                    <span>30% (Optimiste)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 La moyenne Amazon est de 10-15% pour les ebooks bien positionnés
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Suggestions de mots-clés
              </CardTitle>
              <CardDescription>
                Générez des mots-clés optimisés pour votre niche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Niche / Genre</Label>
                  <Select value={niche} onValueChange={setNiche}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre niche" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="développement personnel">Développement personnel</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="thriller">Thriller / Polar</SelectItem>
                      <SelectItem value="business">Business / Entrepreneuriat</SelectItem>
                      <SelectItem value="cuisine">Cuisine / Recettes</SelectItem>
                      <SelectItem value="fantasy">Fantasy / Fantastique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={generateKeywords}
                  disabled={isGeneratingKeywords}
                  className="mt-6 gap-2"
                >
                  {isGeneratingKeywords ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Générer
                    </>
                  )}
                </Button>
              </div>

              {keywords.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{keywords.length} mots-clés trouvés</span>
                    <Badge variant="outline">{niche}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {keywords.map((kw, index) => (
                      <motion.div
                        key={kw.keyword}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Tag className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-medium">{kw.keyword}</div>
                            <div className="text-xs text-muted-foreground">
                              Volume: {kw.searchVolume}/mois
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getCompetitionColor(kw.competition)}>
                            {kw.competition === 'low' ? 'Faible' : kw.competition === 'medium' ? 'Moyen' : 'Élevé'}
                          </Badge>
                          <div className="text-right">
                            <div className="font-bold text-green-500">{kw.suggestedBid.toFixed(2)}€</div>
                            <div className="text-xs text-muted-foreground">CPC suggéré</div>
                          </div>
                          <div className="w-12">
                            <Progress value={kw.relevance} className="h-2" />
                            <div className="text-xs text-center text-muted-foreground mt-1">{kw.relevance}%</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {keywords.length === 0 && !isGeneratingKeywords && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez votre niche et cliquez sur "Générer"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACOS Tab */}
        <TabsContent value="acos" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-orange-500" />
                  Analyse ACOS
                </CardTitle>
                <CardDescription>
                  Advertising Cost of Sale - Coût publicitaire par rapport aux ventes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className={`p-6 rounded-2xl text-center ${
                    projections.isProfitable 
                      ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30' 
                      : 'bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/30'
                  }`}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-sm text-muted-foreground mb-2">Votre ACOS</div>
                  <div className={`text-5xl font-black ${acosStatus.color}`}>
                    {projections.acos.toFixed(1)}%
                  </div>
                  <div className={`flex items-center justify-center gap-2 mt-2 ${acosStatus.color}`}>
                    <acosStatus.icon className="h-4 w-4" />
                    <span className="font-medium">{acosStatus.label}</span>
                  </div>
                </motion.div>

                <div className="space-y-3">
                  <h4 className="font-medium">Interprétation ACOS</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 p-2 rounded bg-green-500/10">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span><strong>0-30%</strong> - Excellent, campagne très rentable</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-yellow-500/10">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span><strong>30-50%</strong> - Acceptable, potentiel d'optimisation</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-red-500/10">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span><strong>50%+</strong> - Élevé, ajustements nécessaires</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Conseils d'optimisation
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {projections.acos > 50 && (
                      <>
                        <li>• Réduisez votre enchère CPC</li>
                        <li>• Ciblez des mots-clés moins compétitifs</li>
                        <li>• Améliorez votre page produit (couverture, description)</li>
                      </>
                    )}
                    {projections.acos > 30 && projections.acos <= 50 && (
                      <>
                        <li>• Testez différentes enchères</li>
                        <li>• Optimisez votre taux de conversion</li>
                        <li>• Ajoutez des mots-clés négatifs</li>
                      </>
                    )}
                    {projections.acos <= 30 && (
                      <>
                        <li>• Votre campagne est bien optimisée</li>
                        <li>• Envisagez d'augmenter le budget pour plus de volume</li>
                        <li>• Maintenez les enchères actuelles</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-500" />
                  Détail des coûts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Dépenses publicitaires</span>
                    <span className="font-bold text-red-500">-{projections.totalBudget}€</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Revenus générés</span>
                    <span className="font-bold text-green-500">+{projections.totalRevenue.toFixed(2)}€</span>
                  </div>
                  <div className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                    projections.isProfitable ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'
                  }`}>
                    <span className="font-medium">Profit net</span>
                    <span className={`text-xl font-bold ${projections.isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                      {projections.profit >= 0 ? '+' : ''}{projections.profit.toFixed(2)}€
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium">Métriques clés</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <div className="text-xs text-muted-foreground">Coût/vente</div>
                      <div className="text-lg font-bold">
                        {projections.estimatedSales > 0 
                          ? (projections.totalBudget / projections.estimatedSales).toFixed(2) 
                          : '0.00'}€
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <div className="text-xs text-muted-foreground">ROAS</div>
                      <div className="text-lg font-bold">{projections.roas.toFixed(2)}x</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ROI Tab */}
        <TabsContent value="roi" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Projection ROI
                </CardTitle>
                <CardDescription>
                  Retour sur investissement de votre campagne
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">ROI</div>
                    <div className={`text-2xl font-black ${projections.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {projections.roi >= 0 ? '+' : ''}{projections.roi.toFixed(0)}%
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">ROAS</div>
                    <div className="text-2xl font-black text-blue-500">{projections.roas.toFixed(2)}x</div>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/20 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">Ventes totales</div>
                    <div className="text-2xl font-black text-purple-500">{projections.estimatedSales}</div>
                  </motion.div>
                  
                  <motion.div 
                    className={`p-4 rounded-xl text-center ${
                      projections.isProfitable 
                        ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20' 
                        : 'bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">Profit</div>
                    <div className={`text-2xl font-black ${projections.isProfitable ? 'text-emerald-500' : 'text-red-500'}`}>
                      {projections.profit >= 0 ? '+' : ''}{projections.profit.toFixed(0)}€
                    </div>
                  </motion.div>
                </div>

                {/* Simulation Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium">Projection sur {campaign.duration} jours</h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
                    {[
                      { day: 7, label: 'Semaine 1', desc: 'Phase d\'apprentissage - Collecte de données' },
                      { day: 14, label: 'Semaine 2', desc: 'Optimisation des enchères basée sur les premiers résultats' },
                      { day: 30, label: 'Mois 1', desc: 'Stabilisation et scaling des performances' },
                    ].filter(item => item.day <= campaign.duration).map((milestone, index) => (
                      <motion.div
                        key={milestone.day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="relative pl-10 pb-6"
                      >
                        <div className="absolute left-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                        <div className="font-medium">{milestone.label}</div>
                        <div className="text-sm text-muted-foreground">{milestone.desc}</div>
                        <div className="text-xs text-primary mt-1">
                          ~{Math.floor(projections.estimatedSales * (milestone.day / campaign.duration))} ventes estimées
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-orange-500" />
                  Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-xl ${
                  projections.isProfitable 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-amber-500/10 border border-amber-500/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {projections.isProfitable ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                    <span className="font-medium">
                      {projections.isProfitable ? 'Campagne rentable' : 'Optimisation requise'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {projections.isProfitable 
                      ? 'Vos paramètres actuels génèrent un profit. Vous pouvez envisager d\'augmenter le budget.'
                      : 'Ajustez vos paramètres pour atteindre la rentabilité avant de lancer.'
                    }
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Actions suggérées</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>Commencez avec un budget test de 7 jours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>Utilisez le ciblage automatique au début</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>Analysez les rapports après 48-72h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>Ajoutez des mots-clés négatifs régulièrement</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full gap-2 mt-4" variant="outline">
                  <Eye className="h-4 w-4" />
                  Guide Amazon Ads complet
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookAmazonAdsSimulator;
