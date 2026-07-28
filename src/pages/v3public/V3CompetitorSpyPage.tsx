import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Eye, Target, TrendingUp, Sparkles, Trophy } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';

type Result = {
  positionnement_concurrents?: { nom: string; angle: string; force: string; faiblesse: string }[];
  patterns_titres?: string[];
  categories_kdp_recommandees?: string[];
  prix_positionnement?: { fourchette_ebook: string; fourchette_broche: string; prix_optimal_lancement: string };
  mots_cles_niche?: string[];
  tactiques_marketing_observees?: { tactique: string; exemple: string; how_to: string }[];
  opportunites_gap?: { opportunite: string; pourquoi: string; action: string }[];
  plan_action_30j?: { semaine: number; action: string; livrable: string }[];
  score_competition?: { niveau: string; note: string; conseil: string };
};

export default function V3CompetitorSpyPage() {
  const [form, setForm] = useState({ niche: '', competitors: '', yourAngle: '', marketplace: 'amazon.fr' });
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState<Result | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const run = async () => {
    if (!form.niche.trim() || !form.competitors.trim()) { toast.error('Niche et concurrents requis'); return; }
    setLoading(true); setR(null);
    try {
      const { data, error } = await supabase.functions.invoke('agent-competitor-spy', { body: form });
      if (error) throw error;
      setR(data as Result);
      toast.success('Analyse concurrentielle prête 🕵️');
    } catch (e: any) {
      toast.error('Erreur : ' + (e?.message || 'inconnue'));
    } finally { setLoading(false); }
  };

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <BackButton />

      <div className="rounded-xl bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-8">
        <div className="flex items-center gap-3 mb-2">
          <Eye className="h-6 w-6" />
          <Badge className="bg-amber-400 text-slate-900">Nouveau · Gratuit tous les plans</Badge>
        </div>
        <h1 className="text-3xl font-bold">Espionnez vos concurrents Amazon</h1>
        <p className="mt-2 text-emerald-50 max-w-2xl">
          Obtenez les <strong>stratégies, prix, catégories et tactiques marketing</strong> des auteurs les mieux rémunérés
          de votre niche. Les auteurs qui écrivent pour le marché voient leur lectorat croître 2× plus vite.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Configure ton espionnage</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Ta niche / genre (ex: romance mafia, dev perso, thrillers historiques...)" value={form.niche} onChange={e => set('niche', e.target.value)} />
          <Textarea rows={4} placeholder="Concurrents à analyser — colle titres, noms d'auteurs, ASIN ou URLs Amazon (un par ligne)" value={form.competitors} onChange={e => set('competitors', e.target.value)} />
          <Input placeholder="Ton positionnement / angle (facultatif)" value={form.yourAngle} onChange={e => set('yourAngle', e.target.value)} />
          <Input placeholder="Marketplace (amazon.fr, amazon.com...)" value={form.marketplace} onChange={e => set('marketplace', e.target.value)} />
          <Button onClick={run} disabled={loading} size="lg" className="bg-emerald-800 hover:bg-emerald-900">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyse en cours…</> : <><Sparkles className="mr-2 h-4 w-4" /> Lancer l'espionnage</>}
          </Button>
        </CardContent>
      </Card>

      {r && (
        <>
          {r.score_competition && (
            <Card className="border-amber-300 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <Trophy className="h-10 w-10 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Niveau de compétition</p>
                  <p className="text-2xl font-bold capitalize">{r.score_competition.niveau} · {r.score_competition.note}/10</p>
                  <p className="text-sm mt-1">{r.score_competition.conseil}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {r.positionnement_concurrents && r.positionnement_concurrents.length > 0 && (
            <Card>
              <CardHeader><CardTitle>🎯 Positionnement des concurrents</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {r.positionnement_concurrents.map((c, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <p className="font-semibold">{c.nom}</p>
                    <p className="text-sm text-muted-foreground italic">"{c.angle}"</p>
                    <div className="grid md:grid-cols-2 gap-3 mt-3 text-sm">
                      <div className="bg-emerald-50 p-2 rounded"><strong>💪 Force :</strong> {c.force}</div>
                      <div className="bg-amber-50 p-2 rounded"><strong>🎯 Angle mort :</strong> {c.faiblesse}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {r.patterns_titres && (
              <Card>
                <CardHeader><CardTitle>✍️ Patterns de titres gagnants</CardTitle></CardHeader>
                <CardContent><ul className="list-disc pl-5 space-y-1 text-sm">{r.patterns_titres.map((p, i) => <li key={i}>{p}</li>)}</ul></CardContent>
              </Card>
            )}
            {r.categories_kdp_recommandees && (
              <Card>
                <CardHeader><CardTitle>📚 Catégories KDP recommandées</CardTitle></CardHeader>
                <CardContent><ul className="list-disc pl-5 space-y-1 text-sm">{r.categories_kdp_recommandees.map((c, i) => <li key={i}>{c}</li>)}</ul></CardContent>
              </Card>
            )}
          </div>

          {r.prix_positionnement && (
            <Card>
              <CardHeader><CardTitle>💰 Prix et positionnement</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-muted p-3 rounded"><p className="text-xs text-muted-foreground">Ebook</p><p className="font-semibold">{r.prix_positionnement.fourchette_ebook}</p></div>
                <div className="bg-muted p-3 rounded"><p className="text-xs text-muted-foreground">Broché</p><p className="font-semibold">{r.prix_positionnement.fourchette_broche}</p></div>
                <div className="bg-emerald-50 p-3 rounded"><p className="text-xs text-muted-foreground">Prix lancement optimal</p><p className="font-semibold">{r.prix_positionnement.prix_optimal_lancement}</p></div>
              </CardContent>
            </Card>
          )}

          {r.mots_cles_niche && (
            <Card>
              <CardHeader><CardTitle>🔑 Mots-clés de la niche</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{r.mots_cles_niche.map((k, i) => <Badge key={i} variant="secondary">{k}</Badge>)}</div></CardContent>
            </Card>
          )}

          {r.tactiques_marketing_observees && (
            <Card>
              <CardHeader><CardTitle><TrendingUp className="inline h-4 w-4 mr-1" /> Tactiques marketing observées</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {r.tactiques_marketing_observees.map((t, i) => (
                  <div key={i} className="border-l-4 border-emerald-600 pl-3">
                    <p className="font-semibold">{t.tactique}</p>
                    <p className="text-sm text-muted-foreground">Exemple : {t.exemple}</p>
                    <p className="text-sm mt-1"><strong>Ta version :</strong> {t.how_to}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {r.opportunites_gap && (
            <Card className="border-emerald-400">
              <CardHeader><CardTitle>💎 Opportunités inexploitées</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {r.opportunites_gap.map((o, i) => (
                  <div key={i} className="bg-emerald-50 p-3 rounded">
                    <p className="font-semibold text-emerald-900">{o.opportunite}</p>
                    <p className="text-sm text-emerald-800">{o.pourquoi}</p>
                    <p className="text-sm mt-1"><strong>→ Action :</strong> {o.action}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {r.plan_action_30j && (
            <Card>
              <CardHeader><CardTitle>📅 Plan d'action 30 jours</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground border-b"><tr><th className="py-2">Semaine</th><th>Action</th><th>Livrable</th></tr></thead>
                  <tbody>
                    {r.plan_action_30j.map((s, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 font-bold">S{s.semaine}</td><td>{s.action}</td><td className="text-muted-foreground">{s.livrable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
