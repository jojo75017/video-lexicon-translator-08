import { useEffect } from 'react';
import { SHORT_LINKS } from '@/data/campagneUnique';

/**
 * Route publique /r et /r/:cle — relais de clic sur le domaine ebookstudio.fr.
 * Enregistre le clic (appel non bloquant) puis redirige vers la destination.
 * En cas d'échec du suivi, la redirection a lieu quand même.
 *
 * Deux formes acceptées :
 * - /r/essai1        → lien court des emails Systeme.io (texte simple)
 * - /r?u=…&e=…&s=…&t=…  → ancien format des newsletters HTML
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const DEFAULT_DESTINATION = '/commander';

/** Une balise de fusion non remplacée ({{contact.email}}) n'est pas un email. */
const cleanEmail = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes('{{') || !trimmed.includes('@')) return '';
  return trimmed;
};

const RedirectClickPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Clé courte : /r/essai1 (le segment après /r)
    const segments = window.location.pathname.split('/').filter(Boolean);
    const shortKey = segments[0] === 'r' && segments[1] ? segments[1] : '';
    const short = shortKey ? SHORT_LINKS[shortKey] : undefined;

    const email = cleanEmail(params.get('e') || params.get('email') || '');
    const step = params.get('s') || shortKey;
    const template = params.get('t') || short?.template || shortKey;
    const raw = params.get('u') || short?.destination || '';

    // Destination : URL interne ou absolue sur notre domaine uniquement
    let destination = DEFAULT_DESTINATION;
    try {
      if (raw) {
        const url = new URL(raw, window.location.origin);
        if (url.origin === window.location.origin || url.hostname.endsWith('ebookstudio.fr')) {
          destination = url.pathname + url.search + url.hash;
        }
      }
    } catch {
      /* on garde la destination par défaut */
    }
    const sep = destination.includes('?') ? '&' : '?';
    // On transmet l'email du prospect à la destination : le ReadingGate le
    // reconnaît et ne lui redemande jamais son email (il l'a déjà donné).
    const emailParam = email ? `&email=${encodeURIComponent(email)}` : '';
    const finalUrl = `${destination}${sep}src=email${template ? `&t=${encodeURIComponent(template)}` : ''}${emailParam}`;

    // Suivi non bloquant, y compris sans email identifié (Systeme.io en texte
    // simple ne transmet pas toujours le contact) : la fonction enregistre
    // alors un clic anonyme, ce qui reste mesurable par destination.
    // sendBeacon survit à la navigation : avec fetch(), la redirection
    // annulait l'appel et une partie des clics n'était jamais comptée.
    if (SUPABASE_URL) {
      const trackUrl = `${SUPABASE_URL}/functions/v1/track-email-click?e=${encodeURIComponent(email)}&s=${encodeURIComponent(step)}&t=${encodeURIComponent(template)}&u=${encodeURIComponent('https://ebookstudio.fr' + finalUrl)}&noredirect=1`;
      try {
        const sent = navigator.sendBeacon?.(trackUrl);
        if (!sent) fetch(trackUrl, { mode: 'no-cors', keepalive: true }).catch(() => {});
      } catch {
        /* silencieux */
      }
    }

    // Redirection immédiate : sendBeacon survit à la navigation, inutile d'attendre.
    window.location.replace(finalUrl);
  }, []);

  return (
    <main
      style={{ background: '#FAFAFA', color: '#232F3E' }}
      className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center"
    >
      <h1 className="text-lg font-semibold">Ouverture de votre page…</h1>
      <p className="text-sm opacity-70">
        Si rien ne se passe,{' '}
        <a href="/essai" style={{ color: '#008296' }} className="underline">
          cliquez ici pour écrire votre chapitre 1
        </a>
        .
      </p>
    </main>
  );
};

export default RedirectClickPage;
