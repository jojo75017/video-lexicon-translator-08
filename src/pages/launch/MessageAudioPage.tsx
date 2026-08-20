import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, ArrowLeft, Calendar, Clock, Rocket } from 'lucide-react';
import useLaunchSettings from '@/hooks/useLaunchSettings';

/** Page d'écoute du message audio de lancement. Utilisée depuis les emails. */
export default function MessageAudioPage() {
  const { settings, loading } = useLaunchSettings();
  const url = String(settings.launch_video?.url || '').trim();
  const isAudio = url.endsWith('.mp3') || settings.launch_video?.kind === 'audio';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Écoutez le message — EbookStudio';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        "Message audio de 2 minutes : pourquoi EbookStudio change la publication sur Amazon, et comment prendre l'accès à vie à 47 € avant le 31 août.",
      );
    }
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  if (!url || !isAudio) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
        <main className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h1 className="v3-serif text-2xl font-bold text-[#2A2118]">Message non disponible</h1>
          <p className="mt-3 text-[#5B5245]">Le message audio n'est pas encore en ligne.</p>
          <Link to="/commander" className="mt-6 inline-block rounded-xl bg-[#0F2E1F] px-5 py-2.5 text-sm font-semibold text-white">
            Voir l'offre 47 €
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link to="/" className="v3-serif text-lg font-bold text-[#2A2118]">EbookStudio</Link>
          <button
            onClick={() => void copyLink()}
            className="text-xs font-semibold text-[#0F2E1F] underline underline-offset-4"
          >
            {copied ? 'Lien copié' : 'Copier le lien'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12">
        <div className="rounded-2xl border-2 border-[#D4AF37]/40 bg-[#0F2E1F] p-8 text-white shadow-lg">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
            <Headphones className="h-3.5 w-3.5" /> Message audio — 2 minutes
          </span>
          <h1 className="v3-serif mt-4 text-3xl font-bold leading-tight md:text-4xl">
            Pourquoi EbookStudio change la publication sur Amazon
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
            Écoutez le message ci-dessous. Ensuite, choisissez : essayer gratuitement votre premier chapitre,
            ou prendre l'accès à vie à 47 € avant le <strong>31 août à minuit</strong>.
          </p>

          <div className="mt-6 rounded-xl bg-white/10 p-4">
            <audio controls className="w-full" preload="metadata">
              <source src={url} type="audio/mpeg" />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#D4AF37]" /> ~2 minutes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#D4AF37]" /> Fin le 31 août 2026
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/commander"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-[#2A2118] transition hover:brightness-110"
            >
              <Rocket className="h-4 w-4" /> Accès à vie 47 €
            </Link>
            <Link
              to="/essai"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Rocket className="h-4 w-4" /> Essayer gratuitement
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/commander" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F2E1F] underline underline-offset-4">
            <ArrowLeft className="h-4 w-4" /> Retour à l'offre
          </Link>
        </div>
      </main>
    </div>
  );
}
