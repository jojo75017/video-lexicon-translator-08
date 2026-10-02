import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Mail, Send } from 'lucide-react';

interface StepInfo { n: number; date: string | null; subject: string; sent: number; status: string }
interface Preview {
  totalPending: number; alreadySent: number; trancheSize: number;
  paused: boolean; places: number; closed: boolean; steps: StepInfo[];
}

const PAUSE_KEY = 'offre_lancement_sequence';
const fmtDate = (d: string | null) =>
  d ? new Date(`${d}T09:00:00+02:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · 9h00' : 'Manuel';

/** Campagne « Offre de lancement 47 € » : email 1 manuel, emails 2 à 7 automatiques à 9h00 (Paris). */
export default function OffreLancementSendPanel() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const readError = async (error: unknown) => {
    const ctx = (error as { context?: unknown })?.context;
    if (ctx instanceof Response) {
      const p = (await ctx.clone().json().catch(() => null)) as { error?: string } | null;
      if (p?.error) return p.error;
    }
    return (error as Error)?.message || 'Action impossible.';
  };

  const call = async (mode: 'preview' | 'send' | 'test', step = 1) => {
    const { data, error } = await supabase.functions.invoke('send-offre-lancement', { body: { mode, step } });
    if (error) throw new Error(await readError(error));
    return data;
  };

  const load = async () => {
    setBusy('preview');
    try { setPreview(await call('preview')); } catch (e) { toast.error((e as Error).message); } finally { setBusy(null); }
  };
  useEffect(() => { load(); }, []);

  const size = preview?.trancheSize ?? 500;
  const pending = preview?.totalPending ?? 0;
  const tranches = Array.from({ length: Math.ceil(pending / size) }, (_, i) => Math.min(size, pending - i * size));

  const sendTranche = async (i: number, count: number) => {
    if (!confirm(`Envoyer la tranche ${i + 1} à ${count} destinataire(s) du segment actif ?`)) return;
    setBusy(`t${i}`);
    try {
      const r = await call('send');
      toast.success(`${r.sentCount} envoyé(s), ${r.failedCount} échec(s)${r.quotaStopped ? ' — quota Resend atteint, arrêt' : ''}.`);
      await load();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(null); }
  };

  const sendTest = async (step: number) => {
    if (!confirm(`Envoyer un test de l'email ${step} uniquement à votre adresse admin ?`)) return;
    setBusy(`test${step}`);
    try { const r = await call('test', step); toast.success(`Test email ${step} envoyé à ${r.to}`); }
    catch (e) { toast.error((e as Error).message); } finally { setBusy(null); }
  };

  const togglePause = async (paused: boolean) => {
    setBusy('pause');
    const { error } = await supabase.from('launch_settings').upsert({ key: PAUSE_KEY, value: { paused } }, { onConflict: 'key' });
    if (error) toast.error(error.message); else toast.success(paused ? 'Séquence en pause : rien ne part.' : 'Séquence réactivée.');
    setBusy(null);
    await load();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Mail className="h-5 w-5 text-primary" /> Offre de lancement 47 € — séquence de 7 emails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          L'email 1 part uniquement sur votre clic. Les emails 2 à 7 partent seuls à 9h00 (heure de Paris), aux actifs ayant reçu l'email 1, hors acheteurs et abonnés. Tout s'arrête à 0 place ou après le 15 octobre.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-md border px-3 py-1.5">À servir (email 1) : <b>{preview ? pending : '…'}</b></span>
          <span className="rounded-md border px-3 py-1.5">Déjà envoyés (email 1) : <b>{preview ? preview.alreadySent : '…'}</b></span>
          <span className="rounded-md border px-3 py-1.5">Places restantes : <b>{preview ? preview.places : '…'}</b></span>
          <label className="flex items-center gap-2 rounded-md border px-3 py-1.5">
            <Switch checked={!!preview?.paused} disabled={!preview || !!busy} onCheckedChange={togglePause} />
            Mettre la séquence en pause
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {tranches.map((count, i) => (
            <Button key={i} onClick={() => sendTranche(i, count)} disabled={!!busy || i > 0}>
              {busy === `t${i}` ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}
              Email 1 — tranche {i + 1} — {count} destinataire(s)
            </Button>
          ))}
          {preview && pending === 0 && <span className="text-sm text-muted-foreground">Email 1 : toutes les adresses actives ont été servies.</span>}
        </div>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr><th className="p-2">#</th><th className="p-2">Date prévue</th><th className="p-2">Objet</th><th className="p-2">Statut</th><th className="p-2">Envois</th><th className="p-2" /></tr>
            </thead>
            <tbody>
              {(preview?.steps ?? []).map((s) => (
                <tr key={s.n} className="border-t">
                  <td className="p-2 font-semibold">{s.n}</td>
                  <td className="p-2 whitespace-nowrap">{fmtDate(s.date)}</td>
                  <td className="p-2">{s.subject}</td>
                  <td className="p-2 whitespace-nowrap">{s.status}</td>
                  <td className="p-2">{s.sent}</td>
                  <td className="p-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => sendTest(s.n)} disabled={!!busy}>
                      {busy === `test${s.n}` ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Mail className="mr-1 h-3.5 w-3.5" />}M'envoyer un test
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
