import { Crown, Sparkles } from 'lucide-react';
import { useV3Mode } from '@/hooks/useV3Mode';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#f0d78c';
const ORANGE = '#FF9E2D';

export function V2V3FloatingSwitch() {
  const { isAdmin, checking, v3Mode, setV3Mode } = useV3Mode();

  if (checking || !isAdmin) return null;

  return (
    <button
      type="button"
      onClick={() => setV3Mode(!v3Mode)}
      aria-label={v3Mode ? 'Basculer vers Ebookstudio Pro V2' : 'Basculer vers Ebookstudio Pro V3'}
      title="Bascule V2 / V3 — importante"
      className="fixed right-5 top-24 z-[9998] inline-flex min-h-14 items-center gap-3 rounded-full border-2 px-5 py-3 text-sm font-black shadow-2xl transition-all duration-200 hover:scale-[1.03] md:right-6"
      style={{
        borderColor: v3Mode ? GOLD : ORANGE,
        background: v3Mode
          ? `linear-gradient(135deg, #0d0d0d 0%, #161616 58%, ${GOLD}22 100%)`
          : `linear-gradient(135deg, ${ORANGE} 0%, #ffb25c 100%)`,
        color: v3Mode ? GOLD_LIGHT : '#ffffff',
        boxShadow: v3Mode
          ? `0 18px 38px -16px ${GOLD}, 0 0 0 4px ${GOLD}22`
          : `0 18px 38px -16px ${ORANGE}, 0 0 0 4px ${ORANGE}33`,
      }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ background: v3Mode ? `${GOLD}22` : 'rgba(255,255,255,0.22)' }}
        aria-hidden="true"
      >
        {v3Mode ? <Crown className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-[0.22em] opacity-80">Mode actuel</span>
        <span className="text-lg tracking-normal">{v3Mode ? 'V3' : 'V2'}</span>
      </span>
      <span
        className="ml-1 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider"
        style={{
          background: v3Mode ? `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` : '#ffffff',
          color: v3Mode ? '#111111' : ORANGE,
        }}
      >
        {v3Mode ? 'Noir & doré' : 'Orange & blanc'}
      </span>
    </button>
  );
}

export default V2V3FloatingSwitch;