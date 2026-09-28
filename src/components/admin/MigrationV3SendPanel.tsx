import { useEffect, useState } from 'react';
import { Loader2, Mail, Send, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  LANCEMENT_V3_EMAILS,
  lancementV3ToText,
  type LancementV3Email,
} from '@/data/lancementV3Systemeio';

/** Mise en forme HTML simple du message (paragraphes + bouton). */
function migrationHtml(email: LancementV3Email): string {
  const paragraphs = email.body
    .split('\n\n')
    .map(
      (block) =>
        `<p style="margin:0 0 16px;line-height:1.65;">${block
          .trim()
          .replace(/\n/g, '<br />')}</p>`,
    )
    .join('\n');

  return `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1f2937;max-width:560px;margin:0 auto;">
${paragraphs}
<p style="margin:28px 0;"><a href="${email.ctaUrl}" style="display:inline-block;background:#0f6b5c;color:#ffffff;padding:14px 24px;border-radius:8px;font-weight:700;text-decoration:none;">${email.ctaLabel}</a></p>
</div>`;
}

/** Envoi en 1 clic de l'email de passage à la V3 aux abonnés enregistrés. */
export function MigrationV3SendPanel() {
  const email = LANCEMENT_V3_EMAILS.find((e) => e.id === 'passage-abonnes-v3');
  const [pending, setPending] = useState<string[] | null>(null);
  const [alreadySent, setAlreadySent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [testTo, setTestTo] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setTestTo((prev) => prev || data.user!.email!);
    });
  }, []);

  if (!email) return null;

  // Le texte part sans le champ [Prénom] : Systeme.io n'est pas utilisé ici.
  const body = lancementV3ToText(email).replace(/\[Prénom\]/g, '').replace(/Bonjour ,/, 'Bonjour,');
  const html = migrationHtml({ ...email, body: email.body.replace(/\[Prénom\]/g, '').replace('Bonjour ,', 'Bonjour,') });

  const loadRecipients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-migration-v3', {
        body: { mode: 'preview' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPending(data.pending ?? []);
      setAlreadySent(data.alreadySent ?? []);
      toast.success(`${(data.pending ?? []).length} abonné(s) à prévenir`);
    } catch (err) {
      toast.error(`Lecture impossible : ${(err as Error).message}`);
    }
    setLoading(false);
  };

  const sendTest = async () => {
    if (!testTo.trim()) return toast.error('Indiquez une adresse');
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-migration-v3', {
        body: { mode: 'test', to: testTo.trim(), subject: email.subject, html },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Test envoyé à ${testTo.trim()}`);
    } catch (err) {
      toast.error(`Envoi impossible : ${(err as Error).message}`);
    }
    setSending(false);
  };

  const sendAll = async () => {
    const count = pending?.length ?? 0;
    if (!count) return toast.error('Chargez d’abord la liste des abonnés');
    if (!window.confirm(`Envoyer l’email de passage à la V3 à ${count} abonné(s) ? Chacun ne le recevra qu’une seule fois.`)) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-migration-v3', {
        body: { mode: 'send', subject: email.subject, html },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`${data.sentCount} email(s) envoyé(s)`);
      if ((data.failed ?? []).length) {
        toast.error(`${data.failed.length} échec(s) — voir la liste rechargée`);
      }
      await loadRecipients();
    } catch (err) {
      toast.error(`Envoi impossible : ${(err as Error).message}`);
    }
    setSending(false);
  };

  return (
    <Card className="space-y-4 rounded-2xl border-emerald-200 bg-emerald-50/50 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="bg-emerald-600 text-white">Envoi automatique</Badge>
        <h3 className="text-base font-semibold text-emerald-900">
          Prévenir mes abonnés du passage à la V3
        </h3>
      </div>
      <p className="text-sm text-emerald-900/80">
        Ce bouton envoie le message ci-dessous, tel quel, à tous vos abonnés enregistrés dans
        EbookStudio. Vous n’avez aucune adresse à chercher. Chaque abonné ne le reçoit qu’une
        seule fois, même si vous cliquez deux fois.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="rounded-xl" onClick={loadRecipients} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
          Voir mes abonnés à prévenir
        </Button>
        <Button
          className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
          onClick={sendAll}
          disabled={sending || !(pending?.length ?? 0)}
        >
          {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Envoyer maintenant {pending?.length ? `(${pending.length})` : ''}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={testTo}
          onChange={(e) => setTestTo(e.target.value)}
          placeholder="mon@email.fr"
          className="h-9 w-64 rounded-xl bg-white"
        />
        <Button variant="outline" size="sm" className="rounded-xl" onClick={sendTest} disabled={sending}>
          <Mail className="mr-2 h-4 w-4" /> M’envoyer un test
        </Button>
      </div>

      {pending && (
        <div className="space-y-2 rounded-xl border border-emerald-200 bg-white p-3 text-sm">
          <p className="font-medium text-emerald-900">
            {pending.length} abonné(s) n’ont pas encore reçu ce message
            {alreadySent.length ? ` · ${alreadySent.length} déjà prévenu(s)` : ''}
          </p>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-joy-ink/70">
            {pending.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <details className="rounded-xl bg-white p-3 text-sm">
        <summary className="cursor-pointer font-medium text-emerald-900">
          Relire le message envoyé — objet : {email.subject}
        </summary>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-joy-ink/80">{body}</pre>
      </details>
    </Card>
  );
}

export default MigrationV3SendPanel;
