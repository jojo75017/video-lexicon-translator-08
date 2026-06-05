import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Package } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

const BundlesBoxsets: React.FC = () => {
  const [seriesName, setSeriesName] = useState('');
  const [titles, setTitles] = useState('');
  const [unitPrice, setUnitPrice] = useState('6.99');
  const [discount, setDiscount] = useState('25');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const titleList = useMemo(() => titles.split(/\n|,/).map((t) => t.trim()).filter(Boolean), [titles]);

  const pricing = useMemo(() => {
    const n = titleList.length;
    const unit = parseFloat(unitPrice) || 0;
    const disc = (parseFloat(discount) || 0) / 100;
    const full = n * unit;
    const bundle = Math.round(full * (1 - disc) * 100) / 100;
    return { n, full: Math.round(full * 100) / 100, bundle, saved: Math.round((full - bundle) * 100) / 100 };
  }, [titleList, unitPrice, discount]);

  const run = async () => {
    if (!seriesName.trim() || titleList.length < 2) return toast.error('Nom de série et au moins 2 titres requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Crée la page de vente d'un box set / bundle Amazon KDP en français.
Série : "${seriesName}"
Titres inclus : ${titleList.join(', ')}
Prix du bundle : ${pricing.bundle}€ (au lieu de ${pricing.full}€, soit ${pricing.saved}€ d'économie)

Génère :
1. Un TITRE de box set accrocheur (avec "Coffret intégrale" ou "Box Set").
2. Une DESCRIPTION vendeuse mettant en avant l'économie et l'expérience de lire la série complète.
3. Les BÉNÉFICES de tout obtenir d'un coup.
4. Un APPEL À L'ACTION.
Format texte clair, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.75 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Crée une offre groupée (box set) : calcule le pricing optimisé et génère la page de vente.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Nom de la série *</Label><Input value={seriesName} onChange={(e) => setSeriesName(e.target.value)} /></div>
        <div><Label className="text-xs">Prix unitaire (€)</Label><Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Titres inclus * (1 par ligne)</Label><Textarea rows={4} value={titles} onChange={(e) => setTitles(e.target.value)} /></div>
        <div><Label className="text-xs">Remise bundle (%)</Label><Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} /></div>
      </div>

      <Card className="border-joy-ink/10" style={{ background: `${TEAL}08` }}><CardContent className="p-4 flex flex-wrap items-center gap-4 text-sm">
        <Package className="h-5 w-5" style={{ color: TEAL }} />
        <span>{pricing.n} titres</span>
        <span>Prix séparés : <b>{pricing.full} €</b></span>
        <span style={{ color: TEAL }}>Prix bundle : <b>{pricing.bundle} €</b></span>
        <span className="text-green-600">Économie : <b>{pricing.saved} €</b></span>
      </CardContent></Card>

      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer la page de vente</span>
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={14} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default BundlesBoxsets;
