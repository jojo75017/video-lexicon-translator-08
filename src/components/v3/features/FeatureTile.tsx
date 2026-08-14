import { Lock, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { FeatureTile as Tile } from '@/data/v3Features';

interface Props {
  tile: Tile;
  open?: boolean;
  onToggle?: (id: string) => void;
}

/** Tuile du module Fonctionnalités — carte blanche, pastille d'icône colorée. */
export function FeatureTile({ tile, open, onToggle }: Props) {
  const navigate = useNavigate();
  const Icon = tile.icon;

  const handleClick = () => {
    if (tile.kind === 'link' && tile.to) {
      if (tile.to.startsWith('http')) window.open(tile.to, '_blank', 'noopener');
      else navigate(tile.to);
      return;
    }
    onToggle?.(tile.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={tile.kind === 'category' ? !!open : undefined}
      className="group w-full h-full rounded-2xl bg-white p-5 text-left transition-all hover:-translate-y-0.5"
      style={{
        border: '1px solid var(--v3-line)',
        boxShadow: open ? '0 8px 24px rgba(6,78,59,0.10)' : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: tile.tint }}
      >
        <Icon className="h-5 w-5" style={{ color: 'var(--v3-emerald)' }} />
      </span>

      <span className="mt-4 flex items-center gap-1.5">
        <span className="text-[15px] font-bold" style={{ color: 'var(--v3-ink)' }}>
          {tile.title}
        </span>
        {tile.kind === 'category' ? (
          open ? (
            <ChevronDown className="h-4 w-4" style={{ color: 'var(--v3-muted)' }} />
          ) : (
            <ChevronRight className="h-4 w-4" style={{ color: 'var(--v3-muted)' }} />
          )
        ) : (
          <ChevronRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            style={{ color: 'var(--v3-muted)' }}
          />
        )}
      </span>

      <span className="mt-1 block text-[12.5px] leading-snug" style={{ color: 'var(--v3-muted)' }}>
        {tile.subtitle}
      </span>

      {tile.private && (
        <span
          className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ background: 'rgba(6,78,59,0.08)', color: 'var(--v3-emerald)' }}
        >
          <Lock className="h-3 w-3" /> Visible par vous seul
        </span>
      )}
    </button>
  );
}

export default FeatureTile;
