import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ExternalLink, Mail, RefreshCw, Route, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type EmailLog = { id: string; message_id: string | null; template_name: string | null; recipient_email: string; status: string; error_message: string | null; created_at: string };

const journeys = [
  { name: 'Achat offre 47 €', steps: ['/commander', 'Paiement sécurisé', '/paiement-reussi', '/connexion-abonne'], status: 'Corrigé', note: 'Tunnel unique et tarif serveur aligné sur 47 €.' },
  { name: 'Connexion après achat', steps: ['/login', '/connexion-abonne', 'Code d’accès', 'Espace abonné'], status: 'Corrigé', note: 'Les alias de connexion mènent désormais à la page abonné.' },
  { name: 'Code manquant ou perdu', steps: ['/mon-code', 'Renvoi du code', '/connexion-abonne'], status: 'Corrigé', note: 'Le code est généré avant l’envoi et ne peut plus être « null ».' },
  { name: 'Adresse inconnue', steps: ['URL inconnue', 'Page 404', 'Choix achat ou connexion'], status: 'Corrigé', note: 'Une mauvaise URL ne redirige plus silencieusement vers l’achat.' },
  { name: 'Automatismes historiques', steps: ['Anciennes séquences', 'Arrêt des crons', 'Contrôle manuel'], status: 'Désactivé', note: 'Les anciens moteurs automatiques ont été neutralisés pour éviter les doublons.' },
];

const usefulTools = [
  { label: 'Prospects', tab: 'prospects' }, { label: 'Inscrits', tab: 'inscrits' }, { label: 'Envoi manuel', tab: 'send' },
  { label: 'Kit GetResponse', tab: 'abkit' }, { label: 'Templates', tab: 'templates' }, { label: 'Pipeline', tab: 'stats' },
  { label: 'CRM', path: '/crm' }, { label: 'Aperçu emails', path: '/apercu-emails' }, { label: 'Tunnel de vente', path: '/commander' }, { label: 'Page connexion', path: '/connexion-abonne' },
];

function describeEmail(templateName: string | null) {
  const template = templateName || 'Email sans modèle';
  const lower = template.toLowerCase();
  const engine = lower.includes('getresponse') ? 'GetResponse' : lower.includes('brevo') ? 'Brevo' : 'App emails';
  const campaign = lower.includes('47') ? 'Offre été 47 €' : lower.includes('access') || lower.includes('code') ? 'Accès abonné' : lower.includes('payment') || lower.includes('receipt') ? 'Achat' : lower.includes('welcome') || lower.includes('onboarding') ? 'Accueil' : 'Communication système';
  return { template, engine, campaign };
}

export default function CommunicationJourneyTracker({ onSelectTab }: { onSelectTab: (tab: string) => void }) {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const loadLogs = useCallback(async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('email_send_log').select('id,message_id,template_name,recipient_email,status,error_message,created_at').not('message_id', 'is', null).order('created_at', { ascending: false }).limit(1000);
    setLogs((data || []) as EmailLog[]); setLoading(false);
  }, []);
  useEffect(() => { loadLogs(); }, [loadLogs]);
  const latestEmails = useMemo(() => { const seen = new Set<string>(); return logs.filter((row) => { const key = row.message_id || row.id; if (seen.has(key)) return false; seen.add(key); return true; }); }, [logs]);

  return <div className="space-y-8">
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 text-xl font-semibold"><Mail className="h-5 w-5 text-primary" /> Suivi des emails</h2><p className="text-sm text-muted-foreground">Dernier état de chaque message, dédoublonné par identifiant d’envoi.</p></div><Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Actualiser</Button></div>
      <div className="overflow-hidden rounded-lg border border-border"><div className="max-h-[520px] overflow-auto"><table className="w-full min-w-[900px] text-sm"><thead className="sticky top-0 z-10 bg-card"><tr className="border-b text-left text-muted-foreground"><th className="px-3 py-3">Type</th><th className="px-3 py-3">Campagne</th><th className="px-3 py-3">Destinataire</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Moteur</th><th className="px-3 py-3">État</th></tr></thead><tbody>
        {latestEmails.map((email) => { const info = describeEmail(email.template_name); const failed = ['failed', 'dlq', 'bounced', 'complained'].includes(email.status); return <tr key={email.message_id || email.id} className="border-b border-border/60 align-top hover:bg-muted/30"><td className="px-3 py-3 font-medium">{info.template}</td><td className="px-3 py-3">{info.campaign}</td><td className="px-3 py-3">{email.recipient_email}</td><td className="whitespace-nowrap px-3 py-3">{new Date(email.created_at).toLocaleString('fr-FR')}</td><td className="px-3 py-3"><Badge variant="outline">{info.engine}</Badge></td><td className="px-3 py-3"><Badge className={failed ? 'border-destructive/30 bg-destructive/10 text-destructive' : email.status === 'sent' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-muted text-muted-foreground'}>{email.status}</Badge>{email.error_message && <p className="mt-1 max-w-xs text-xs text-destructive">{email.error_message}</p>}</td></tr>; })}
        {!loading && latestEmails.length === 0 && <tr><td colSpan={6} className="px-3 py-10 text-center text-muted-foreground">Aucun envoi journalisé.</td></tr>}
      </tbody></table></div></div>
    </section>
    <section><div className="mb-4"><h2 className="flex items-center gap-2 text-xl font-semibold"><Route className="h-5 w-5 text-primary" /> Parcours clients</h2><p className="text-sm text-muted-foreground">Enchaînements actifs et état des corrections.</p></div><div className="space-y-3">{journeys.map((journey) => <div key={journey.name} className="rounded-lg border bg-card p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold">{journey.name}</h3><p className="mt-1 text-sm text-muted-foreground">{journey.note}</p></div><Badge className="border-primary/30 bg-primary/10 text-primary"><CheckCircle2 className="mr-1 h-3.5 w-3.5" />{journey.status}</Badge></div><div className="mt-3 flex flex-wrap items-center gap-2">{journey.steps.map((step, index) => <div key={step} className="flex items-center gap-2"><Badge variant="outline" className="font-normal">{step}</Badge>{index < journey.steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}</div>)}</div></div>)}</div></section>
    <section><div className="mb-4"><h2 className="flex items-center gap-2 text-xl font-semibold"><Wrench className="h-5 w-5 text-primary" /> Onglets et pages utiles</h2></div><div className="flex flex-wrap gap-2">{usefulTools.map((tool) => <Button key={tool.label} variant="outline" onClick={() => tool.tab ? onSelectTab(tool.tab) : navigate(tool.path || '/gestion-prospects')}>{tool.label}<ExternalLink className="ml-2 h-3.5 w-3.5" /></Button>)}</div></section>
  </div>;
}