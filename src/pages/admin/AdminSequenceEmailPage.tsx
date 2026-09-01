import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Copy, ExternalLink, Gift, Mail, Send, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import { NewsletterClicksPanel } from '@/components/admin/NewsletterClicksPanel';
import { FunnelUnifiedPanel } from '@/components/admin/FunnelUnifiedPanel';
import { NewsletterEngagementPanel } from '@/components/admin/NewsletterEngagementPanel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  BONUS_TOTAL_VALUE,
  CAMPAGNE,
  CAMPAGNE_BONUSES,
  CAMPAGNE_EMAILS,
  SYSTEMEIO_SETUP_STEPS,
  emailToHtml,
  emailShortKey,
  emailShortUrl,
  type CampagneEmail,
} from '@/data/campagneUnique';

import {
  NEWSLETTERS,
  NEWSLETTER_EXCLUDE_TAG,
  NEWSLETTER_HOWTO,
  NEWSLETTER_SENDER,
  NEWSLETTER_TAG,
  newsletterShortKey,
  newsletterShortUrl,
  newsletterToText,
  type Newsletter,
  newsletterDestination,
  SYSTEMEIO_EMAIL_MERGE_TAG,
} from '@/data/newslettersSystemeio';

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

function TestSender({ email }: { email: CampagneEmail }) {
  const [to, setTo] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setTo((prev) => prev || data.user!.email!);
    });
  }, []);

  const send = async () => {
    if (!to.trim()) {
      toast.error('Indiquez une adresse email');
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-campaign-test', {
        body: {
          emailId: email.id,
          to: to.trim(),
          subject: email.subject,
          html: emailToHtml(email),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Test envoyé à ${to.trim()}`);
    } catch (err) {
      toast.error(`Envoi impossible : ${(err as Error).message}`);
    }
    setSending(false);
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
      <Input
        type="email"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="votre@email.fr"
        className="h-9 w-56 rounded-xl"
      />
      <Button type="button" size="sm" onClick={send} disabled={sending} className="rounded-xl">
        <Send className="mr-2 h-4 w-4" />
        {sending ? 'Envoi…' : 'M’envoyer ce test'}
      </Button>
      <span className="text-xs text-muted-foreground">
        Objet préfixé [TEST] — aucun impact sur les statistiques.
      </span>
    </div>
  );
}

function EmailCard({ email, index }: { email: CampagneEmail; index: number }) {
  const shortLink = emailShortUrl(email);

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

      {/* 1. L'objet */}
      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          1. Objet
        </p>
        <p className="mt-1 text-sm text-foreground">{email.subject}</p>
        <div className="mt-2">
          <CopyButton value={email.subject} label="Copier l'objet" />
        </div>
      </div>

      {/* 2. Le texte du corps */}
      <div className="mt-3 rounded-xl border border-border bg-muted/30 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          2. Texte à coller dans Systeme.io
        </p>
        <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-background p-3 text-sm leading-relaxed text-foreground">
          {email.body}
        </pre>
        <div className="mt-2">
          <CopyButton value={email.body} label="Copier le texte" variant="default" />
        </div>
      </div>

      {/* 3. Le bouton */}
      <div className="mt-3 rounded-xl border border-border bg-muted/30 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          3. Bouton Systeme.io
        </p>
        <p className="mt-1 text-sm text-foreground">
          Libellé : <strong>{email.ctaLabel}</strong>
        </p>
        <p className="mt-1 break-all text-sm text-muted-foreground">
          Champ URL : <code>{shortLink}</code>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <CopyButton value={email.ctaLabel} label="Copier le libellé" />
          <CopyButton value={shortLink} label="Copier le lien court" />
          <Button asChild size="sm" variant="ghost" className="rounded-xl">
            <a href={`/r/${emailShortKey(email)}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Tester le lien
            </a>
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Ce lien court compte le clic puis redirige aussitôt. Ne le remplacez jamais par un lien
          direct : le clic ne serait plus mesuré.
        </p>
      </div>

      <TestSender email={email} />
    </Card>
  );
}



/** Panneau unique de la campagne email : tout se copie ici, nulle part ailleurs. */
const FUNNEL_STEPS: Array<{ key: string; label: string }> = [
  { key: 'view', label: "Arrivées sur /essai" },
  { key: 'generate_click', label: 'Clics sur « Voir mon livre commencer »' },
  { key: 'outline_shown', label: 'Sommaires affichés' },
  { key: 'wall_shown', label: 'Murs email vus' },
  { key: 'email_captured', label: 'Emails laissés (leads)' },
  { key: 'commander_click', label: 'Clics vers /commander' },
];

function EssaiFunnelPanel() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('capture_events')
        .select('event_type')
        .eq('surface', 'essai')
        .limit(10000);
      if (error) {
        setCounts({});
        return;
      }
      const map: Record<string, number> = {};
      (data ?? []).forEach((row) => {
        map[row.event_type] = (map[row.event_type] ?? 0) + 1;
      });
      setCounts(map);
    })();
  }, []);

  const first = counts?.[FUNNEL_STEPS[0].key] ?? 0;

  return (
    <Card className="rounded-2xl border-border bg-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Target className="h-5 w-5" /> Le tunnel d'essai, marche par marche
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Chaque ligne se remplit en temps réel. La marche qui chute est celle à corriger.
      </p>
      {counts === null ? (
        <p className="mt-4 text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <ul className="mt-4 space-y-2 text-sm">
          {FUNNEL_STEPS.map((step) => {
            const value = counts[step.key] ?? 0;
            const pct = first > 0 ? Math.round((value / first) * 100) : 0;
            return (
              <li key={step.key} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{step.label}</span>
                <span className="font-semibold text-foreground">
                  {value}
                  {first > 0 && <span className="ml-2 text-xs text-muted-foreground">{pct} %</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function NewsletterCard({ newsletter }: { newsletter: Newsletter }) {
  const text = newsletterToText(newsletter);
  const buttons: Array<{ slot: 'cta1' | 'cta2'; label: string; url: string; key: string }> = [
    {
      slot: 'cta1',
      label: newsletter.cta.label,
      url: newsletterShortUrl(newsletter, 'cta1'),
      key: newsletterShortKey(newsletter, 'cta1'),
    },
  ];
  if (newsletter.cta2) {
    buttons.push({
      slot: 'cta2',
      label: newsletter.cta2.label,
      url: newsletterShortUrl(newsletter, 'cta2'),
      key: newsletterShortKey(newsletter, 'cta2'),
    });
  }

  return (
    <Card className="rounded-2xl border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="rounded-full">Newsletter {newsletter.number}</Badge>
        <Badge variant="outline" className="rounded-full">
          <Clock className="mr-1.5 h-3 w-3" />
          {newsletter.sendDate} — {newsletter.sendTime}
        </Badge>
        <Badge variant="outline" className="rounded-full">
          <Target className="mr-1.5 h-3 w-3" />
          {newsletter.goal}
        </Badge>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-foreground">{newsletter.subject}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{newsletter.note}</p>

      {/* 1. L'objet */}
      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          1. Objet
        </p>
        <p className="mt-1 text-sm text-foreground">{newsletter.subject}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <CopyButton value={newsletter.subject} label="Copier l'objet" />
          <CopyButton value={newsletter.preheader} label="Copier le pré-header" />
        </div>
      </div>

      {/* 2. Le texte du corps */}
      <div className="mt-3 rounded-xl border border-border bg-muted/30 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          2. Texte à coller dans Systeme.io
        </p>
        <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-background p-3 text-sm leading-relaxed text-foreground">
          {text}
        </pre>
        <div className="mt-2">
          <CopyButton value={text} label="Copier le texte" variant="default" />
        </div>
      </div>

      {/* 3. Les boutons */}
      <div className="mt-3 rounded-xl border border-border bg-muted/30 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          3. Bouton{buttons.length > 1 ? 's' : ''} Systeme.io
        </p>
        {buttons.map((btn, i) => (
          <div key={btn.slot} className={i === 0 ? 'mt-1' : 'mt-4'}>
            <p className="text-sm text-foreground">
              Libellé : <strong>{btn.label}</strong>
            </p>
            <p className="mt-1 break-all text-sm text-muted-foreground">
              Champ URL : <code>{btn.url}</code>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <CopyButton value={btn.label} label="Copier le libellé" />
              <CopyButton value={btn.url} label="Copier le lien court" />
              <Button asChild size="sm" variant="ghost" className="rounded-xl">
                <a href={`/r/${btn.key}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Tester le lien
                </a>
              </Button>
            </div>
          </div>
        ))}
        <p className="mt-3 text-xs text-muted-foreground">
          Ces liens courts comptent le clic puis redirigent aussitôt vers{' '}
          {buttons.map((b) => newsletterDestination(b.url)).join(' et ')}. Ne les remplacez jamais
          par un lien direct : le clic ne serait plus mesuré.
        </p>
      </div>
    </Card>
  );
}


function NewslettersPanel() {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card p-6">
        <Badge className="rounded-full">Nouveaux emails Systeme.io</Badge>
        <h2 className="mt-3 text-xl font-bold text-foreground">
          5 newsletters datées — septembre 2026
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ce sont des diffusions ponctuelles à programmer aux dates indiquées, en plus de la
          campagne automatique. Expéditeur : <strong>{NEWSLETTER_SENDER}</strong> · cible :{' '}
          <strong>{NEWSLETTER_TAG}</strong> · exclusion : <strong>{NEWSLETTER_EXCLUDE_TAG}</strong>.
        </p>
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
          {NEWSLETTERS.map((n) => (
            <li key={n.id}>
              <strong className="text-foreground">{n.sendDate}</strong> — {n.subject}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="rounded-2xl border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Mode d'emploi</h2>
        <div className="mt-4 space-y-3 text-sm">
          {NEWSLETTER_HOWTO.map((item) => (
            <div key={item.title}>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </Card>

      <NewsletterClicksPanel />

      <NewsletterEngagementPanel />

      {NEWSLETTERS.map((n) => (
        <NewsletterCard key={n.id} newsletter={n} />
      ))}
    </div>
  );
}

export default function AdminSequenceEmailPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>

        <AdminPanelNav />

        <Tabs defaultValue="newsletters" className="space-y-6">
          <TabsList className="rounded-xl">
            <TabsTrigger value="newsletters" className="rounded-lg">
              Nouveaux emails Systeme.io
            </TabsTrigger>
            <TabsTrigger value="campagne" className="rounded-lg">
              Campagne automatique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="newsletters" className="space-y-6">
            <NewslettersPanel />
          </TabsContent>

          <TabsContent value="campagne" className="space-y-6">
            <Card className="rounded-2xl border-border bg-card p-6">
              <Badge className="rounded-full">Campagne unique</Badge>
              <h1 className="mt-3 text-2xl font-bold text-foreground">{CAMPAGNE.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Un seul tag Systeme.io : <strong>{CAMPAGNE.tag}</strong>. Un seul lien par email.
                Les trois premiers emails renvoient sur la page d'essai (idée → titre, sommaire et
                chapitre 1, puis mur email), les deux derniers sur la commande à {CAMPAGNE.price}.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Les envois partent uniquement de Systeme.io (contact@ebookstudio-mail.fr) : ici on
                copie l'objet et le corps de chaque email. L'application n'envoie plus aucune
                campagne de masse ; Resend reste réservé aux emails de service (codes d'accès,
                confirmations de paiement).
              </p>
            </Card>

            <FunnelUnifiedPanel />

            <EssaiFunnelPanel />

            <Card className="rounded-2xl border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Gift className="h-5 w-5" /> Les bonus offerts à l'inscription — {BONUS_TOTAL_VALUE}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {CAMPAGNE_BONUSES.map((bonus) => (
                  <li key={bonus.key}>
                    <strong className="text-foreground">{bonus.title}</strong> — {bonus.value} ·{' '}
                    {bonus.to}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
