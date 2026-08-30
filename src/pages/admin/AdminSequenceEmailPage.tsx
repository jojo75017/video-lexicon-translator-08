import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Copy, ExternalLink, Gift, Mail, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import { toast } from 'sonner';
import {
  BONUS_TOTAL_VALUE,
  CAMPAGNE,
  CAMPAGNE_BONUSES,
  CAMPAGNE_EMAILS,
  SYSTEMEIO_SETUP_STEPS,
  emailToHtml,
  type CampagneEmail,
} from '@/data/campagneUnique';

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

function EmailCard({ email, index }: { email: CampagneEmail; index: number }) {
  return (
    <Card className="rounded-2xl border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="rounded-full">Email {index + 1}</Badge>
        <Badge className="rounded-full bg-muted text-muted-foreground hover:bg-muted">
          <Clock className="mr-1.5 h-3 w-3" />
          {email.delayDays === 0 ? 'Immédiat' : `J+${email.delayDays}`}
        </Badge>
        <Badge variant="outline" className="rounded-full">
          <Target className="mr-1.5 h-3 w-3" />
          {email.goal}
        </Badge>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-foreground">{email.subject}</h3>
      <p className="mt-1 text-sm text-muted-foreground">Pré-header : {email.preheader}</p>

      <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-sm leading-relaxed text-foreground">
        {email.body}
      </pre>

      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton value={email.subject} label="Copier l'objet" />
        <CopyButton value={email.body} label="Copier le texte" variant="default" />
        <CopyButton value={emailToHtml(email)} label="Copier le HTML" />
        <Button asChild size="sm" variant="ghost" className="rounded-xl">
          <a href={email.ctaUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" /> Tester le lien
          </a>
        </Button>
      </div>
    </Card>
  );
}

/** Panneau unique de la campagne email : tout se copie ici, nulle part ailleurs. */
export default function AdminSequenceEmailPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>

        <AdminPanelNav />

        <Card className="rounded-2xl border-border bg-card p-6">
          <Badge className="rounded-full">Campagne unique</Badge>
          <h1 className="mt-3 text-2xl font-bold text-foreground">{CAMPAGNE.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Un seul tag Systeme.io : <strong>{CAMPAGNE.tag}</strong>. Un seul lien par email.
            Les trois premiers emails renvoient sur la page cadeau (5 niches visibles + inscription
            qui débloque les bonus), les deux derniers sur la commande à {CAMPAGNE.price}.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Toutes les anciennes campagnes ont été supprimées : il n'y a plus qu'un seul contenu à jour.
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Gift className="h-5 w-5" /> Les bonus offerts à l'inscription — {BONUS_TOTAL_VALUE}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {CAMPAGNE_BONUSES.map((bonus) => (
              <li key={bonus.key}>
                <strong className="text-foreground">{bonus.title}</strong> — {bonus.value} · {bonus.to}
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Mail className="h-5 w-5" /> Les {CAMPAGNE_EMAILS.length} emails, dans l'ordre
          </h2>
          {CAMPAGNE_EMAILS.map((email, index) => (
            <EmailCard key={email.id} email={email} index={index} />
          ))}
        </div>

        <Card className="rounded-2xl border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Paramétrage dans Systeme.io</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            {SYSTEMEIO_SETUP_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
