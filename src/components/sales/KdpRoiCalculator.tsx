import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, BookOpen, DollarSign, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KdpRoiCalculatorProps {
  onCtaClick?: () => void;
}

export const KdpRoiCalculator: React.FC<KdpRoiCalculatorProps> = ({ onCtaClick }) => {
  const navigate = useNavigate();
  const [ebooksPerMonth, setEbooksPerMonth] = useState(2);
  const [pricePerEbook, setPricePerEbook] = useState(9.99);
  const [salesPerDay, setSalesPerDay] = useState(3);

  // KDP royalty rate (70% for 2.99-9.99 price range)
  const royaltyRate = pricePerEbook >= 2.99 && pricePerEbook <= 9.99 ? 0.70 : 0.35;
  
  // Calculations
  const royaltyPerSale = pricePerEbook * royaltyRate;
  const monthlyRevenuePerBook = royaltyPerSale * salesPerDay * 30;
  const totalEbooks = ebooksPerMonth * 12; // After 1 year
  const yearlyRevenue = monthlyRevenuePerBook * totalEbooks;
  const monthlyPassiveIncome = yearlyRevenue / 12;

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              Calculateur de Revenus KDP
              <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                ROI
              </Badge>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] font-bold">
                2026
              </Badge>
            </CardTitle>
            <CardDescription>
              Estimez vos revenus passifs avec Amazon KDP
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sliders */}
        <div className="space-y-5">
          {/* Ebooks per month */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Ebooks créés par mois
              </label>
              <Badge variant="outline" className="text-lg font-bold text-emerald-600 border-emerald-300">
                {ebooksPerMonth}
              </Badge>
            </div>
            <Slider
              value={[ebooksPerMonth]}
              onValueChange={(value) => setEbooksPerMonth(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Avec EbookStudio Pro, créez un ebook complet en 2-3h au lieu de plusieurs semaines
            </p>
          </div>

          {/* Price per ebook */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Prix de vente
              </label>
              <Badge variant="outline" className="text-lg font-bold text-emerald-600 border-emerald-300">
                {pricePerEbook.toFixed(2)}€
              </Badge>
            </div>
            <Slider
              value={[pricePerEbook]}
              onValueChange={(value) => setPricePerEbook(value[0])}
              min={2.99}
              max={14.99}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Royalties: {(royaltyRate * 100).toFixed(0)}% ({royaltyPerSale.toFixed(2)}€ par vente)
            </p>
          </div>

          {/* Sales per day */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Ventes par jour (par ebook)
              </label>
              <Badge variant="outline" className="text-lg font-bold text-emerald-600 border-emerald-300">
                {salesPerDay}
              </Badge>
            </div>
            <Slider
              value={[salesPerDay]}
              onValueChange={(value) => setSalesPerDay(value[0])}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Moyenne conservatrice pour un ebook bien optimisé SEO
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-emerald-200 dark:border-emerald-700">
          <h4 className="font-semibold text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            VOS REVENUS ESTIMÉS APRÈS 1 AN
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalEbooks}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Ebooks publiés</p>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {monthlyPassiveIncome.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
              </p>
              <p className="text-xs text-muted-foreground mt-1">Revenus mensuels</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Revenus annuels potentiels</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {yearlyRevenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-3">
            💡 Investissement : <strong>67€ une seule fois</strong> → ROI en {Math.ceil(67 / monthlyPassiveIncome * 30)} jours
          </p>
        </div>

        {/* CTA */}
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
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
