import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const ROI_PER_EBOOK_MONTH = 25; // avg €25/month per ebook
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
    <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-white">Calculateur de ROI</h3>
            <p className="text-sm text-white/60">Estimez vos revenus KDP avec EbookStudio</p>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-3">
            <label className="text-sm font-semibold text-white/80">Ebooks publiés par mois</label>
            <span className="text-3xl font-black text-cyan-400">{ebooksPerMonth[0]}</span>
          </div>
          <Slider
            value={ebooksPerMonth}
            onValueChange={setEbooksPerMonth}
            min={1}
            max={12}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/40 mt-2">
            <span>1/mois (débutant)</span>
            <span>12/mois (pro)</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            key={monthlyRevenue}
            initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-center"
          >
            <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-emerald-400">{monthlyRevenue}€</p>
            <p className="text-xs text-white/50">Revenus/mois estimés</p>
          </motion.div>
          
          <motion.div 
            key={yearlyRevenue}
            initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-900/50 text-center"
          >
            <TrendingUp className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-cyan-400">{yearlyRevenue.toLocaleString('fr-FR')}€</p>
            <p className="text-xs text-white/50">Revenus annuels estimés</p>
          </motion.div>
          
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
            <p className="text-2xl font-black text-white">{totalCost.toFixed(0)}€</p>
            <p className="text-xs text-white/50">Coût total (outil + API)</p>
          </div>
          
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-900/50 text-center">
            <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-amber-400">x{Math.max(1, Math.round(yearlyRevenue / totalCost))}</p>
            <p className="text-xs text-white/50">Retour sur investissement</p>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
          <p className="text-sm text-white/90 text-center leading-relaxed">
            À <strong className="text-cyan-400">{ebooksPerMonth[0]} ebook{ebooksPerMonth[0] > 1 ? 's' : ''}/mois</strong>, 
            votre investissement de <strong>67€</strong> est rentabilisé dès le <strong className="text-emerald-400">{paybackBooks}ème ebook vendu</strong>.
            <br />
            Profit net estimé sur 12 mois : <strong className="text-amber-400">{netProfit.toLocaleString('fr-FR')}€</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoiCalculator;
