import { useLocation } from 'react-router-dom';

/**
 * Global fixed banner announcing the V3 launch on Oct 1st, 2026.
 * Hidden on V3 routes (already promoted there) and on the offer page itself.
 */
export default function V3LaunchGlobalBanner() {
  const { pathname } = useLocation();

  if (pathname.startsWith('/v3')) return null;

  return (
    <a
      href="/v3/offre"
      className="block w-full relative overflow-hidden group"
      style={{
        background: 'linear-gradient(90deg, #0F2E1F 0%, #14532D 50%, #0F2E1F 100%)',
        borderBottom: '1px solid rgba(212,175,55,0.4)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 sm:px-6 text-center">
        <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-full px-2 py-0.5">
          1ᵉʳ Octobre 2026
        </span>
        <p
          className="text-[13px] sm:text-[14px] font-medium text-white"
          style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}
        >
          🚀 <strong className="text-[#D4AF37]">EbookStudio V3</strong> arrive — Plume 17 €/mois · Édition 27 €/mois (2 mois offerts en annuel).{' '}
          <span className="underline decoration-[#D4AF37]/60 underline-offset-2 group-hover:decoration-[#D4AF37]">
            Découvrir l'offre Fondateur →
          </span>
        </p>
      </div>
    </a>
  );
}
