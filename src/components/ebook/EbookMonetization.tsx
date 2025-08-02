import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, TrendingUp, Package, Users, 
  Calculator, Sparkles, Target, BarChart3,
  Copy, Download, Share, Percent, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { calculateRoi } from '@/utils/seo/roiCalculator';
import { RoiResults } from '@/types/seo/RoiResults';

export const EbookMonetization: React.FC = () => {
  // États pour le calculateur ROI
  const [roiParams, setRoiParams] = useState({
    investment: 500,
    currentTraffic: 1000,
    projectedIncrease: 150,
    conversionRate: 2.5,
    averageOrderValue: 29.99,
    timeframe: 12
  });
  const [roiResults, setRoiResults] = useState<RoiResults | null>(null);

  // États pour les prix dynamiques
  const [priceAnalysis, setPriceAnalysis] = useState({
    category: '',
    competition: '',
    quality: 'standard',
    length: 100,
    format: 'pdf'
  });
  const [suggestedPrices, setSuggestedPrices] = useState<any>(null);

  // États pour les bundles
  const [bundles, setBundles] = useState<Array<{
    id: string;
    name: string;
    ebooks: string[];
    originalPrice: number;
    bundlePrice: number;
    discount: number;
  }>>([]);
  const [bundleForm, setBundleForm] = useState({
    name: '',
    ebooks: '',
    originalPrice: 0,
    discount: 20
  });

  // États pour l'affiliation
  const [affiliateProgram, setAffiliateProgram] = useState({
    commissionRate: 30,
    cookieDuration: 30,
    minimumPayout: 50,
    paymentSchedule: 'monthly'
  });

  // Calculer ROI en temps réel
  useEffect(() => {
    const results = calculateRoi(
      roiParams.investment,
      roiParams.currentTraffic,
      roiParams.projectedIncrease,
      roiParams.conversionRate,
      roiParams.averageOrderValue,
      roiParams.timeframe
    );
    setRoiResults(results);
  }, [roiParams]);

  // Générer suggestions de prix
  const generatePricesSuggestions = () => {
    const basePrice = 19.99;
    const factors = {
      category: priceAnalysis.category === 'business' ? 1.5 : 
                priceAnalysis.category === 'self-help' ? 1.2 : 1.0,
      quality: priceAnalysis.quality === 'premium' ? 1.4 : 
               priceAnalysis.quality === 'standard' ? 1.0 : 0.7,
      length: Math.max(0.8, Math.min(2.0, priceAnalysis.length / 100)),
      format: priceAnalysis.format === 'interactive' ? 1.3 : 1.0
    };

    const calculatedPrice = basePrice * factors.category * factors.quality * factors.length * factors.format;
    
    setSuggestedPrices({
      recommended: Math.round(calculatedPrice * 100) / 100,
      economy: Math.round(calculatedPrice * 0.8 * 100) / 100,
      premium: Math.round(calculatedPrice * 1.2 * 100) / 100,
      psychological: Math.round((calculatedPrice - 0.01) * 100) / 100,
      market: {
        low: Math.round(calculatedPrice * 0.7 * 100) / 100,
        high: Math.round(calculatedPrice * 1.5 * 100) / 100
      }
    });
    
    toast.success('Prix suggérés générés !');
  };

  // Ajouter un bundle
  const addBundle = () => {
    if (!bundleForm.name || !bundleForm.ebooks) {
      toast.error('Remplissez tous les champs obligatoires');
      return;
    }

    const ebooksList = bundleForm.ebooks.split(',').map(e => e.trim());
    const bundlePrice = bundleForm.originalPrice * (1 - bundleForm.discount / 100);

    const newBundle = {
      id: Date.now().toString(),
      name: bundleForm.name,
      ebooks: ebooksList,
      originalPrice: bundleForm.originalPrice,
      bundlePrice: Math.round(bundlePrice * 100) / 100,
      discount: bundleForm.discount
    };

    setBundles([...bundles, newBundle]);
    setBundleForm({ name: '', ebooks: '', originalPrice: 0, discount: 20 });
    toast.success('Bundle créé avec succès !');
  };

  // Supprimer un bundle
  const removeBundle = (bundleId: string) => {
    setBundles(bundles.filter(b => b.id !== bundleId));
    toast.success('Bundle supprimé');
  };

  // Copier le code d'affiliation
  const copyAffiliateCode = () => {
    const code = `
<!-- Code d'affiliation -->
<script>
  const affiliateProgram = {
    commissionRate: ${affiliateProgram.commissionRate},
    cookieDuration: ${affiliateProgram.cookieDuration},
    minimumPayout: ${affiliateProgram.minimumPayout},
    paymentSchedule: '${affiliateProgram.paymentSchedule}'
  };
  
  // Tracker les clics d'affiliation
  function trackAffiliate(affiliateId, ebookId) {
    localStorage.setItem('affiliate_id', affiliateId);
    localStorage.setItem('affiliate_timestamp', Date.now());
    // Rediriger vers la page d'achat
    window.location.href = '/purchase?ebook=' + ebookId + '&ref=' + affiliateId;
  }
</script>`;

    navigator.clipboard.writeText(code);
    toast.success('Code d\'affiliation copié !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">💰 Monétisation</h2>
        <p className="text-muted-foreground">Optimisez vos revenus avec des outils avancés</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculateur ROI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculateur ROI en temps réel
            </CardTitle>
            <CardDescription>
              Analysez le retour sur investissement de vos ebooks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investment">Investissement initial (€)</Label>
                <Input
                  id="investment"
                  type="number"
                  value={roiParams.investment}
                  onChange={(e) => setRoiParams({...roiParams, investment: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="traffic">Trafic actuel (visiteurs/mois)</Label>
                <Input
                  id="traffic"
                  type="number"
                  value={roiParams.currentTraffic}
                  onChange={(e) => setRoiParams({...roiParams, currentTraffic: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="increase">Augmentation projetée (%)</Label>
                <Input
                  id="increase"
                  type="number"
                  value={roiParams.projectedIncrease}
                  onChange={(e) => setRoiParams({...roiParams, projectedIncrease: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="conversion">Taux de conversion (%)</Label>
                <Input
                  id="conversion"
                  type="number"
                  step="0.1"
                  value={roiParams.conversionRate}
                  onChange={(e) => setRoiParams({...roiParams, conversionRate: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="orderValue">Panier moyen (€)</Label>
                <Input
                  id="orderValue"
                  type="number"
                  step="0.01"
                  value={roiParams.averageOrderValue}
                  onChange={(e) => setRoiParams({...roiParams, averageOrderValue: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="timeframe">Période (mois)</Label>
                <Input
                  id="timeframe"
                  type="number"
                  value={roiParams.timeframe}
                  onChange={(e) => setRoiParams({...roiParams, timeframe: Number(e.target.value)})}
                />
              </div>
            </div>

            {roiResults && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-3 text-green-800">Résultats ROI</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">ROI:</span>
                    <span className="font-bold text-green-600 ml-2">{roiResults.roi}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenus annuels:</span>
                    <span className="font-bold ml-2">{roiResults.yearlyRevenue}€</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Seuil de rentabilité:</span>
                    <span className="font-bold ml-2">{roiResults.breakEvenMonth} mois</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conversions totales:</span>
                    <span className="font-bold ml-2">{roiResults.totalConversions}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prix dynamiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Prix dynamiques intelligents
            </CardTitle>
            <CardDescription>
              Suggestions de prix basées sur votre marché
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <select 
                  className="w-full p-2 border border-input rounded-md"
                  value={priceAnalysis.category}
                  onChange={(e) => setPriceAnalysis({...priceAnalysis, category: e.target.value})}
                >
                  <option value="">Sélectionner...</option>
                  <option value="business">Business</option>
                  <option value="self-help">Développement personnel</option>
                  <option value="fiction">Fiction</option>
                  <option value="technical">Technique</option>
                  <option value="cookbook">Cuisine</option>
                </select>
              </div>
              <div>
                <Label htmlFor="quality">Qualité</Label>
                <select 
                  className="w-full p-2 border border-input rounded-md"
                  value={priceAnalysis.quality}
                  onChange={(e) => setPriceAnalysis({...priceAnalysis, quality: e.target.value})}
                >
                  <option value="basic">Basique</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <Label htmlFor="length">Nombre de pages</Label>
                <Input
                  id="length"
                  type="number"
                  value={priceAnalysis.length}
                  onChange={(e) => setPriceAnalysis({...priceAnalysis, length: Number(e.target.value)})}
                />
              </div>
            </div>

            <Button onClick={generatePricesSuggestions} className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Générer les prix
            </Button>

            {suggestedPrices && (
              <div className="mt-4 space-y-3">
                <h4 className="font-semibold">Prix suggérés:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline">Recommandé: {suggestedPrices.recommended}€</Badge>
                  <Badge variant="outline">Économique: {suggestedPrices.economy}€</Badge>
                  <Badge variant="outline">Premium: {suggestedPrices.premium}€</Badge>
                  <Badge variant="outline">Psychologique: {suggestedPrices.psychological}€</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Fourchette marché: {suggestedPrices.market.low}€ - {suggestedPrices.market.high}€
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bundles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Création de bundles
            </CardTitle>
            <CardDescription>
              Regroupez vos ebooks pour augmenter vos ventes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="bundleName">Nom du bundle</Label>
                <Input
                  id="bundleName"
                  value={bundleForm.name}
                  onChange={(e) => setBundleForm({...bundleForm, name: e.target.value})}
                  placeholder="Pack Développement Personnel"
                />
              </div>
              <div>
                <Label htmlFor="bundleEbooks">Ebooks (séparés par des virgules)</Label>
                <Textarea
                  id="bundleEbooks"
                  value={bundleForm.ebooks}
                  onChange={(e) => setBundleForm({...bundleForm, ebooks: e.target.value})}
                  placeholder="Guide du Succès, Motivation 2024, Habitudes Gagnantes"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="originalPrice">Prix total original (€)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={bundleForm.originalPrice}
                    onChange={(e) => setBundleForm({...bundleForm, originalPrice: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Remise (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={bundleForm.discount}
                    onChange={(e) => setBundleForm({...bundleForm, discount: Number(e.target.value)})}
                  />
                </div>
              </div>
              {bundleForm.originalPrice > 0 && (
                <div className="text-sm text-muted-foreground">
                  Prix du bundle: {Math.round(bundleForm.originalPrice * (1 - bundleForm.discount / 100) * 100) / 100}€ 
                  (économie de {Math.round(bundleForm.originalPrice * bundleForm.discount / 100 * 100) / 100}€)
                </div>
              )}
            </div>

            <Button onClick={addBundle} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Créer le bundle
            </Button>

            {bundles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Bundles créés:</h4>
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{bundle.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {bundle.ebooks.length} ebooks • {bundle.bundlePrice}€ 
                          <span className="line-through ml-1">{bundle.originalPrice}€</span>
                          <Badge variant="secondary" className="ml-2">-{bundle.discount}%</Badge>
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeBundle(bundle.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Système d'affiliation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Programme d'affiliation
            </CardTitle>
            <CardDescription>
              Configurez votre système d'affiliation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  value={affiliateProgram.commissionRate}
                  onChange={(e) => setAffiliateProgram({...affiliateProgram, commissionRate: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="cookieDuration">Durée des cookies (jours)</Label>
                <Input
                  id="cookieDuration"
                  type="number"
                  value={affiliateProgram.cookieDuration}
                  onChange={(e) => setAffiliateProgram({...affiliateProgram, cookieDuration: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="minimumPayout">Paiement minimum (€)</Label>
                <Input
                  id="minimumPayout"
                  type="number"
                  value={affiliateProgram.minimumPayout}
                  onChange={(e) => setAffiliateProgram({...affiliateProgram, minimumPayout: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="paymentSchedule">Fréquence de paiement</Label>
                <select 
                  className="w-full p-2 border border-input rounded-md"
                  value={affiliateProgram.paymentSchedule}
                  onChange={(e) => setAffiliateProgram({...affiliateProgram, paymentSchedule: e.target.value})}
                >
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                  <option value="quarterly">Trimestriel</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Configuration actuelle:</h4>
              <div className="text-sm space-y-1 text-blue-700">
                <div>• Commission: {affiliateProgram.commissionRate}% par vente</div>
                <div>• Cookies: {affiliateProgram.cookieDuration} jours</div>
                <div>• Paiement min: {affiliateProgram.minimumPayout}€</div>
                <div>• Fréquence: {affiliateProgram.paymentSchedule}</div>
              </div>
            </div>

            <Button onClick={copyAffiliateCode} className="w-full">
              <Copy className="w-4 h-4 mr-2" />
              Copier le code d'affiliation
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques récapitulatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tableau de bord monétisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {roiResults ? `${roiResults.roi}%` : '0%'}
              </div>
              <div className="text-sm text-green-700">ROI Projeté</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {suggestedPrices ? `${suggestedPrices.recommended}€` : '0€'}
              </div>
              <div className="text-sm text-blue-700">Prix Recommandé</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{bundles.length}</div>
              <div className="text-sm text-purple-700">Bundles Créés</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{affiliateProgram.commissionRate}%</div>
              <div className="text-sm text-orange-700">Commission Affiliés</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};