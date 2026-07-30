import React, { useMemo, useState } from 'react';
import { CheckCircle2, Lock, ShieldCheck, ChevronDown } from 'lucide-react';
import {
  V3_MODULES, V3_PILLAR_META, getModuleAccess, V3_PRICE, V3_FULL_PACK,
  type V3Module,
} from '@/data/roadmapV3';
import useV3Entitlement from '@/hooks/useV3Entitlement';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const SERIF = "'Georgia', 'Times New Roman', serif";

const GREEN_BG = '#e8f7ef';
const GREEN_FG = '#0b6e4c';

/**
 * Récapitulatif global des droits V3 :
 * - colonne « Inclus 197€ » (base, livres & ebooks illimités)
 * - colonne « Pack 547€ » (premium : marketing, monétisation, IA avancée, couvertures pro…)
 * Chaque module porte un badge de prix + un indicateur « débloqué » selon l'achat réel.
 */
const V3AccessRecap: React.FC<{ onOpenModule?: (m: V3Module) => void }> = ({ onOpenModule }) => {
  const { hasBase, hasFull, isAdmin } = useV3Entitlement();
  const [open, setOpen] = useState(true);

  const isUnlocked = React.useCallback((m: V3Module) => {
    if (isAdmin) return true;
    return getModuleAccess(m.id) === 'pack' ? hasFull : hasBase;
  }, [isAdmin, hasBase, hasFull]);

  const { included, pack } = useMemo(() => {
    const included: V3Module[] = [];
    const pack: V3Module[] = [];
    for (const m of V3_MODULES) {
      (getModuleAccess(m.id) === 'included' ? included : pack).push(m);
    }
    return { included, pack };
  }, []);

  const unlockedCount = useMemo(() => V3_MODULES.filter(isUnlocked).length, [isUnlocked]);

  const renderRow = (m: V3Module, tier: 'included' | 'pack') => {
    const unlocked = isUnlocked(m);
    const price = tier === 'included' ? `${V3_PRICE}€` : `${V3_FULL_PACK.price}€`;
    return (
      <li key={m.id}>
        <button
          onClick={() => onOpenModule?.(m)}
          className="group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-[#FCF8F0]"
        >
          <span className="text-base leading-none">{V3_PILLAR_META[m.pillar].emoji}</span>
          <span className="flex-1 text-[12.5px] font-medium leading-tight" style={{ color: INK }}>
            {m.title}
          </span>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={tier === 'included'
              ? { background: GREEN_BG, color: GREEN_FG, border: `1px solid ${GREEN_FG}33` }
              : { background: AMBER_SOFT, color: AMBER_DEEP, border: `1px solid ${AMBER}55` }}
          >
            {price}
          </span>
          {unlocked ? (
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color: GREEN_FG }} aria-label="Débloqué" />
          ) : (
            <Lock className="h-3.5 w-3.5 shrink-0" style={{ color: '#c2ad8a' }} aria-label="À débloquer" />
          )}
        </button>
      </li>
    );
  };

  return (
    <section className="mb-8 rounded-2xl border border-[#eadfc9] bg-white shadow-[0_2px_14px_-8px_rgba(180,140,60,0.25)] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div>
          <h2 className="text-lg font-bold leading-tight" style={{ fontFamily: SERIF, color: INK }}>
            Récapitulatif de vos droits
          </h2>
          <p className="mt-0.5 text-[12px]" style={{ color: '#8a7860' }}>
            Ce qui est inclus à <strong style={{ color: GREEN_FG }}>197€</strong> vs ce qui demande le{' '}
            <strong style={{ color: AMBER_DEEP }}>Pack Tout Complet 547€</strong>.
            <span className="ml-1">
              {unlockedCount}/{V3_MODULES.length} outils débloqués pour vous.
            </span>
          </p>
        </div>
        <ChevronDown
          className="h-5 w-5 shrink-0 transition-transform"
          style={{ color: AMBER_DEEP, transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border-t border-[#eadfc9]" style={{ background: '#eadfc9' }}>
          {/* Inclus 197€ */}
          <div className="bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" style={{ color: GREEN_FG }} />
              <h3 className="text-sm font-bold" style={{ color: GREEN_FG }}>
                Inclus dans la base 197€
              </h3>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: GREEN_BG, color: GREEN_FG }}>
                {included.length}
              </span>
            </div>
            <p className="mb-2 text-[11px]" style={{ color: '#8a7860' }}>
              De l'idée jusqu'à publier sur KDP — livres & ebooks illimités.
            </p>
            <ul className="space-y-0.5">
              {included.map((m) => renderRow(m, 'included'))}
            </ul>
          </div>

          {/* Pack 547€ */}
          <div className="bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4" style={{ color: AMBER }} />
              <h3 className="text-sm font-bold" style={{ color: AMBER_DEEP }}>
                Pack premium — 547€
              </h3>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>
                {pack.length}
              </span>
            </div>
            <p className="mb-2 text-[11px]" style={{ color: '#8a7860' }}>
              Marketing, vente, monétisation, IA avancée & couvertures pro.
            </p>
            <ul className="space-y-0.5">
              {pack.map((m) => renderRow(m, 'pack'))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default V3AccessRecap;
