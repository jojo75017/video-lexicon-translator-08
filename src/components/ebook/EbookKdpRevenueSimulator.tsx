import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, BookOpen, Calculator, Target, Award } from 'lucide-react';

interface EbookKdpRevenueSimulatorProps {
  ebookTitle?: string;
}

const categories = [
  { id: 'fiction', label: 'Fiction / Roman', avgSales: 5 },
  { id: 'self-help', label: 'Développement Personnel', avgSales: 8 },
  { id: 'business', label: 'Business / Finance', avgSales: 6 },
  { id: 'cooking', label: 'Cuisine / Recettes', avgSales: 7 },
  { id: 'children', label: 'Livres Enfants', avgSales: 10 },
  { id: 'romance', label: 'Romance', avgSales: 12 },
  { id: 'thriller', label: 'Thriller / Policier', avgSales: 9 },
  { id: 'education', label: 'Éducation / Manuel', avgSales: 4 },
  { id: 'coloring', label: 'Coloriage / Activités', avgSales: 15 },
  { id: 'journal', label: 'Journal / Carnet', avgSales: 20 },
];

export const EbookKdpRevenueSimulator: React.FC<EbookKdpRevenueSimulatorProps> = ({ ebookTitle }) => {
  const [price, setPrice] = useState([9.99]);
  const [dailySales, setDailySales] = useState([5]);
  const [numBooks, setNumBooks] = useState([3]);
  const [category, setCategory] = useState('self-help');
  const [format, setFormat] = useState<'ebook' | 'paperback' | 'both'>('both');

  const results = useMemo(() => {
    const p = price[0];
    const sales = dailySales[0];
    const books = numBooks[0];

    // KDP royalty calculation
    const royaltyRate = p >= 2.99 && p <= 9.99 ? 0.70 : 0.35;
    const deliveryCost = p >= 2.99 && p <= 9.99 ? 0.01 : 0; // simplified
    const ebookRoyalty = (p - deliveryCost) * royaltyRate;

    // Paperback (60% royalty after printing)
    const printCost = 3.5; // avg printing cost
    const paperbackPrice = p * 1.8; // typical markup
    const paperbackRoyalty = Math.max(0, (paperbackPrice * 0.6) - printCost);

    let dailyPerBook = 0;
    if (format === 'ebook') dailyPerBook = ebookRoyalty * sales;
    else if (format === 'paperback') dailyPerBook = paperbackRoyalty * (sales * 0.3);
    else dailyPerBook = (ebookRoyalty * sales) + (paperbackRoyalty * (sales * 0.3));

    const dailyTotal = dailyPerBook * books;
    const monthlyTotal = dailyTotal * 30;
    const yearlyTotal = dailyTotal * 365;

    // 12-month projection with growth
    const projection = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const growthFactor = 1 + (month * 0.05); // 5% growth per month
      const revenue = monthlyTotal * growthFactor;
      return {
        month: `M${month}`,
        revenus: Math.round(revenue),
        cumulé: Math.round(revenue * (month + 1) / 2), // approximate cumulative
      };
    });

    return {
      royaltyRate: Math.round(royaltyRate * 100),
      ebookRoyalty: ebookRoyalty.toFixed(2),
      dailyTotal: dailyTotal.toFixed(2),
      monthlyTotal: Math.round(monthlyTotal),
      yearlyTotal: Math.round(yearlyTotal),
      projection,
    };
  }, [price, dailySales, numBooks, format]);

  const selectedCat = categories.find(c => c.id === category);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            Simulateur de Revenus KDP
            <Badge className="bg-primary/10 text-primary border-primary/30">PRO</Badge>
          </CardTitle>
          <CardDescription>
            Estimez vos gains Amazon KDP selon le prix, la catégorie et le volume de ventes
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" /> Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label} (~{c.avgSales} ventes/j)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as any)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ebook">eBook uniquement</SelectItem>
                  <SelectItem value="paperback">Broché uniquement</SelectItem>
                  <SelectItem value="both">eBook + Broché</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm font-medium">Prix eBook</Label>
                <Badge variant="secondary">{price[0].toFixed(2)} €</Badge>
              </div>
              <Slider value={price} onValueChange={setPrice} min={0.99} max={19.99} step={0.50} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0,99 €</span>
                <span className="text-primary font-medium">
                  Royalties : {results.royaltyRate}%
                </span>
                <span>19,99 €</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm font-medium">Ventes / jour / livre</Label>
                <Badge variant="secondary">{dailySales[0]}</Badge>
              </div>
              <Slider value={dailySales} onValueChange={setDailySales} min={1} max={50} step={1} />
              <p className="text-xs text-muted-foreground mt-1">
                Moyenne {selectedCat?.label} : ~{selectedCat?.avgSales} ventes/jour
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm font-medium">Nombre de livres publiés</Label>
                <Badge variant="secondary">{numBooks[0]}</Badge>
              </div>
              <Slider value={numBooks} onValueChange={setNumBooks} min={1} max={30} step={1} />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Estimation des Revenus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Royalty / vente', value: `${results.ebookRoyalty} €`, icon: BookOpen },
                { label: 'Revenus / jour', value: `${results.dailyTotal} €`, icon: DollarSign },
                { label: 'Revenus / mois', value: `${results.monthlyTotal.toLocaleString('fr-FR')} €`, icon: TrendingUp },
                { label: 'Revenus / an', value: `${results.yearlyTotal.toLocaleString('fr-FR')} €`, icon: Award },
              ].map(kpi => (
                <div key={kpi.label} className="p-3 rounded-lg bg-muted/50 text-center">
                  <kpi.icon className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <div className="text-lg font-bold">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div>
              <h4 className="text-sm font-medium mb-2">Projection sur 12 mois (avec croissance +5%/mois)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={results.projection} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString('fr-FR')} €`} />
                  <Area type="monotone" dataKey="revenus" name="Revenus mensuels" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Tips */}
            <div className="p-4 rounded-lg bg-muted/30 border">
              <h4 className="font-medium text-sm mb-2">💡 Conseils pour maximiser vos revenus</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>Zone 70%</strong> : Fixez le prix entre 2,99 € et 9,99 € pour obtenir 70% de royalties</li>
                <li>• <strong>Multi-format</strong> : Proposez eBook + Broché pour doubler votre audience</li>
                <li>• <strong>Catalogue</strong> : Chaque nouveau livre génère des revenus passifs supplémentaires</li>
                <li>• <strong>{selectedCat?.label}</strong> : Ventes moyennes de ~{selectedCat?.avgSales} exemplaires/jour dans cette catégorie</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EbookKdpRevenueSimulator;
