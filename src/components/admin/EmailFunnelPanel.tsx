import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, RefreshCw, MousePointerClick, Send } from 'lucide-react';

/**
 * Tunnel complet, d'un seul écran : envoyés → ouvreurs → clics par lien →
 * visites de la page de commande → clics paiement → commandes payées.
 * Permet aussi de lancer les segments (non-ouvreurs, cliqueurs) et la relance
 * des commandes restées en attente.
 */

const norm = (v?: string | null) => (v || '').trim().toLowerCase();
const uniq = (rows: Array<Record<string, unknown>> | null, key: string) =>
  new Set((rows || []).map((r) => norm(String(r[key] ?? ''))).filter(Boolean)).size;

/** Étiquette lisible pour chaque lien mesuré (`lk=` posé dans les emails). */
const LINK_LABELS: Record<string, string> = {
  cadeau: 'Chapitre offert (/essai)',
  offre: 'Bouton offre 47 €',
  audio: 'Page message audio',
  mp3: 'Fichier audio direct',
  video: 'Vidéo',
  autre: 'Autre lien',
};

interface FunnelData {
  sent: number;
  openers: number;
  clickers: number;
  linkClicks: Array<{ tag: string; count: number }>;
  pageViews: number;
  checkoutClicks: number;
  checkoutReady: number;
  paid: number;
  pending: number;
}

const EmailFunnelPanel = () => {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sent, opens, clicks, events, orders] = await Promise.all([
        (supabase as any).from('email_send_log').select('recipient_email').like('template_name', 'rappel-47%').in('status', ['sent', 'delivered']).limit(5000),
        (supabase as any).from('email_opens').select('prospect_email').like('template_name', 'rappel-47%').limit(5000),
        (supabase as any).from('email_clicks').select('prospect_email, clicked_url').limit(5000),
        (supabase as any).from('capture_events').select('event_type').eq('surface', 'commander').limit(5000),
        (supabase as any).from('funnel_orders').select('email, status').limit(5000),
      ]);

      const perLink = new Map<string, Set<string>>();
      for (const row of clicks.data || []) {
        const url = String(row.clicked_url || '');
        const match = url.match(/[?&]lk=([a-z0-9_-]+)/i);
        const tag = match ? match[1].toLowerCase() : 'autre';
        if (!perLink.has(tag)) perLink.set(tag, new Set());
        perLink.get(tag)!.add(norm(row.prospect_email));
      }

      const eventRows = events.data || [];
      const countEvent = (type: string) => eventRows.filter((e: any) => e.event_type === type).length;
      const orderRows = orders.data || [];

      setData({
        sent: uniq(sent.data, 'recipient_email'),
        openers: uniq(opens.data, 'prospect_email'),
        clickers: uniq(clicks.data, 'prospect_email'),
        linkClicks: Array.from(perLink.entries())
          .map(([tag, set]) => ({ tag, count: set.size }))
          .sort((a, b) => b.count - a.count),
        pageViews: countEvent('view'),
        checkoutClicks: countEvent('checkout_click'),
        checkoutReady: countEvent('checkout_ready'),
        paid: orderRows.filter((o: any) => norm(o.status) === 'paid').length,
        pending: orderRows.filter((o: any) => norm(o.status) === 'pending').length,
      });
    } catch (err) {
      toast.error('Chargement du tunnel impossible : ' + ((err as Error).message || ''));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const call = async (body: Record<string, unknown>, label: string) => {
    setBusy(label);
    try {
      const { data: session } = await supabase.auth.getSession();
      const { data: result, error } = await supabase.functions.invoke('send-sales-email', {
        body,
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });
      if (error) throw error;
      const r = result as Record<string, unknown>;
      toast.success(
        body.dry_run
          ? `${label} : ${r.would_send ?? 0} destinataires seraient contactés`
          : `${label} : ${r.sent ?? 0} envoyés sur ${r.targets ?? 0} cibles`,
      );
      await load();
    } catch (err) {
      toast.error(`${label} impossible : ` + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  const steps = data
    ? [
        { label: 'Emails envoyés', value: data.sent },
        { label: 'Ont ouvert', value: data.openers },
        { label: 'Ont cliqué', value: data.clickers },
        { label: 'Visites page commande', value: data.pageViews },
        { label: 'Clics paiement', value: data.checkoutClicks },
        { label: 'Formulaire affiché', value: data.checkoutReady },
        { label: 'Commandes payées', value: data.paid },
      ]
    : [];

  return (
    <section className="rounded-xl border bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Tunnel email → commande</h2>
          <p className="text-xs text-slate-500">
            Chaque lien des emails passe par le relais de suivi : on voit enfin la marche qui bloque.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Actualiser
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {steps.map((s) => (
          <div key={s.label} className="rounded-lg border bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-xl font-black text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <MousePointerClick className="h-4 w-4" /> Clics par lien (personnes uniques)
        </h3>
        {data && data.linkClicks.length > 0 ? (
          <ul className="mt-2 divide-y rounded-lg border">
            {data.linkClicks.map((l) => (
              <li key={l.tag} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="text-slate-700">{LINK_LABELS[l.tag] || l.tag}</span>
                <span className="font-bold text-slate-900">{l.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-slate-500">Aucun clic enregistré pour le moment.</p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={!!busy} onClick={() => call({ mode: 'resend_non_openers', step: 1, dry_run: true }, 'Simulation non-ouvreurs')}>
          Simuler : non-ouvreurs
        </Button>
        <Button size="sm" disabled={!!busy} onClick={() => call({ mode: 'resend_non_openers', step: 1 }, 'Envoi non-ouvreurs')}>
          {busy === 'Envoi non-ouvreurs' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Envoyer aux non-ouvreurs
        </Button>
        <Button size="sm" variant="outline" disabled={!!busy} onClick={() => call({ mode: 'resend_clickers', step: 1, dry_run: true }, 'Simulation cliqueurs')}>
          Simuler : cliqueurs
        </Button>
        <Button size="sm" disabled={!!busy} onClick={() => call({ mode: 'resend_clickers', step: 1 }, 'Envoi cliqueurs')}>
          Envoyer aux cliqueurs
        </Button>
        <Button size="sm" variant="outline" disabled={!!busy} onClick={() => call({ mode: 'recover_pending' }, 'Relance paniers en attente')}>
          Relancer les commandes en attente {data ? `(${data.pending})` : ''}
        </Button>
      </div>
    </section>
  );
};

export default EmailFunnelPanel;
