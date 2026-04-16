import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const ROI_PER_EBOOK_MONTH = 25;
const COST_PER_EBOOK = 0.30;
const TOOL_PRICE = 67;

const RoiCalculator = () => {
  const [ebooksPerMonth, setEbooksPerMonth] = useState([4]);

  const months = 12;
  const totalEbooks = ebooksPerMonth[0] * months;
  const monthlyRevenue = ebooksPerMonth[0] * ROI_PER_EBOOK_MONTH;
  const yearlyRevenue = totalEbooks * ROI_PER_EBOOK_MONTH;
  const totalCost = TOOL_PRICE + (totalEbooks * COST_PER_EBOOK);
  const netProfit = yearlyRevenue - totalCost;
  const roi = Math.round((netProfit / TOOL_PRICE) * 100);
  const paybackBooks = Math.ceil(TOOL_PRICE / (ROI_PER_EBOOK_MONTH - COST_PER_EBOOK));

  return (
    <Card className="bg-card/80 border-border overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-foreground">Calculateur de ROI</h3>
            <p className="text-sm text-foreground/60">Estimez vos revenus KDP avec EbookStudio</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-3">
            <label className="text-sm font-semibold text-foreground/80">Ebooks publiés par mois</label>
            <span className="text-3xl font-black text-primary">{ebooksPerMonth[0]}</span>
          </div>
          <Slider
            value={ebooksPerMonth}
            onValueChange={setEbooksPerMonth}
            min={1}
            max={12}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-foreground/40 mt-2">
            <span>1/mois (débutant)</span>
            <span>12/mois (pro)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            key={monthlyRevenue}
            initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center"
          >
            <DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-black text-primary">{monthlyRevenue}€</p>
            <p className="text-xs text-foreground/50">Revenus/mois estimés</p>
          </motion.div>
          
          <motion.div 
            key={yearlyRevenue}
            initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center"
          >
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-black text-primary">{yearlyRevenue.toLocaleString('fr-FR')}€</p>
            <p className="text-xs text-foreground/50">Revenus annuels estimés</p>
          </motion.div>
          
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-center">
            <p className="text-2xl font-black text-foreground">{totalCost.toFixed(0)}€</p>
            <p className="text-xs text-foreground/50">Coût total (outil + API)</p>
          </div>
          
          <div className="p-4 rounded-xl bg-kdp-orange/10 border border-kdp-orange/20 text-center">
            <Sparkles className="w-5 h-5 text-kdp-orange mx-auto mb-1" />
            <p className="text-2xl font-black text-kdp-orange">x{Math.max(1, Math.round(yearlyRevenue / totalCost))}</p>
            <p className="text-xs text-foreground/50">Retour sur investissement</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground/90 text-center leading-relaxed">
            À <strong className="text-primary">{ebooksPerMonth[0]} ebook{ebooksPerMonth[0] > 1 ? 's' : ''}/mois</strong>, 
            votre investissement de <strong>67€</strong> est rentabilisé dès le <strong className="text-primary">{paybackBooks}ème ebook vendu</strong>.
            <br />
            Profit net estimé sur 12 mois : <strong className="text-kdp-orange">{netProfit.toLocaleString('fr-FR')}€</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoiCalculator;
