import { useEffect } from 'react';

/**
 * Route publique /r — relais de clic sur le domaine ebookstudio.fr.
 * Enregistre le clic (appel non bloquant) puis redirige vers la destination.
 * En cas d'échec du suivi, la redirection a lieu quand même.
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const DEFAULT_DESTINATION = '/commander';

const RedirectClickPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('e') || '';
    const step = params.get('s') || '';
    const template = params.get('t') || '';
    const raw = params.get('u') || '';

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
    const finalUrl = `${destination}${sep}src=email${template ? `&t=${encodeURIComponent(template)}` : ''}`;

    // Suivi non bloquant
    if (SUPABASE_URL && email) {
      const trackUrl = `${SUPABASE_URL}/functions/v1/track-email-click?e=${encodeURIComponent(email)}&s=${encodeURIComponent(step)}&t=${encodeURIComponent(template)}&u=${encodeURIComponent('https://ebookstudio.fr' + finalUrl)}&noredirect=1`;
      try {
        fetch(trackUrl, { mode: 'no-cors', keepalive: true }).catch(() => {});
      } catch {
        /* silencieux */
      }
    }

    const timer = window.setTimeout(() => window.location.replace(finalUrl), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main
      style={{ background: '#FAFAFA', color: '#232F3E' }}
      className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center"
    >
      <h1 className="text-lg font-semibold">Ouverture de votre offre…</h1>
      <p className="text-sm opacity-70">
        Si rien ne se passe,{' '}
        <a href={DEFAULT_DESTINATION} style={{ color: '#008296' }} className="underline">
          cliquez ici pour accéder à la page de commande
        </a>
        .
      </p>
    </main>
  );
};

export default RedirectClickPage;
