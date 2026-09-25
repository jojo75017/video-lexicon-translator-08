// Page de capture publique du tunnel de lancement — /lancement
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Check, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { trackCaptureEvent } from '@/lib/captureTracking';
import {
  LANCEMENT_HERO,
  LANCEMENT_GARANTIES,
  LANCEMENT_LEAD_SOURCE,
  LANCEMENT_DATE_LABEL,
} from '@/data/lancementTunnel';

export default function LancementCapturePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const source = params.get('source') || '';
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void trackCaptureEvent('lancement', 'page_view');
  }, []);

  const offersUrl = source
    ? `/lancement/offres?source=${encodeURIComponent(source)}`
    : '/lancement/offres';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Merci d’indiquer un email valide.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('funnel-capture-lead', {
        body: {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim() || null,
          source: LANCEMENT_LEAD_SOURCE,
          utm_source: source || null,
          lead_magnet: '10-niches-offertes',
        },
      });
      if (error) throw new Error(error.message);
      void trackCaptureEvent('lancement', 'email_captured');
      try {
        localStorage.setItem('lancement_email', email.trim().toLowerCase());
      } catch { /* stockage indisponible : sans conséquence */ }
      toast.success('C’est noté ! Votre document arrive par email.');
      navigate(offersUrl);
    } catch (err) {
      // Le prospect ne doit jamais être perdu en silence.
      void trackCaptureEvent('lancement', 'error');
      toast.error('Enregistrement impossible pour le moment. Réessayez dans un instant.');
      console.error('Capture lancement échouée:', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Lancement EbookStudio — écrivez et publiez votre livre sur Amazon</title>
        <meta
          name="description"
          content={`Ouverture le ${LANCEMENT_DATE_LABEL} : l'atelier complet pour écrire, corriger, habiller et publier votre livre sur Amazon KDP.`}
        />
        <meta property="og:title" content="Lancement EbookStudio" />
        <meta property="og:url" content="https://ebookstudio.fr/lancement" />
        <link rel="canonical" href="https://ebookstudio.fr/lancement" />
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              {LANCEMENT_HERO.eyebrow}
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
              {LANCEMENT_HERO.title}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">{LANCEMENT_HERO.subtitle}</p>
            <ul className="mt-8 space-y-3">
              {LANCEMENT_HERO.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-lg md:p-8">
            <h2 className="text-xl font-bold md:text-2xl">{LANCEMENT_HERO.formTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{LANCEMENT_HERO.formNote}</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Input
                placeholder="Votre prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
              <Input
                type="email"
                required
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Je veux écrire mon livre
              </Button>
            </form>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Aucune carte demandée à cette étape. Désinscription en un clic.
            </p>
            <div className="mt-6 border-t pt-4 text-sm">
              <Link to={offersUrl} className="font-semibold text-primary hover:underline">
                Voir directement les offres du {LANCEMENT_DATE_LABEL} →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-3 rounded-xl border bg-muted/40 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {LANCEMENT_GARANTIES.map((g) => (
            <div key={g} className="flex gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{g}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
