import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LANCEMENT_FIN_ISO, LANCEMENT_FIN_LABEL, LANCEMENT_PLACES, LANCEMENT_PRIX,
  LANCEMENT_APRES_LABEL,
} from '@/data/lancementTunnel';

function remaining(now: number) {
  const ms = Math.max(0, Date.parse(LANCEMENT_FIN_ISO) - now);
  const s = Math.floor(ms / 1000);
  return { ms, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Bandeau sobre de l'offre de lancement, avec compte à rebours réel. */
export default function LancementOfferBanner({ source }: { source?: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const r = remaining(now);
  const href = `/lancement/offres${source ? `?source=${encodeURIComponent(source)}` : ''}#offres`;

  if (r.ms === 0) {
    return (
      <div className="w-full border-b border-primary/20 bg-primary/5 px-4 py-3 text-center text-sm text-foreground">
        L'offre de lancement est terminée. {LANCEMENT_APRES_LABEL.replace('À partir du 16 octobre 2026 : a', 'A')}
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="w-full border-b border-primary/25 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-3 text-center md:flex-row md:justify-between md:text-left">
        <p className="text-sm text-foreground md:text-[15px]">
          <span className="mr-2 inline-block rounded-full border border-primary/40 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Offre de lancement
          </span>
          <strong className="font-serif">Édition à vie, {LANCEMENT_PRIX} € une seule fois</strong>
          <span className="text-muted-foreground"> — {LANCEMENT_PLACES} places, jusqu'au {LANCEMENT_FIN_LABEL}</span>
        </p>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 font-mono text-sm tabular-nums" aria-label="Temps restant">
            {[[r.d, 'j'], [r.h, 'h'], [r.m, 'min'], [r.s, 's']].map(([v, u]) => (
              <span key={u as string} className="rounded-md border bg-card px-2 py-1">
                {pad(v as number)}<span className="ml-0.5 text-[10px] text-muted-foreground">{u}</span>
              </span>
            ))}
          </div>
          <Link to={href} className="whitespace-nowrap text-sm font-semibold text-primary underline-offset-4 hover:underline">
            J'en profite →
          </Link>
        </div>
      </div>
    </div>
  );
}
