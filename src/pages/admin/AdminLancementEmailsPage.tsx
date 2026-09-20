import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Mail, RefreshCw, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import { FunnelConversionPanel } from '@/components/admin/FunnelConversionPanel';
import { supabase } from '@/integrations/supabase/client';

/** Les 4 emails de la séquence de lancement V3 (1er octobre 2026). */
const STEPS = [
  { step: 1, template: 'v3l-essai-J18', title: 'Email 1 — L’essai gratuit', when: 'J-18' },
  { step: 2, template: 'v3l-livre-J10', title: 'Email 2 — Un livre écrit sous vos yeux', when: 'J-10' },
  { step: 3, template: 'v3l-changement-J4', title: 'Email 3 — Ce qui change le 1er octobre', when: 'J-4' },
  { step: 4, template: 'v3l-dernier-J1', title: 'Email 4 — Dernier jour à 47 €', when: 'J-1' },
  { step: 5, template: 'v3l-niches-offertes', title: 'Lettre cadeau — 10 niches (un seul bouton)', when: 'À tout moment' },
];

type LogRow = { message_id: string | null; id: string; template_name: string | null; recipient_email: string; status: string; error_message: string | null; created_at: string };
type ClickRow = { prospect_email: string; template_name: string | null; clicked_at: string };

/** Calendrier de la séquence de lancement V3 (lancement le 1er octobre 2026). */
const CALENDAR = [
  {
    startDay: 13, endDay: 20, monthLabel: 'Septembre 2026',
    emailLabel: 'Email 1 — L’essai gratuit (J-18)',
    action: 'Envoyer l’Email 1 par lots de 100 par jour (priorité : plus engagés puis adresses personnelles).',
    step: 1, when: '13 → 20 sept.',
  },
  {
    startDay: 21, endDay: 26, monthLabel: 'Septembre 2026',
    emailLabel: 'Email 2 — Un livre écrit sous vos yeux (J-10)',
    action: 'Commencer l’Email 2 le 21 septembre. Continuer les lots de 100 par jour.',
    step: 2, when: '21 → 26 sept.',
  },
  {
    startDay: 27, endDay: 29, monthLabel: 'Septembre 2026',
    emailLabel: 'Email 3 — Ce qui change le 1er octobre (J-4)',
    action: 'Envoyer l’Email 3. Finit les lots restants de l’Email 2 si besoin.',
    step: 3, when: '27 → 29 sept.',
  },
  {
    startDay: 30, endDay: 30, monthLabel: 'Septembre 2026',
    emailLabel: 'Email 4 — Dernier jour à 47 € (J-1)',
    action: 'Dernier rappel : envoyer l’Email 4 à tous ceux qui ne l’ont pas encore reçu.',
    step: 4, when: '30 sept. uniquement',
  },
  {
    startDay: 1, endDay: 1, monthLabel: 'Octobre 2026',
    emailLabel: 'Lancement V3 — 1er octobre',
    action: 'Ouverture V3. Plus d’envois de la séquence : l’offre à 47 € est terminée.',
    step: null, when: '1er oct.',
  },
];

const SEPTEMBER_DAYS = 30;
const CAL_START = 13; // calendrier affiché du 13 septembre au 1er octobre

export default function AdminLancementEmailsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [clicks, setClicks] = useState<ClickRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const templates = STEPS.map((s) => s.template);
    const [logRes, clickRes] = await Promise.all([
      (supabase as any).from('email_send_log').select('id,message_id,template_name,recipient_email,status,error_message,created_at').in('template_name', templates).order('created_at', { ascending: false }).limit(2000),
      (supabase as any).from('email_clicks').select('prospect_email,template_name,clicked_at').in('template_name', templates).order('clicked_at', { ascending: false }).limit(2000),
    ]);
    setLogs((logRes.data || []) as LogRow[]);
    setClicks((clickRes.data || []) as ClickRow[]);
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

  const perStep = useMemo(() => STEPS.map((s) => {
    const rows = latest.filter((r) => r.template_name === s.template);
    const failed = rows.filter((r) => ['failed', 'dlq', 'bounced', 'complained'].includes(r.status)).length;
    const clicked = new Set(clicks.filter((c) => c.template_name === s.template).map((c) => c.prospect_email)).size;
    return { ...s, total: rows.length, sent: rows.length - failed, failed, clicked };
  }), [latest, clicks]);

  const sentToday = useMemo(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    return latest.filter((r) => new Date(r.created_at) >= start).length;
  }, [latest]);

  const runSend = async (step: number, segment: 'hot' | 'all' | 'cold' | 'personal', limit: number) => {
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

        <div className="mb-6">
          <FunnelConversionPanel />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold"><Mail className="h-6 w-6 text-primary" /> Séquence de lancement V3</h1>
            <p className="text-sm text-muted-foreground">Les emails envoyés avant le 1er octobre et la lettre cadeau « 10 niches », avec les envois et les clics. La lettre contient un seul bouton vers la page cadeau.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{sentToday} envoyé(s) aujourd’hui</Badge>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        <p className="mb-4 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
          Envoi limité à 100 emails par lot, pour rester dans le quota gratuit de Resend.
          Envoyez d’abord aux contacts les plus engagés, puis aux adresses personnelles, puis au reste.
          Les clients, les désinscrits et les personnes déjà destinataires du même email sont exclus automatiquement.
        </p>

        <Card className="mb-6 p-4">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-primary" /> Calendrier de la séquence
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Ordre obligatoire : ne jamais mélanger ni tirer les emails au hasard. Chaque email part dans
            l’ordre, par lots de 100 par jour. La lettre cadeau « 10 niches » part à tout moment, en priorité
            aux personnes ayant cliqué.
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              {/* En-tête des jours : 13 sept. → 1er oct. */}
              <div className="mb-1 grid" style={{ gridTemplateColumns: `180px repeat(${SEPTEMBER_DAYS - CAL_START + 2}, 1fr)` }}>
                <div />
                {Array.from({ length: SEPTEMBER_DAYS - CAL_START + 2 }, (_, i) => {
                  const day = CAL_START + i;
                  const label = day <= SEPTEMBER_DAYS ? `${day}` : '1/10';
                  const isToday = day === new Date().getDate() && new Date().getMonth() === 8;
                  return (
                    <div key={i} className={`text-center text-[10px] ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                      {label}
                    </div>
                  );
                })}
              </div>
              {CALENDAR.map((row) => {
                const startCol = row.monthLabel.startsWith('Octobre')
                  ? SEPTEMBER_DAYS - CAL_START + 2
                  : row.startDay - CAL_START + 1;
                const span = row.monthLabel.startsWith('Octobre')
                  ? 1
                  : row.endDay - row.startDay + 1;
                return (
                  <div key={row.emailLabel} className="mb-2 grid items-center" style={{ gridTemplateColumns: `180px repeat(${SEPTEMBER_DAYS - CAL_START + 2}, 1fr)` }}>
                    <div className="pr-2 text-xs font-medium leading-tight">{row.when}</div>
                    {Array.from({ length: SEPTEMBER_DAYS - CAL_START + 2 }, (_, i) => {
                      const col = i + 1;
                      const inRange = col >= startCol && col < startCol + span;
                      return (
                        <div key={i} className="px-px">
                          {inRange && (
                            <div
                              className={`h-6 rounded ${row.step === null ? 'bg-primary' : 'bg-primary/25'} ${col === startCol ? 'rounded-l-md' : ''} ${col === startCol + span - 1 ? 'rounded-r-md' : ''}`}
                              title={row.emailLabel}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {CALENDAR.map((row) => (
              <div key={row.emailLabel} className="flex flex-wrap items-start gap-2 rounded-md border bg-muted/30 p-2 text-sm">
                <Badge variant="outline" className="shrink-0">{row.when}</Badge>
                <div>
                  <p className="font-medium">{row.emailLabel}</p>
                  <p className="text-xs text-muted-foreground">{row.action}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          {perStep.map((s) => (
            <Card key={s.step} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{s.title}</h2>
                  <p className="text-xs text-muted-foreground">{s.when} · repère interne {s.template}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-primary/30 bg-primary/10 text-primary">{s.sent} envoyés</Badge>
                  <Badge variant="outline">{s.clicked} clics</Badge>
                  {s.failed > 0 && <Badge className="border-destructive/30 bg-destructive/10 text-destructive">{s.failed} en échec</Badge>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={sending !== null} onClick={() => runSend(s.step, 'hot', 20)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {sending === `${s.step}-hot` ? 'Envoi…' : 'Envoyer aux plus engagés'}
                </Button>
                <Button size="sm" variant="outline" disabled={sending !== null} onClick={() => runSend(s.step, 'cold', 100)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {sending === `${s.step}-cold` ? 'Envoi…' : 'Envoyer aux non-cliqueurs'}
                </Button>
                <Button size="sm" variant="outline" disabled={sending !== null} onClick={() => runSend(s.step, 'personal', 100)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {sending === `${s.step}-personal` ? 'Envoi…' : 'Adresses personnelles'}
                </Button>
                <Button size="sm" disabled={sending !== null} onClick={() => runSend(s.step, 'all', 100)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  {sending === `${s.step}-all` ? 'Envoi…' : 'Envoyer un lot de 100'}
                </Button>
              </div>
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
