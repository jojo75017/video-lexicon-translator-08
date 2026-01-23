import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  ExternalLink, 
  Copy, 
  Check,
  ShoppingCart,
  Percent,
  Calculator,
  Globe,
  CreditCard,
  Zap,
  BookOpen,
  TrendingUp,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface Platform {
  id: string;
  name: string;
  logo: string;
  fee: number;
  features: string[];
  link: string;
  color: string;
  recommended?: boolean;
}

interface EbookDirectSalesProps {
  ebookTitle: string;
  authorName: string;
  suggestedPrice?: number;
}

const platforms: Platform[] = [
  {
    id: 'gumroad',
    name: 'Gumroad',
    logo: '🍬',
    fee: 10,
    features: [
      'Paiement instantané',
      'Système d\'affiliation',
      'Vente par email',
      'Offres de pré-commande',
      'Analytics avancés'
    ],
    link: 'https://gumroad.com',
    color: 'from-pink-500 to-rose-500',
    recommended: true
  },
  {
    id: 'payhip',
    name: 'Payhip',
    logo: '💳',
    fee: 5,
    features: [
      'Frais les plus bas',
      'Coupons & promotions',
      'Abonnements',
      'Upsells intégrés',
      'Livraison PDF/EPUB'
    ],
    link: 'https://payhip.com',
    color: 'from-blue-500 to-cyan-500',
    recommended: true
  },
  {
    id: 'lemonsqueezy',
    name: 'Lemon Squeezy',
    logo: '🍋',
    fee: 5,
    features: [
      'TVA automatique',
      'Licences logicielles',
      'Abonnements',
      'Design moderne',
      'Support EU/RGPD'
    ],
    link: 'https://lemonsqueezy.com',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'ko-fi',
    name: 'Ko-fi',
    logo: '☕',
    fee: 0,
    features: [
      '0% de frais',
      'Donations & tips',
      'Boutique simple',
      'Communauté intégrée',
      'Abonnements'
    ],
    link: 'https://ko-fi.com',
    color: 'from-cyan-500 to-teal-500'
  }
];

const EbookDirectSales: React.FC<EbookDirectSalesProps> = ({
  ebookTitle,
  authorName,
  suggestedPrice = 9.99
}) => {
  const [price, setPrice] = useState(suggestedPrice);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('gumroad');
  const [copied, setCopied] = useState(false);

  const calculateEarnings = (platform: Platform) => {
    const platformFee = price * (platform.fee / 100);
    const paymentFee = price * 0.029 + 0.30; // Stripe/PayPal ~2.9% + 0.30$
    const netEarning = price - platformFee - paymentFee;
    const percentage = (netEarning / price) * 100;
    return { platformFee, paymentFee, netEarning, percentage };
  };

  const amazonComparison = {
    ebook35: price * 0.35, // 35% royalty (< $2.99 or > $9.99)
    ebook70: price * 0.70, // 70% royalty ($2.99 - $9.99)
    kdpSelect: price * 0.70, // KDP Select same but with exclusivity
  };

  const generateProductDescription = () => {
    return `📖 ${ebookTitle}
Par ${authorName}

✨ Ce que vous allez découvrir:
• [Point clé 1]
• [Point clé 2]
• [Point clé 3]

🎁 Bonus inclus:
• PDF haute qualité
• EPUB pour liseuse
• Mises à jour gratuites

💯 Satisfaction garantie - Remboursement sous 30 jours

📧 Questions? Contactez-moi: [votre email]`;
  };

  const copyDescription = async () => {
    await navigator.clipboard.writeText(generateProductDescription());
    setCopied(true);
    toast.success('Description copiée !');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentPlatform = platforms.find(p => p.id === selectedPlatform) || platforms[0];
  const earnings = calculateEarnings(currentPlatform);

  return (
    <Card className="border-2 border-dashed border-green-200 dark:border-green-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Vente Directe
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  2026
                </Badge>
              </CardTitle>
              <CardDescription>
                Vendez directement aux lecteurs et gardez jusqu'à 95% des revenus
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="platforms" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="platforms">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Plateformes
            </TabsTrigger>
            <TabsTrigger value="calculator">
              <Calculator className="h-4 w-4 mr-2" />
              Calculateur
            </TabsTrigger>
            <TabsTrigger value="description">
              <BookOpen className="h-4 w-4 mr-2" />
              Description
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="space-y-4">
            {/* Avantage vs Amazon */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Pourquoi vendre en direct ?
                </span>
              </div>
              <div className="grid gap-2 md:grid-cols-3 text-sm">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-green-600" />
                  <span>90-95% des revenus vs 35-70% Amazon</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span>Paiements immédiats (pas 60j)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span>Pas d'exclusivité KDP Select</span>
                </div>
              </div>
            </div>

            {/* Liste des plateformes */}
            <div className="grid gap-4 md:grid-cols-2">
              {platforms.map((platform) => {
                const platformEarnings = calculateEarnings(platform);
                return (
                  <Card 
                    key={platform.id}
                    className={`cursor-pointer transition-all ${
                      selectedPlatform === platform.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{platform.logo}</span>
                          <span className="font-semibold">{platform.name}</span>
                          {platform.recommended && (
                            <Badge className="bg-amber-500">Recommandé</Badge>
                          )}
                        </div>
                        <Badge variant="outline">
                          {platform.fee}% frais
                        </Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                        {platform.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          Vous gardez:
                        </span>
                        <span className="font-bold text-green-600">
                          {platformEarnings.percentage.toFixed(0)}% (~{platformEarnings.netEarning.toFixed(2)}€)
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Lien vers la plateforme */}
            <Button 
              className="w-full"
              onClick={() => window.open(currentPlatform.link, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Créer un compte {currentPlatform.name}
            </Button>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            {/* Prix de vente */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Prix de vente (€)</label>
              <Input
                type="number"
                min="0.99"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="text-lg font-mono"
              />
            </div>

            {/* Comparaison des gains */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Vente directe */}
              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Zap className="h-4 w-4" />
                    Vente Directe ({currentPlatform.name})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {earnings.netEarning.toFixed(2)}€
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Frais plateforme ({currentPlatform.fee}%):</span>
                      <span>-{earnings.platformFee.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais paiement (~3%):</span>
                      <span>-{earnings.paymentFee.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between font-medium pt-1 border-t">
                      <span>Vous gardez:</span>
                      <span className="text-green-600">{earnings.percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amazon KDP */}
              <Card className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-orange-700 dark:text-orange-300">
                    <ShoppingCart className="h-4 w-4" />
                    Amazon KDP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {amazonComparison.ebook70.toFixed(2)}€
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Royalties 70% (2.99-9.99€):</span>
                      <span>{amazonComparison.ebook70.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Royalties 35% (autre prix):</span>
                      <span>{amazonComparison.ebook35.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between font-medium pt-1 border-t">
                      <span>Paiement:</span>
                      <span className="text-orange-600">60 jours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Différence */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center">
              <div className="text-sm opacity-90">En vendant en direct, vous gagnez</div>
              <div className="text-2xl font-bold">
                +{(earnings.netEarning - amazonComparison.ebook70).toFixed(2)}€ par vente
              </div>
              <div className="text-sm opacity-90 mt-1">
                Soit {((earnings.netEarning / amazonComparison.ebook70 - 1) * 100).toFixed(0)}% de plus qu'Amazon
              </div>
            </div>
          </TabsContent>

          <TabsContent value="description" className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <strong>Template de description produit</strong>
                <p className="text-muted-foreground mt-1">
                  Personnalisez ce template pour votre page de vente Gumroad/Payhip.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm whitespace-pre-wrap">
              {generateProductDescription()}
            </div>

            <Button onClick={copyDescription} className="w-full">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copié !' : 'Copier la description'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EbookDirectSales;
