import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Download, Sparkles, Target, TrendingUp } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';

type Kw = { kw: string; match: string; score: number; bid: number };
type Result = {
  auteurs_concurrents?: Kw[];
  titres_similaires?: Kw[];
  long_tail?: Kw[];
  occasions?: Kw[];
  emotions_benefices?: Kw[];
  negative_keywords?: string[];
  campaign_tips?: string[];
};

const CATEGORIES: Array<{ key: keyof Result; label: string; emoji: string }> = [
  { key: 'auteurs_concurrents', label: 'Auteurs concurrents', emoji: '👥' },
  { key: 'titres_similaires', label: 'Titres similaires', emoji: '📚' },
  { key: 'long_tail', label: 'Long-tail (intention forte)', emoji: '🎯' },
  { key: 'occasions', label: 'Occasions & saisons', emoji: '🎁' },
  { key: 'emotions_benefices', label: 'Émotions & bénéfices', emoji: '💛' },
];

export default function V3AmsKeywordsPage() {
  const [form, setForm] = useState({
    title: '', subtitle: '', author: '', genre: '', audience: '',
    synopsis: '', marketplace: 'amazon.fr', language: 'français',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const generate = async () => {
    if (!form.title.trim()) { toast.error('Renseigne au moins le titre du livre'); return; }
    setLoading(true); setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('agent-ams-keywords', { body: form });
      if (error) throw error;
      setResult(data as Result);
      toast.success('Mots-clés générés ✨');
    } catch (e: any) {
      toast.error('Erreur : ' + (e?.message || 'inconnue'));
    } finally { setLoading(false); }
  };

  const exportCsv = () => {
    if (!result) return;
    const rows: string[][] = [['Keyword', 'Match Type', 'Suggested Bid (EUR)', 'Category', 'Score']];
    CATEGORIES.forEach(cat => {
      (result[cat.key] as Kw[] | undefined)?.forEach(k => {
        rows.push([k.kw, k.match, k.bid.toFixed(2), cat.label, String(k.score)]);
      });
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `ams-keywords-${(form.title || 'livre').slice(0, 40).replace(/\s+/g, '-')}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const totalKw = result ? CATEGORIES.reduce((s, c) => s + ((result[c.key] as Kw[] | undefined)?.length || 0), 0) : 0;

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <BackButton />

      <div className="rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-700 text-white p-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-6 w-6" />
          <Badge className="bg-amber-400 text-emerald-950">Nouveau · Gratuit tous les plans</Badge>
        </div>
        <h1 className="text-3xl font-bold">Boostez vos annonces Amazon Ads</h1>
        <p className="mt-2 text-emerald-50 max-w-2xl">
          Générez des <strong>centaines de mots-clés à fort taux de conversion</strong> pour vos campagnes AMS
          en quelques secondes, avec type de match et enchère suggérée. Export CSV prêt pour Amazon.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Décris ton livre</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Input placeholder="Titre du livre *" value={form.title} onChange={e => set('title', e.target.value)} />
            <Input placeholder="Sous-titre" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
            <Input placeholder="Auteur" value={form.author} onChange={e => set('author', e.target.value)} />
            <Input placeholder="Genre / catégorie (ex: romance historique)" value={form.genre} onChange={e => set('genre', e.target.value)} />
            <Input placeholder="Public cible (ex: femmes 30-55 ans)" value={form.audience} onChange={e => set('audience', e.target.value)} />
            <Input placeholder="Marketplace (amazon.fr, amazon.com...)" value={form.marketplace} onChange={e => set('marketplace', e.target.value)} />
          </div>
          <Textarea rows={4} placeholder="Résumé / 4e de couverture" value={form.synopsis} onChange={e => set('synopsis', e.target.value)} />
          <Button onClick={generate} disabled={loading} size="lg" className="bg-emerald-700 hover:bg-emerald-800">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Génération…</> : <><Sparkles className="mr-2 h-4 w-4" /> Générer mes mots-clés</>}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{totalKw} mots-clés générés</p>
              <p className="text-sm text-muted-foreground">Prêts à importer dans Amazon Ads</p>
            </div>
            <Button onClick={exportCsv} variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV Amazon</Button>
          </div>

          {result.campaign_tips && result.campaign_tips.length > 0 && (
            <Card className="border-amber-300 bg-amber-50">
              <CardHeader><CardTitle className="text-amber-900">💡 Conseils de campagne</CardTitle></CardHeader>
              <CardContent><ul className="list-disc pl-5 space-y-1 text-sm">{result.campaign_tips.map((t, i) => <li key={i}>{t}</li>)}</ul></CardContent>
            </Card>
          )}

          {CATEGORIES.map(cat => {
            const list = (result[cat.key] as Kw[] | undefined) || [];
            if (!list.length) return null;
            return (
              <Card key={cat.key}>
                <CardHeader><CardTitle>{cat.emoji} {cat.label} <span className="text-sm text-muted-foreground font-normal">({list.length})</span></CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-muted-foreground border-b">
                        <tr><th className="py-2">Mot-clé</th><th>Match</th><th>Score</th><th>Enchère</th></tr>
                      </thead>
                      <tbody>
                        {list.sort((a, b) => b.score - a.score).map((k, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2 font-medium">{k.kw}</td>
                            <td><Badge variant="outline">{k.match}</Badge></td>
                            <td>{k.score}/10</td>
                            <td>{k.bid.toFixed(2)} €</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {result.negative_keywords && result.negative_keywords.length > 0 && (
            <Card>
              <CardHeader><CardTitle>🚫 Mots-clés négatifs recommandés</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{result.negative_keywords.map((n, i) => <Badge key={i} variant="secondary">{n}</Badge>)}</div></CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
