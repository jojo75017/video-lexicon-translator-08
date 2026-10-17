import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, RefreshCw, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import { supabase } from '@/integrations/supabase/client';
import { canSendLaunchEmail } from '../../../supabase/functions/_shared/launchEmailSchedule';

/** Trois emails à des dates distinctes. */
const STEPS: { step: number; template: string; title: string; when: string; targeted?: boolean }[] = [
  { step: 1, template: 't16-ouverture-2026-10-16', title: 'Email 1 — C’est ouvert (16 oct. matin)', when: '16 oct.' },
  { step: 4, template: 't17-niches-cliqueurs-2026-10-17', title: 'Relance A — 10 niches offertes (cliqueurs de l’email 1)', when: '17 oct. 2026', targeted: true },
  { step: 5, template: 't18-question-non-cliqueurs-2026-10-18', title: 'Relance B — Quel est votre projet ? (non-cliqueurs)', when: '18 oct. 2026', targeted: true },
  { step: 2, template: 't16-livre-fini-2026-10-16', title: 'Email 2 — Le livre que vous repoussez', when: '19 oct. 2026' },
  { step: 3, template: 't16-derniere-chance-2026-10-16', title: 'Email 3 — Vous n’avez pas encore regardé ?', when: '20 oct. 2026' },
];

type LogRow = { message_id: string | null; id: string; template_name: string | null; recipient_email: string; status: string; last_event: string | null; error_message: string | null; created_at: string };
type ClickRow = { prospect_email: string; template_name: string | null; clicked_at: string };

export default function AdminLancementEmailsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [clicks, setClicks] = useState<ClickRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<Record<number, number | null>>({});
  const [base, setBase] = useState<{ total?: number; bounced?: number; unsub?: number; inactif?: number }>({});
  const [unsubs, setUnsubs] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const templates = STEPS.map((s) => s.template);
    const count = async (f?: (q: any) => any) => {
      let q = (supabase as any).from('sales_prospects').select('*', { count: 'exact', head: true });
      if (f) q = f(q);
      const { count: c } = await q;
      return c ?? undefined;
    };
    Promise.all([
      count(),
      count((q) => q.eq('status', 'bounced')),
      count((q) => q.eq('unsubscribed', true)),
      count((q) => q.eq('status', 'inactif')),
    ]).then(([total, bounced, unsub, inactif]) => setBase({ total, bounced, unsub, inactif }));
    const fetchLogs = async () => {
      const all: LogRow[] = [];
      for (let offset = 0; offset < 20000; offset += 1000) {
        const { data } = await (supabase as any).from('email_send_log').select('id,message_id,template_name,recipient_email,status,last_event,error_message,created_at').in('template_name', templates).order('created_at', { ascending: false }).range(offset, offset + 999);
        all.push(...(data || []));
        if (!data || data.length < 1000) break;
      }
      return all;
    };
    const [logData, clickRes, unsubRes, audienceRes] = await Promise.all([
      fetchLogs(),
      (supabase as any).from('email_clicks').select('prospect_email,template_name,clicked_at').in('template_name', templates).order('clicked_at', { ascending: false }).limit(5000),
      (supabase as any).from('sales_prospects').select('email').eq('unsubscribed', true).limit(5000),
      Promise.all(STEPS.map(async ({ step }) => {
        const { data, error } = await supabase.functions.invoke('send-launch-sequence', {
          body: { mode: 'status', step, segment: 'all' },
        });
        return [step, !error && typeof data?.total_eligible === 'number' ? data.total_eligible : null] as const;
      })),
    ]);
    setLogs(logData);
    setClicks((clickRes.data || []) as ClickRow[]);
    setUnsubs(new Set(((unsubRes.data || []) as { email: string }[]).map((r) => r.email.toLowerCase())));
    setRemaining(Object.fromEntries(audienceRes));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const latest = useMemo(() => {
    const seen = new Set<string>();
    return logs.filter((row) => {
      const key = row.message_id || row.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [logs]);

  const pct = (n: number, d: number) => (d > 0 ? `${((n / d) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %` : '—');

  const perStep = useMemo(() => STEPS.map((s) => {
    const rows = latest.filter((r) => r.template_name === s.template);
    const isFailed = (r: LogRow) => ['failed', 'dlq', 'bounced', 'complained', 'error'].includes(r.status) || ['suppressed', 'bounced', 'complained'].includes(r.last_event || '');
    const failed = rows.filter(isFailed).length;
    const okEmails = new Set(rows.filter((r) => !isFailed(r)).map((r) => r.recipient_email.toLowerCase()));
    const opened = new Set(rows.filter((r) => ['opened', 'clicked'].includes(r.last_event || '')).map((r) => r.recipient_email.toLowerCase())).size;
    const clicked = new Set(clicks.filter((c) => c.template_name === s.template).map((c) => c.prospect_email.toLowerCase()).filter((e) => okEmails.has(e) || rows.some((r) => r.recipient_email.toLowerCase() === e))).size;
    const unsubscribed = [...okEmails].filter((e) => unsubs.has(e)).length;
    return { ...s, total: rows.length, sent: rows.filter((r) => ['sent', 'delivered'].includes(r.status)).length, failed, clicked, opened, unsubscribed, recipients: okEmails.size };
  }), [latest, clicks, unsubs]);

  const sentToday = useMemo(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    return latest.filter((r) => new Date(r.created_at) >= start).length;
  }, [latest]);

  const runSend = async (step: number, segment: 'hot' | 'all' | 'cold' | 'personal', limit: number) => {
    if (!canSendLaunchEmail(step)) { toast.error('Cet email ne peut pas être envoyé aujourd’hui.'); return; }
    const key = `${step}-${segment}`;
    setSending(key);
    const { data, error } = await supabase.functions.invoke('send-launch-sequence', { body: { mode: 'send', step, segment, limit } });
    setSending(null);
    if (error) { toast.error('Envoi impossible : ' + error.message); return; }
    const res = data as any;
    toast.success(`Email ${step} : ${res?.sent ?? 0} envoyé(s) sur ${res?.targeted ?? 0} destinataires.`);
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminPanelNav />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Retour au dashboard
        </Button>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold"><Mail className="h-6 w-6 text-primary" /> Emails du tunnel du 16 octobre</h1>
            <p className="text-sm text-muted-foreground">Email 1 : 16 octobre · Relance A : 17 · Relance B : 18 · Email 2 : 19 octobre · Email 3 : 20 octobre 2026.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{sentToday} envoyé(s) aujourd’hui</Badge>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        <Card className="mb-4 border-primary/30 bg-primary/5 p-4">
          <p className="text-lg font-bold text-primary">
            Base qualifiée : {loading || remaining[2] == null ? '…' : remaining[2].toLocaleString('fr-FR')} prospects joignables
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sur {base.total ?? '…'} adresses : {base.bounced ?? '…'} mortes ou rejetées, {base.unsub ?? '…'} désinscrits et {base.inactif ?? '…'} inactifs sont exclus, ainsi que les clients payants et les adresses de test.
          </p>
        </Card>
        <p className="mb-4 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
          Envois par groupes de 300 maximum. Envois manuels uniquement aux dates prévues (heure de Paris). Les clients, désinscrits et doublons sont exclus.
        </p>


        <div className="space-y-4">
          {perStep.map((s) => (
            <Card key={s.step} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{s.title}</h2>
                  <p className="text-xs text-muted-foreground">{s.when} · repère interne {s.template}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{loading ? 'Chargement…' : remaining[s.step] == null ? 'Nombre indisponible' : `${remaining[s.step]?.toLocaleString('fr-FR')} destinataires restants`}</Badge>
                  <Badge className="border-primary/30 bg-primary/10 text-primary">{s.sent} envoyés</Badge>
                  <Badge variant="outline">{s.opened} ouvertures · {pct(s.opened, s.recipients)}</Badge>
                  <Badge variant="outline">{s.clicked} cliqueurs · {pct(s.clicked, s.recipients)}</Badge>
                  <Badge variant="outline">{s.unsubscribed} désinscrits · {pct(s.unsubscribed, s.recipients)}</Badge>
                  {s.failed > 0 && <Badge className="border-destructive/30 bg-destructive/10 text-destructive">{s.failed} en échec</Badge>}
                </div>
              </div>
              {s.targeted ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" disabled={sending !== null || !canSendLaunchEmail(s.step)} onClick={() => runSend(s.step, 'all', 300)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {sending === `${s.step}-all` ? 'Envoi…' : 'Envoyer un lot de 300 (groupe ciblé)'}
                </Button>
              </div>
              ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={sending !== null || !canSendLaunchEmail(s.step)} onClick={() => runSend(s.step, 'hot', 20)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {sending === `${s.step}-hot` ? 'Envoi…' : 'Envoyer aux plus engagés'}
                </Button>
                <Button size="sm" variant="outline" disabled={sending !== null || !canSendLaunchEmail(s.step)} onClick={() => runSend(s.step, 'cold', 300)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {sending === `${s.step}-cold` ? 'Envoi…' : 'Envoyer aux non-cliqueurs'}
                </Button>
                <Button size="sm" variant="outline" disabled={sending !== null || !canSendLaunchEmail(s.step)} onClick={() => runSend(s.step, 'personal', 300)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {sending === `${s.step}-personal` ? 'Envoi…' : 'Adresses personnelles'}
                </Button>
                <Button size="sm" disabled={sending !== null || !canSendLaunchEmail(s.step)} onClick={() => runSend(s.step, 'all', 300)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {sending === `${s.step}-all` ? 'Envoi…' : 'Envoyer un lot de 300'}
                </Button>
              </div>
              )}
            </Card>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-lg font-semibold">Derniers envois</h2>
        <div className="overflow-hidden rounded-lg border">
          <div className="max-h-[480px] overflow-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Destinataire</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">État</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((row) => {
                  const failed = ['failed', 'dlq', 'bounced', 'complained'].includes(row.status);
                  return (
                    <tr key={row.message_id || row.id} className="border-b border-border/60 hover:bg-muted/30">
                      <td className="px-3 py-2">{STEPS.find((s) => s.template === row.template_name)?.when || row.template_name}</td>
                      <td className="px-3 py-2">{row.recipient_email}</td>
                      <td className="whitespace-nowrap px-3 py-2">{new Date(row.created_at).toLocaleString('fr-FR')}</td>
                      <td className="px-3 py-2">
                        <Badge className={failed ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-primary/30 bg-primary/10 text-primary'}>{row.status}</Badge>
                        {row.error_message && <p className="mt-1 max-w-xs text-xs text-destructive">{row.error_message}</p>}
                      </td>
                    </tr>
                  );
                })}
                {!loading && latest.length === 0 && (
                  <tr><td colSpan={4} className="px-3 py-10 text-center text-muted-foreground">Aucun envoi pour l’instant.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
