import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, FolderTree, Trophy, Sparkles, Clock, TrendingUp, Copy, AlertTriangle } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';

type TopCat = {
  rang: number;
  chemin_complet: string;
  code_bisac?: string;
  concurrence: string;
  volume_estime: string;
  raison: string;
  chance_bestseller: string;
  requete_kdp: string;
};

type Result = {
  positionnement?: string;
  top_3_categories?: TopCat[];
  categories_alternatives?: { chemin_complet: string; concurrence: string; volume_estime: string; raison: string }[];
  categories_a_eviter?: { chemin: string; pourquoi: string }[];
  mots_cles_backend_suggeres?: string[];
  conseil_strategique?: string;
  gain_temps_estime?: string;
  double_chances_bestseller?: string;
};

const concColor = (c: string) => {
  const v = (c || '').toLowerCase();
  if (v.includes('faible')) return 'bg-emerald-100 text-emerald-800';
  if (v.includes('moy')) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

export default function V3CategoryFinderPage() {
  const [form, setForm] = useState({
    title: '', subtitle: '', synopsis: '', genre: '', audience: '', keywords: '',
    marketplace: 'amazon.fr', format: 'ebook + broché',
  });
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState<Result | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const run = async () => {
    if (!form.title.trim() || !form.synopsis.trim()) { toast.error('Titre et synopsis requis'); return; }
    setLoading(true); setR(null);
    try {
      const { data, error } = await supabase.functions.invoke('agent-category-finder', { body: form });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setR(data as Result);
      toast.success('Catégories optimales identifiées 🎯');
    } catch (e: any) {
      toast.error('Erreur : ' + (e?.message || 'inconnue'));
    } finally { setLoading(false); }
  };

  const copy = (t: string) => {
    navigator.clipboard.writeText(t);
    toast.success('Copié dans le presse-papier');
  };

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <BackButton />

      <div className="rounded-xl bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-8">
        <div className="flex items-center gap-3 mb-2">
          <FolderTree className="h-6 w-6" />
          <Badge className="bg-amber-400 text-slate-900">Nouveau · Gratuit tous les plans</Badge>
        </div>
        <h1 className="text-3xl font-bold">Analyser & optimiser les catégories KDP</h1>
        <p className="mt-2 text-emerald-50 max-w-3xl">
          Explorez en profondeur les <strong>plus de 19 000 catégories Amazon</strong> pour trouver celles qui
          correspondent parfaitement à votre livre et maximisent votre potentiel de vente.
        </p>
        <div className="flex flex-wrap gap-3 mt-4 text-sm">
          <span className="bg-white/10 rounded-full px-3 py-1 flex items-center gap-1"><Trophy className="h-3.5 w-3.5" /> Doublez vos chances de best-seller</span>
          <span className="bg-white/10 rounded-full px-3 py-1 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Économisez 5h+ par livre</span>
          <span className="bg-white/10 rounded-full px-3 py-1 flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> Niches à faible concurrence</span>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FolderTree className="h-5 w-5" /> Renseigne ton livre</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Input placeholder="Titre du livre *" value={form.title} onChange={e => set('title', e.target.value)} />
            <Input placeholder="Sous-titre" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
            <Input placeholder="Genre (ex: thriller psychologique, dev perso...)" value={form.genre} onChange={e => set('genre', e.target.value)} />
            <Input placeholder="Public cible (ex: femmes 30-50, entrepreneurs...)" value={form.audience} onChange={e => set('audience', e.target.value)} />
            <Input placeholder="Marketplace" value={form.marketplace} onChange={e => set('marketplace', e.target.value)} />
            <Input placeholder="Format (ebook / broché / both)" value={form.format} onChange={e => set('format', e.target.value)} />
          </div>
          <Input placeholder="Mots-clés principaux (séparés par des virgules)" value={form.keywords} onChange={e => set('keywords', e.target.value)} />
          <Textarea rows={5} placeholder="Synopsis / résumé du livre * (3-6 phrases)" value={form.synopsis} onChange={e => set('synopsis', e.target.value)} />
          <Button onClick={run} disabled={loading} size="lg" className="bg-emerald-800 hover:bg-emerald-900">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyse des 19 000+ catégories…</> : <><Sparkles className="mr-2 h-4 w-4" /> Analyser & optimiser</>}
          </Button>
        </CardContent>
      </Card>

      {r && (
        <>
          {r.positionnement && (
            <Card className="border-emerald-300 bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold mb-1">Positionnement idéal</p>
                <p className="text-slate-800">{r.positionnement}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs">
                  {r.gain_temps_estime && <span className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1"><Clock className="inline h-3 w-3 mr-1" /> {r.gain_temps_estime}</span>}
                  {r.double_chances_bestseller && <span className="bg-amber-100 text-amber-800 rounded-full px-3 py-1"><Trophy className="inline h-3 w-3 mr-1" /> {r.double_chances_bestseller}</span>}
                </div>
              </CardContent>
            </Card>
          )}

          {r.top_3_categories && r.top_3_categories.length > 0 && (
            <Card>
              <CardHeader><CardTitle>🏆 Top 3 catégories KDP recommandées</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {r.top_3_categories.map((c, i) => (
                  <div key={i} className="border-2 border-emerald-200 rounded-lg p-4 bg-gradient-to-br from-emerald-50/50 to-white">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-800 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">#{c.rang}</span>
                        <p className="font-semibold text-slate-900">{c.chemin_complet}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copy(c.chemin_complet)}><Copy className="h-3.5 w-3.5" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2 my-2 text-xs">
                      <Badge className={concColor(c.concurrence)}>Concurrence : {c.concurrence}</Badge>
                      <Badge variant="secondary">Volume : {c.volume_estime}</Badge>
                      {c.code_bisac && <Badge variant="outline">BISAC : {c.code_bisac}</Badge>}
                      <Badge className="bg-amber-500 text-white">🏆 Best-seller {c.chance_bestseller}/10</Badge>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{c.raison}</p>
                    {c.requete_kdp && (
                      <p className="text-xs bg-slate-100 rounded p-2"><strong>Terme à taper dans KDP :</strong> <code>{c.requete_kdp}</code></p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {r.categories_alternatives && r.categories_alternatives.length > 0 && (
            <Card>
              <CardHeader><CardTitle>🔀 Alternatives de qualité</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {r.categories_alternatives.map((a, i) => (
                  <div key={i} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{a.chemin_complet}</p>
                      <div className="flex gap-1">
                        <Badge className={concColor(a.concurrence)} variant="secondary">Conc. {a.concurrence}</Badge>
                        <Badge variant="outline">Vol. {a.volume_estime}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{a.raison}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {r.categories_a_eviter && r.categories_a_eviter.length > 0 && (
            <Card className="border-red-200">
              <CardHeader><CardTitle className="text-red-800"><AlertTriangle className="inline h-4 w-4 mr-1" /> Catégories à éviter</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {r.categories_a_eviter.map((a, i) => (
                  <div key={i} className="bg-red-50 rounded p-2 text-sm">
                    <p className="font-medium text-red-900">{a.chemin}</p>
                    <p className="text-xs text-red-700">{a.pourquoi}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {r.mots_cles_backend_suggeres && r.mots_cles_backend_suggeres.length > 0 && (
            <Card>
              <CardHeader><CardTitle>🔑 Mots-clés backend suggérés (7 max KDP)</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{r.mots_cles_backend_suggeres.map((k, i) => <Badge key={i} variant="secondary">{k}</Badge>)}</div></CardContent>
            </Card>
          )}

          {r.conseil_strategique && (
            <Card className="border-amber-300 bg-amber-50">
              <CardHeader><CardTitle>💡 Conseil stratégique</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-slate-800">{r.conseil_strategique}</p></CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
