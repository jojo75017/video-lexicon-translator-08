import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Crown } from 'lucide-react';
import useLaunchSettings from '@/hooks/useLaunchSettings';

/** Fin de l'offre 47 € à vie : 30 septembre 2026, 23h59 heure de Paris. */
const DEADLINE = new Date('2026-09-30T23:59:59+02:00').getTime();

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
 * Bandeau de lancement : rappelle la fin de l'accès à vie à 47 € (30 septembre)
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
        background: 'var(--v3-editorial-ink)',
        borderBottom: '1px solid var(--v3-gold)',
      }}
      aria-label="Lancement EbookStudio V3"
    >
      <div className={`mx-auto max-w-7xl px-5 md:px-8 ${compact ? 'py-2' : 'py-2.5'}`}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className="inline-flex items-center gap-1.5 border-r pr-3 text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--v3-gold)', borderColor: 'color-mix(in srgb, var(--v3-gold) 45%, transparent)' }}
            >
              <Crown className="h-3 w-3" /> Lancement V3
            </span>
            <h2 className="text-[13px] font-semibold leading-snug text-primary-foreground sm:text-[14px]">
              <strong style={{ color: 'var(--v3-gold)' }}>47 € à vie jusqu’au 30 septembre</strong>
              <span className="hidden sm:inline"> — ouverture V3 le 1<sup>er</sup> octobre, 1<sup>er</sup> mois offert</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5" aria-label="Temps restant">
            {t.over ? (
              <span className="rounded px-2 py-1 text-[11px] font-semibold text-primary-foreground/90" style={{ background: 'color-mix(in srgb, var(--v3-gold) 12%, transparent)' }}>
                Offre 47 € terminée — rendez-vous le 1<sup>er</sup> octobre
              </span>
            ) : (
              cells.map((c) => (
                <div
                  key={c.label}
                  className="min-w-[38px] rounded px-1.5 py-1 text-center"
                  style={{ background: 'color-mix(in srgb, var(--v3-gold) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--v3-gold) 35%, transparent)' }}
                >
                  <div className="text-[13px] font-bold leading-none" style={{ color: 'var(--v3-gold)' }}>
                    {String(c.value).padStart(2, '0')}
                  </div>
                  <div className="mt-0.5 text-[7px] uppercase tracking-[0.12em] text-primary-foreground/60">{c.label}</div>
                </div>
              ))
            )}
            <Link to="/essai" className="ml-1 inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-bold" style={{ background: 'var(--v3-gold)', color: 'var(--v3-editorial-ink)' }}>
              <Rocket className="h-3.5 w-3.5" /> Essayer gratuitement
            </Link>
            <Link to="/v3/attente" className="px-2 text-[10.5px] font-semibold text-primary-foreground/80 underline underline-offset-4">
              Réserver ma place
            </Link>
            <Link to="/commander" className="px-2 text-[10.5px] font-semibold text-primary-foreground/80 underline underline-offset-4">
              Accès à vie 47 €
            </Link>
            {video && <a href={video} target="_blank" rel="noopener noreferrer" className="sr-only">Voir la vidéo de lancement</a>}
          </div>
        </div>
      </div>
    </section>
  );
}
