import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Mail, Send } from 'lucide-react';

interface Preview { totalPending: number; alreadySent: number; trancheSize: number }

/** Campagne « Offre de lancement 47 € » : segment actif, tranches de 500, envoi manuel. */
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

  const call = async (mode: 'preview' | 'send' | 'test') => {
    const { data, error } = await supabase.functions.invoke('send-offre-lancement', { body: { mode } });
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

  const sendTest = async () => {
    if (!confirm('Envoyer un test uniquement à votre adresse admin ?')) return;
    setBusy('test');
    try { const r = await call('test'); toast.success(`Test envoyé à ${r.to}`); }
    catch (e) { toast.error((e as Error).message); } finally { setBusy(null); }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Mail className="h-5 w-5 text-primary" /> Offre de lancement 47 € — segment actif</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Objet : « Prénom, 15 places à 47 € pour EbookStudio V3 (jusqu'au 15 octobre) ». Rien ne part sans votre clic. Une adresse ne reçoit jamais deux fois cet email.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-md border px-3 py-1.5">À servir : <b>{preview ? pending : '…'}</b></span>
          <span className="rounded-md border px-3 py-1.5">Déjà envoyés : <b>{preview ? preview.alreadySent : '…'}</b></span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={sendTest} disabled={!!busy}>
            {busy === 'test' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Mail className="mr-1.5 h-4 w-4" />}M'envoyer un test
          </Button>
          {tranches.map((count, i) => (
            <Button key={i} onClick={() => sendTranche(i, count)} disabled={!!busy || i > 0}>
              {busy === `t${i}` ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}
              Tranche {i + 1} — {count} destinataire(s)
            </Button>
          ))}
          {preview && pending === 0 && <span className="text-sm text-muted-foreground">Toutes les adresses actives ont été servies.</span>}
        </div>
      </CardContent>
    </Card>
  );
}
