import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Copy, ExternalLink, Flame, Gift, Mail, Snowflake } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import { toast } from 'sonner';
import {
  BONUS_TOTAL_VALUE,
  LAUNCH_BONUSES,
  LAUNCH_OFFER,
  SEQUENCE_EMAILS,
  SYSTEMEIO_SETUP_STEPS,
  emailToHtml,
  type SequenceEmail,
  type SequenceSegment,
} from '@/data/systemeioSequences';

function CopyButton({
  value,
  label,
  variant = 'outline',
}: {
  value: string;
  label: string;
  variant?: 'default' | 'outline';
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copié`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copie impossible — sélectionnez le texte manuellement');
    }
  };

  return (
    <Button type="button" size="sm" variant={variant} onClick={onCopy} className="rounded-xl">
      {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}

function EmailCard({ email, index }: { email: SequenceEmail; index: number }) {
  const bonus = LAUNCH_BONUSES.find((b) => b.key === email.bonusKey);

  return (
    <Card className="rounded-2xl border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="rounded-full">
          Email {index + 1}
        </Badge>
        <Badge className="rounded-full bg-muted text-muted-foreground hover:bg-muted">
          <Clock className="mr-1.5 h-3 w-3" />
          {email.delayDays === 0 ? 'Immédiat' : `J+${email.delayDays}`}
        </Badge>
        {bonus && (
          <Badge variant="outline" className="rounded-full border-amber-400 text-amber-700">
            <Gift className="mr-1.5 h-3 w-3" />
            {bonus.title}
          </Badge>
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">Objet : {email.subject}</h3>
      <p className="mt-1 text-sm text-muted-foreground">Pré-header : {email.preheader}</p>

      <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-sm leading-relaxed text-foreground">
        {email.body}
      </pre>

      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton value={email.subject} label="Copier l'objet" />
        <CopyButton value={email.body} label="Copier le texte" variant="default" />
        <CopyButton value={emailToHtml(email)} label="Copier le HTML" />
        <Button asChild size="sm" variant="ghost" className="rounded-xl">
          <a href={email.ctaUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Tester le lien
          </a>
        </Button>
      </div>
    </Card>
  );
}

export default function AdminSequenceEmailPage() {
  const navigate = useNavigate();
  const [segment, setSegment] = useState<SequenceSegment>('chaud');

  const emails = SEQUENCE_EMAILS.filter((e) => e.segment === segment);

  const fullSequenceText = SEQUENCE_EMAILS.filter((e) => e.segment === segment)
    .map(
      (e, i) =>
        `===== EMAIL ${i + 1} — ${e.delayDays === 0 ? 'immédiat' : `J+${e.delayDays}`} =====\nOBJET : ${e.subject}\nPRÉ-HEADER : ${e.preheader}\n\n${e.body}\n`,
    )
    .join('\n');

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord admin
        </Button>

        <AdminPanelNav />

        <Card className="rounded-2xl border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Systeme.io — prêt à copier
              </p>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">
                Séquence « Dernière offre de lancement — {LAUNCH_OFFER.price} à vie »
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Tout est déjà rédigé : {SEQUENCE_EMAILS.length} emails, un bonus par message, un seul
            lien par email. Vous n'avez qu'à copier l'objet et le corps dans Systeme.io. L'offre
            portée par la séquence : accès à vie à {LAUNCH_OFFER.price} jusqu'au{' '}
            {LAUNCH_OFFER.deadline}, V3 incluse d'office le 1er octobre, {BONUS_TOTAL_VALUE} de
            bonus.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <a href="/bonus" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir la page /bonus
              </a>
            </Button>
            <CopyButton value={fullSequenceText} label="Copier toute la séquence affichée" />
          </div>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            Paramétrage dans Systeme.io — 8 étapes
          </h2>
          <ol className="mt-4 space-y-3">
            {SYSTEMEIO_SETUP_STEPS.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={segment === 'chaud' ? 'default' : 'outline'}
            onClick={() => setSegment('chaud')}
            className="rounded-xl"
          >
            <Flame className="mr-2 h-4 w-4" />
            Contacts chauds (4 emails)
          </Button>
          <Button
            type="button"
            variant={segment === 'froid' ? 'default' : 'outline'}
            onClick={() => setSegment('froid')}
            className="rounded-xl"
          >
            <Snowflake className="mr-2 h-4 w-4" />
            Contacts froids (3 emails)
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          {emails.map((email, i) => (
            <EmailCard key={email.id} email={email} index={i} />
          ))}
        </div>

        <Card className="rounded-2xl border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            Les {LAUNCH_BONUSES.length} bonus utilisés dans la séquence
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {LAUNCH_BONUSES.map((b) => (
              <li key={b.key} className="flex flex-wrap items-center gap-2">
                <Gift className="h-4 w-4 shrink-0 text-primary" />
                <span className="font-medium text-foreground">{b.title}</span>
                <Badge variant="outline" className="rounded-full">
                  {b.value}
                </Badge>
                <code className="text-xs">{b.to}</code>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
