import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, Loader2, Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Inscription à l'essai gratuit 7 jours (page publique).
 *
 * Lovable gère uniquement : inscription, accès 7 jours, expiration et
 * envoi du contact vers Systeme.io (tag ESSAI_EBOOKSTUDIO).
 * Les emails marketing sont pilotés dans Systeme.io.
 */
const INCLUDED = [
  '1 livre complet (sommaire IA + chapitres)',
  'Correction professionnelle éditoriale',
  'Sauvegarde et prévisualisation du livre',
  'Export PDF / DOCX (avec filigrane d’essai)',
];

const LOCKED = [
  'Deuxième livre',
  'Cover Studio Pro',
  'Audio / audiobook',
  'KDP Pilot',
  'Traductions 10 langues',
  'Livres de jeux & histoires courtes',
  'Export sans filigrane',
];

const EssaiGratuit7JoursPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [done, setDone] = useState<{ endsAt: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAlreadyUsed(false);
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const { data, error: fnError } = await supabase.functions.invoke('free-trial-signup', {
        body: {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim(),
          website: honeypot,
          utm_source: params.get('utm_source'),
          utm_campaign: params.get('utm_campaign'),
          landing_url: window.location.href,
        },
      });
      if (fnError) throw fnError;
      if (data?.ok) {
        setDone({ endsAt: data.endsAt });
      } else if (data?.alreadyUsed) {
        setAlreadyUsed(true);
        setError(data.error ?? 'Cet email a déjà utilisé son essai gratuit.');
      } else {
        setError(data?.error ?? 'Inscription impossible. Réessayez dans un instant.');
      }
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion et réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase text-primary">Sans carte bancaire</p>
        </div>
        <h1 className="mt-2 text-center text-3xl font-bold text-foreground md:text-4xl">
          Essai gratuit 7 jours
        </h1>
        <p className="mt-3 text-center text-muted-foreground">
          Écrivez votre premier livre complet avec EbookStudio. Sans carte bancaire.
        </p>

        {done ? (
          <section className="mt-10 rounded-lg border border-border bg-card p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold text-card-foreground">Votre essai est ouvert</h2>
            <p className="mt-2 text-muted-foreground">
              Vous avez jusqu’au{' '}
              <strong>{new Date(done.endsAt).toLocaleDateString('fr-FR')}</strong> pour créer votre livre.
              Vos accès et la marche à suivre arrivent par email dans quelques minutes.
            </p>
            <Button asChild className="mt-6 min-h-11 px-6">
              <Link to="/v3">Commencer mon livre</Link>
            </Button>
          </section>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm md:p-8"
          >
            <label className="block text-sm font-medium text-foreground" htmlFor="trial-first-name">Prénom</label>
            <div className="mt-1 flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="trial-first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
                className="w-full bg-transparent py-3 text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Marie"
              />
            </div>

            <label className="mt-5 block text-sm font-medium text-foreground" htmlFor="trial-email">Email</label>
            <div className="mt-1 flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="trial-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-transparent py-3 text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="vous@exemple.fr"
              />
            </div>

            {/* Piège anti-robot (invisible pour l'utilisateur) */}
            <input
              type="text"
              tabIndex={-1}
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              autoComplete="off"
            />

            {error && (
              <div className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground" role="alert">
                <p>{error}</p>
                {alreadyUsed && (
                  <Button asChild className="mt-3 min-h-11">
                    <Link to="/commander">Voir l’offre complète</Link>
                  </Button>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-6 min-h-11 w-full"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Création de votre essai…' : 'Démarrer mes 7 jours gratuits'}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Un seul essai gratuit par adresse email. Aucune carte bancaire demandée.
            </p>
          </form>
        )}

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="font-semibold text-primary">Inclus pendant l’essai</h2>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              {INCLUDED.map((i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="font-semibold text-foreground">Réservé aux abonnés</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {LOCKED.map((i) => (
                <li key={i} className="flex gap-2">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          À la fin des 7 jours, votre livre reste visible en lecture seule : rien n’est supprimé.
        </p>
      </div>
    </main>
  );
};

export default EssaiGratuit7JoursPage;
