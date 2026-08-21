import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, PlayCircle, Crown } from 'lucide-react';
import useLaunchSettings from '@/hooks/useLaunchSettings';

/** Fin de l'offre 47 € à vie : 31 août 2026, 23h59 heure de Paris. */
const DEADLINE = new Date('2026-08-31T23:59:59+02:00').getTime();

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return useMemo(() => {
    const diff = Math.max(0, target - now);
    return {
      over: diff === 0,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }, [now, target]);
}

/**
 * Bandeau de lancement : rappelle la fin de l'accès à vie à 47 € (31 août)
 * et l'ouverture de la V3 le 1er octobre avec le premier mois offert.
 * Affiché en haut de l'accueil V3 et de la page de commande.
 */
export default function V3LaunchBanner({ compact = false }: { compact?: boolean }) {
  const { settings } = useLaunchSettings();
  const video = String(settings.launch_video?.url || '');
  const t = useCountdown(DEADLINE);

  const cells = [
    { value: t.days, label: 'jours' },
    { value: t.hours, label: 'heures' },
    { value: t.minutes, label: 'min' },
    { value: t.seconds, label: 'sec' },
  ];

  return (
    <section
      className="w-full"
      style={{
        background: 'linear-gradient(120deg,#064e3b 0%,#075e4a 55%,#0b3b2f 100%)',
        borderBottom: '2px solid #C9A84C',
      }}
      aria-label="Lancement EbookStudio V3"
    >
      <div className={`mx-auto max-w-6xl px-5 ${compact ? 'py-4' : 'py-6'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1 sm:min-w-[260px]">
            <span
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ background: '#C9A84C', color: '#0b2b22' }}
            >
              <Crown className="h-3 w-3" /> Lancement V3
            </span>
            <h2 className="mt-2 text-[19px] font-bold leading-snug text-white sm:text-[22px]">
              47 € à vie jusqu’au 31 août —{' '}
              <span style={{ color: '#F1DFA6' }}>la V3 ouvre le 1er octobre, 1<sup>er</sup> mois offert</span>
            </h2>
            {!compact && (
              <p className="mt-1 text-[13px] leading-relaxed text-white/80">
                Après le 31 août, plus de paiement unique : uniquement l’abonnement. Inscriptions à la V3 dès
                le 1<sup>er</sup> septembre.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2" aria-label="Temps restant">
            {t.over ? (
              <span className="rounded bg-white/10 px-3 py-2 text-[13px] font-semibold text-white">
                Offre 47 € terminée — rendez-vous le 1<sup>er</sup> octobre
              </span>
            ) : (
              cells.map((c) => (
                <div
                  key={c.label}
                  className="min-w-[54px] rounded-lg px-2 py-1.5 text-center"
                  style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(201,168,76,0.45)' }}
                >
                  <div className="text-[19px] font-bold leading-none" style={{ color: '#F1DFA6' }}>
                    {String(c.value).padStart(2, '0')}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/70">{c.label}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <Link
            to="/essai"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-bold"
            style={{ background: '#C9A84C', color: '#0b2b22' }}
          >
            <Rocket className="h-4 w-4" /> Essayer le chapitre 1 gratuit
          </Link>
          <Link
            to="/v3/attente"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold text-white"
            style={{ border: '1px solid rgba(255,255,255,0.45)' }}
          >
            <Crown className="h-4 w-4" /> Réserver ma place (1<sup>er</sup> mois offert)
          </Link>
          <Link
            to="/commander"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold text-white/90 underline decoration-[#C9A84C] underline-offset-4"
          >
            Accès à vie 47 € avant le 31 août
          </Link>
          {video && (
            <a
              href={video}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold text-white"
              style={{ border: '1px solid rgba(201,168,76,0.6)' }}
            >
              <PlayCircle className="h-4 w-4" /> Voir la vidéo (2 min)
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
