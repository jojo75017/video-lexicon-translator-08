import { useEffect, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Rocket } from 'lucide-react';
import ReadingGate from '@/components/marketing/ReadingGate';

/** Date de fin de l'offre à 47 € (31 août 2026, 23h59 Paris). */
const DEADLINE = new Date('2026-08-31T23:59:59+02:00').getTime();

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, DEADLINE - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, over: diff <= 0 };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Compte à rebours affiché en haut de chaque fiche. */
export function FicheCountdown({ dark = false }: { dark?: boolean }) {
  const { days, hours, minutes, seconds, over } = useCountdown();
  if (over) {
    return (
      <p className={`text-sm font-semibold ${dark ? 'text-white/80' : 'text-[#5B5245]'}`}>
        L'offre à 47 € est terminée.
      </p>
    );
  }
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-bold ${
        dark ? 'bg-white/10 text-[#D4AF37]' : 'bg-[#0F2E1F]/5 text-[#0F2E1F]'
      }`}
    >
      <Clock className="h-4 w-4" />
      <span>
        Fin de l'offre 47 € : {days} j {pad(hours)} h {pad(minutes)} min {pad(seconds)} s
      </span>
    </div>
  );
}

/** Le bouton unique de chaque fiche : redirige vers /commander en conservant
 *  les paramètres de suivi (src, email) venus de l'email. */
export function FicheCta({
  label = 'Profiter de l’accès à vie à 47 €',
  dark = false,
}: {
  label?: string;
  dark?: boolean;
}) {
  const [params] = useSearchParams();
  const qs = new URLSearchParams();
  const src = params.get('src');
  const email = params.get('email');
  if (src) qs.set('src', src);
  if (email) qs.set('email', email);
  const suffix = qs.toString();
  return (
    <div className="mt-8 text-center">
      <Link
        to={`/commander${suffix ? `?${suffix}` : ''}`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-8 py-4 text-base font-bold text-[#2A2118] shadow-lg transition hover:brightness-110 sm:w-auto"
      >
        <Rocket className="h-5 w-5" /> {label}
      </Link>
      <p className="mt-3 text-xs" style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#5B5245' }}>
        Paiement unique · pas d'abonnement · accès conservé · V3 incluse au 1er octobre
      </p>
    </div>
  );
}


/** Bouton final verrouillé pour les visiteurs inconnus (jamais pour un
 *  prospect venu d'un email, un abonné ou un admin). */
export function FicheCtaGated({
  surface,
  label,
  dark = false,
}: {
  surface: string;
  label?: string;
  dark?: boolean;
}) {
  return (
    <ReadingGate surface={surface} compact title="La suite vous est offerte">
      <FicheCta label={label} dark={dark} />
    </ReadingGate>
  );
}


interface FicheShellProps {
  badge: string;
  title: string;
  children: ReactNode;
  ctaLabel?: string;
  metaTitle?: string;
  metaDescription?: string;
  /** Si présent, le bouton final est verrouillé pour les visiteurs inconnus. */
  gateSurface?: string;
}

/** Gabarit commun des fiches ponts du tunnel email : en-tête sobre,
 *  compte à rebours, contenu pré-vendeur, UN seul bouton vers /commander. */
export default function FicheShell({ badge, title, children, ctaLabel, metaTitle, metaDescription, gateSurface }: FicheShellProps) {
  useEffect(() => {
    if (metaTitle) document.title = metaTitle;
    if (metaDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', metaDescription);
    }
  }, [metaTitle, metaDescription]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <span className="v3-serif text-lg font-bold text-[#2A2118]">EbookStudio</span>
          <FicheCountdown />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12">
        <span className="inline-flex items-center rounded-full bg-[#D4AF37]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a6d1f]">
          {badge}
        </span>
        <h1 className="v3-serif mt-4 text-3xl font-bold leading-tight text-[#2A2118] md:text-4xl">{title}</h1>

        <div className="mt-8 space-y-6">{children}</div>

        <div className="mt-10 rounded-2xl border-2 border-[#D4AF37]/40 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-center gap-3 text-center">
            <span className="text-4xl font-black text-[#0F2E1F]">47 €</span>
            <span className="text-lg text-[#5B5245] line-through">59 €</span>
            <span className="text-sm font-semibold text-[#5B5245]">paiement unique — jusqu'au 31 août</span>
          </div>
          <FicheCta label={ctaLabel} />
        </div>
      </main>
    </div>
  );
}
