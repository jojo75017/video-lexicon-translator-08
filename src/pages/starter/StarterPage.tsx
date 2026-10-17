// Tunnel EbookStudio Starter — /starter : capture (5 niches offertes) puis offre 27 € à vie.
// Présentation seulement : la vente n'est pas ouverte tant que Georges ne l'a pas validée.
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { usePageMeta } from '@/hooks/usePageMeta';
import { trackCaptureEvent } from '@/lib/captureTracking';
import { getNiches5Pack, NICHES_5_LEAD_MAGNET, readNiches5Email, rememberNiches5Email } from '@/lib/nichesPack5';

export const STARTER_PRIX = 27;
/** Passe à true seulement après validation explicite de Georges. */
export const STARTER_VENTE_OUVERTE = true;

const INCLUS = [
  '✍️ La rédaction guidée de votre livre en français : titre, plan et chapitres',
  '📑 Le sommaire créé automatiquement',
  '🔢 La numérotation des pages faite pour vous',
  '🎨 Des modèles de mise en page propres et prêts à l’emploi',
  '📄 L’export Word (DOCX) pour relire et retoucher dans Word ou Google Docs',
  '📕 L’export PDF pour lire, offrir ou vendre votre livre',
  '♾️ L’accès à vie : vous payez une fois, l’outil reste à vous',
];

export default function StarterPage({ offerOnly = false }: { offerOnly?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const offersUrl = `/lancement/offres${location.search}`;
  const paymentUrl = (plan: string) => {
    const params = new URLSearchParams(location.search);
    params.set("plan", plan);
    const capturedEmail = readNiches5Email();
    if (capturedEmail) params.set("email", capturedEmail);
    return `/paiement-offre?${params.toString()}`;
  };
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [inscrit, setInscrit] = useState(() => !!readNiches5Email());
  const niches = getNiches5Pack();

  usePageMeta({
    title: 'EbookStudio Starter — votre livre pour 27 € à vie',
    description: '5 niches Amazon offertes, puis EbookStudio Starter : rédaction guidée, sommaire, export Word et PDF, 27 € une seule fois.',
    canonical: `https://ebookstudio.fr${offerOnly ? '/lancement/offres' : '/lancement'}`,
  });

  useEffect(() => { void trackCaptureEvent('lancement', 'page_view', { leadMagnet: NICHES_5_LEAD_MAGNET }); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Merci d’indiquer un email valide.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('funnel-capture-lead', {
        body: { email: email.trim().toLowerCase(), first_name: firstName.trim() || null, source: 'starter-27', lead_magnet: NICHES_5_LEAD_MAGNET },
      });
      if (error) throw new Error(error.message);
      rememberNiches5Email(email);
      void trackCaptureEvent('lancement', 'email_captured', { leadMagnet: NICHES_5_LEAD_MAGNET });
      setInscrit(true);
      navigate(offersUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error('Enregistrement impossible pour le moment. Réessayez dans un instant.');
    } finally { setLoading(false); }
  };

  if (!offerOnly && !inscrit) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 text-foreground md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-start">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">🎁 5 niches Amazon offertes</span>
            <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">EbookStudio Starter — écrivez votre premier livre</h1>
            <p className="mt-5 text-lg text-muted-foreground">Recevez 5 niches qui vendent sur Amazon KDP, tirées de notre base de 600 niches, avec le mot-clé à viser pour chacune.</p>
            <p className="mt-4 text-xl font-semibold text-primary">27 € à vie · Export Word et PDF inclus</p>
            <ul className="mt-8 space-y-3">
              {['Une niche par grande catégorie qui vend', 'Le mot-clé Amazon à viser', 'Le niveau de concurrence', 'Un angle de livre conseillé'].map((b) => (
                <li key={b} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{b}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-lg md:p-8">
            <h2 className="text-xl font-bold md:text-2xl">Recevez vos 5 niches offertes</h2>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Input placeholder="Votre prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
              <Input type="email" required placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Je reçois mes 5 niches
              </Button>
            </form>
            <Button asChild variant="outline" className="mt-4 w-full"><Link to={offersUrl}>Découvrir directement Starter à 27 €</Link></Button>
            <p className="mt-4 text-center text-sm"><Link to="/connexion-abonne" className="text-primary underline">Déjà client ? Me connecter</Link></p>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4" />Aucune carte demandée. Désinscription en un clic.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-3xl">
        {inscrit && <p className="rounded-lg bg-primary/10 p-3 text-center font-semibold text-primary">✅ C’est noté ! Vos 5 niches offertes sont juste en dessous.</p>}
        <h1 className="mt-8 text-center text-3xl font-bold md:text-4xl">EbookStudio Starter — votre premier livre pour 27 € à vie</h1>
        <p className="mt-4 text-center text-lg text-muted-foreground">Avec <strong>EbookStudio Starter</strong>, transformez une de ces niches en livre complet, prêt à publier, pour <strong>{STARTER_PRIX} € une seule fois</strong>. Accès à vie, sans abonnement.</p>

        <section className="mt-8 rounded-2xl border bg-card p-6 shadow-lg">
          <ul className="space-y-2">{INCLUS.map((i) => <li key={i}>{i}</li>)}</ul>
          <div className="mt-6 text-center">

            <p className="text-4xl font-bold text-primary">{STARTER_PRIX} € à vie</p>
            <p className="mt-1 text-sm text-muted-foreground">Moins cher qu’un restaurant, pour un livre qui porte votre nom.</p>
            {STARTER_VENTE_OUVERTE ? (
              <Button asChild size="lg" className="mt-5 w-full md:w-auto">
                <Link to={paymentUrl("starter27_1x")}>👉 Je crée mon premier livre pour {STARTER_PRIX} €</Link>
              </Button>
            ) : (
              <Button size="lg" className="mt-5 w-full md:w-auto" disabled><Lock className="mr-2 h-4 w-4" />Ouverture prochainement</Button>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Paiement unique et sécurisé • Aucun abonnement caché</p>
          </div>
        </section>

        <section className="mt-8 border-y py-6">
          <h2 className="text-xl font-bold">Et ensuite ?</h2>
          <p className="mt-2 text-muted-foreground">Quand vous voudrez aller plus loin, vous pourrez débloquer en un clic :</p>
          <ul className="mt-3 space-y-2">
            <li>📚 <strong>Cover Studio Pro (47 €)</strong> : la couverture brochée complète, dos et quatrième, pour Amazon KDP</li>
            <li>🚀 <strong>Plan Auteur (97 €/an)</strong> : les 15 spécialistes IA, toutes les couvertures et la suite complète</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="outline"><Link to={`/v3/cover-pro${location.search}`}>Découvrir Cover Studio Pro</Link></Button><Button asChild><Link to={paymentUrl("auteur97_1x")}>Passer au plan Auteur · 97 €/an</Link></Button></div>
        </section>

        {inscrit ? <section className="mt-8">
          <h2 className="text-2xl font-bold">🎁 Vos 5 niches offertes</h2>
          <div className="mt-4 grid gap-4">
            {niches.map((n) => (
              <article key={n.niche} className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">{n.categoryLabel}</p>
                <h3 className="text-lg font-semibold">{n.niche}</h3>
                <p className="text-sm">Mot-clé : « {n.motCleAmazon} » • Concurrence : {n.concurrence}</p>
                <p className="mt-1 text-sm text-muted-foreground">{n.angle}</p>
              </article>
            ))}
          </div>
        </section> : <p className="mt-8 text-center"><Link to={`/lancement${location.search}`} className="text-primary underline">Recevoir mes 5 niches gratuites</Link></p>}

        <p className="mt-10 text-center text-sm"><Link to="/" className="text-muted-foreground underline">Non merci, je garde seulement mes 5 niches</Link></p>
      </div>
    </main>
  );
}
