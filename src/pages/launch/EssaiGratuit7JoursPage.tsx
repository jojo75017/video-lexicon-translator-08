import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, Loader2, Lock, Mail, User } from 'lucide-react';

/**
 * Inscription à l'essai gratuit 7 jours (page publique).
 *
 * Lovable gère uniquement : inscription, accès 7 jours, expiration et
 * envoi du contact vers Systeme.io (tag ESSAI_EBOOKSTUDIO).
 * Les emails marketing sont pilotés dans Systeme.io.
 */
const AMBER = '#E8951E';
const INK = '#2A2118';

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
    <main className="min-h-screen bg-[#0E0B08] text-[#F6EFE6] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center" style={{ color: AMBER }}>
          Essai gratuit 7 jours
        </h1>
        <p className="mt-3 text-center text-[#D8CCBC]">
          Écrivez votre premier livre complet avec EbookStudio. Sans carte bancaire.
        </p>

        {done ? (
          <section className="mt-10 rounded-2xl border border-[#2E241A] bg-[#171208] p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
            <h2 className="mt-4 text-2xl font-semibold">Votre essai est ouvert</h2>
            <p className="mt-2 text-[#D8CCBC]">
              Vous avez jusqu’au{' '}
              <strong>{new Date(done.endsAt).toLocaleDateString('fr-FR')}</strong> pour créer votre livre.
              Vos accès et la marche à suivre arrivent par email dans quelques minutes.
            </p>
            <Link
              to="/v3"
              className="mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-[#1A1206]"
              style={{ background: AMBER }}
            >
              Commencer mon livre
            </Link>
          </section>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 rounded-2xl border border-[#2E241A] bg-[#171208] p-6 md:p-8"
          >
            <label className="block text-sm text-[#D8CCBC]" htmlFor="trial-first-name">Prénom</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-[#3A2C1D] bg-[#0F0B06] px-3">
              <User className="h-4 w-4 text-[#8A7A66]" />
              <input
                id="trial-first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
                className="w-full bg-transparent py-3 outline-none"
                placeholder="Marie"
              />
            </div>

            <label className="mt-5 block text-sm text-[#D8CCBC]" htmlFor="trial-email">Email</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-[#3A2C1D] bg-[#0F0B06] px-3">
              <Mail className="h-4 w-4 text-[#8A7A66]" />
              <input
                id="trial-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-transparent py-3 outline-none"
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
              <div className="mt-5 rounded-lg border border-amber-600/40 bg-amber-900/20 p-4 text-sm">
                <p>{error}</p>
                {alreadyUsed && (
                  <Link
                    to="/commander"
                    className="mt-3 inline-block rounded-lg px-4 py-2 font-semibold text-[#1A1206]"
                    style={{ background: AMBER }}
                  >
                    Voir l’offre complète
                  </Link>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-[#1A1206] disabled:opacity-60"
              style={{ background: AMBER }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Création de votre essai…' : 'Démarrer mes 7 jours gratuits'}
            </button>
            <p className="mt-3 text-center text-xs text-[#9C8B77]">
              Un seul essai gratuit par adresse email. Aucune carte bancaire demandée.
            </p>
          </form>
        )}

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#2E241A] bg-[#12100A] p-6">
            <h2 className="font-semibold" style={{ color: AMBER }}>Inclus pendant l’essai</h2>
            <ul className="mt-3 space-y-2 text-sm text-[#D8CCBC]">
              {INCLUDED.map((i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#2E241A] bg-[#12100A] p-6">
            <h2 className="font-semibold text-[#C9B79E]">Réservé aux abonnés</h2>
            <ul className="mt-3 space-y-2 text-sm text-[#A8998A]">
              {LOCKED.map((i) => (
                <li key={i} className="flex gap-2">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-[#9C8B77]" style={{ color: undefined }}>
          À la fin des 7 jours, votre livre reste visible en lecture seule : rien n’est supprimé.
        </p>
        <p className="sr-only" style={{ color: INK }}>EbookStudio essai gratuit</p>
      </div>
    </main>
  );
};

export default EssaiGratuit7JoursPage;
