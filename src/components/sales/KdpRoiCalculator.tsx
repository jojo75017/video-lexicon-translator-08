import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, BookOpen, DollarSign, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface KdpRoiCalculatorProps {
  onCtaClick?: () => void;
}

export const KdpRoiCalculator: React.FC<KdpRoiCalculatorProps> = ({ onCtaClick }) => {
  const [ebooksPerMonth, setEbooksPerMonth] = useState(2);
  const [pricePerEbook, setPricePerEbook] = useState(4.99);
  const [salesPerDay, setSalesPerDay] = useState(3);

  const royaltyRate = pricePerEbook >= 2.99 && pricePerEbook <= 9.99 ? 0.7 : 0.35;
  const royaltyPerSale = pricePerEbook * royaltyRate;
  const monthlyRevenuePerBook = royaltyPerSale * salesPerDay * 30;
  const totalEbooks = ebooksPerMonth * 12;
  const yearlyRevenue = monthlyRevenuePerBook * totalEbooks * 6;
  const monthlyPassiveIncome = yearlyRevenue / 12;

  const handleCtaClick = () => {
    if (onCtaClick) onCtaClick();
    else document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="bg-card border-primary/20 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              Calculateur de Revenus KDP
              <Badge className="bg-primary/15 text-primary border-primary/20">ROI</Badge>
            </CardTitle>
            <CardDescription>Estimez vos revenus passifs avec Amazon KDP</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Ebooks créés par mois
              </label>
              <Badge variant="outline" className="text-lg font-bold text-primary border-primary/40">
                {ebooksPerMonth}
              </Badge>
            </div>
            <Slider value={[ebooksPerMonth]} onValueChange={(v) => setEbooksPerMonth(v[0])} min={1} max={10} step={1} />
            <p className="text-xs text-muted-foreground">
              Avec EbookStudio Pro, créez un ebook complet en 2-3h au lieu de plusieurs semaines
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Prix de vente
              </label>
              <Badge variant="outline" className="text-lg font-bold text-primary border-primary/40">
                {pricePerEbook.toFixed(2)}€
              </Badge>
            </div>
            <Slider value={[pricePerEbook]} onValueChange={(v) => setPricePerEbook(v[0])} min={2.99} max={14.99} step={1} />
            <p className="text-xs text-muted-foreground">
              Royalties: {(royaltyRate * 100).toFixed(0)}% ({royaltyPerSale.toFixed(2)}€ par vente)
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Ventes par jour (par ebook)
              </label>
              <Badge variant="outline" className="text-lg font-bold text-primary border-primary/40">
                {salesPerDay}
              </Badge>
            </div>
            <Slider value={[salesPerDay]} onValueChange={(v) => setSalesPerDay(v[0])} min={1} max={20} step={1} />
            <p className="text-xs text-muted-foreground">Moyenne conservatrice pour un ebook bien optimisé SEO</p>
          </div>
        </div>

        <div className="bg-muted/30 rounded-xl p-5 border border-primary/20">
          <h4 className="font-semibold text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-kdp-orange" />
            VOS REVENUS ESTIMÉS APRÈS 1 AN
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-3xl font-bold text-primary">{totalEbooks}</p>
              <p className="text-xs text-muted-foreground mt-1">Ebooks publiés</p>
            </div>
            <div className="text-center p-4 bg-kdp-orange/10 rounded-lg">
              <p className="text-3xl font-bold text-kdp-orange">
                {monthlyPassiveIncome.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
              </p>
              <p className="text-xs text-muted-foreground mt-1">Revenus mensuels</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Revenus annuels potentiels</p>
            <p className="text-4xl font-bold text-primary">
              {yearlyRevenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-3">
            💡 Investissement : <strong>67€ une seule fois</strong> → ROI en {Math.ceil(67 / monthlyPassiveIncome * 30)} jours
          </p>
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          size="lg"
          onClick={handleCtaClick}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Commencer à Générer des Revenus
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default KdpRoiCalculator;
