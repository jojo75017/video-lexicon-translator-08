import { useState, useMemo } from 'react';
import BackButton from '@/components/v3/BackButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp } from 'lucide-react';

// KDP royalty calculator FR — simplifié mais réaliste
// eBook 70% si prix entre 2,99€ et 9,99€, sinon 35%
// Broché : (prix - taxe fixe - (pages * coût page)) * 60% (marché Amazon.fr)
// KU : ~0,004€ par page lue

export default function V3RoyaltiesPage() {
  const [ebookPrice, setEbookPrice] = useState(4.99);
  const [ebookSales, setEbookSales] = useState(50);
  const [pbPrice, setPbPrice] = useState(12.99);
  const [pbSales, setPbSales] = useState(20);
  const [pages, setPages] = useState(200);
  const [kuPages, setKuPages] = useState(5000);
  const [isColor, setIsColor] = useState(false);

  const calc = useMemo(() => {
    const ebookRate = ebookPrice >= 2.99 && ebookPrice <= 9.99 ? 0.7 : 0.35;
    const ebookDelivery = ebookRate === 0.7 ? 0.06 : 0; // approximation frais livraison
    const ebookRoyalty = (ebookPrice - ebookDelivery) * ebookRate * ebookSales;

    // Broché : coût = 2,05€ fixe + (pages * 0,013 N&B ou 0,065 couleur)
    const printCost = 2.05 + pages * (isColor ? 0.065 : 0.013);
    const pbRoyalty = Math.max(0, (pbPrice * 0.6 - printCost)) * pbSales;

    const kuRoyalty = kuPages * 0.004;

    const total = ebookRoyalty + pbRoyalty + kuRoyalty;

    return {
      ebookRoyalty: ebookRoyalty.toFixed(2),
      ebookRate: (ebookRate * 100).toFixed(0),
      pbRoyalty: pbRoyalty.toFixed(2),
      pbUnit: Math.max(0, (pbPrice * 0.6 - printCost)).toFixed(2),
      printCost: printCost.toFixed(2),
      kuRoyalty: kuRoyalty.toFixed(2),
      total: total.toFixed(2),
      yearly: (total * 12).toFixed(2),
    };
  }, [ebookPrice, ebookSales, pbPrice, pbSales, pages, kuPages, isColor]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/v3/nouveautes" />

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <Badge className="bg-emerald-600 mb-1">🎁 OFFERT</Badge>
              <h1 className="text-3xl font-bold text-[#232F3E]">Calculateur royalties KDP</h1>
            </div>
          </div>
          <p className="text-slate-600">Simulez vos gains mensuels en 30 secondes — ebook, broché et Kindle Unlimited.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 text-[#232F3E]">📱 eBook</h2>
            <div className="space-y-3">
              <div>
                <Label>Prix de vente (€)</Label>
                <Input type="number" step="0.5" value={ebookPrice} onChange={e => setEbookPrice(+e.target.value)} />
              </div>
              <div>
                <Label>Ventes / mois</Label>
                <Input type="number" value={ebookSales} onChange={e => setEbookSales(+e.target.value)} />
              </div>
              <p className="text-xs text-slate-500">Taux appliqué : {calc.ebookRate}%</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4 text-[#232F3E]">📖 Broché</h2>
            <div className="space-y-3">
              <div>
                <Label>Prix de vente (€)</Label>
                <Input type="number" step="0.5" value={pbPrice} onChange={e => setPbPrice(+e.target.value)} />
              </div>
              <div>
                <Label>Ventes / mois</Label>
                <Input type="number" value={pbSales} onChange={e => setPbSales(+e.target.value)} />
              </div>
              <div>
                <Label>Nombre de pages</Label>
                <Input type="number" value={pages} onChange={e => setPages(+e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isColor} onChange={e => setIsColor(e.target.checked)} />
                Impression couleur
              </label>
              <p className="text-xs text-slate-500">
                Coût impression : {calc.printCost} € · Royalty/unité : {calc.pbUnit} €
              </p>
            </div>
          </Card>

          <Card className="p-6 md:col-span-2">
            <h2 className="font-semibold text-lg mb-4 text-[#232F3E]">📚 Kindle Unlimited</h2>
            <div>
              <Label>Pages lues / mois (KENP)</Label>
              <Input type="number" value={kuPages} onChange={e => setKuPages(+e.target.value)} />
              <p className="text-xs text-slate-500 mt-1">Tarif moyen : 0,004 € / page lue</p>
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-8 bg-gradient-to-br from-[#008296] to-emerald-700 text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Vos royalties estimées</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm opacity-90">eBook</div>
              <div className="text-2xl font-bold">{calc.ebookRoyalty} €</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm opacity-90">Broché</div>
              <div className="text-2xl font-bold">{calc.pbRoyalty} €</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm opacity-90">KU</div>
              <div className="text-2xl font-bold">{calc.kuRoyalty} €</div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-4 flex flex-col sm:flex-row justify-between gap-2">
            <div>
              <div className="text-sm opacity-90">Total mensuel</div>
              <div className="text-4xl font-bold">{calc.total} €</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Estimation annuelle</div>
              <div className="text-4xl font-bold text-yellow-200">{calc.yearly} €</div>
            </div>
          </div>
        </Card>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Estimations indicatives basées sur les grilles Amazon KDP France. Les taux réels peuvent varier selon le pays et les frais de livraison.
        </p>
      </div>
    </div>
  );
}
